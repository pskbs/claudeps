import { createSupabaseServerClient } from "./supabase";
import type { User, Entry, NotificationSettings } from "./types";

/**
 * Supabase(profiles/entries 테이블) 데이터 접근 계층.
 * 다른 코드는 이 파일의 함수만 통해서 데이터를 읽고 써야 한다.
 */

type ProfileRow = {
  id: string;
  username: string;
  birth_year: number;
  birth_month: number | null;
  birth_day: number | null;
  birth_hour: number | null;
  life_expectancy: number;
  morning_time: string;
  evening_time: string;
  evening_label: string;
  created_at: string;
};

type EntryRow = {
  id: string;
  user_id: string;
  date: string;
  content: string;
  detail: string | null;
  ai_feedback: string;
  saju_fortune: string | null;
  is_shared: boolean;
  created_at: string;
};

function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    username: row.username,
    birthYear: row.birth_year,
    birthMonth: row.birth_month ?? undefined,
    birthDay: row.birth_day ?? undefined,
    birthHour: row.birth_hour ?? undefined,
    lifeExpectancy: row.life_expectancy,
    notification: {
      morningTime: row.morning_time,
      eveningTime: row.evening_time,
      eveningLabel: row.evening_label,
    },
    createdAt: row.created_at,
  };
}

function mapEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    keyword: row.content,
    detail: row.detail ?? undefined,
    aiFeedback: row.ai_feedback,
    sajuFortune: row.saju_fortune ?? undefined,
    is_shared: row.is_shared,
    createdAt: row.created_at,
  };
}

export async function getProfileById(id: string): Promise<User | undefined> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapProfile(data as ProfileRow);
}

/** 회원가입 시 아이디 중복 여부만 안전하게 확인한다 (RLS를 우회하지 않는 RPC). */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("username_exists", {
    check_username: username,
  });
  if (error) return false;
  return Boolean(data);
}

export async function createProfile(profile: {
  id: string;
  username: string;
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  birthHour?: number;
  lifeExpectancy: number;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("profiles").insert({
    id: profile.id,
    username: profile.username,
    birth_year: profile.birthYear,
    birth_month: profile.birthMonth ?? null,
    birth_day: profile.birthDay ?? null,
    birth_hour: profile.birthHour ?? null,
    life_expectancy: profile.lifeExpectancy,
  });
  return { error: error?.message ?? null };
}

export async function updateProfile(
  id: string,
  updates: Partial<{
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    lifeExpectancy: number;
  }>
): Promise<User | undefined> {
  const supabase = createSupabaseServerClient();
  const patch: Record<string, unknown> = {};
  if (updates.birthMonth !== undefined) patch.birth_month = updates.birthMonth;
  if (updates.birthDay !== undefined) patch.birth_day = updates.birthDay;
  if (updates.birthHour !== undefined) patch.birth_hour = updates.birthHour;
  if (updates.lifeExpectancy !== undefined) patch.life_expectancy = updates.lifeExpectancy;

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) return undefined;
  return mapProfile(data as ProfileRow);
}

export async function updateNotificationSettings(
  id: string,
  notification: NotificationSettings
): Promise<NotificationSettings | undefined> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      morning_time: notification.morningTime,
      evening_time: notification.eveningTime,
      evening_label: notification.eveningLabel,
    })
    .eq("id", id)
    .select("morning_time, evening_time, evening_label")
    .single();
  if (error || !data) return undefined;
  return {
    morningTime: data.morning_time,
    eveningTime: data.evening_time,
    eveningLabel: data.evening_label,
  };
}

export async function getEntriesByUser(userId: string): Promise<Entry[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return (data as EntryRow[]).map(mapEntry);
}

export async function getEntryById(id: string): Promise<Entry | undefined> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapEntry(data as EntryRow);
}

/** 로그인한 본인의 계정을 완전히 삭제한다 (auth.users 삭제 → profiles/entries cascade 삭제). */
export async function deleteOwnAccount(): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("delete_own_account");
  return { error: error?.message ?? null };
}

export async function addEntry(entry: {
  userId: string;
  date: string;
  keyword: string;
  detail?: string;
  aiFeedback: string;
  sajuFortune?: string;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("entries").insert({
    user_id: entry.userId,
    date: entry.date,
    content: entry.keyword,
    detail: entry.detail ?? null,
    ai_feedback: entry.aiFeedback,
    saju_fortune: entry.sajuFortune ?? null,
    is_shared: false,
  });
  return { error: error?.message ?? null };
}
