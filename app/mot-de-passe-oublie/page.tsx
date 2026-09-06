"use client";

import { useState } from "react";
import Link from "next/link";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-xs text-gray-500 mt-1">
            Indique ton email, on t&apos;envoie un lien pour en choisir un nouveau.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {sent ? (
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700 text-center">
            Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé. Vérifie ta boîte de réception.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500">
          <Link href="/connexion" className="text-emerald-600 font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
