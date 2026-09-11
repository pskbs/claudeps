import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateNotificationSettings } from "@/lib/storage";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }
  return NextResponse.json({ notification: user.notification });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { morningTime, eveningTime, eveningLabel } = (await req.json()) ?? {};

  if (!TIME_RE.test(morningTime) || !TIME_RE.test(eveningTime)) {
    return NextResponse.json({ error: "시간 형식이 올바르지 않아요." }, { status: 400 });
  }
  const label = typeof eveningLabel === "string" && eveningLabel.trim()
    ? eveningLabel.trim().slice(0, 20)
    : user.notification.eveningLabel;

  const updated = await updateNotificationSettings(user.id, {
    morningTime,
    eveningTime,
    eveningLabel: label,
  });

  return NextResponse.json({ ok: true, notification: updated });
}
