-- 인생여행 (Life Journey) Supabase 스키마 — Supabase Auth 전환판
-- Supabase 대시보드 > SQL Editor 에 그대로 붙여넣고 실행하세요.
--
-- ⚠️ 이전에 만들었던 public.users / public.entries 테이블을 삭제하고 새로 만듭니다.
--    (자체 아이디/비밀번호 테이블 대신 Supabase Auth를 쓰기로 했기 때문입니다.
--     기존 테이블에 실제 서비스 데이터가 없다면 그대로 실행해도 안전합니다.)
--
-- 로그인은 "아이디"를 쓰지만 Supabase Auth는 이메일 기반이라,
-- 서버 코드에서 아이디를 `${username}@vacationlife.local` 형태의 가짜 이메일로 변환해
-- supabase.auth.signUp / signInWithPassword 에 사용합니다.
-- ⚠️ Supabase 대시보드 > Authentication > Sign In / Providers > Email 에서
--    "Confirm email"을 반드시 꺼주세요. (실제 수신 불가능한 가짜 이메일이라
--    확인 메일 발송/클릭 절차를 쓸 수 없습니다.)

create extension if not exists "pgcrypto";

drop table if exists public.entries;
drop table if exists public.users;

-- 1) profiles ----------------------------------------------------------
-- auth.users(실제 인증 정보: 이메일/비밀번호)와 1:1로 연결되는 프로필 테이블.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  birth_year integer not null,
  birth_month integer check (birth_month between 1 and 12),
  birth_day integer check (birth_day between 1 and 31),
  birth_hour integer check (birth_hour between 0 and 23),
  life_expectancy integer not null default 80 check (life_expectancy between 1 and 200),
  morning_time text not null default '09:00',
  evening_time text not null default '21:00',
  evening_label text not null default '오늘 하루 마무리',
  created_at timestamptz not null default now()
);

comment on table public.profiles is '인생여행 프로필. id는 auth.users.id와 동일.';

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 회원가입 화면에서 "이미 사용 중인 아이디"를 미리 알려주기 위한 함수.
-- profiles는 RLS로 본인 행만 조회 가능하므로, 존재 여부만 안전하게 확인해주는
-- security definer 함수를 anon/authenticated 모두에게 열어둔다 (다른 정보는 노출하지 않음).
create or replace function public.username_exists(check_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where username = check_username);
$$;

grant execute on function public.username_exists(text) to anon, authenticated;

-- 2) entries -------------------------------------------------------------

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  content text not null,
  ai_feedback text not null,
  saju_fortune text,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

comment on column public.entries.saju_fortune is '기록 시점의 인생사주 스냅샷 (사주 정보 입력자만)';
comment on column public.entries.is_shared is '향후 익명 공유 피드 확장용. 지금은 항상 false로만 저장';

create index entries_user_id_date_idx on public.entries (user_id, date desc);

alter table public.entries enable row level security;

create policy "entries_select_own" on public.entries
  for select using (auth.uid() = user_id);

create policy "entries_insert_own" on public.entries
  for insert with check (auth.uid() = user_id);

create policy "entries_update_own" on public.entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "entries_delete_own" on public.entries
  for delete using (auth.uid() = user_id);
