import { createSupabaseServerClient } from "./supabase";
import { getProfileById } from "./storage";
import type { User } from "./types";

// 서비스의 "아이디"는 사용자의 실제 이메일 주소다 (Supabase Auth의 email과 그대로 1:1).
// 대소문자 차이로 다른 계정처럼 취급되지 않도록 항상 소문자로 정규화해서 저장/조회한다.
// Supabase 대시보드에서 Authentication > Email > "Confirm email"은 꺼둔 상태를 유지한다
// (가입 즉시 세션을 받아 바로 로그인 상태로 홈에 진입하는 흐름을 유지하기 위함).
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getCurrentUser(): Promise<User | undefined> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  return getProfileById(user.id);
}
