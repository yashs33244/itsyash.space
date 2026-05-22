import crypto from "crypto";

export function getExpectedToken(): string {
  const password = process.env.ACCESS_PASSWORD || "";
  const secret = process.env.SESSION_SECRET || "fallback-secret";
  return crypto.createHmac("sha256", secret).update(password).digest("hex");
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = getExpectedToken();
  // Constant-time comparison to prevent timing attacks
  if (cookieValue.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected));
}
