import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    DataWipe
                  </h1>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Secure File, Folder, and Drive Cleanup
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                DataWipe runs secure deletion commands from a hosted web panel to a local agent running on your machine. Use it for Windows and Linux file wipe, folder wipe, and disk/drive cleanup with safety checks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 text-center"
                >
                  Open Dashboard
                </Link>
                <Link
                  to="/register"
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition duration-200 text-center"
                >
                  Create Account
                </Link>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Universal agent bundle for Windows and Linux
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Supports file wipe, folder wipe, and disk/drive erase
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Disk cleanup protected by permission and compliance checks
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hosted Flow</h2>
              <ol className="space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">1.</span> Download and run agent on target machine.
                </li>
                <li>
                  <span className="font-semibold">2.</span> Set <span className="font-mono text-sm bg-white px-1 py-0.5 rounded">DATAWIPE_SERVER_URL</span> to hosted backend.
                </li>
                <li>
                  <span className="font-semibold">3.</span> Queue wipe from web UI with path or drive/device target.
                </li>
                <li>
                  <span className="font-semibold">4.</span> Agent executes locally and reports completion to history.
                </li>
              </ol>

              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Safety Rules</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Windows disk erase requires Administrator mode.</div>
                  <div>Linux disk erase requires root privileges.</div>
                  <div>System/root disk erase is blocked unless explicitly allowed.</div>
                  <div>Secure deletion is irreversible.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supported Platforms
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Use the same universal agent bundle for both platforms. Runtime checks ensure commands only run on matching OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png" alt="Windows" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Windows</h3>
              </div>
              <p className="text-gray-600">File wipe, folder wipe, and drive cleanup with quick/full/crypto options.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <img src="https://cdn.freebiesupply.com/logos/large/2x/linux-tux-2-logo-png-transparent.png" alt="Linux" className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Linux</h3>
              </div>
              <p className="text-gray-600">File wipe, folder wipe, and disk cleanup with standard/enhanced/crypto options.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Secure Deletion?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sign in, download the agent, and run cleanup operations from a single hosted dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
