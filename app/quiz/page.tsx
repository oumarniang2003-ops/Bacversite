"use client";

import React, { useState } from "react";
import Link from "next/link";

const BAC_SERIES = ["L1", "L2", "S1", "S2", "S3", "S4", "S5", "G", "T", "Autre"];

const INTERESTS = [
  { value: "Sciences/Logique", label: "Sciences & Logique" },
  { value: "Aider les autres/Santé", label: "Aider les autres & Santé" },
  { value: "Droit/Justice", label: "Droit & Justice" },
  { value: "Chiffres/Gestion", label: "Chiffres & Gestion" },
  { value: "Lecture/Écriture", label: "Lecture & Écriture" },
  { value: "Informatique/Technologie", label: "Informatique & Technologie" },
  { value: "Nature/Agriculture", label: "Nature & Agriculture" },
  { value: "Créativité/Communication", label: "Créativité & Communication" },
  { value: "Voyager/Contact humain", label: "Voyager & Contact humain" },
];

const BUDGET_OPTIONS = [
  "Public uniquement - budget limité",
  "Peu importe, je peux considérer le privé",
  "Peu importe totalement",
];

const ABROAD_OPTIONS = [
  "Oui, c'est mon objectif",
  "Peut-être",
  "Non, je préfère rester au Sénégal",
];

interface SchoolRecommendation {
  id: number;
  nom: string;
  type: string;
  ville: string;
}

interface FiliereRecommendation {
  nom: string;
  description: string;
  ecoles: SchoolRecommendation[];
}

