import { NextResponse } from "next/server";
import { getStudentSession } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Returns the current student session, or null if not logged in.
 */
export async function GET() {
  const session = await getStudentSession();
  return NextResponse.json({ student: session });
}
