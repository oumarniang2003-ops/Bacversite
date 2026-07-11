"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/ecoles", label: "Écoles & Univs" },
  { href: "/concours", label: "Concours" },
  { href: "/bourses", label: "Bourses" },
  { href: "/etranger", label: "Études à l'étranger" },
  { href: "/quiz", label: "Quiz d'orientation" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative">
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-emerald-50  text-emerald-600  font-semibold"
                  : "text-gray-600 hover:text-emerald-600   hover:bg-gray-100 "
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-md py-2 z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50  text-emerald-600  border-r-4 border-emerald-600"
                    : "text-gray-600 hover:text-emerald-600   hover:bg-gray-50 "
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
