import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { signStudentJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

/**
 * POST /api/auth/login
 * Log a student in.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe." },
        { status: 400 }
      );
    }

    const res = await query(
      "SELECT id, nom, email, password_hash FROM students WHERE email = $1",
      [email]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
    }

    const student = res.rows[0];
    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
    }

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
    console.error("Erreur POST /api/auth/login :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
