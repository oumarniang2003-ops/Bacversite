import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { signStudentJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

/**
 * POST /api/auth/signup
 * Create a student account and log them in.
 */
export async function POST(req: NextRequest) {
  try {
    const { nom, email, password } = await req.json();

    if (!nom || !email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un nom, un email et un mot de passe." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const existing = await query("SELECT id FROM students WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const res = await query(
      "INSERT INTO students (nom, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nom, email",
      [nom, email, passwordHash]
    );
    const student = res.rows[0];

    const token = await signStudentJWT({
      id: student.id,
      email: student.email,
      nom: student.nom,
    });

    const cookieStore = await cookies();
    cookieStore.set("student_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: "/",
    });

    return NextResponse.json({ id: student.id, nom: student.nom, email: student.email });
  } catch (error) {
    console.error("Erreur POST /api/auth/signup :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
