import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth";
import { query } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

interface FavoriRow {
  item_type: "ecole" | "bourse" | "concours" | "etude_etranger";
  item_id: number;
}

interface FavoriDisplay {
  item_type: FavoriRow["item_type"];
  item_id: number;
  nom: string;
  href: string;
}

const TYPE_LABELS: Record<FavoriRow["item_type"], string> = {
  ecole: "Écoles",
  bourse: "Bourses",
  concours: "Concours",
  etude_etranger: "Études à l'étranger",
};

async function getFavorisDetails(studentId: number): Promise<FavoriDisplay[]> {
  const { rows: favoris } = await query<FavoriRow>(
    "SELECT item_type, item_id FROM student_favoris WHERE student_id = $1 ORDER BY created_at DESC",
    [studentId]
  );

  const idsByType: Record<string, number[]> = {};
  for (const f of favoris) {
    (idsByType[f.item_type] ||= []).push(f.item_id);
  }

  const results: FavoriDisplay[] = [];

  if (idsByType.ecole?.length) {
    const { rows } = await query<{ id: number; nom: string }>(
      "SELECT id, nom FROM ecoles WHERE id = ANY($1::int[])",
      [idsByType.ecole]
    );
    for (const r of rows) {
      results.push({ item_type: "ecole", item_id: r.id, nom: r.nom, href: `/ecoles/${r.id}` });
    }
  }

  if (idsByType.bourse?.length) {
    const { rows } = await query<{ id: number; nom: string }>(
      "SELECT id, nom FROM bourses WHERE id = ANY($1::int[])",
      [idsByType.bourse]
    );
    for (const r of rows) {
      results.push({ item_type: "bourse", item_id: r.id, nom: r.nom, href: `/bourses` });
    }
  }

  if (idsByType.concours?.length) {
    const { rows } = await query<{ id: number; nom: string }>(
      "SELECT id, nom FROM concours WHERE id = ANY($1::int[])",
      [idsByType.concours]
    );
    for (const r of rows) {
      results.push({ item_type: "concours", item_id: r.id, nom: r.nom, href: `/concours` });
    }
  }

  if (idsByType.etude_etranger?.length) {
    const { rows } = await query<{ id: number; pays: string }>(
      "SELECT id, pays FROM etudes_etranger WHERE id = ANY($1::int[])",
      [idsByType.etude_etranger]
    );
    for (const r of rows) {
      results.push({ item_type: "etude_etranger", item_id: r.id, nom: r.pays, href: `/etranger` });
    }
  }

  return results;
}

export default async function ComptePage() {
  const session = await getStudentSession();
  if (!session) {
    redirect("/connexion");
  }

  const favoris = await getFavorisDetails(session.id);
  const grouped = favoris.reduce<Record<string, FavoriDisplay[]>>((acc, f) => {
    (acc[f.item_type] ||= []).push(f);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{session.nom}</h1>
            <p className="text-sm text-gray-500">{session.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Mes favoris</h2>

          {favoris.length === 0 ? (
            <p className="text-sm text-gray-500">
              Tu n&apos;as encore ajouté aucun favori. Parcours les{" "}
              <Link href="/ecoles" className="text-emerald-600 font-semibold hover:underline">
                écoles
              </Link>{" "}
              et clique sur l&apos;étoile pour en sauvegarder.
            </p>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {TYPE_LABELS[type as FavoriRow["item_type"]]}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <Link
                      key={`${item.item_type}-${item.item_id}`}
                      href={item.href}
                      className="block bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-semibold text-gray-800 hover:border-emerald-500/50 hover:text-emerald-700 transition-colors"
                    >
                      {item.nom}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
