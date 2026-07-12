"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
interface Ecole {
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

interface Concours {
  id: number;
  nom: string;
  filieres: string | null;
  date_limite: string | null; // format YYYY-MM-DD
  conditions: string | null;
  ecoles_liees: string | null;
}

interface Bourse {
  id: number;
  nom: string;
  pays: string | null;
  montant: string | null;
  date_limite: string | null; // format YYYY-MM-DD
  conditions_eligibilite: string | null;
  lien_candidature: string | null;
}

interface EtudeEtranger {
  id: number;
  pays: string;
  procedures: string | null;
  cout_vie_estime: string | null;
  partenaires: string | null;
  visa_info: string | null;
}

type TabType = "ecoles" | "concours" | "bourses" | "etudes";

interface AdminDashboardClientProps {
  adminEmail: string;
}

export default function AdminDashboardClient({ adminEmail }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ecoles");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // Only used for Ecoles
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Data lists
  const [ecoles, setEcoles] = useState<Ecole[]>([]);
  const [concours, setConcours] = useState<Concours[]>([]);
  const [bourses, setBourses] = useState<Bourse[]>([]);
  const [etudes, setEtudes] = useState<EtudeEtranger[]>([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Dynamic Form states
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Map tabs to API endpoints
  const apiEndpoint = {
    ecoles: "/api/admin/ecoles",
    concours: "/api/admin/concours",
    bourses: "/api/admin/bourses",
    etudes: "/api/admin/etudes-etranger",
  }[activeTab];

  // Fetch items based on active tab and query filters
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (activeTab === "ecoles" && typeFilter) queryParams.set("type", typeFilter);

      const res = await fetch(`${apiEndpoint}?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération des données");
      const data = await res.json();

      if (activeTab === "ecoles") setEcoles(data);
      else if (activeTab === "concours") setConcours(data);
      else if (activeTab === "bourses") setBourses(data);
      else if (activeTab === "etudes") setEtudes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, typeFilter, activeTab]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Déconnexion échouée :", error);
    }
  };

  // Get initial values for forms depending on active tab
  const getInitialFormState = (item: any = null) => {
    if (activeTab === "ecoles") {
      return {
        nom: item?.nom || "",
        type: item?.type || "Public",
        ville: item?.ville || "",
        filieres: item?.filieres || "",
        frais: item?.frais || "",
        conditions_admission: item?.conditions_admission || "",
        contact: item?.contact || "",
        site_web: item?.site_web || "",
      };
    }
    if (activeTab === "concours") {
      return {
        nom: item?.nom || "",
        filieres: item?.filieres || "",
        date_limite: item?.date_limite || "",
        conditions: item?.conditions || "",
        ecoles_liees: item?.ecoles_liees || "",
      };
    }
    if (activeTab === "bourses") {
      return {
        nom: item?.nom || "",
        pays: item?.pays || "",
        montant: item?.montant || "",
        date_limite: item?.date_limite || "",
        conditions_eligibilite: item?.conditions_eligibilite || "",
        lien_candidature: item?.lien_candidature || "",
      };
    }
    // etudes
    return {
      pays: item?.pays || "",
      procedures: item?.procedures || "",
      cout_vie_estime: item?.cout_vie_estime || "",
      partenaires: item?.partenaires || "",
      visa_info: item?.visa_info || "",
    };
  };

  const openAddModal = () => {
    setFormState(getInitialFormState());
    setFormError(null);
    setShowAddModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormState(getInitialFormState(item));
    setFormError(null);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de création");

      setShowAddModal(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch(apiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, id: editingId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de modification");

      setShowEditModal(false);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    try {
      const res = await fetch(`${apiEndpoint}?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de suppression");
      }

      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shrink-0 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="text-lg font-bold text-gray-900">Admin Bacversité</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab("ecoles"); setSearch(""); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "ecoles"
                  ? "bg-emerald-50  text-emerald-600 "
                  : "text-gray-500 hover:text-gray-900   hover:bg-gray-50 "
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Écoles & Univs</span>
            </button>

            <button
              onClick={() => { setActiveTab("concours"); setSearch(""); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "concours"
                  ? "bg-emerald-50  text-emerald-600 "
                  : "text-gray-500 hover:text-gray-900   hover:bg-gray-50 "
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Concours</span>
            </button>

            <button
              onClick={() => { setActiveTab("bourses"); setSearch(""); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "bourses"
                  ? "bg-emerald-50  text-emerald-600 "
                  : "text-gray-500 hover:text-gray-900   hover:bg-gray-50 "
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bourses d'études</span>
            </button>

            <button
              onClick={() => { setActiveTab("etudes"); setSearch(""); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "etudes"
                  ? "bg-emerald-50  text-emerald-600 "
                  : "text-gray-500 hover:text-gray-900   hover:bg-gray-50 "
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11 20.955V18.5a2.5 2.5 0 00-2.5-2.5h-.5A2 2 0 016 14v-2.945M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Études à l'étranger</span>
            </button>
          </nav>
        </div>

        {/* Admin Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="mb-4">
            <p className="text-xs text-gray-450">Session administrateur</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-center text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 space-y-6">
        
        {/* Top bar title and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">
              {activeTab === "ecoles" && "Gestion des Écoles"}
              {activeTab === "concours" && "Gestion des Concours"}
              {activeTab === "bourses" && "Gestion des Bourses"}
              {activeTab === "etudes" && "Gestion des Études à l'Étranger"}
            </h1>
            <p className="text-xs text-gray-500">
              {activeTab === "ecoles" && "Gérer l'annuaire des établissements d'enseignement supérieur"}
              {activeTab === "concours" && "Gérer les dates et fiches des concours nationaux"}
              {activeTab === "bourses" && "Gérer les offres de bourses locales et internationales"}
              {activeTab === "etudes" && "Gérer les guides et démarches par pays de destination"}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
          >
            + Ajouter un élément
          </button>
        </div>

        {/* List Controls (Search & Filters) */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par mot-clé..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-205 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors text-gray-900"
              />
              <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {activeTab === "ecoles" && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-205 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-gray-900"
              >
                <option value="">Tous les types</option>
                <option value="Public">Public</option>
                <option value="Privé">Privé</option>
              </select>
            )}
          </div>

          {/* Dynamic Table Rendering */}
          <div className="overflow-x-auto pt-2">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <>
                {/* 1. ECOLES TABLE */}
                {activeTab === "ecoles" && (
                  ecoles.length === 0 ? <p className="text-center py-10 text-gray-500 text-sm">Aucune école trouvée.</p> : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead>
                        <tr className="text-left font-semibold text-gray-400">
                          <th className="pb-3 pr-4">Nom</th>
                          <th className="pb-3 px-4">Type</th>
                          <th className="pb-3 px-4">Ville</th>
                          <th className="pb-3 px-4">Frais</th>
                          <th className="pb-3 px-4">Contact</th>
                          <th className="pb-3 pl-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {ecoles.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-4 font-bold text-gray-900 max-w-xs truncate">{item.nom}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                                item.type === "Public" 
                                  ? "bg-emerald-55 text-emerald-700  " 
                                  : "bg-purple-55 text-purple-700  "
                              }`}>{item.type}</span>
                            </td>
                            <td className="py-3.5 px-4">{item.ville || "-"}</td>
                            <td className="py-3.5 px-4 max-w-[120px] truncate">{item.frais || "-"}</td>
                            <td className="py-3.5 px-4 max-w-[120px] truncate">{item.contact || "-"}</td>
                            <td className="py-3.5 pl-4 text-right space-x-3">
                              <button onClick={() => openEditModal(item)} className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Modifier</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 transition-colors font-medium">Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 2. CONCOURS TABLE */}
                {activeTab === "concours" && (
                  concours.length === 0 ? <p className="text-center py-10 text-gray-500 text-sm">Aucun concours trouvé.</p> : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead>
                        <tr className="text-left font-semibold text-gray-400">
                          <th className="pb-3 pr-4">Nom</th>
                          <th className="pb-3 px-4">Filières</th>
                          <th className="pb-3 px-4">Date Limite</th>
                          <th className="pb-3 px-4">Écoles Liées</th>
                          <th className="pb-3 pl-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {concours.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-4 font-bold text-gray-900 max-w-xs truncate">{item.nom}</td>
                            <td className="py-3.5 px-4 max-w-[160px] truncate">{item.filieres || "-"}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-gray-900">
                                {item.date_limite ? new Date(item.date_limite).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-[160px] truncate">{item.ecoles_liees || "-"}</td>
                            <td className="py-3.5 pl-4 text-right space-x-3">
                              <button onClick={() => openEditModal(item)} className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Modifier</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 transition-colors font-medium">Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 3. BOURSES TABLE */}
                {activeTab === "bourses" && (
                  bourses.length === 0 ? <p className="text-center py-10 text-gray-500 text-sm">Aucune bourse trouvée.</p> : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead>
                        <tr className="text-left font-semibold text-gray-400">
                          <th className="pb-3 pr-4">Nom</th>
                          <th className="pb-3 px-4">Pays</th>
                          <th className="pb-3 px-4">Montant</th>
                          <th className="pb-3 px-4">Date Limite</th>
                          <th className="pb-3 pl-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {bourses.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-4 font-bold text-gray-900 max-w-xs truncate">{item.nom}</td>
                            <td className="py-3.5 px-4">{item.pays || "-"}</td>
                            <td className="py-3.5 px-4 font-medium text-emerald-600">{item.montant || "-"}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-gray-900">
                                {item.date_limite ? new Date(item.date_limite).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 text-right space-x-3">
                              <button onClick={() => openEditModal(item)} className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Modifier</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 transition-colors font-medium">Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 4. ETUDES ET RANGER TABLE */}
                {activeTab === "etudes" && (
                  etudes.length === 0 ? <p className="text-center py-10 text-gray-500 text-sm">Aucune destination trouvée.</p> : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead>
                        <tr className="text-left font-semibold text-gray-400">
                          <th className="pb-3 pr-4">Pays</th>
                          <th className="pb-3 px-4">Coût de Vie Estimé</th>
                          <th className="pb-3 px-4">Partenaires</th>
                          <th className="pb-3 pl-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {etudes.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-4 font-bold text-gray-900">{item.pays}</td>
                            <td className="py-3.5 px-4">{item.cout_vie_estime || "-"}</td>
                            <td className="py-3.5 px-4 max-w-xs truncate">{item.partenaires || "-"}</td>
                            <td className="py-3.5 pl-4 text-right space-x-3">
                              <button onClick={() => openEditModal(item)} className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Modifier</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 transition-colors font-medium">Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

              </>
            )}
          </div>
        </div>

      </main>

      {/* DYNAMIC ADD / EDIT MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg border border-gray-200 shadow-lg p-6 relative">
            
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              {showAddModal ? "Ajouter un élément" : "Modifier l'élément"} ({activeTab === "ecoles" ? "École" : activeTab === "concours" ? "Concours" : activeTab === "bourses" ? "Bourse" : "Destination"})
            </h3>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 p-4 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              
              {/* --- 1. ECOLES FORM FIELDS --- */}
              {activeTab === "ecoles" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nom de l'établissement *</label>
                    <input type="text" required value={formState.nom || ""} onChange={(e) => setFormState({ ...formState, nom: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Type</label>
                    <select value={formState.type || "Public"} onChange={(e) => setFormState({ ...formState, type: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30">
                      <option value="Public">Public</option>
                      <option value="Privé">Privé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Ville</label>
                    <input type="text" value={formState.ville || ""} onChange={(e) => setFormState({ ...formState, ville: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Frais de scolarité</label>
                    <input type="text" value={formState.frais || ""} onChange={(e) => setFormState({ ...formState, frais: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Contact</label>
                    <input type="text" value={formState.contact || ""} onChange={(e) => setFormState({ ...formState, contact: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Site Web</label>
                    <input type="text" value={formState.site_web || ""} onChange={(e) => setFormState({ ...formState, site_web: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Filières</label>
                    <textarea value={formState.filieres || ""} onChange={(e) => setFormState({ ...formState, filieres: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Conditions d'admission</label>
                    <textarea value={formState.conditions_admission || ""} onChange={(e) => setFormState({ ...formState, conditions_admission: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                </div>
              )}

              {/* --- 2. CONCOURS FORM FIELDS --- */}
              {activeTab === "concours" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nom du concours *</label>
                      <input type="text" required value={formState.nom || ""} onChange={(e) => setFormState({ ...formState, nom: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Date limite de candidature</label>
                      <input type="date" value={formState.date_limite || ""} onChange={(e) => setFormState({ ...formState, date_limite: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Filières ciblées</label>
                    <input type="text" value={formState.filieres || ""} onChange={(e) => setFormState({ ...formState, filieres: e.target.value })} placeholder="Ex: Informatique, Énergie, Management" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Écoles partenaires / liées</label>
                    <input type="text" value={formState.ecoles_liees || ""} onChange={(e) => setFormState({ ...formState, ecoles_liees: e.target.value })} placeholder="Ex: ESP, IPT, Polytechnique" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Conditions de participation</label>
                    <textarea value={formState.conditions || ""} onChange={(e) => setFormState({ ...formState, conditions: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                </div>
              )}

              {/* --- 3. BOURSES FORM FIELDS --- */}
              {activeTab === "bourses" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nom de la bourse *</label>
                      <input type="text" required value={formState.nom || ""} onChange={(e) => setFormState({ ...formState, nom: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Pays d'étude</label>
                      <input type="text" value={formState.pays || ""} onChange={(e) => setFormState({ ...formState, pays: e.target.value })} placeholder="Ex: Sénégal, France, Canada" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Montant / Couverture</label>
                      <input type="text" value={formState.montant || ""} onChange={(e) => setFormState({ ...formState, montant: e.target.value })} placeholder="Ex: 50 000 FCFA/mois ou Couverture totale" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Date limite de candidature</label>
                      <input type="date" value={formState.date_limite || ""} onChange={(e) => setFormState({ ...formState, date_limite: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Lien vers la candidature</label>
                    <input type="text" value={formState.lien_candidature || ""} onChange={(e) => setFormState({ ...formState, lien_candidature: e.target.value })} placeholder="https://exemple.com/apply" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Conditions d'éligibilité</label>
                    <textarea value={formState.conditions_eligibilite || ""} onChange={(e) => setFormState({ ...formState, conditions_eligibilite: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                </div>
              )}

              {/* --- 4. ETUDES ETRANGER FORM FIELDS --- */}
              {activeTab === "etudes" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nom du pays *</label>
                      <input type="text" required value={formState.pays || ""} onChange={(e) => setFormState({ ...formState, pays: e.target.value })} placeholder="Ex: France, Canada" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Coût de la vie estimé</label>
                      <input type="text" value={formState.cout_vie_estime || ""} onChange={(e) => setFormState({ ...formState, cout_vie_estime: e.target.value })} placeholder="Ex: 800€/mois" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Établissements / Organismes partenaires</label>
                    <input type="text" value={formState.partenaires || ""} onChange={(e) => setFormState({ ...formState, partenaires: e.target.value })} placeholder="Ex: Campus France, Universités du Québec" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Procédures d'admission</label>
                    <textarea value={formState.procedures || ""} onChange={(e) => setFormState({ ...formState, procedures: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Informations de Visa</label>
                    <textarea value={formState.visa_info || ""} onChange={(e) => setFormState({ ...formState, visa_info: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30" />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[100px] cursor-pointer"
                >
                  {formLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
