import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { addUser, getUserByUsername } from "@/lib/storage";
import { setSession } from "@/lib/auth";
import type { User } from "@/lib/types";

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

  if (getUserByUsername(username.trim())) {
    return NextResponse.json({ error: "이미 사용 중인 아이디예요." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: uuidv4(),
    username: username.trim(),
    passwordHash,
    birthYear: year,
    birthMonth: birthMonth ? Number(birthMonth) : undefined,
    birthDay: birthDay ? Number(birthDay) : undefined,
    birthHour: birthHour !== undefined && birthHour !== "" ? Number(birthHour) : undefined,
    lifeExpectancy: expectancy,
    notification: {
      morningTime: "09:00",
      eveningTime: "21:00",
      eveningLabel: "오늘 하루 마무리",
    },
    createdAt: new Date().toISOString(),
  };

  addUser(user);
  setSession(user.id);

  return NextResponse.json({ ok: true });
}
