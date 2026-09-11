import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/lib/storage";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) ?? {};

  if (!username || !password) {
    return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const user = getUserByUsername(username.trim());
  if (!user) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  setSession(user.id);
  return NextResponse.json({ ok: true });
}
