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

  const { keyword, detail } = (await req.json()) ?? {};
  const trimmedKeyword = typeof keyword === "string" ? keyword.trim() : "";
  const trimmedDetail = typeof detail === "string" ? detail.trim() : "";

  if (!trimmedKeyword) {
    return NextResponse.json({ error: "오늘을 표현하는 키워드를 적어주세요." }, { status: 400 });
  }
  if (trimmedKeyword.length > 12) {
    return NextResponse.json({ error: "키워드는 12자 이내로 적어주세요." }, { status: 400 });
  }
  if (trimmedDetail.length > 200) {
    return NextResponse.json({ error: "추가 설명은 200자 이내로 적어주세요." }, { status: 400 });
  }

  const today = formatDate();
  const completeness = getSajuCompleteness({
    birthMonth: user.birthMonth,
    birthDay: user.birthDay,
    birthHour: user.birthHour,
  });

  const [aiFeedback, sajuFortune] = await Promise.all([
    getEveningFeedback({ keyword: trimmedKeyword, detail: trimmedDetail || undefined }),
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
    keyword: trimmedKeyword,
    detail: trimmedDetail || undefined,
    aiFeedback,
    sajuFortune,
  });

  if (error) {
    return NextResponse.json({ error: "기록 저장에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, aiFeedback });
}
