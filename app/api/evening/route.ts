import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/auth";
import { getEveningFeedback, getSajuFortune } from "@/lib/ai";
import { addEntry } from "@/lib/storage";
import { formatDate, getSajuCompleteness } from "@/lib/date-utils";
import type { Entry } from "@/lib/types";

export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { content } = (await req.json()) ?? {};
  const trimmed = typeof content === "string" ? content.trim() : "";

  if (!trimmed) {
    return NextResponse.json({ error: "오늘 하루를 짧게 적어주세요." }, { status: 400 });
  }
  if (trimmed.length > 10) {
    return NextResponse.json({ error: "10자 이내로 적어주세요." }, { status: 400 });
  }

  const today = formatDate();
  const completeness = getSajuCompleteness({
    birthMonth: user.birthMonth,
    birthDay: user.birthDay,
    birthHour: user.birthHour,
  });

  const [aiFeedback, sajuFortune] = await Promise.all([
    getEveningFeedback(trimmed),
    completeness !== "none"
      ? getSajuFortune({
          birthYear: user.birthYear,
          birthMonth: user.birthMonth,
          birthDay: user.birthDay,
          birthHour: user.birthHour,
          today,
        })
      : Promise.resolve(undefined),
  ]);

  const entry: Entry = {
    id: uuidv4(),
    userId: user.id,
    date: today,
    content: trimmed,
    aiFeedback,
    sajuFortune,
    is_shared: false,
    createdAt: new Date().toISOString(),
  };

  addEntry(entry);

  return NextResponse.json({ ok: true, aiFeedback });
}
