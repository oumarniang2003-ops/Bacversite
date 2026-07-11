import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";

interface School {
  id: number;
  nom: string;
  type: string | null;
  ville: string | null;
  filieres: string | null;
  frais: string | null;
  conditions_admission: string | null;
  contact: string | null;
  site_web: string | null;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getSchool(id: string): Promise<School | null> {
  try {
    const res = await query("SELECT * FROM ecoles WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'école :", error);
    return null;
  }
}

export default async function EcoleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const school = await getSchool(resolvedParams.id);

  if (!school) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/ecoles"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'annuaire
          </Link>
        </div>

        {/* Main Details Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150/60 dark:border-gray-800/80 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-white space-y-4">
            <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-white/20 text-white`}>
              {school.type}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {school.nom}
            </h1>
            {school.ville && (
              <p className="text-sm text-blue-100 flex items-center font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {school.ville}
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left and Middle Content (2 cols) */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Filières */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                  Filières & Formations proposées
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {school.filieres ? school.filieres : "Aucune information disponible sur les filières."}
                </div>
              </div>

              {/* Conditions d'admission */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                  Conditions d'admission
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {school.conditions_admission ? school.conditions_admission : "Aucune condition d'admission spécifique enregistrée."}
                </div>
              </div>

            </div>

            {/* Right sidebar info (1 col) */}
            <div className="space-y-6 bg-gray-50/50 dark:bg-gray-850/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Informations pratiques
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Frais de scolarité</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-base">{school.frais ? school.frais : "Non spécifiés"}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{school.contact ? school.contact : "Non disponible"}</span>
                </div>

                {school.site_web && (
                  <div className="pt-2">
                    <a
                      href={school.site_web.startsWith("http") ? school.site_web : `https://${school.site_web}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
                    >
                      Visiter le site officiel
                      <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
