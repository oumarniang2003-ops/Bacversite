import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/**
 * GET /api/admin/bourses
 * List all scholarships with optional search.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let queryText = `
      SELECT id, nom, pays, montant, to_char(date_limite, 'YYYY-MM-DD') as date_limite, conditions_eligibilite, lien_candidature, created_at
      FROM bourses
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR pays ILIKE $${params.length} OR montant ILIKE $${params.length})`;
    }

    queryText += " ORDER BY date_limite ASC NULLS LAST, id DESC";

    const res = await query(queryText, params);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erreur GET /api/admin/bourses :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/bourses
 * Add a new scholarship.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature } = body;

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de la bourse est obligatoire." },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO bourses (nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *, to_char(date_limite, 'YYYY-MM-DD') as date_limite
    `;

    const res = await query(insertQuery, [
      nom,
      pays || null,
      montant || null,
      date_limite || null,
      conditions_eligibilite || null,
      lien_candidature || null,
    ]);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur POST /api/admin/bourses :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/bourses
 * Update an existing scholarship.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { id, nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature } = body;

    if (!id || !nom) {
      return NextResponse.json(
        { error: "L'ID et le nom de la bourse sont obligatoires." },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE bourses
      SET nom = $1, pays = $2, montant = $3, date_limite = $4, conditions_eligibilite = $5, lien_candidature = $6
      WHERE id = $7
      RETURNING *, to_char(date_limite, 'YYYY-MM-DD') as date_limite
    `;

    const res = await query(updateQuery, [
      nom,
      pays || null,
      montant || null,
      date_limite || null,
      conditions_eligibilite || null,
      lien_candidature || null,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Bourse non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur PUT /api/admin/bourses :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/bourses
 * Delete a scholarship by ID.
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant de la bourse est requis." },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM bourses WHERE id = $1 RETURNING *";
    const res = await query(deleteQuery, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Bourse non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: res.rows[0] });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/bourses :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
