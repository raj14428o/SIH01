import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';

const WindowsSolution = () => {
  const [selectedPath, setSelectedPath] = useState('');
  const [wipeType, setWipeType] = useState('file');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeComplete, setWipeComplete] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Windows Data Wipe Solution</h1>
              <p className="text-gray-600">Securely wipe files and folders on Windows systems</p>
            </div>
          </div>

          <div className="space-y-6">
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-yellow-800">Full Disk Wipe</h3>
                    <p className="text-sm text-yellow-700">Complete disk wiping functionality will be available in the full version</p>
                  </div>
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
      </div>
    </div>
  );
};

export default WindowsSolution;
