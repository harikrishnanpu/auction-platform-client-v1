import { APP_BRAND } from '../config/app-nav';

export const AdminFooter = ({
  appVersion = '1.0.0',
  year = String(new Date().getFullYear()),
}: {
  appVersion?: string;
  year?: string;
}) => {
  return (
    <footer className="bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-gray-800 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {APP_BRAND} Admin Panel{' '}
            </span>{' '}
            <span
              data-testid="app-version"
              className="text-gray-500 dark:text-gray-400"
            >
              v{appVersion}
            </span>
          </div>

          <div data-testid="copyright" className="text-xs text-gray-400">
            © {year} {APP_BRAND} Inc. Internal use only.
          </div>
        </div>
      </div>
    </footer>
  );
};
