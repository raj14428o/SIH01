import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';

const WindowsSolution = () => {
  const [selectedPath, setSelectedPath] = useState('');
  const [wipeType, setWipeType] = useState('file');
  const [selectedMethod, setSelectedMethod] = useState('dod-7pass');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeComplete, setWipeComplete] = useState(false);
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

  const deletionMethods = [
    { id: 'dod-7pass', name: 'DoD 5220.22-M (7-pass)', passes: 7, security: 'High', description: 'Department of Defense standard with 7 overwrite passes' },
    { id: 'dod-3pass', name: 'DoD Short (3-pass)', passes: 3, security: 'Medium', description: 'Shortened DoD standard with 3 overwrite passes' },
    { id: 'hmg-is4', name: 'HMG IS4', passes: 1, security: 'Medium', description: 'UK Government standard for secure data deletion' },
    { id: 'prng', name: 'PRNG Stream', passes: 1, security: 'Low', description: 'Pseudorandom number generator overwrite' },
    { id: 'verify', name: 'Verify Zeros/Ones', passes: 2, security: 'Low', description: 'Simple zero and one pattern verification' }
  ];

  const handleDownloadAgent = () => {
    alert('Download Windows Agent initiated (Demo only - no actual file)');
  };

  const handleDownloadISO = () => {
    alert('Download Bootable ISO initiated (Demo only - no actual file)');
  };

  const handleFileSelect = () => {
    // Mock file picker
    const mockPath = wipeType === 'file' 
      ? 'C:\\Users\\Documents\\sensitive_data.txt'
      : 'C:\\Users\\Documents\\SensitiveFolder';
    setSelectedPath(mockPath);
  };

  const startWipe = () => {
    if (!selectedPath) {
      alert('Please select a file or folder path first.');
      return;
    }

    setIsWiping(true);
    setWipeComplete(false);

    // Mock wipe process
    setTimeout(() => {
      setIsWiping(false);
      setWipeComplete(true);
      
      // Save wipe record to localStorage for history
      const existingHistory = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: wipeType === 'file' ? 'File Wipe' : 'Folder Wipe',
        path: selectedPath,
        status: 'Success',
        platform: 'Windows'
      };
      existingHistory.push(newRecord);
      localStorage.setItem('wipeHistory', JSON.stringify(existingHistory));

      // Future agent integration placeholder
      console.log('🚧 Agent integration will be added here in future. Currently Mock Process.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Windows Data Wipe Solution</h1>
              <p className="text-gray-600">Securely wipe files and folders on Windows systems with agent download</p>
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔧 Data Wipe
              </button>
              <button
                onClick={() => setActiveTab('download')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'download'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📥 Download Agent
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'methods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Deletion Methods
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
                {deletionMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 border-2 rounded-lg transition duration-200 text-left ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
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
              </div>
            </div>

            {/* Path Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {wipeType === 'file' ? 'Select File Path' : 'Select Folder Path'}
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  placeholder={wipeType === 'file' ? 'C:\\path\\to\\file.txt' : 'C:\\path\\to\\folder'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFileSelect}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Full Disk Wipe Option */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16M10 11v6M14 11v6" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-blue-800">Full Disk Wipe</h3>
                      <p className="text-sm text-blue-700">For complete disk wiping, download and install the DataWipe agent</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('download')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center text-sm"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-4 h-4 mr-2" />
                    Download Agent
                  </button>
                </div>
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
                    <h3 className="font-medium text-green-800">Wipe Process Completed Successfully!</h3>
                    <p className="text-sm text-green-700">
                      ✅ Wipe process started (Mock). Agent integration will be implemented here later.
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Windows Agent Installation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Installation Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Download the Windows agent from the download section</li>
                  <li>Right-click the installer and select "Run as Administrator"</li>
                  <li>Give Admin permission when prompted</li>
                  <li>Turn off Windows Defender/Firewall temporarily</li>
                  <li>Follow the setup wizard instructions</li>
                  <li>Restart your system after installation</li>
                  <li>Re-enable Windows Defender/Firewall</li>
                  <li>Launch DataWipe from the Start menu</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">System Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Windows 10/11 (64-bit)</li>
                  <li>Minimum 4GB RAM</li>
                  <li>Administrator privileges required</li>
                  <li>Internet connection for updates</li>
                  <li>500MB free disk space</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Important Notes</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Always backup important data before wiping</li>
                  <li>Secure deletion is irreversible</li>
                  <li>Close all applications before starting wipe process</li>
                  <li>Ensure stable power supply during operation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Downloads */}
          <div className="space-y-6">
            {/* Windows Agent Download */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🔧</span>
                Windows Agent
              </h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-5 h-5 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">DataWipe Windows Agent</h3>
                    </div>
                    <p className="text-sm text-gray-600">Compatible with Windows 10/11</p>
                    <p className="text-xs text-gray-500 mt-1">Version 1.0.0 (Coming Soon) • Size: ~50MB</p>
                  </div>
                  <button
                    onClick={handleDownloadAgent}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-4 h-4 mr-2" />
                    Download Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Bootable ISO Download */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">💿</span>
                Bootable ISO
              </h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">DataWipe Bootable ISO</h3>
                    <p className="text-sm text-gray-600">Standalone bootable environment</p>
                    <p className="text-xs text-gray-500 mt-1">Size: ~500MB (Coming Soon)</p>
                  </div>
                  <button
                    onClick={handleDownloadISO}
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200 flex items-center"
                  >
                    <span className="mr-2">📥</span>
                    Download ISO
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>ISO Usage:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Create bootable USB with Rufus or similar tool</li>
                  <li>Boot from USB drive</li>
                  <li>Select drive/partition to wipe</li>
                  <li>Choose deletion method and confirm</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'methods' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🔒</span>
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

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Security Recommendations</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
              <li><strong>High Security:</strong> Use DoD 5220.22-M (7-pass) for maximum security</li>
              <li><strong>Medium Security:</strong> DoD Short (3-pass) or HMG IS4 for balanced security and speed</li>
              <li><strong>Low Security:</strong> PRNG Stream or Verify methods for basic overwriting</li>
              <li><strong>SSD Drives:</strong> Consider using manufacturer-specific secure erase commands</li>
              <li><strong>Compliance:</strong> DoD methods meet government and military standards</li>
            </ul>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default WindowsSolution;
