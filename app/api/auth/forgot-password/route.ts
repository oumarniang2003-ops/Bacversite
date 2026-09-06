import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

const GENERIC_RESPONSE = {
  success: true,
  message:
    "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
};

/**
 * POST /api/auth/forgot-password
 * Always responds the same way whether or not the email is registered,
 * so this endpoint can't be used to enumerate student accounts.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Veuillez fournir un email." }, { status: 400 });
    }

    const res = await query<{ id: number }>("SELECT id FROM students WHERE email = $1", [email]);

    if (res.rows.length > 0) {
      const studentId = res.rows[0].id;
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      await query(
        "INSERT INTO password_reset_tokens (student_id, token_hash, expires_at) VALUES ($1, $2, $3)",
        [studentId, tokenHash, expiresAt]
      );

      const resetUrl = `${new URL(req.url).origin}/reinitialiser-mot-de-passe?token=${rawToken}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Erreur POST /api/auth/forgot-password :", error);
    // Even on internal failure, don't leak whether the email exists.
    return NextResponse.json(GENERIC_RESPONSE);
  }
}
