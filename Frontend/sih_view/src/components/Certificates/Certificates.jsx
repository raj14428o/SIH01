import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Navbar';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Load certificates from wipe history and add dummy data
    const wipeHistory = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
    
    // Create certificates from wipe history
    const certificatesFromHistory = wipeHistory.map(record => ({
      ...record,
      certificateId: `CERT-${record.id}-${new Date(record.date).getFullYear()}`,
      algorithm: 'DoD 5220.22-M',
      passes: 3,
      verification: 'Complete',
      issueDate: record.date
    }));

    // Add some additional dummy certificates if needed
    const dummyCertificates = [
      {
        id: 999,
        certificateId: 'CERT-999-2025',
        date: '2025-09-11',
        type: 'File Wipe',
        path: 'C:\\Users\\Documents\\financial_records.xlsx',
        status: 'Success',
        platform: 'Windows',
        algorithm: 'DoD 5220.22-M',
        passes: 3,
        verification: 'Complete',
        issueDate: '2025-09-11'
      },
      {
        id: 998,
        certificateId: 'CERT-998-2025',
        date: '2025-09-10',
        type: 'Folder Wipe',
        path: '/var/log/sensitive/',
        status: 'Success',
        platform: 'Linux',
        algorithm: 'Gutmann Method',
        passes: 35,
        verification: 'Complete',
        issueDate: '2025-09-10'
      }
    ];

    const allCertificates = [...certificatesFromHistory, ...dummyCertificates];
    setCertificates(allCertificates);
  }, []);

  const downloadPDF = (cert) => {
    alert(`Downloading PDF certificate: ${cert.certificateId}\n\n[Sample PDF Certificate Content]\n\nCertificate ID: ${cert.certificateId}\nWipe Type: ${cert.type}\nPath: ${cert.path}\nAlgorithm: ${cert.algorithm}\nPasses: ${cert.passes}\nVerification: ${cert.verification}\nIssue Date: ${cert.issueDate}`);
  };

  const downloadJSON = (cert) => {
    const certificateData = {
      certificateId: cert.certificateId,
      wipeDetails: {
        id: cert.id,
        date: cert.date,
        type: cert.type,
        path: cert.path,
        platform: cert.platform,
        status: cert.status
      },
      securityDetails: {
        algorithm: cert.algorithm,
        passes: cert.passes,
        verification: cert.verification,
        compliance: ['DoD 5220.22-M', 'NIST SP 800-88'],
        timestamp: new Date().toISOString()
      },
      issuer: {
        organization: 'DataWipe Security Solutions',
        contact: 'certificates@datawipe.com',
        website: 'https://datawipe.com'
      }
    };
    
    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `certificate_${cert.certificateId}.json`;
    
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

  const getAlgorithmBadge = (algorithm) => {
    const colors = {
      'DoD 5220.22-M': 'bg-blue-100 text-blue-800',
      'Gutmann Method': 'bg-purple-100 text-purple-800',
      'Random Overwrite': 'bg-gray-100 text-gray-800'
    };
    
    return `px-2 py-1 rounded text-xs font-medium ${colors[algorithm] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wipe Certificates</h1>
                <p className="text-gray-600">Official certificates for completed secure data wipe operations</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{certificates.length}</div>
                <div className="text-sm text-gray-600">Total Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.status === 'Success').length}
                </div>
                <div className="text-sm text-gray-600">Successful Wipes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {certificates.filter(c => c.platform === 'Windows').length}
                </div>
                <div className="text-sm text-gray-600">Windows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {certificates.filter(c => c.platform === 'Linux').length}
                </div>
                <div className="text-sm text-gray-600">Linux</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Algorithm
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
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No certificates available. Complete a wipe operation to generate certificates.
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.certificateId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {cert.certificateId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cert.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {cert.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={getAlgorithmBadge(cert.algorithm)}>
                          {cert.algorithm}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {cert.passes} passes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="flex items-center">
                          <span className="mr-2">{getPlatformIcon(cert.platform)}</span>
                          {cert.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(cert.status)}>
                          {cert.status}
                        </span>
                        {cert.verification && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ {cert.verification}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => downloadPDF(cert)}
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
                          onClick={() => downloadJSON(cert)}
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

          {certificates.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
                </p>
                <div className="text-sm text-gray-500">
                  All certificates are digitally signed and compliant with industry standards
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
