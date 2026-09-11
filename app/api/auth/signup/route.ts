import { NextRequest, NextResponse } from "next/server";
import { usernameToAuthEmail } from "@/lib/auth";
import { createProfile, isUsernameTaken } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase";

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

  if (!username || typeof username !== "string" || username.trim().length < 2) {
    return NextResponse.json({ error: "아이디를 2자 이상 입력해주세요." }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 4) {
    return NextResponse.json({ error: "비밀번호를 4자 이상 입력해주세요." }, { status: 400 });
  }
  const year = Number(birthYear);
  const expectancy = Number(lifeExpectancy);
  if (!year || year < 1900 || year > new Date().getFullYear()) {
    return NextResponse.json({ error: "태어난 연도를 확인해주세요." }, { status: 400 });
  }
  if (!expectancy || expectancy < 1 || expectancy > 200) {
    return NextResponse.json({ error: "몇 살까지 여행하고 싶은지 확인해주세요." }, { status: 400 });
  }

  const trimmedUsername = username.trim();

  if (await isUsernameTaken(trimmedUsername)) {
    return NextResponse.json({ error: "이미 사용 중인 아이디예요." }, { status: 409 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: usernameToAuthEmail(trimmedUsername),
    password,
    options: { data: { username: trimmedUsername } },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "이미 사용 중인 아이디이거나 회원가입에 실패했어요." },
      { status: 409 }
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
    return NextResponse.json({ error: "프로필 저장에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
