import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* ✅ Fixed navigation */}
                <h1
                  className="text-2xl font-bold text-blue-600 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  DataWipe
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  🔒 Secure Data Wiping Solution
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Permanently
                <span className="text-blue-600 block">Delete Sensitive</span>
                Data with Confidence
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Professional-grade data wiping solution that ensures your sensitive information 
                is completely and permanently removed from Windows and Linux systems. 
                Get compliance certificates for every operation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 text-center"
                >
                  Start Secure Wiping
                </Link>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition duration-200">
                  Watch Demo
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  DoD 5220.22-M Compliant
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  NIST SP 800-88 Standard
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  100% Success Rate
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                {/* Mock Terminal/Interface */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-gray-400 text-sm">DataWipe Terminal</div>
                  </div>
                  <div className="text-green-400 font-mono text-sm">
                    <div className="mb-1">$ datawipe --secure-delete /path/to/sensitive/</div>
                    <div className="mb-1 text-gray-400">Initializing secure wipe process...</div>
                    <div className="mb-1 text-blue-400">Using DoD 5220.22-M algorithm</div>
                    <div className="mb-1 text-yellow-400">Pass 1/3: Writing random data...</div>
                    <div className="mb-1 text-yellow-400">Pass 2/3: Writing complement...</div>
                    <div className="mb-1 text-yellow-400">Pass 3/3: Writing random data...</div>
                    <div className="text-green-400">✓ Secure wipe completed successfully</div>
                    <div className="text-blue-400">Certificate: CERT-2025-001</div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">2.4TB</div>
                    <div className="text-sm text-gray-600">Data Secured</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.5-2a11 11 0 11-18 0 11 11 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Certified Secure</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Real-time Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DataWipe?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional data wiping solution trusted by organizations worldwide for secure data disposal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.5-2a11 11 0 11-18 0 11 11 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Military-Grade Security</h3>
              <p className="text-gray-600">
                Implements DoD 5220.22-M and NIST SP 800-88 standards for complete data destruction that meets government and enterprise requirements.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Certificates</h3>
              <p className="text-gray-600">
                Generate official certificates for every wipe operation with detailed reports for audit trails and regulatory compliance.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cross-Platform Support</h3>
              <p className="text-gray-600">
                Works seamlessly on both Windows and Linux systems with platform-specific optimization for maximum security and performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Secure Your Data?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of organizations that trust DataWipe for their secure data disposal needs.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">DataWipe</h3>
              <p className="text-gray-400 mb-4">
                Professional secure data wiping solution for enterprises and organizations worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-sm">🔒</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-sm">🛡️</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DataWipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
