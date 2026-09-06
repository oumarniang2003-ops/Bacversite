"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      setSuccess(true);
      setTimeout(() => router.push("/connexion"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-sm text-red-600 text-center">
        Lien de réinitialisation manquant ou invalide.{" "}
        <Link href="/mot-de-passe-oublie" className="font-semibold hover:underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700 text-center">
        Mot de passe mis à jour. Redirection vers la connexion...
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <p className="text-[11px] text-gray-400 mt-1">Au moins 8 caractères.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Nouveau mot de passe</h1>
        </div>

        <Suspense fallback={<p className="text-center text-sm text-gray-500">Chargement...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
