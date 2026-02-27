export const AdminFooter = () => {
  return (
    <footer className="bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-gray-800 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              HammerDown Admin Panel
            </span>{' '}
            v2.4.0
          </div>
          <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-400">
            <a className="hover:text-[#111111] dark:hover:text-white" href="#">
              Support
            </a>
            <a className="hover:text-[#111111] dark:hover:text-white" href="#">
              System Status
            </a>
            <a className="hover:text-[#111111] dark:hover:text-white" href="#">
              Documentation
            </a>
          </div>
          <div className="text-xs text-gray-400">
            © 2023 HammerDown Inc. Internal use only.
          </div>
        </div>
      </div>
    </footer>
  );
};
