import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.AUTH_SECRET || "duck-duck-cook-super-secret-jwt-key-2026";
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

const COOKIE_NAME = "ddc_session";

/** Hash password menggunakan bcrypt dengan salt rounds 10 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 10);
}

/** Verifikasi kecocokan password dengan hash */
export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

/** Membuat token JWT bertanda tangan dengan durasi 7 hari */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/** Memverifikasi keabsahan JWT token */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Mengambil session user saat ini dari httpOnly cookie */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Menyimpan cookie session secara aman (httpOnly, secure di production) */
export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  });
}

/** Menghapus cookie session (logout) */
export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

