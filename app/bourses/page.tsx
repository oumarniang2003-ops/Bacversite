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
    enCours?: string;
    expire?: string;
  }>;
}

async function getScholarships(search: string, enCours: boolean, expire: boolean): Promise<Scholarship[]> {
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

    if (enCours && !expire) {
      queryText += " AND (date_limite >= CURRENT_DATE OR date_limite IS NULL)";
    } else if (expire && !enCours) {
      queryText += " AND date_limite < CURRENT_DATE";
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
  const enCours = resolvedParams.enCours === "true";
  const expire = resolvedParams.expire === "true";

  const scholarships = await getScholarships(search, enCours, expire);

  const getDaysRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Breadcrumb Bar */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-600">
          <Link href="/" className="text-emerald-600 hover:underline font-medium">
            Accueil
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>Bourses d'études</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 w-full flex-grow">
        
        {/* Left Column: Filters */}
        <aside className="w-full md:w-[280px] shrink-0">
          <form action="/bourses" method="GET" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Affiner ma recherche
              </h2>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Nom ou mot-clé
              </label>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Ex: Eiffel, Sénégal..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-250 bg-white text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              />
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Statut de la bourse
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="enCours"
                    value="true"
                    defaultChecked={enCours}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>En cours / Actives</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="expire"
                    value="true"
                    defaultChecked={expire}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>Fermées / Expirées</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Rechercher
              </button>
              
              {(search || enCours || expire) && (
                <div className="text-center">
                  <Link
                    href="/bourses"
                    className="text-xs text-gray-500 hover:text-emerald-600 transition-colors underline"
                  >
                    Réinitialiser les filtres
                  </Link>
                </div>
              )}
            </div>

          </form>
        </aside>

        {/* Right Column: Bourses Results */}
        <section className="flex-grow space-y-4">
          <div className="pb-1">
            <h2 className="text-xl font-bold text-gray-900">
              {scholarships.length} {scholarships.length > 1 ? "bourses trouvées" : "bourse trouvé"}
            </h2>
          </div>

          {/* Results List */}
          {scholarships.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
              <p className="text-gray-500 text-sm">Aucune bourse ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {scholarships.map((sch) => {
                const daysLeft = getDaysRemaining(sch.date_limite);
                const isClosed = daysLeft !== null && daysLeft < 0;

                return (
                  <div
                    key={sch.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      
                      <div className="space-y-1.5 flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {sch.nom}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          {sch.pays && (
                            <span className="text-sm text-gray-500">
                              📍 Pays cible : <span className="text-gray-900 font-semibold">{sch.pays}</span>
                            </span>
                          )}
                          {sch.montant && (
                            <span className="text-xs text-blue-600 font-bold">
                              💰 {sch.montant}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Date details */}
                      <div className="text-left sm:text-right shrink-0">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Date limite
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {sch.date_limite
                            ? new Date(sch.date_limite).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Toujours ouverte"}
                        </span>
                        {daysLeft !== null && !isClosed && (
                          <span className={`block text-xs font-semibold mt-0.5 ${
                            daysLeft <= 7 ? "text-red-650 " : "text-emerald-600 "
                          }`}>
                            {daysLeft === 0 ? "Aujourd'hui !" : daysLeft === 1 ? "Plus que 1 jour !" : `Plus que ${daysLeft} jours`}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Conditions and Apply Link */}
                    <div className="pt-4 border-t border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-grow">
                        {sch.conditions_eligibilite && (
                          <p className="text-xs text-gray-500">
                            <strong>Éligibilité :</strong> {sch.conditions_eligibilite}
                          </p>
                        )}
                      </div>
                      
                      {sch.lien_candidature && (
                        <div className="shrink-0 self-end sm:self-auto">
                          <a
                            href={sch.lien_candidature.startsWith("http") ? sch.lien_candidature : `https://${sch.lien_candidature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm hover:underline flex items-center gap-1"
                          >
                            Postuler en ligne →
                          </a>
                        </div>
                      )}
                    </div>

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
