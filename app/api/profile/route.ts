import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { birthMonth, birthDay, birthHour, lifeExpectancy } = (await req.json()) ?? {};

  const updates: {
    birthMonth?: number;
    birthDay?: number;
    birthHour?: number;
    lifeExpectancy?: number;
  } = {};

  if (birthMonth !== undefined && birthMonth !== "") {
    const m = Number(birthMonth);
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      return NextResponse.json({ error: "태어난 월을 확인해주세요." }, { status: 400 });
    }
    updates.birthMonth = m;
  }
  if (birthDay !== undefined && birthDay !== "") {
    const d = Number(birthDay);
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      return NextResponse.json({ error: "태어난 일을 확인해주세요." }, { status: 400 });
    }
    updates.birthDay = d;
  }
  if (birthHour !== undefined && birthHour !== "") {
    const h = Number(birthHour);
    if (!Number.isInteger(h) || h < 0 || h > 23) {
      return NextResponse.json({ error: "태어난 시를 확인해주세요." }, { status: 400 });
    }
    updates.birthHour = h;
  }
  if (lifeExpectancy !== undefined && lifeExpectancy !== "") {
    const l = Number(lifeExpectancy);
    if (!Number.isInteger(l) || l < 1 || l > 200) {
      return NextResponse.json({ error: "몇 살까지 여행하고 싶은지 1~200 사이로 입력해주세요." }, { status: 400 });
    }
    updates.lifeExpectancy = l;
  }

  const updated = updateUser(user.id, updates);
  return NextResponse.json({ ok: true, user: updated ? { ...updated, passwordHash: undefined } : null });
}
