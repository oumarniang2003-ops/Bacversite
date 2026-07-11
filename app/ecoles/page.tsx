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
    ville?: string;
    public?: string;
    private?: string;
  }>;
}

async function getSchools(search: string, ville: string, isPublic: boolean, isPrivate: boolean): Promise<School[]> {
  try {
    let queryText = "SELECT * FROM ecoles WHERE 1=1";
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR filieres ILIKE $${params.length})`;
    }

    if (ville) {
      params.push(ville);
      queryText += ` AND ville = $${params.length}`;
    }

    // Apply type checkboxes filter logic
    if (isPublic && !isPrivate) {
      queryText += " AND type = 'Public'";
    } else if (isPrivate && !isPublic) {
      queryText += " AND type = 'Privé'";
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
  const ville = resolvedParams.ville || "";
  const isPublic = resolvedParams.public === "true";
  const isPrivate = resolvedParams.private === "true";

  const [schools, cities] = await Promise.all([
    getSchools(search, ville, isPublic, isPrivate),
    getDistinctCities(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Breadcrumb Bar */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-600">
          <Link href="/" className="text-emerald-600 hover:underline font-medium">
            Accueil
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>Annuaire des écoles</span>
        </div>
      </div>

      {/* Main Content (2 Columns Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 w-full flex-grow">
        
        {/* Left Column: Filter Sidebar */}
        <aside className="w-full md:w-[280px] shrink-0">
          <form action="/ecoles" method="GET" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-5">
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
                placeholder="Ex: ESP, Polytechnique..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-250 bg-white text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              />
            </div>

            {/* City Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ville
              </label>
              <select
                name="ville"
                defaultValue={ville}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-250 bg-white text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              >
                <option value="">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Type d'établissement
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="public"
                    value="true"
                    defaultChecked={isPublic}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="private"
                    value="true"
                    defaultChecked={isPrivate}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                  />
                  <span>Privé</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Filtrer
              </button>
              
              {(search || ville || isPublic || isPrivate) && (
                <div className="text-center">
                  <Link
                    href="/ecoles"
                    className="text-xs text-gray-500 hover:text-emerald-600 transition-colors underline"
                  >
                    Réinitialiser les filtres
                  </Link>
                </div>
              )}
            </div>

          </form>
        </aside>

        {/* Right Column: Search Results */}
        <section className="flex-grow space-y-4">
          <div className="pb-1">
            <h2 className="text-xl font-bold text-gray-900">
              {schools.length} {schools.length > 1 ? "écoles trouvées" : "école trouvée"}
            </h2>
          </div>

          {/* Results List */}
          {schools.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
              <p className="text-gray-500 text-sm">Aucun établissement ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-gray-900">
                      {school.nom}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      {school.ville && (
                        <span className="text-sm text-gray-500">
                          📍 {school.ville}
                        </span>
                      )}
                      
                      <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
                        school.type === "Public"
                          ? "bg-emerald-100 text-emerald-700  "
                          : "bg-purple-100 text-purple-700  "
                      }`}>
                        {school.type}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-auto">
                    <Link
                      href={`/ecoles/${school.id}`}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm hover:underline flex items-center gap-1"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
