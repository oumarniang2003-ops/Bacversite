import Link from "next/link";
import { query } from "@/lib/db";

interface StudyDestination {
  id: number;
  pays: string;
  procedures: string | null;
  cout_vie_estime: string | null;
  partenaires: string | null;
  visa_info: string | null;
}

async function getDestinations(): Promise<StudyDestination[]> {
  try {
    const res = await query("SELECT * FROM etudes_etranger ORDER BY pays ASC");
    return res.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des destinations :", error);
    return [];
  }
}

export default async function EtrangerPage() {
  const destinations = await getDestinations();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Études à l'Étranger
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez toutes les informations indispensables pour préparer votre projet d'études internationales.
          </p>
        </div>

        {/* Destination List */}
        {destinations.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-10 text-center shadow-sm">
            <p className="text-gray-500 text-sm">Aucun guide de destination n'est disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Header Banner */}
                <div className="bg-emerald-600 dark:bg-emerald-700 p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-base">
                      {dest.pays.slice(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-lg font-bold">{dest.pays}</h2>
                  </div>
                  {dest.cout_vie_estime && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                      Coût de la vie : {dest.cout_vie_estime}
                    </span>
                  )}
                </div>

                {/* Content Sections */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Procedures & Partners */}
                  <div className="space-y-6">
                    {dest.procedures && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
                          Procédures d'admission
                        </h3>
                        <div className="text-sm text-gray-650 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-2.5">
                          {dest.procedures}
                        </div>
                      </div>
                    )}

                    {dest.partenaires && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
                          Organismes & Universités partenaires
                        </h3>
                        <div className="text-sm text-gray-650 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-2.5">
                          {dest.partenaires}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Visa Information */}
                  <div className="space-y-5 bg-gray-50 dark:bg-gray-950/40 p-5 rounded-lg border border-gray-200 dark:border-gray-850">
                    {dest.visa_info && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-150 dark:border-gray-800 pb-2">
                          Démarches de visa étudiant
                        </h3>
                        <div className="text-sm text-gray-650 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                          {dest.visa_info}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