interface QuizResult {
  recommendations: FiliereRecommendation[];
  etranger: {
    pays: Array<{ id: number; pays: string; cout_vie_estime: string }>;
    bourses: Array<{ id: number; nom: string; pays: string; montant: string }>;
  } | null;
}

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [bacSerie, setBacSerie] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [etranger, setEtranger] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInterestToggle = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleReset = () => {
    setBacSerie("");
    setSelectedInterests([]);
    setBudget("");
    setEtranger("");
    setResult(null);
    setError(null);
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/resultats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bacSerie,
          interests: selectedInterests,
          budget,
          etranger,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec du calcul des résultats.");

      setResult(data);
      setStep(5); // Show results
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Header Title */}
          <div className="text-center pb-4 border-b border-gray-100">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Quiz d'Orientation Bacversité
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Découvrez les filières et universités qui correspondent le mieux à votre profil
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600">Analyse de vos préférences en cours...</p>
            </div>
          )}

          {/* Wizard Steps */}
          {!loading && (
            <>
              {/* STEP 1: BAC SERIES */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Étape 1 sur 4</span>
                    <h2 className="text-lg font-bold text-gray-950 mt-1">Quelle est la série de votre BAC ?</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {BAC_SERIES.map((serie) => (
                      <button
                        key={serie}
                        type="button"
                        onClick={() => setBacSerie(serie)}
                        className={`py-3 px-4 rounded-lg text-sm font-semibold border text-center transition-colors cursor-pointer ${
                          bacSerie === serie
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {serie}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={!bacSerie}
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: INTERESTS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Étape 2 sur 4</span>
                    <h2 className="text-lg font-bold text-gray-950 mt-1">Quels sont vos principaux centres d'intérêt ?</h2>
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez toutes les options qui vous plaisent</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.value);
                      return (
                        <button
                          key={interest.value}
                          type="button"
                          onClick={() => handleInterestToggle(interest.value)}
                          className={`flex items-center space-x-3 p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50/50 border-emerald-500/50 text-emerald-700 font-semibold"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                          />
                          <span className="text-sm">{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2.5 text-sm font-semibold text-gray-750 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      disabled={selectedInterests.length === 0}
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: BUDGET */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Étape 3 sur 4</span>
                    <h2 className="text-lg font-bold text-gray-950 mt-1">Quel budget d'études pouvez-vous allouer ?</h2>
                  </div>

                  <div className="space-y-3">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBudget(option)}
                        className={`w-full flex items-center space-x-3 p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                          budget === option
                            ? "bg-emerald-50/50 border-emerald-500/50 text-emerald-700 font-semibold"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          budget === option ? "border-emerald-600" : "border-gray-300"
                        }`}>
                          {budget === option && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
                        </div>
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 text-sm font-semibold text-gray-750 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      disabled={!budget}
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ABROAD */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Étape 4 sur 4</span>
                    <h2 className="text-lg font-bold text-gray-950 mt-1">Avez-vous le souhait d'étudier à l'étranger ?</h2>
                  </div>

                  <div className="space-y-3">
                    {ABROAD_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setEtranger(option)}
                        className={`w-full flex items-center space-x-3 p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                          etranger === option
                            ? "bg-emerald-50/50 border-emerald-500/50 text-emerald-700 font-semibold"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          etranger === option ? "border-emerald-600" : "border-gray-300"
                        }`}>
                          {etranger === option && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
                        </div>
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 text-sm font-semibold text-gray-750 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      disabled={!etranger}
                      onClick={handleSubmit}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Soumettre
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: RESULTS DISPLAY */}
              {step === 5 && result && (
                <div className="space-y-8">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Résultats du Quiz</span>
                    <h2 className="text-xl font-extrabold text-gray-900 mt-1">Vos Recommandations Personnalisées</h2>
                    <p className="text-xs text-gray-500 mt-1">Voici les filières d'études et universités adaptées à vos centres d'intérêt.</p>
                  </div>

                  {/* Recommended Filieres */}
                  <div className="space-y-6">
                    {result.recommendations.map((rec, index) => (
                      <div key={rec.nom} className="bg-gray-50 border border-gray-200 rounded-lg p-5 sm:p-6 space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-emerald-600 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-950">{rec.nom}</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rec.description}</p>
                          </div>
                        </div>

                        {/* Matching Schools */}
                        <div className="pt-3.5 border-t border-gray-200/60 space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Établissements sénégalais suggérés</h4>
                          
                          {rec.ecoles.length === 0 ? (
                            <p className="text-xs text-gray-550 italic">Aucun établissement public ne correspond directement à ces critères de filières.</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                              {rec.ecoles.map((school) => (
                                <div key={school.id} className="bg-white border border-gray-200 rounded p-3 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-bold text-gray-900">{school.nom}</span>
                                    <span className="text-gray-500 ml-2">📍 {school.ville}</span>
                                  </div>
                                  <Link
                                    href={`/ecoles/${school.id}`}
                                    className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                                  >
                                    Voir la fiche →
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Study Abroad Section (If wants abroad) */}
                  {result.etranger && (
                    <div className="space-y-5 pt-6 border-t border-gray-150">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          ✈️ Opportunités à l'étranger
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Parce que vous envisagez d'étudier hors du Sénégal.</p>
                      </div>

                      {/* Suggested countries */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destinations suggérées</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {result.etranger.pays.map((p) => (
                            <div key={p.id} className="bg-white border border-gray-200 rounded p-4 text-center">
                              <span className="block font-bold text-sm text-gray-900">{p.pays}</span>
                              <span className="block text-xs text-gray-500 mt-1">Coût de la vie : {p.cout_vie_estime || "-"}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-right">
                          <Link href="/etranger" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                            Voir les démarches par pays →
                          </Link>
                        </div>
                      </div>

                      {/* Relevant scholarships */}
                      <div className="space-y-3.5 pt-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bourses recommandées</h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {result.etranger.bourses.map((b) => (
                            <div key={b.id} className="bg-white border border-gray-200 rounded p-4 flex justify-between items-center text-xs">
                              <div>
                                <span className="block font-bold text-gray-950 text-sm">{b.nom}</span>
                                <span className="block text-gray-500 mt-0.5">📍 Pays : {b.pays} • 💰 {b.montant || "Non spécifié"}</span>
                              </div>
                              <Link
                                href="/bourses"
                                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline shrink-0"
                              >
                                Postuler →
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Refaire le quiz button */}
                  <div className="flex justify-center pt-6 border-t border-gray-150">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Refaire le quiz
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
