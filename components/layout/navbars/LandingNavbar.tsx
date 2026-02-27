import { Logo } from '@/components/ui/logo/Logo';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Link from 'next/link';

function LandingNavbar() {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-50 relative">
      <Logo />

      <div className="hidden md:flex items-center space-x-8">
        <a
          className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          href="#features"
        >
          Features
        </a>
        <a
          className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          href="#solutions"
        >
          Solutions
        </a>
        <a
          className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          href="#why-us"
        >
          Why Us
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          className="hidden md:block text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          href="/login"
        >
          Log In
        </Link>
        <Link
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
          href="/register"
        >
          Get Started
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default LandingNavbar;
