import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            B
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Bacversité
          </span>
        </Link>

        {/* Navigation links */}
        <Nav />

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm shadow-blue-500/10 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            Faire le Quiz
          </Link>
        </div>

      </div>
    </header>
  );
}
