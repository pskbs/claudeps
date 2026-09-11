import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEveningFeedback, getSajuFortune } from "@/lib/ai";
import { addEntry } from "@/lib/storage";
import { formatDate, getSajuCompleteness } from "@/lib/date-utils";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
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

  const { error } = await addEntry({
    userId: user.id,
    date: today,
    content: trimmed,
    aiFeedback,
    sajuFortune,
  });

  if (error) {
    return NextResponse.json({ error: "기록 저장에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, aiFeedback });
}
