import { createSupabaseServerClient } from "./supabase";
import { getProfileById } from "./storage";
import type { User } from "./types";

// Supabase Auth는 이메일 기반이라, 서비스의 "아이디"를 내부용 가짜 이메일로 바꿔서 사용한다.
// Supabase 대시보드에서 Authentication > Email > "Confirm email"을 꺼둬야 정상 동작한다.
const FAKE_EMAIL_DOMAIN = "vacationlife.local";

export function usernameToAuthEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
}

export async function getCurrentUser(): Promise<User | undefined> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  return getProfileById(user.id);
}
