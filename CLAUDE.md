# 인생여행 (Life Journey)

따뜻한 파스텔톤의 웰빙 SNS형 MVP. Next.js 14(App Router) + TypeScript + Tailwind CSS.

## 현재 단계: 로컬 1단계

- **DB 없음.** 데이터는 `data/users.json`, `data/entries.json` 로컬 JSON 파일에 저장한다. 접근은 반드시 `lib/storage.ts`를 통해서만 한다 (파일 직접 read/write 금지).
- **AI 호출은 Anthropic API 키 없이** 로컬에 설치된 Claude Code CLI(`claude -p`)를 `child_process`로 호출한다. 구현은 `lib/ai.ts`에만 있다. 다른 곳에서 직접 `child_process`로 CLI를 호출하지 말 것.
- 인증은 아이디/비밀번호 방식이며 비밀번호는 `bcryptjs`로 해싱해 저장한다. 세션은 httpOnly 쿠키(`vl_session`)에 userId만 저장하는 단순 방식이다 (NextAuth 등 미도입).

## 향후 확장 계획 (지금은 하지 않음)

- `lib/storage.ts`의 JSON 파일 I/O → Supabase 등 실제 DB로 교체 예정. 다른 코드가 `storage.ts`의 함수 시그니처(`getUsers`, `addUser`, `getEntriesByUser` 등)에만 의존하도록 유지해야 교체가 쉬움.
- `lib/ai.ts`의 CLI 호출 → Anthropic API 키 기반 SDK 호출로 교체 예정. `getSajuFortune`, `getEveningFeedback` 등 상위 함수 시그니처는 유지하면서 내부 구현만 바꿀 것.
- `Entry` 타입에는 `is_shared` 필드가 미리 들어있다 (익명 공유 SNS 피드 확장 대비). **지금은 항상 `false`로 저장해야 하며, 공유 피드 기능은 아직 구현하지 않는다.**

## 폴더 구조

```
lib/
  types.ts               # User, Entry, NotificationSettings 타입
  storage.ts              # JSON 파일 read/write (데이터 접근은 반드시 여기를 통해서)
  auth.ts                  # 세션 쿠키 get/set/clear, getCurrentUser()
  ai.ts                    # claude CLI 호출 (getSajuFortune, getEveningFeedback)
  date-utils.ts            # 여행 일수/남은 일수/사주 완성도 계산
  quotes.ts                # 오늘의 응원문구 100개 (AI 미사용, 날짜+userId 해시로 결정적 선택)
  notification-copy.ts    # 인앱 알림 문구 (아침/저녁, 랜덤 선택)
components/                # 재사용 UI (Mascot, Card, Button, Input, NotificationScheduler 등)
app/
  login/, signup/, home/, profile/edit/, evening/, settings/
  api/auth/*, api/saju/, api/evening/, api/settings/, api/profile/
data/
  users.json, entries.json   # 파일이 없으면 storage.ts가 자동 생성함
middleware.ts               # 세션 쿠키 없으면 보호 라우트(/home, /evening, /settings, /profile) → /login
```

## 디자인 컨셉

파스텔톤(피치/크림/코랄), 둥근 모서리(`rounded-4xl`/`rounded-full` 위주), 부드러운 한글 폰트(Gowun Dodum), 귀여운 캐릭터 `components/Mascot.tsx`를 화면 곳곳에 재사용. 새 화면을 추가할 때도 이 톤을 유지할 것.

## 알림

실제 푸시 알림이 아니라 브라우저 `Notification` API 기반 인앱 알림이다 (`components/NotificationScheduler.tsx`). 탭이 열려 있을 때만 동작하며, 이 제약을 UI 문구에서 사용자에게 안내한다.

## 코딩 규칙

- 새 기능에서 데이터를 읽고 쓸 때는 `lib/storage.ts`의 함수만 사용한다.
- 새 기능에서 AI 응답이 필요하면 `lib/ai.ts`에 함수를 추가하고 그것을 호출한다 (직접 CLI/API 호출 금지).
- 정적 문구(응원문구, 알림문구 등)는 `lib/quotes.ts`, `lib/notification-copy.ts`처럼 별도 파일에 배열로 관리한다.
