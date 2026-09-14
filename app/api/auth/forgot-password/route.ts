import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendNewPasswordEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

const GENERIC_MESSAGE =
  "입력하신 이메일로 가입된 계정이 있다면, 새 비밀번호를 보내드렸어요.";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) ?? {};

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "올바른 이메일 형식을 입력해주세요." }, { status: 400 });
  }

  const normalized = normalizeEmail(email);

  const admin = createSupabaseAdminClient();
  if (!admin) {
    console.error("[forgot-password] SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.");
    return NextResponse.json(
      { error: "지금은 비밀번호 찾기를 이용할 수 없어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  // 이메일로 auth 사용자를 찾기 위해 profiles에서 id를 먼저 조회한다.
  const { data: profileRow, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  if (profileError || !profileRow) {
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }

  const newPassword = generatePassword();
  const { error: updateError } = await admin.auth.admin.updateUserById(profileRow.id, {
    password: newPassword,
  });

  if (updateError) {
    console.error("[forgot-password] 비밀번호 업데이트 실패:", updateError.message);
    return NextResponse.json(
      { error: "비밀번호 재설정에 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const { error: mailError } = await sendNewPasswordEmail({
    to: normalized,
    newPassword,
  });
  if (mailError) {
    console.error("[forgot-password] 메일 발송 실패:", mailError);
    return NextResponse.json(
      { error: "새 비밀번호는 발급됐지만 메일 발송에 실패했어요. 관리자에게 문의해주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
