export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-12 border-t border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <span className="text-2xl   font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              Hammr.Down
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              The premium SaaS solution for modern auctioneers. Secure, fast,
              and scalable.
            </p>
            <div className="flex space-x-4">
              <a
                className="text-gray-400 hover:text-blue-500 transition-colors"
                href="#"
              >
                🌐
              </a>
              <a
                className="text-gray-400 hover:text-blue-500 transition-colors"
                href="#"
              >
                @
              </a>
              <a
                className="text-gray-400 hover:text-blue-500 transition-colors"
                href="#"
              >
                📡
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Integrations
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:text-blue-500 transition-colors" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">📧 hello@hammr.down</li>
              <li className="flex items-center gap-2">📞 +1 (555) 123-4567</li>
              <li className="flex items-center gap-2">📍 San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Hammr.Down Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
