import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE_NAME = "ff_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function isPlaceholder(value?: string) {
  if (!value) return true;
  const lowered = value.toLowerCase();
  return lowered.includes("your-admin-password") || lowered.includes("your-session-secret");
}

function getAuthConfig() {
  const password = process.env.ADMIN_REVIEW_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || password || "";
  const configured = Boolean(password) && !isPlaceholder(password) && !isPlaceholder(sessionSecret);
  return { password: password ?? "", sessionSecret, configured };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function constantTimeEquals(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function isAdminAuthConfigured() {
  return getAuthConfig().configured;
}

export function validateAdminPassword(input: string) {
  const { password, configured } = getAuthConfig();
  if (!configured) return false;
  return constantTimeEquals(input, password);
}

export function createAdminSessionToken() {
  const { sessionSecret, configured } = getAuthConfig();
  if (!configured) return "";
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = Math.random().toString(36).slice(2, 10);
  const payload = `${issuedAt}.${nonce}`;
  const signature = sign(payload, sessionSecret);
  return `${payload}.${signature}`;
}

export function isValidAdminSession(token?: string | null) {
  const { sessionSecret, configured } = getAuthConfig();
  if (!configured || !token) return false;

  const [issuedAtRaw, nonce, signature] = token.split(".");
  if (!issuedAtRaw || !nonce || !signature) return false;
  const payload = `${issuedAtRaw}.${nonce}`;
  const expected = sign(payload, sessionSecret);
  if (!constantTimeEquals(signature, expected)) return false;

  const issuedAt = Number(issuedAtRaw);
  if (Number.isNaN(issuedAt)) return false;
  const age = Math.floor(Date.now() / 1000) - issuedAt;
  return age >= 0 && age <= SESSION_MAX_AGE_SECONDS;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}
