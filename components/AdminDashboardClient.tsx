"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  created_at: string;
}

interface AdminDashboardClientProps {
  adminEmail: string;
}

const initialFormState = {
  nom: "",
  type: "Public",
  ville: "",
  filieres: "",
  frais: "",
  conditions_admission: "",
  contact: "",
  site_web: "",
};

export default function AdminDashboardClient({ adminEmail }: AdminDashboardClientProps) {
  const [ecoles, setEcoles] = useState<Ecole[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEcole, setEditingEcole] = useState<Ecole | null>(null);

  // Form state
  const [formState, setFormState] = useState(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();

  // Fetch ecoles on load, and when search/filter changes
  const fetchEcoles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (typeFilter) queryParams.set("type", typeFilter);

      const res = await fetch(`/api/admin/ecoles?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Erreur de récupération des écoles");
      const data = await res.json();
      setEcoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEcoles();
    }, 300); // Debounce search input

    return () => clearTimeout(delayDebounce);
  }, [search, typeFilter]);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/ecoles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de création");

      setShowAddModal(false);
      setFormState(initialFormState);
      fetchEcoles();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEcole) return;
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/ecoles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, id: editingEcole.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de modification");

      setShowEditModal(false);
      setEditingEcole(null);
      setFormState(initialFormState);
      fetchEcoles();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) return;

    try {
      const res = await fetch(`/api/admin/ecoles?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de suppression");
      }

      fetchEcoles();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openEditModal = (ecole: Ecole) => {
    setEditingEcole(ecole);
    setFormState({
      nom: ecole.nom,
      type: ecole.type || "Public",
      ville: ecole.ville || "",
      filieres: ecole.filieres || "",
      frais: ecole.frais || "",
      conditions_admission: ecole.conditions_admission || "",
      contact: ecole.contact || "",
      site_web: ecole.site_web || "",
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setFormState(initialFormState);
    setFormError(null);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecté en tant que : <span className="font-semibold text-blue-600 dark:text-blue-400">{adminEmail}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-xl transition-all"
          >
            Déconnexion
          </button>
        </div>

        {/* Schools CRUD Title & Search Controls */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gestion des Établissements</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ajouter, modifier ou supprimer les écoles</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-sm transition-all"
            >
              + Ajouter une école
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, ville..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-gray-900 dark:text-white"
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-gray-900 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="Public">Public</option>
              <option value="Privé">Privé</option>
            </select>
          </div>

          {/* Schools Table */}
          <div className="overflow-x-auto pt-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : ecoles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                Aucun établissement trouvé.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                <thead>
                  <tr className="text-left font-semibold text-gray-500 dark:text-gray-400">
                    <th className="pb-3 pr-4">Nom</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Ville</th>
                    <th className="pb-3 px-4">Frais</th>
                    <th className="pb-3 px-4">Contact</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
                  {ecoles.map((ecole) => (
                    <tr key={ecole.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 pr-4 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                        {ecole.nom}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                          ecole.type === "Public" 
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" 
                            : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                        }`}>
                          {ecole.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{ecole.ville || "-"}</td>
                      <td className="py-3.5 px-4">{ecole.frais || "-"}</td>
                      <td className="py-3.5 px-4">{ecole.contact || "-"}</td>
                      <td className="py-3.5 pl-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(ecole)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(ecole.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 relative">
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {showAddModal ? "Ajouter un établissement" : "Modifier l'établissement"}
            </h3>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 p-4 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Nom de l'établissement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nom}
                    onChange={(e) => setFormState({ ...formState, nom: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Type
                  </label>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  >
                    <option value="Public">Public</option>
                    <option value="Privé">Privé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formState.ville}
                    onChange={(e) => setFormState({ ...formState, ville: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Frais de scolarité
                  </label>
                  <input
                    type="text"
                    value={formState.frais}
                    onChange={(e) => setFormState({ ...formState, frais: e.target.value })}
                    placeholder="Ex: Gratuit ou 50 000 FCFA/mois"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Contact (Téléphone / Email)
                  </label>
                  <input
                    type="text"
                    value={formState.contact}
                    onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Site web
                  </label>
                  <input
                    type="text"
                    value={formState.site_web}
                    onChange={(e) => setFormState({ ...formState, site_web: e.target.value })}
                    placeholder="https://exemple.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Filières disponibles
                </label>
                <textarea
                  value={formState.filieres}
                  onChange={(e) => setFormState({ ...formState, filieres: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Conditions d'admission
                </label>
                <textarea
                  value={formState.conditions_admission}
                  onChange={(e) => setFormState({ ...formState, conditions_admission: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingEcole(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-sm transition-all flex items-center justify-center"
                >
                  {formLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : showAddModal ? (
                    "Enregistrer"
                  ) : (
                    "Mettre à jour"
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
