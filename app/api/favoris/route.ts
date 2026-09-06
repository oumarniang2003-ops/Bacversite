import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getStudentSession } from "@/lib/auth";

const VALID_ITEM_TYPES = ["ecole", "bourse", "concours", "etude_etranger"] as const;
type ItemType = (typeof VALID_ITEM_TYPES)[number];

function isValidItemType(value: unknown): value is ItemType {
  return typeof value === "string" && (VALID_ITEM_TYPES as readonly string[]).includes(value);
}

/**
 * GET /api/favoris
 * List the current student's favorites.
 */
export async function GET() {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const res = await query(
    "SELECT id, item_type, item_id, created_at FROM student_favoris WHERE student_id = $1 ORDER BY created_at DESC",
    [session.id]
  );

  return NextResponse.json(res.rows);
}

/**
 * POST /api/favoris
 * Add a favorite. Body: { item_type, item_id }
 */
export async function POST(req: NextRequest) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json();
  const { item_type, item_id } = body;

  if (!isValidItemType(item_type) || !Number.isInteger(item_id)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const res = await query(
    `INSERT INTO student_favoris (student_id, item_type, item_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (student_id, item_type, item_id) DO NOTHING
     RETURNING id, item_type, item_id, created_at`,
    [session.id, item_type, item_id]
  );

  return NextResponse.json(res.rows[0] ?? { item_type, item_id, already_exists: true });
}

/**
 * DELETE /api/favoris?item_type=ecole&item_id=3
 */
export async function DELETE(req: NextRequest) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const item_type = searchParams.get("item_type");
  const item_id = Number(searchParams.get("item_id"));

  if (!isValidItemType(item_type) || !Number.isInteger(item_id)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  await query(
    "DELETE FROM student_favoris WHERE student_id = $1 AND item_type = $2 AND item_id = $3",
    [session.id, item_type, item_id]
  );

  return NextResponse.json({ success: true });
}
