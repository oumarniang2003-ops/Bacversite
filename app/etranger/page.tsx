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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Études à l'Étranger
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez toutes les informations indispensables pour préparer votre projet d'études internationales.
          </p>
        </div>

        {/* Destination List */}
        {destinations.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-12 text-center">
            <p className="text-gray-500">Aucun guide de destination n'est disponible pour le moment. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="space-y-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white dark:bg-gray-900 border border-gray-150/60 dark:border-gray-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                      {dest.pays.slice(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold">{dest.pays}</h2>
                  </div>
                  {dest.cout_vie_estime && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                      Coût de la vie : {dest.cout_vie_estime}
                    </span>
                  )}
                </div>

                {/* Content Sections */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column: Procedures & Partners */}
                  <div className="space-y-6">
                    {dest.procedures && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                          Procédures d'admission
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-3">
                          {dest.procedures}
                        </div>
                      </div>
                    )}

                    {dest.partenaires && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-emerald-500 pl-2">
                          Organismes & Universités partenaires
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-3">
                          {dest.partenaires}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Visa Information */}
                  <div className="space-y-6 bg-gray-50/50 dark:bg-gray-950/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-850/60">
                    {dest.visa_info && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
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
