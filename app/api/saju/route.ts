import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSajuFortune } from "@/lib/ai";
import { formatDate, getSajuCompleteness } from "@/lib/date-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const completeness = getSajuCompleteness({
    birthMonth: user.birthMonth,
    birthDay: user.birthDay,
    birthHour: user.birthHour,
  });

  if (completeness === "none") {
    return NextResponse.json({ completeness, fortune: null });
  }

  const fortune = await getSajuFortune({
    birthYear: user.birthYear,
    birthMonth: user.birthMonth,
    birthDay: user.birthDay,
    birthHour: user.birthHour,
    today: formatDate(),
  });

  return NextResponse.json({ completeness, fortune });
}
