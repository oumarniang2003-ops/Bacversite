import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Bacversité
          </span>
        </Link>

        {/* Navigation links */}
        <Nav />

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg transition-colors duration-300"
          >
            Faire le Quiz
          </Link>
        </div>

      </div>
    </header>
  );
}
