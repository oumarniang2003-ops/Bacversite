import Link from "next/link";
import { query } from "@/lib/db";

interface School {
  id: number;
  nom: string;
  type: string | null;
  ville: string | null;
  filieres: string | null;
  frais: string | null;
  contact: string | null;
  site_web: string | null;
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    ville?: string;
  }>;
}

async function getSchools(search: string, type: string, ville: string): Promise<School[]> {
  try {
    let queryText = "SELECT * FROM ecoles WHERE 1=1";
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR ville ILIKE $${params.length} OR filieres ILIKE $${params.length})`;
    }

    if (type) {
      params.push(type);
      queryText += ` AND type = $${params.length}`;
    }

    if (ville) {
      params.push(ville);
      queryText += ` AND ville = $${params.length}`;
    }

    queryText += " ORDER BY nom ASC, id DESC";

    const res = await query(queryText, params);
    return res.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des écoles :", error);
    return [];
  }
}

async function getDistinctCities(): Promise<string[]> {
  try {
    const res = await query(
      "SELECT DISTINCT ville FROM ecoles WHERE ville IS NOT NULL AND ville != '' ORDER BY ville"
    );
    return res.rows.map((row) => row.ville);
  } catch (error) {
    console.error("Erreur lors de la récupération des villes :", error);
    return [];
  }
}

export default async function EcolesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const type = resolvedParams.type || "";
  const ville = resolvedParams.ville || "";

  const [schools, cities] = await Promise.all([
    getSchools(search, type, ville),
    getDistinctCities(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Annuaire des Établissements
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trouvez les meilleures universités publiques, privées et écoles de formation au Sénégal.
          </p>
        </div>

        {/* Filters Form */}
        <form action="/ecoles" method="GET" className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150/60 dark:border-gray-800/80 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* Text Search */}
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher par nom, filière..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-gray-900 dark:text-white"
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Type Filter */}
          <div>
            <select
              name="type"
              defaultValue={type}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-gray-900 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="Public">Public</option>
              <option value="Privé">Privé</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              name="ville"
              defaultValue={ville}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Filtrer
            </button>
            {(search || type || ville) && (
              <Link
                href="/ecoles"
                className="inline-flex items-center justify-center p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-500 hover:text-gray-700 transition-colors"
                title="Réinitialiser"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                </svg>
              </Link>
            )}
          </div>

        </form>

        {/* Results List */}
        {schools.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-12 text-center">
            <p className="text-gray-500">Aucun établissement ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Link
                key={school.id}
                href={`/ecoles/${school.id}`}
                className="group flex flex-col justify-between bg-white dark:bg-gray-900 border border-gray-150/60 dark:border-gray-800/60 rounded-2xl p-6 hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:-translate-y-0.5 transition-all duration-305"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      school.type === "Public"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                    }`}>
                      {school.type}
                    </span>
                    {school.ville && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {school.ville}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {school.nom}
                  </h3>

                  {school.filieres && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      Filières : {school.filieres}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
                  <span>Frais : <span className="font-semibold text-gray-700 dark:text-gray-300">{school.frais || "N/A"}</span></span>
                  
                  <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                    Voir la fiche
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
