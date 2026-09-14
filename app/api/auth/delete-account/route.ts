import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteOwnAccount } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { error } = await deleteOwnAccount();
  if (error) {
    return NextResponse.json({ error: "회원 탈퇴에 실패했어요." }, { status: 500 });
  }

  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
