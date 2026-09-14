import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SUPABASE_FETCH_TIMEOUT_MS = 10000;

/**
 * Supabase 프로젝트가 일시정지됐거나 URL이 잘못돼 응답이 없을 때, 플랫폼(Vercel)의
 * 함수 타임아웃까지 무작정 기다리다 애매한 "Gateway Timeout"을 받는 대신,
 * 여기서 먼저 타임아웃을 걸어 명확한 에러로 실패하게 한다.
 */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: init?.signal ?? controller.signal }).finally(() =>
    clearTimeout(timeout)
  );
}

/**
 * 서버 컴포넌트 / 라우트 핸들러에서 쓰는 Supabase 클라이언트.
 * 요청마다 새로 만들어야 현재 요청의 쿠키(세션)를 올바르게 읽고 쓴다.
 *
 * 서버 컴포넌트 안에서는 쿠키를 쓸 수 없어 set/remove가 실패할 수 있는데,
 * 세션 갱신은 middleware.ts가 담당하므로 여기서는 그 실패를 무시해도 된다.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // 서버 컴포넌트에서는 쿠키를 쓸 수 없다. middleware가 세션을 갱신한다.
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // 서버 컴포넌트에서는 쿠키를 쓸 수 없다. middleware가 세션을 갱신한다.
        }
      },
    },
  });
}
