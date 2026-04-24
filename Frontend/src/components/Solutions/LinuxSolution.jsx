import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';
import { downloadAgentFromServer, queueWipeCommand, waitForCommandCompletion } from '../../utils/agentIntegration';
import { toast } from 'react-toastify';

const LinuxSolution = () => {
  const [selectedPath, setSelectedPath] = useState('');
  const [wipeType, setWipeType] = useState('file');
  const [selectedMethod, setSelectedMethod] = useState('dod-7pass');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeComplete, setWipeComplete] = useState(false);
  const [wipeMessage, setWipeMessage] = useState('');
  const [activeTab, setActiveTab] = useState('wipe');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'download') {
      setActiveTab('download');
    }
  }, [searchParams]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAbsolutePath = (value) => {
    if (!value) return false;
    if (/^[a-zA-Z]:\\/.test(value)) return true;
    if (value.startsWith('\\\\')) return true;
    if (value.startsWith('/')) return true;
    return false;
  };

  const deletionMethods = [
    { id: 'default', name: 'Default Eraser', passes: 3, security: 'Medium', description: 'Default secure overwrite routine from local scripts' },
    { id: 'dod-7pass', name: 'DoD 5220.22-M (7-pass)', passes: 7, security: 'High', description: 'Department of Defense standard with 7 overwrite passes' },
    { id: 'dod-3pass', name: 'DoD Short (3-pass)', passes: 3, security: 'Medium', description: 'Shortened DoD standard with 3 overwrite passes' },
    { id: 'hmg-is5-enhanced', name: 'HMG IS5 Enhanced', passes: 3, security: 'High', description: 'HMG IS5 enhanced overwrite sequence from local scripts' },
    { id: 'prng-stream', name: 'PRNG Stream', passes: 1, security: 'Low', description: 'Single-pass pseudorandom overwrite' }
  ];

  const diskMethods = [
    { id: 'standard', name: 'Standard Secure Erase', passes: 1, security: 'Medium', description: 'Standard secure erase routine for supported devices' },
    { id: 'enhanced', name: 'Enhanced Secure Erase', passes: 1, security: 'High', description: 'Enhanced secure erase mode for stronger cleanup' },
    { id: 'crypto', name: 'Crypto Erase', passes: 1, security: 'High', description: 'Cryptographic erase for supported NVMe/SATA devices' },
  ];

  const methodsForSelection = wipeType === 'disk' ? diskMethods : deletionMethods;

  useEffect(() => {
    if (wipeType === 'disk') {
      if (!diskMethods.some((method) => method.id === selectedMethod)) {
        setSelectedMethod('standard');
      }
      return;
    }

    if (!deletionMethods.some((method) => method.id === selectedMethod)) {
      setSelectedMethod('dod-7pass');
    }
  }, [wipeType, selectedMethod]);

  const isValidLinuxDisk = (value) => /^\/dev\/.+/.test((value || '').trim());

  const handleDownloadAgent = async () => {
    try {
      await downloadAgentFromServer('universal');
      toast.success('Universal agent bundle downloaded successfully.');
    } catch (error) {
      console.error('Linux agent download failed:', error);
      toast.error('Linux agent download failed. Please try again.');
    }
  };

  const handleFileSelect = () => {
    const picker = document.createElement('input');
    picker.type = 'file';

    if (wipeType === 'folder') {
      picker.setAttribute('webkitdirectory', '');
      picker.setAttribute('directory', '');
    }

    picker.onchange = (event) => {
      const input = event.target;
      const selectedFile = input?.files?.[0];

      if (!selectedFile) {
        return;
      }

      const runtimePath = typeof selectedFile.path === 'string' ? selectedFile.path : '';
      const rawValue = input.value || '';

      // Browsers often hide absolute paths (for example C:\fakepath\...) for security reasons.
      const safePath = runtimePath || (rawValue.includes('fakepath') ? '' : rawValue);

      if (safePath) {
        setSelectedPath(safePath);
        return;
      }

      if (wipeType === 'folder' && selectedFile.webkitRelativePath) {
        const folderName = selectedFile.webkitRelativePath.split('/')[0] || selectedFile.name;
        setSelectedPath(folderName);
      } else {
        setSelectedPath(selectedFile.name || '');
      }

      toast.warning('Browser privacy may hide absolute paths. If wipe fails, replace this with the full local path manually.');
    };

    picker.click();
  };

  const updateHistoryRecord = (commandId, updates) => {
    const history = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
    const next = history.map((item) => (item.commandId === commandId ? { ...item, ...updates } : item));
    localStorage.setItem('wipeHistory', JSON.stringify(next));
  };

  const startWipe = async () => {
    if (!selectedPath) {
      toast.error(wipeType === 'disk' ? 'Please enter a target device (example: /dev/sdb).' : 'Please select a file or folder path first.');
      return;
    }

    if (wipeType === 'disk' && !isValidLinuxDisk(selectedPath)) {
      toast.error('Please enter a valid Linux device path (example: /dev/sdb or /dev/nvme0n1).');
      return;
    }

    if (wipeType !== 'disk' && !isAbsolutePath(selectedPath)) {
      toast.error('Please enter a full absolute path (example: /home/raj/test.txt).');
      return;
    }

    setIsWiping(true);
    setWipeComplete(false);
    setWipeMessage('');

    try {
      const action = wipeType === 'folder' ? 'FOLDER_WIPE' : wipeType === 'disk' ? 'DISK_ERASE' : 'FILE_WIPE';
      const normalizedTarget = selectedPath.trim();
      const response = await queueWipeCommand({
        action,
        path: wipeType === 'disk' ? undefined : normalizedTarget,
        disk: wipeType === 'disk' ? normalizedTarget : undefined,
        method: selectedMethod,
        platform: 'Linux',
      });
      const commandId = response?.command?.commandId || null;
      
      // Save wipe record to localStorage for history
      const existingHistory = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: wipeType === 'file' ? 'File Wipe' : wipeType === 'folder' ? 'Folder Wipe' : 'Disk/Drive Cleanup',
        path: normalizedTarget,
        status: 'Queued',
        commandId,
        algorithm: selectedMethod,
        platform: 'Linux'
      };
      existingHistory.push(newRecord);
      localStorage.setItem('wipeHistory', JSON.stringify(existingHistory));

      if (!commandId) {
        throw new Error('Command queued but no commandId returned from server.');
      }

      const finalStatus = await waitForCommandCompletion(commandId);
      updateHistoryRecord(commandId, {
        status: 'Success',
        completedAt: new Date().toISOString(),
      });

      setWipeMessage(finalStatus.details?.result?.message || 'Deletion completed successfully.');
      setWipeComplete(true);
      setIsWiping(false);
    } catch (error) {
      console.error('Wipe command failed:', error);
      const history = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
      if (history.length > 0) {
        const last = history[history.length - 1];
        if (last.status === 'Queued') {
          updateHistoryRecord(last.commandId, {
            status: 'Failed',
            error: error.message || 'Unknown error',
          });
        }
      }
      setIsWiping(false);
      toast.error(error.message || 'Failed to queue wipe command');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
            <img src="https://cdn.freebiesupply.com/logos/large/2x/linux-tux-2-logo-png-transparent.png" alt="Linux" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Linux Data Wipe Solution</h1>
              <p className="text-gray-600">Securely wipe files and folders on Linux systems with agent download</p>
            </div>
          </div>
          
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('wipe')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'wipe'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Data Wipe
              </button>
              <button
                onClick={() => setActiveTab('download')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'download'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Download Agent
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'methods'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Deletion Methods
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'wipe' && (
        <div className="bg-white rounded-lg shadow-md p-6">

          <div className="space-y-6">
            {/* Deletion Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Deletion Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {methodsForSelection.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 border-2 rounded-lg transition duration-200 text-left ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{method.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{method.passes} pass{method.passes > 1 ? 'es' : ''}</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                      method.security === 'High' ? 'bg-red-100 text-red-800' :
                      method.security === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {method.security}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wipe Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Wipe Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setWipeType('file')}
                  className={`p-4 border-2 rounded-lg transition duration-200 ${
                    wipeType === 'file'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <h3 className="font-medium">File Wipe</h3>
                      <p className="text-sm text-gray-600">Wipe individual files</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setWipeType('folder')}
                  className={`p-4 border-2 rounded-lg transition duration-200 ${
                    wipeType === 'folder'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <div className="text-left">
                      <h3 className="font-medium">Folder Wipe</h3>
                      <p className="text-sm text-gray-600">Wipe entire folders</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setWipeType('disk')}
                  className={`p-4 border-2 rounded-lg transition duration-200 ${
                    wipeType === 'disk'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7h16M8 11h8m-8 4h6" />
                    </svg>
                    <div className="text-left">
                      <h3 className="font-medium">Disk/Drive Cleanup</h3>
                      <p className="text-sm text-gray-600">Clean up a full Linux block device</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Path Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {wipeType === 'file' ? 'Select File Path' : wipeType === 'folder' ? 'Select Folder Path' : 'Target Device'}
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  placeholder={wipeType === 'file' ? '/path/to/file.txt' : wipeType === 'folder' ? '/path/to/folder' : '/dev/sdb'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {wipeType !== 'disk' && (
                  <button
                    onClick={handleFileSelect}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                  >
                    Browse
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={startWipe}
                disabled={isWiping || !selectedPath}
                className={`px-6 py-3 rounded-md font-medium transition duration-200 ${
                  isWiping || !selectedPath
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                }`}
              >
                {isWiping ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wiping...
                  </div>
                ) : (
                  'Start Wipe'
                )}
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Success Message */}
            {wipeComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-green-800">Deletion Completed Successfully</h3>
                    <p className="text-sm text-green-700">
                      {wipeMessage || 'The local agent confirmed completion.'}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Path: {selectedPath}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'download' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How To Run Local Wipe
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Setup Steps (Hosted Website)</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Download the universal agent zip from this page and extract it.</li>
                  <li>Open terminal in the extracted <code className="bg-gray-100 px-1 rounded">agent</code> folder.</li>
                  <li>Set the hosted API URL: <code className="bg-gray-100 px-1 rounded">export DATAWIPE_SERVER_URL=https://your-domain.com</code>.</li>
                  <li>Optional: set a fixed agent id: <code className="bg-gray-100 px-1 rounded">export DATAWIPE_AGENT_ID=office-linux-01</code>.</li>
                  <li>Run agent: <code className="bg-gray-100 px-1 rounded">python3 agent.py</code>.</li>
                  <li>Open the hosted website, go to Linux Solution, and provide absolute path or device id.</li>
                  <li>Choose method, click Start Wipe, and wait for Success/Failed confirmation in history.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">System Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Ubuntu 18.04+, CentOS 7+, RHEL 7+</li>
                  <li>Minimum 2GB RAM</li>
                  <li>Root/sudo privileges required</li>
                  <li>Internet connection for updates</li>
                  <li>100MB free disk space</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Deletion Flow Checklist</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Agent must be online on the same machine where data exists.</li>
                  <li>Use absolute local path (or /dev device for disk erase).</li>
                  <li>Disk erase requires root privileges on Linux agent host.</li>
                  <li>Root/system device erase is blocked unless compliance override is enabled.</li>
                  <li>Secure deletion is irreversible. Test with non-critical files first.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Downloads */}
          <div className="space-y-6">
            {/* Universal Agent Download */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Agent Download
              </h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">DataWipe Universal Agent</h3>
                    <p className="text-sm text-gray-600">Compatible with Linux and Windows</p>
                    <p className="text-xs text-gray-500 mt-1">Single zip bundle with OS-aware execution checks.</p>
                  </div>
                  <button
                    onClick={handleDownloadAgent}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Download Agent
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        )}

        {activeTab === 'methods' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Deletion Methods
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deletionMethods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{method.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-gray-900">
                        {method.passes} pass{method.passes > 1 ? 'es' : ''}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        method.security === 'High' ? 'bg-red-100 text-red-800' :
                        method.security === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {method.security} Security
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Linux-Specific Recommendations</h3>
            <ul className="list-disc list-inside space-y-2 text-green-800 text-sm">
              <li><strong>For SSDs:</strong> Use <code className="bg-green-100 px-1 rounded">blkdiscard</code> or manufacturer tools</li>
              <li><strong>For HDDs:</strong> DoD 5220.22-M provides maximum security</li>
              <li><strong>File Systems:</strong> ext4, xfs, btrfs all supported</li>
              <li><strong>RAID Arrays:</strong> Wipe individual drives for complete security</li>
              <li><strong>Encrypted Volumes:</strong> Key destruction may be sufficient</li>
            </ul>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default LinuxSolution;
