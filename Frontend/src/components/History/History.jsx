import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';

const History = () => {
  const [wipeHistory, setWipeHistory] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Load existing history and add some dummy data if empty
    const existingHistory = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
    
    if (existingHistory.length === 0) {
      // Add some dummy sample data
      const dummyHistory = [
        {
          id: 1,
          date: '2025-09-11',
          type: 'File Wipe',
          path: 'C:\\Users\\Documents\\confidential.pdf',
          status: 'Success',
          platform: 'Windows'
        },
        {
          id: 2,
          date: '2025-09-10',
          type: 'Folder Wipe',
          path: '/home/user/sensitive_data/',
          status: 'Success',
          platform: 'Linux'
        },
        {
          id: 3,
          date: '2025-09-09',
          type: 'File Wipe',
          path: 'C:\\Temp\\old_records.xlsx',
          status: 'Success',
          platform: 'Windows'
        }
      ];
      localStorage.setItem('wipeHistory', JSON.stringify(dummyHistory));
      setWipeHistory(dummyHistory);
    } else {
      setWipeHistory(existingHistory);
    }
  }, []);

  const downloadPDF = (record) => {
    // Mock PDF download
    alert(`Downloading PDF certificate for ${record.type} on ${record.date}\n\n[Sample PDF content would be generated here]`);
  };

  const downloadJSON = (record) => {
    // Mock JSON download
    const jsonData = {
      wipeId: record.id,
      date: record.date,
      type: record.type,
      path: record.path,
      status: record.status,
      platform: record.platform,
      timestamp: new Date().toISOString(),
      certificate: {
        algorithm: 'DoD 5220.22-M',
        passes: 3,
        verification: 'Complete'
      }
    };
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wipe_certificate_${record.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Success') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'Failed') {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getPlatformIcon = (platform) => {
    if (platform === 'Windows') {
      return '🪟';
    } else if (platform === 'Linux') {
      return '🐧';
    }
    return '💻';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cleanup History</h1>
                <p className="text-gray-600">View and download certificates for completed wipe operations</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download PDF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download JSON
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wipeHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No wipe operations found. Start a wipe operation to see history here.
                    </td>
                  </tr>
                ) : (
                  wipeHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {record.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={record.path}>
                        {record.path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="flex items-center">
                          <span className="mr-2">{getPlatformIcon(record.platform)}</span>
                          {record.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(record.status)}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => downloadPDF(record)}
                          className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Sample PDF
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => downloadJSON(record)}
                          className="text-green-600 hover:text-green-900 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Sample JSON
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {wipeHistory.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {wipeHistory.length} wipe operation{wipeHistory.length !== 1 ? 's' : ''}
                </p>
                <div className="text-sm text-gray-500">
                  Total success rate: {Math.round((wipeHistory.filter(r => r.status === 'Success').length / wipeHistory.length) * 100)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
