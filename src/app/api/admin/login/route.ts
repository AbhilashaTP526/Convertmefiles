import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  checkAdminEmail,
  checkAdminPassword,
  createAdminSessionToken,
  isAdminAuthConfigured,
} from "@/lib/admin/auth";
import { isRateLimited, getClientIp } from "@/lib/admin/rate-limit";

const bodySchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin login isn't configured yet. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  if (await isRateLimited("admin-login", ip, 5, 15 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const emailOk = checkAdminEmail(parsed.data.email);
  const passwordOk = checkAdminPassword(parsed.data.password);
  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h, matches the JWT's own expiry
  });

  return NextResponse.json({ ok: true });
}
