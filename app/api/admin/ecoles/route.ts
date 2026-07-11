import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/**
 * GET /api/admin/ecoles
 * List all schools with optional search/filter.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    let queryText = "SELECT * FROM ecoles WHERE 1=1";
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (nom ILIKE $${params.length} OR ville ILIKE $${params.length})`;
    }

    if (type) {
      params.push(type);
      queryText += ` AND type = $${params.length}`;
    }

    queryText += " ORDER BY id DESC";

    const res = await query(queryText, params);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erreur GET /api/admin/ecoles :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ecoles
 * Add a new school.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const {
      nom,
      type,
      ville,
      filieres,
      frais,
      conditions_admission,
      contact,
      site_web,
    } = body;

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de l'établissement est obligatoire." },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const res = await query(insertQuery, [
      nom,
      type || null,
      ville || null,
      filieres || null,
      frais || null,
      conditions_admission || null,
      contact || null,
      site_web || null,
    ]);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur POST /api/admin/ecoles :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/ecoles
 * Update an existing school.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      nom,
      type,
      ville,
      filieres,
      frais,
      conditions_admission,
      contact,
      site_web,
    } = body;

    if (!id || !nom) {
      return NextResponse.json(
        { error: "L'ID et le nom de l'établissement sont obligatoires." },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE ecoles
      SET nom = $1, type = $2, ville = $3, filieres = $4, frais = $5, conditions_admission = $6, contact = $7, site_web = $8
      WHERE id = $9
      RETURNING *
    `;

    const res = await query(updateQuery, [
      nom,
      type || null,
      ville || null,
      filieres || null,
      frais || null,
      conditions_admission || null,
      contact || null,
      site_web || null,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Établissement non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur PUT /api/admin/ecoles :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/ecoles
 * Delete a school by ID.
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
        { error: "L'identifiant de l'établissement est requis." },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM ecoles WHERE id = $1 RETURNING *";
    const res = await query(deleteQuery, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Établissement non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: res.rows[0] });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/ecoles :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
