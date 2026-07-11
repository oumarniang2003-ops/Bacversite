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
  }>;
}

async function getContests(search: string): Promise<Contest[]> {
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
  const contests = await getContests(search);

  const getDaysRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Concours d'Entrée
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez les concours nationaux et d'écoles pour l'accès aux grandes écoles et universités.
          </p>
        </div>

        {/* Search form */}
        <form action="/concours" method="GET" className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150/60 dark:border-gray-800/80 shadow-sm flex gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher un concours, une filière, une école liée..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-gray-900 dark:text-white"
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Rechercher
          </button>
          {search && (
            <Link
              href="/concours"
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Effacer
            </Link>
          )}
        </form>

        {/* Contests List */}
        {contests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-12 text-center">
            <p className="text-gray-500">Aucun concours ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {contests.map((contest) => {
              const daysLeft = getDaysRemaining(contest.date_limite);

              return (
                <div
                  key={contest.id}
                  className="bg-white dark:bg-gray-900 border border-gray-150/60 dark:border-gray-800/60 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400">
                        Concours
                      </span>
                      {contest.ecoles_liees && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                          📍 {contest.ecoles_liees}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {contest.nom}
                    </h2>

                    {contest.filieres && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong className="text-gray-900 dark:text-white font-semibold">Filières ciblées :</strong> {contest.filieres}
                      </p>
                    )}

                    {contest.conditions && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 p-4 rounded-xl border border-gray-100 dark:border-gray-850/50">
                        <strong className="block text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-1.5">Conditions de participation</strong>
                        <div className="whitespace-pre-line leading-relaxed">{contest.conditions}</div>
                      </div>
                    )}
                  </div>

                  {/* Date Limit Widget */}
                  <div className="md:w-60 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-6 shrink-0 space-y-4">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Date limite d'inscription
                      </span>
                      <span className="block text-base font-bold text-gray-950 dark:text-white">
                        {contest.date_limite
                          ? new Date(contest.date_limite).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Non spécifiée"}
                      </span>
                    </div>

                    {daysLeft !== null && (
                      <div>
                        {daysLeft < 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-150 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Fermé / Expiré
                          </span>
                        ) : daysLeft === 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 animate-pulse">
                            Aujourd'hui !
                          </span>
                        ) : daysLeft === 1 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-extrabold">
                            Plus que 1 jour !
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            daysLeft <= 7
                              ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                          }`}>
                            Plus que {daysLeft} jours
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
