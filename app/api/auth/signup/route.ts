import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/auth";
import { createProfile, isUsernameTaken } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    username,
    password,
    birthYear,
    lifeExpectancy,
    birthMonth,
    birthDay,
    birthHour,
  } = body ?? {};

  if (!username || typeof username !== "string" || !EMAIL_RE.test(username.trim())) {
    return NextResponse.json({ error: "올바른 이메일 형식의 아이디를 입력해주세요." }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "비밀번호를 6자 이상 입력해주세요." }, { status: 400 });
  }
  const year = Number(birthYear);
  const expectancy = Number(lifeExpectancy);
  if (!year || year < 1900 || year > new Date().getFullYear()) {
    return NextResponse.json({ error: "태어난 연도를 확인해주세요." }, { status: 400 });
  }
  if (!expectancy || expectancy < 1 || expectancy > 200) {
    return NextResponse.json({ error: "몇 살까지 여행하고 싶은지 확인해주세요." }, { status: 400 });
  }

  const trimmedUsername = normalizeEmail(username);

  if (await isUsernameTaken(trimmedUsername)) {
    return NextResponse.json({ error: "이미 사용 중인 이메일이에요." }, { status: 409 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: trimmedUsername,
    password,
    options: { data: { username: trimmedUsername } },
  });

  if (error || !data.user) {
    console.error("[signup] supabase.auth.signUp failed:", error?.message);
    return NextResponse.json(
      { error: "이미 사용 중인 이메일이거나 회원가입에 실패했어요." },
      { status: 409 }
    );
  }

  if (!data.session) {
    console.error(
      "[signup] signUp succeeded but no session was returned — Supabase Auth의 " +
        "'Confirm email' 설정이 켜져 있을 가능성이 높습니다."
    );
    return NextResponse.json(
      { error: "회원가입 설정이 완료되지 않았어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const { error: profileError } = await createProfile({
    id: data.user.id,
    username: trimmedUsername,
    birthYear: year,
    birthMonth: birthMonth ? Number(birthMonth) : undefined,
    birthDay: birthDay ? Number(birthDay) : undefined,
    birthHour: birthHour !== undefined && birthHour !== "" ? Number(birthHour) : undefined,
    lifeExpectancy: expectancy,
  });

  if (profileError) {
    console.error("[signup] profile insert failed:", profileError);
    return NextResponse.json({ error: "프로필 저장에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
