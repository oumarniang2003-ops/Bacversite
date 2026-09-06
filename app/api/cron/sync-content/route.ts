import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { researchEcole, discoverConcours } from "@/lib/ai-sync";

export const maxDuration = 300; // this job calls the AI + web search per école, can take a while

interface EcoleRow {
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

/**
 * GET /api/cron/sync-content
 * Triggered weekly by Vercel Cron (see vercel.json). Refreshes école
 * info via web research and discovers/updates concours, writing changes
 * straight to the database (no admin approval step).
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const ecolesUpdated: string[] = [];
  const ecolesUnchanged: string[] = [];

  const { rows: ecoles } = await query<EcoleRow>("SELECT * FROM ecoles ORDER BY id");

  for (const ecole of ecoles) {
    const update = await researchEcole(ecole.nom, ecole.ville);
    if (!update) continue;

    const changed =
      (update.type && update.type !== ecole.type) ||
      (update.ville && update.ville !== ecole.ville) ||
      (update.filieres && update.filieres !== ecole.filieres) ||
      (update.frais && update.frais !== ecole.frais) ||
      (update.conditions_admission && update.conditions_admission !== ecole.conditions_admission) ||
      (update.contact && update.contact !== ecole.contact) ||
      (update.site_web && update.site_web !== ecole.site_web);

    if (!changed) {
      ecolesUnchanged.push(ecole.nom);
      continue;
    }

    await query(
      `UPDATE ecoles SET
        type = COALESCE($1, type),
        ville = COALESCE($2, ville),
        filieres = COALESCE($3, filieres),
        frais = COALESCE($4, frais),
        conditions_admission = COALESCE($5, conditions_admission),
        contact = COALESCE($6, contact),
        site_web = COALESCE($7, site_web)
      WHERE id = $8`,
      [
        update.type,
        update.ville,
        update.filieres,
        update.frais,
        update.conditions_admission,
        update.contact,
        update.site_web,
        ecole.id,
      ]
    );
    ecolesUpdated.push(ecole.nom);
  }

  const concoursFound = await discoverConcours();
  const concoursInserted: string[] = [];
  const concoursUpdated: string[] = [];

  for (const item of concoursFound) {
    const { rows: existing } = await query<{ id: number }>(
      "SELECT id FROM concours WHERE nom ILIKE $1 LIMIT 1",
      [item.nom]
    );

    if (existing.length > 0) {
      await query(
        `UPDATE concours SET
          filieres = COALESCE($1, filieres),
          date_limite = COALESCE($2, date_limite),
          conditions = COALESCE($3, conditions),
          ecoles_liees = COALESCE($4, ecoles_liees)
        WHERE id = $5`,
        [item.filieres, item.date_limite, item.conditions, item.ecoles_liees, existing[0].id]
      );
      concoursUpdated.push(item.nom);
    } else {
      await query(
        `INSERT INTO concours (nom, filieres, date_limite, conditions, ecoles_liees)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.nom, item.filieres, item.date_limite, item.conditions, item.ecoles_liees]
      );
      concoursInserted.push(item.nom);
    }
  }

  return NextResponse.json({
    ecoles: {
      total: ecoles.length,
      updated: ecolesUpdated,
      unchanged_count: ecolesUnchanged.length,
    },
    concours: {
      found: concoursFound.length,
      inserted: concoursInserted,
      updated: concoursUpdated,
    },
  });
}
