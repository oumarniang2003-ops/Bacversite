"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FavoriButtonProps {
  itemType: "ecole" | "bourse" | "concours" | "etude_etranger";
  itemId: number;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}

export default function FavoriButton({
  itemType,
  itemId,
  initialFavorited,
  isLoggedIn,
}: FavoriButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push("/connexion");
      return;
    }

    setLoading(true);
    const next = !favorited;
    setFavorited(next); // optimistic

    try {
      if (next) {
        await fetch("/api/favoris", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_type: itemType, item_id: itemId }),
        });
      } else {
        await fetch(`/api/favoris?item_type=${itemType}&item_id=${itemId}`, {
          method: "DELETE",
        });
      }
    } catch {
      setFavorited(!next); // revert on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={favorited}
      title={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
        favorited
          ? "bg-emerald-50 border-emerald-500/50 text-emerald-600"
          : "bg-white border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-500/50"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={favorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}
