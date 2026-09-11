import { cookies } from "next/headers";
import type { User } from "./types";
import { getUserById } from "./storage";

const SESSION_COOKIE = "vl_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30일

/** 로컬 1단계용 심플 세션: 쿠키에 userId만 저장한다. */
export function setSession(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

export function getSessionUserId(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

export function getCurrentUser(): User | undefined {
  const userId = getSessionUserId();
  if (!userId) return undefined;
  return getUserById(userId);
}
