import { NextRequest, NextResponse } from "next/server";
import { usernameToAuthEmail } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) ?? {};

  if (!username || !password) {
    return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToAuthEmail(username),
    password,
  });

  if (error) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
