import Link from "next/link";
import { query } from "@/lib/db";

interface Contest {
  id: number;
  nom: string;
  filieres: string | null;
  date_limite: string | null; // format YYYY-MM-DD
  conditions: string | null;
  ecoles_liees: string | null;
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    enCours?: string;
    expire?: string;
  }>;
}

async function getContests(search: string, enCours: boolean, expire: boolean): Promise<Contest[]> {
  try {
    let queryText = `
      SELECT id, nom, filieres, to_char(date_limite, 'YYYY-MM-DD') as date_limite, conditions, ecoles_liees 
      FROM concours 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR filieres ILIKE $${params.length} OR ecoles_liees ILIKE $${params.length})`;
    }

    if (enCours && !expire) {
      queryText += " AND (date_limite >= CURRENT_DATE OR date_limite IS NULL)";
    } else if (expire && !enCours) {
      queryText += " AND date_limite < CURRENT_DATE";
    }

    queryText += " ORDER BY date_limite ASC NULLS LAST, id DESC";

    const res = await query(queryText, params);
    return res.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des concours :", error);
    return [];
  }
}

export default async function ConcoursPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const enCours = resolvedParams.enCours === "true";
  const expire = resolvedParams.expire === "true";

  const contests = await getContests(search, enCours, expire);

  const getDaysRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      
      {/* Breadcrumb Bar */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100/60 dark:border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-sm text-gray-550 dark:text-gray-400">
          <Link href="/" className="text-emerald-600 dark:text-emerald-450 hover:underline font-medium">
            Accueil
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>Concours d'entrée</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 w-full flex-grow">
        
        {/* Left Column: Filters */}
        <aside className="w-full md:w-[280px] shrink-0">
          <form action="/concours" method="GET" className="bg-white dark:bg-gray-900 border border-gray-150/70 dark:border-gray-800/80 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Affiner ma recherche
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Filtrez les concours
              </p>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nom ou mot-clé
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Ex: ESP, Journalisme..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-850 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <svg className="w-4.5 h-4.5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut du concours
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="enCours"
                    value="true"
                    defaultChecked={enCours}
                    className="w-4.5 h-4.5 rounded border-gray-300 dark:border-gray-800 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>En cours (Actifs)</span>
                </label>
                <label className="flex items-center space-x-2.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="expire"
                    value="true"
                    defaultChecked={expire}
                    className="w-4.5 h-4.5 rounded border-gray-300 dark:border-gray-800 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>Fermés / Expirés</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Rechercher
              </button>
              
              {(search || enCours || expire) && (
                <div className="text-center">
                  <Link
                    href="/concours"
                    className="text-xs text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors underline"
                  >
                    Réinitialiser les filtres
                  </Link>
                </div>
              )}
            </div>

          </form>
        </aside>

        {/* Right Column: Contest Results */}
        <section className="flex-grow space-y-6">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {contests.length} {contests.length > 1 ? "concours trouvés" : "concours trouvé"}
            </h2>
          </div>

          {/* Results List */}
          {contests.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150/70 dark:border-gray-800/80 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-gray-500 text-sm">Aucun concours ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contests.map((contest) => {
                const daysLeft = getDaysRemaining(contest.date_limite);
                const isClosed = daysLeft !== null && daysLeft < 0;

                return (
                  <div
                    key={contest.id}
                    className="bg-white dark:bg-gray-900 border border-gray-150/70 dark:border-gray-800/60 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {contest.nom}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          {contest.ecoles_liees && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              🏫 {contest.ecoles_liees}
                            </span>
                          )}
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            isClosed
                              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}>
                            {isClosed ? "Fermé / Expiré" : "En cours / Actif"}
                          </span>
                        </div>
                      </div>

                      {/* Date details */}
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          Date limite
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {contest.date_limite
                            ? new Date(contest.date_limite).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Non spécifiée"}
                        </span>
                        {daysLeft !== null && !isClosed && (
                          <span className={`block text-xs font-semibold mt-0.5 ${
                            daysLeft <= 7 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {daysLeft === 0 ? "Aujourd'hui !" : daysLeft === 1 ? "Plus que 1 jour !" : `Plus que ${daysLeft} jours`}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Detailed info */}
                    {(contest.filieres || contest.conditions) && (
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        {contest.filieres && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <strong>Filières ciblées :</strong> {contest.filieres}
                          </p>
                        )}
                        {contest.conditions && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                            <strong>Conditions :</strong> {contest.conditions}
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
