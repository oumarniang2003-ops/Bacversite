import Link from "next/link";
import { query } from "@/lib/db";

interface DeadlineItem {
  item_type: "concours" | "bourse";
  id: number;
  nom: string;
  date_limite: string;
  pays: string | null;
  montant: string | null;
}

async function getUpcomingDeadlines(): Promise<DeadlineItem[]> {
  try {
    const sqlQuery = `
      SELECT 'concours' as item_type, id, nom, to_char(date_limite, 'YYYY-MM-DD') as date_limite, NULL as pays, NULL as montant
      FROM concours
      WHERE date_limite >= CURRENT_DATE AND date_limite <= CURRENT_DATE + INTERVAL '30 days'
      UNION ALL
      SELECT 'bourse' as item_type, id, nom, to_char(date_limite, 'YYYY-MM-DD') as date_limite, pays, montant
      FROM bourses
      WHERE date_limite >= CURRENT_DATE AND date_limite <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY date_limite ASC
    `;
    const res = await query(sqlQuery);
    return res.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des dates limites :", error);
    return [];
  }
}

export default async function Home() {
  const deadlines = await getUpcomingDeadlines();

  const getDaysRemaining = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Orientation post-bac et réussite universitaire au Sénégal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Trouvez votre voie après le{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Baccalauréat
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recherchez les établissements d'enseignement supérieur, préparez vos concours d'entrée, postulez aux bourses d'études et organisez vos démarches.
          </p>

          {/* Quick Search Form */}
          <form action="/ecoles" method="GET" className="max-w-2xl mx-auto flex items-center bg-gray-50 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="relative flex-grow">
              <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="search"
                required
                placeholder="Rechercher une école, une formation, une ville..."
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Rechercher
            </button>
          </form>

        </div>
      </section>

      {/* Grid of Main Services */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link href="/ecoles" className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Annuaire des Écoles</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Explorez les filières et les conditions d'admission.</p>
            </Link>

            <Link href="/concours" className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Concours d'Entrée</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Préparez vos candidatures aux concours nationaux.</p>
            </Link>

            <Link href="/bourses" className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Bourses d'Études</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consultez les offres de bourses d'études disponibles.</p>
            </Link>

            <Link href="/etranger" className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11 20.955V18.5a2.5 2.5 0 00-2.5-2.5h-.5A2 2 0 016 14v-2.945M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Études à l'étranger</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toutes les démarches de visa et de coût de la vie.</p>
            </Link>

          </div>
        </div>
      </section>

      {/* Deadlines Section */}
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Dates limites qui approchent
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Opportunités de candidature arrivant à échéance sous 30 jours.</p>
          </div>

          {deadlines.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 text-center rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucune date limite proche pour le moment. Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deadlines.map((item) => {
                const daysLeft = getDaysRemaining(item.date_limite);
                const isUrgent = daysLeft <= 7;

                return (
                  <div
                    key={`${item.item_type}-${item.id}`}
                    className="flex flex-col justify-between bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                          item.item_type === "concours"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                        }`}>
                          {item.item_type === "concours" ? "Concours" : "Bourse"}
                        </span>
                        
                        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                          isUrgent
                            ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                            : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                        }`}>
                          {daysLeft === 0
                            ? "Aujourd'hui"
                            : daysLeft === 1
                            ? "Demain !"
                            : `Plus que ${daysLeft} jours`}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-base">
                        {item.nom}
                      </h3>

                      {item.item_type === "bourse" && (
                        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {item.pays && <span>📍 Pays : <span className="font-semibold text-gray-700 dark:text-gray-300">{item.pays}</span></span>}
                          {item.montant && <span>💰 Montant : <span className="font-semibold text-gray-700 dark:text-gray-300">{item.montant}</span></span>}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                      <Link
                        href={item.item_type === "concours" ? "/concours" : "/bourses"}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                      >
                        En savoir plus →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
