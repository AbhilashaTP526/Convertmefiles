import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "convertmefiles_admin_session";
const SESSION_DURATION = "12h";

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set it to a long random string (32+ characters) in your environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Timing-safe comparison so response time can't leak how many characters matched. */
function timingSafeStringEqual(candidate: string, expected: string): boolean {
  const a = new TextEncoder().encode(candidate.padEnd(expected.length, "\0"));
  const b = new TextEncoder().encode(expected.padEnd(candidate.length, "\0"));
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0 && candidate.length === expected.length;
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeStringEqual(candidate, expected);
}

export function checkAdminEmail(candidate: string): boolean {
  const expected = process.env.ADMIN_EMAIL;
  if (!expected) return false;
  return timingSafeStringEqual(candidate.trim().toLowerCase(), expected.trim().toLowerCase());
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

/**
 * Defense in depth: proxy.ts already gates /admin and /api/admin, but every
 * protected route handler re-checks the session itself too, in case it's
 * ever reached through a path proxy doesn't cover (e.g. a future deployment
 * target that skips proxy, or a matcher edit that narrows coverage).
 */
export async function requireAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
