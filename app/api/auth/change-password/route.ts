import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = (await req.json()) ?? {};

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json({ error: "현재 비밀번호를 입력해주세요." }, { status: 400 });
  }
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "새 비밀번호를 6자 이상 입력해주세요." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) {
    return NextResponse.json({ error: "현재 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    // Supabase Auth는 새 비밀번호가 기존과 같으면 에러를 반환하는데,
    // 이 서비스에서는 굳이 막을 이유가 없어 이 경우만 성공으로 처리한다.
    const isSamePasswordError =
      updateError.code === "same_password" ||
      /different from the old password/i.test(updateError.message);
    if (!isSamePasswordError) {
      return NextResponse.json({ error: "비밀번호 변경에 실패했어요." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
