import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
  });
  const navigate = useNavigate();

  const computeStats = () => {
    const history = JSON.parse(localStorage.getItem('wipeHistory') || '[]');
    const successful = history.filter((item) => item.status === 'Success').length;
    const failed = history.filter((item) => item.status === 'Failed').length;

    setStats({
      total: history.length,
      successful,
      failed,
    });
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      computeStats();
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const onStorageChange = (event) => {
      if (!event.key || event.key === 'wipeHistory') {
        computeStats();
      }
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Logged in as: <span className="font-medium">{user.email}</span>
          </p>
        </div>

        {/* Real Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Operations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successful}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/solutions/windows')}
              className="group p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-left bg-gradient-to-br from-white to-blue-50"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">Windows Solution</h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Wipe files and folders on Windows</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/solutions/linux')}
              className="group p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-left bg-gradient-to-br from-white to-green-50"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/linux-tux-2-logo-png-transparent.png" alt="Linux" className="w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">Linux Solution</h3>
                  <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">Wipe files and folders on Linux</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
