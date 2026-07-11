import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/**
 * GET /api/admin/etudes-etranger
 * List all study abroad countries with optional search.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let queryText = "SELECT * FROM etudes_etranger WHERE 1=1";
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (pays ILIKE $${params.length} OR partenaires ILIKE $${params.length})`;
    }

    queryText += " ORDER BY pays ASC, id DESC";

    const res = await query(queryText, params);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erreur GET /api/admin/etudes-etranger :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/etudes-etranger
 * Add a new country details.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { pays, procedures, cout_vie_estime, partenaires, visa_info } = body;

    if (!pays) {
      return NextResponse.json(
        { error: "Le nom du pays est obligatoire." },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO etudes_etranger (pays, procedures, cout_vie_estime, partenaires, visa_info)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const res = await query(insertQuery, [
      pays,
      procedures || null,
      cout_vie_estime || null,
      partenaires || null,
      visa_info || null,
    ]);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur POST /api/admin/etudes-etranger :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/etudes-etranger
 * Update an existing country details.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { id, pays, procedures, cout_vie_estime, partenaires, visa_info } = body;

    if (!id || !pays) {
      return NextResponse.json(
        { error: "L'ID et le nom du pays sont obligatoires." },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE etudes_etranger
      SET pays = $1, procedures = $2, cout_vie_estime = $3, partenaires = $4, visa_info = $5
      WHERE id = $6
      RETURNING *
    `;

    const res = await query(updateQuery, [
      pays,
      procedures || null,
      cout_vie_estime || null,
      partenaires || null,
      visa_info || null,
      id,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Destination non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Erreur PUT /api/admin/etudes-etranger :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/etudes-etranger
 * Delete country details by ID.
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
        { error: "L'identifiant de la destination est requis." },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM etudes_etranger WHERE id = $1 RETURNING *";
    const res = await query(deleteQuery, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Destination non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: res.rows[0] });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/etudes-etranger :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
