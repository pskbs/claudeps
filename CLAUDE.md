# 인생여행 (Life Journey)

따뜻한 파스텔톤의 웰빙 SNS형 MVP. Next.js 14(App Router) + TypeScript + Tailwind CSS.

## 현재 단계: Supabase 연동 2단계

- **DB는 Supabase(Postgres)를 쓴다.** 스키마는 `supabase/schema.sql`에 있다 (profiles, entries 테이블 + RLS). 접근은 반드시 `lib/storage.ts`를 통해서만 한다 (다른 곳에서 `lib/supabase.ts` 클라이언트를 직접 import해서 쿼리하지 말 것).
- **AI 호출은 Anthropic API 키 없이** 로컬에 설치된 Claude Code CLI(`claude -p`)를 `child_process`로 호출한다. 구현은 `lib/ai.ts`에만 있다. 다른 곳에서 직접 `child_process`로 CLI를 호출하지 말 것.
- **인증은 Supabase Auth를 쓴다.** 다만 서비스 UX는 이메일이 아니라 "아이디"이므로, 서버에서 `lib/auth.ts`의 `usernameToAuthEmail()`로 `${username}@vacationlife.local` 형태의 내부용 가짜 이메일을 만들어 `supabase.auth.signUp` / `signInWithPassword`에 사용한다. 세션은 Supabase Auth가 쿠키로 관리한다 (`@supabase/ssr`, `middleware.ts`가 세션 갱신 담당).
- 회원가입/로그인용 아이디는 `profiles.username`에 저장하고, `auth.users`와는 `profiles.id = auth.users.id`로 1:1 연결한다.
- Supabase 대시보드에서 **Authentication > Email > Confirm email을 꺼둬야 한다** (가짜 이메일이라 실제 확인 메일을 받을 수 없음).

## 향후 확장 계획 (지금은 하지 않음)

- `lib/ai.ts`의 CLI 호출 → Anthropic API 키 기반 SDK 호출로 교체 예정. `getSajuFortune`, `getEveningFeedback` 등 상위 함수 시그니처는 유지하면서 내부 구현만 바꿀 것.
- `Entry` 타입에는 `is_shared` 필드가 미리 들어있다 (익명 공유 SNS 피드 확장 대비). **지금은 항상 `false`로 저장해야 하며, 공유 피드 기능은 아직 구현하지 않는다.**

## 폴더 구조

```
lib/
  types.ts               # User, Entry, NotificationSettings 타입
  storage.ts              # Supabase(profiles/entries) read/write (데이터 접근은 반드시 여기를 통해서)
  supabase.ts              # 서버용 Supabase 클라이언트 생성(createSupabaseServerClient)
  auth.ts                  # getCurrentUser(), usernameToAuthEmail()
  ai.ts                    # claude CLI 호출 (getSajuFortune, getEveningFeedback)
  date-utils.ts            # 여행 일수/남은 일수/사주 완성도 계산
  quotes.ts                # 오늘의 응원문구 100개 (AI 미사용, 날짜+userId 해시로 결정적 선택)
  notification-copy.ts    # 인앱 알림 문구 (아침/저녁, 랜덤 선택)
components/                # 재사용 UI (Mascot, Card, Button, Input, NotificationScheduler 등)
app/
  login/, signup/, home/, profile/edit/, evening/, settings/
  api/auth/*, api/saju/, api/evening/, api/settings/, api/profile/
supabase/
  schema.sql               # Supabase SQL Editor에 붙여넣는 스키마 (profiles, entries, RLS)
middleware.ts               # Supabase 세션 갱신 + 세션 없으면 보호 라우트(/home, /evening, /settings, /profile, /history) → /login
```

환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 `.env.local`(로컬)과 Vercel 프로젝트 설정에 넣는다. `.env.local`은 git에 커밋하지 않는다.

## 디자인 컨셉

파스텔톤(피치/크림/코랄), 둥근 모서리(`rounded-4xl`/`rounded-full` 위주), 부드러운 한글 폰트(Gowun Dodum), 귀여운 캐릭터 `components/Mascot.tsx`를 화면 곳곳에 재사용. 새 화면을 추가할 때도 이 톤을 유지할 것.

## 알림

실제 푸시 알림이 아니라 브라우저 `Notification` API 기반 인앱 알림이다 (`components/NotificationScheduler.tsx`). 탭이 열려 있을 때만 동작하며, 이 제약을 UI 문구에서 사용자에게 안내한다.

## 코딩 규칙

- 새 기능에서 데이터를 읽고 쓸 때는 `lib/storage.ts`의 함수만 사용한다.
- 새 기능에서 AI 응답이 필요하면 `lib/ai.ts`에 함수를 추가하고 그것을 호출한다 (직접 CLI/API 호출 금지).
- 정적 문구(응원문구, 알림문구 등)는 `lib/quotes.ts`, `lib/notification-copy.ts`처럼 별도 파일에 배열로 관리한다.
