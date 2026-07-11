import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Bacversité
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              La plateforme ultime d'orientation universitaire et de préparation pour les bacheliers. Trouvez votre voie, découvrez les meilleures universités et préparez vos concours en toute sérénité.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Ressources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ecoles" className="hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Universités & Écoles
                </Link>
              </li>
              <li>
                <Link href="/concours" className="hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Concours d'entrée
                </Link>
              </li>
              <li>
                <Link href="/bourses" className="hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Bourses d'études
                </Link>
              </li>
              <li>
                <Link href="/etranger" className="hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Étudier à l'étranger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Orientation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Orientation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/quiz" className="hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">
                  Faire le Test d'Orientation
                </Link>
              </li>
              <li>
                <Link href="/filieres" className="hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">
                  Découvrir les Filières
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">
                  Espace Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                Email: <a href="mailto:support@bacversite.sn" className="text-gray-650 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">support@bacversite.sn</a>
              </li>
              <li>
                Lieu: Dakar, Sénégal
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2.237c1.137-.035 2.636-.062 3.737-.062.303 0 .566.247.597.549.183 1.782.209 3.564.085 5.349l-.023.342c-.046.685-.631 1.2-1.319 1.186a11.13 11.13 0 01-5.733-2.067 11.16 11.16 0 01-3.663-5.267.587.587 0 01.353-.69c.813-.306 1.666-.462 2.527-.462.247 0 .473.15.564.382.492 1.258 1.18 2.42 2.036 3.44.409.488 1.144.417 1.464-.15.426-.757.73-1.579.907-2.433.053-.256-.123-.5-.382-.544a8.2 8.2 0 00-1.428-.124.58.58 0 01-.58-.511 8.22 8.2 0 01.272-3.151.58.58 0 01.69-.408c.516.14 1.018.337 1.5.586z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {currentYear} Bacversité. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/mentions-legales" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Mentions Légales
            </Link>
            <Link href="/confidentialite" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
