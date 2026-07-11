import Link from "next/link";
import { query } from "@/lib/db";

interface Scholarship {
  id: number;
  nom: string;
  pays: string | null;
  montant: string | null;
  date_limite: string | null; // format YYYY-MM-DD
  conditions_eligibilite: string | null;
  lien_candidature: string | null;
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

async function getScholarships(search: string): Promise<Scholarship[]> {
  try {
    let queryText = `
      SELECT id, nom, pays, montant, to_char(date_limite, 'YYYY-MM-DD') as date_limite, conditions_eligibilite, lien_candidature
      FROM bourses
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR pays ILIKE $${params.length} OR conditions_eligibilite ILIKE $${params.length})`;
    }

    queryText += " ORDER BY date_limite ASC NULLS LAST, id DESC";

    const res = await query(queryText, params);
    return res.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des bourses :", error);
    return [];
  }
}

export default async function BoursesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const scholarships = await getScholarships(search);

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
            Bourses d'Études
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Consultez les offres d'aides financières et de bourses disponibles pour financer vos études supérieures.
          </p>
        </div>

        {/* Search form */}
        <form action="/bourses" method="GET" className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150/60 dark:border-gray-800/80 shadow-sm flex gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher une bourse par nom, pays, critères..."
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
              href="/bourses"
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Effacer
            </Link>
          )}
        </form>

        {/* Scholarships List */}
        {scholarships.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-12 text-center">
            <p className="text-gray-500">Aucune offre de bourse ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {scholarships.map((sch) => {
              const daysLeft = getDaysRemaining(sch.date_limite);

              return (
                <div
                  key={sch.id}
                  className="bg-white dark:bg-gray-900 border border-gray-150/60 dark:border-gray-800/60 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                        Bourse d'études
                      </span>
                      {sch.pays && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                          📍 Destination : <span className="text-gray-900 dark:text-white">{sch.pays}</span>
                        </span>
                      )}
                      {sch.montant && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold ml-2">
                          💰 {sch.montant}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {sch.nom}
                    </h2>

                    {sch.conditions_eligibilite && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 p-4 rounded-xl border border-gray-100 dark:border-gray-850/50">
                        <strong className="block text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-1.5">Conditions d'éligibilité</strong>
                        <div className="whitespace-pre-line leading-relaxed">{sch.conditions_eligibilite}</div>
                      </div>
                    )}
                  </div>

                  {/* Right hand columns */}
                  <div className="md:w-60 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-6 shrink-0 space-y-6">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Date limite de dépôt
                      </span>
                      <span className="block text-base font-bold text-gray-950 dark:text-white">
                        {sch.date_limite
                          ? new Date(sch.date_limite).toLocaleDateString("fr-FR", {
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

                    {sch.lien_candidature && (
                      <div className="pt-2">
                        <a
                          href={sch.lien_candidature.startsWith("http") ? sch.lien_candidature : `https://${sch.lien_candidature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-colors text-center"
                        >
                          Postuler en ligne
                          <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
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
