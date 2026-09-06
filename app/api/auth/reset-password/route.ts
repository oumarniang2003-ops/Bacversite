import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

interface ResetTokenRow {
  id: number;
  student_id: number;
  expires_at: string;
  used_at: string | null;
}

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const res = await query<ResetTokenRow>(
      "SELECT id, student_id, expires_at, used_at FROM password_reset_tokens WHERE token_hash = $1",
      [tokenHash]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation est invalide." },
        { status: 400 }
      );
    }

    const record = res.rows[0];
    if (record.used_at || new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a expiré. Demandes-en un nouveau." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await query("UPDATE students SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      record.student_id,
    ]);
    await query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1", [record.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur POST /api/auth/reset-password :", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}
