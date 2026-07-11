import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "bacversite-super-secret-jwt-key-2026-admin-system";
const key = new TextEncoder().encode(SECRET_KEY);

export interface AdminSession {
  id: number;
  email: string;
}

/**
 * Sign a session payload and return a JWT string.
 */
export async function signJWT(payload: AdminSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Session valid for 24 hours
    .sign(key);
}

/**
 * Verify a JWT string and return the payload if valid, or null if invalid/expired.
 */
export async function verifyJWT(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return {
      id: payload.id as number,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Retrieve the current admin session from the cookies.
 * Works inside Server Components, Server Actions, and Route Handlers.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch (error) {
    return null;
  }
}
