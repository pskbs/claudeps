import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesByUser } from "@/lib/storage";
import { formatDate } from "@/lib/date-utils";

/**
 * 오늘 기록이 실제로 저장됐는지 확인하는 용도.
 * iOS에서 기록 요청 중 네트워크가 끊겨 클라이언트는 실패로 보이지만
 * 서버는 계속 처리를 마치고 저장에 성공하는 경우가 있어,
 * 클라이언트가 "정말 실패했는지" 재확인할 때 쓴다.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const today = formatDate();
  const entries = await getEntriesByUser(user.id);
  const todayEntry = entries.find((entry) => entry.date === today);

  if (!todayEntry) {
    return NextResponse.json({ recorded: false });
  }
  return NextResponse.json({ recorded: true, aiFeedback: todayEntry.aiFeedback });
}
