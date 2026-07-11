import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { signJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe." },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur dans la base de données
    const res = await query(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
      [email]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    const admin = res.rows[0];

    // Vérifier le mot de passe haché
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Générer le JWT
    const token = await signJWT({
      id: admin.id,
      email: admin.email,
    });

    // Définir le cookie sécurisé httpOnly
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur lors de la connexion de l'admin :", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
