import { Mail, Phone, MapPin } from 'lucide-react';
import { APP_BRAND } from '../config/app-nav';

export function LandingFooter({
  year = String(new Date().getFullYear()),
  appVersion = '1.0.0',
}: {
  appVersion?: string;
  year?: string;
}) {
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
              {APP_BRAND}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              The premium SaaS solution for modern auctioneers. Secure, fast,
              and scalable.
            </p>
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
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>hello@hammr.down</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+91 7994211778</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Kochi, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            data-testid="copyright"
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            © {year} {APP_BRAND} Inc. All rights reserved.
          </p>
          <p
            data-testid="app-version"
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            v{appVersion}
          </p>
        </div>
      </div>
    </footer>
  );
}
