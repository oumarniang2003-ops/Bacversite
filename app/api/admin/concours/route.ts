import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/**
 * GET /api/admin/concours
 * List all contests with optional search.
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
      SELECT id, nom, filieres, to_char(date_limite, 'YYYY-MM-DD') as date_limite, conditions, ecoles_liees, created_at 
      FROM concours 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR filieres ILIKE $${params.length} OR ecoles_liees ILIKE $${params.length})`;
    }

    queryText += " ORDER BY date_limite ASC NULLS LAST, id DESC";

    const res = await query(queryText, params);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erreur GET /api/admin/concours :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/concours
 * Add a new contest.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { nom, filieres, date_limite, conditions, ecoles_liees } = body;

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom du concours est obligatoire." },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO concours (nom, filieres, date_limite, conditions, ecoles_liees)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *, to_char(date_limite, 'YYYY-MM-DD') as date_limite
    `;

    const res = await query(insertQuery, [
      nom,
      filieres || null,
      date_limite || null,
      conditions || null,
      ecoles_liees || null,
    ]);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur POST /api/admin/concours :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/concours
 * Update an existing contest.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { id, nom, filieres, date_limite, conditions, ecoles_liees } = body;

    if (!id || !nom) {
      return NextResponse.json(
        { error: "L'ID et le nom du concours sont obligatoires." },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE concours
      SET nom = $1, filieres = $2, date_limite = $3, conditions = $4, ecoles_liees = $5
      WHERE id = $6
      RETURNING *, to_char(date_limite, 'YYYY-MM-DD') as date_limite
    `;

    const res = await query(updateQuery, [
      nom,
      filieres || null,
      date_limite || null,
      conditions || null,
      ecoles_liees || null,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Concours non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur PUT /api/admin/concours :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/concours
 * Delete a contest by ID.
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
        { error: "L'identifiant du concours est requis." },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM concours WHERE id = $1 RETURNING *";
    const res = await query(deleteQuery, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Concours non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: res.rows[0] });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/concours :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
