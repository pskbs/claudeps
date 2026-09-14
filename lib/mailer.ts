import nodemailer from "nodemailer";

/**
 * 비밀번호 찾기 메일 발송 전용. Gmail SMTP(wol100st2@gmail.com)를 사용한다.
 * GMAIL_APP_PASSWORD(Google 계정의 "앱 비밀번호")가 설정되지 않으면 발송을 건너뛰고
 * 에러를 반환한다 — 이 경우에도 API는 사용자에게 일반적인 성공 메시지를 보여줘서
 * 가입 여부가 이메일 유무로 노출되지 않게 한다.
 */
const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL || "wol100st2@gmail.com";
const SENDER_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | undefined;

function getTransporter() {
  if (!SENDER_PASSWORD) return undefined;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
    });
  }
  return cachedTransporter;
}

export async function sendNewPasswordEmail(params: {
  to: string;
  newPassword: string;
}): Promise<{ error: string | null }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { error: "GMAIL_APP_PASSWORD가 설정되지 않아 메일을 보낼 수 없어요." };
  }

  try {
    await transporter.sendMail({
      from: `"인생여행" <${SENDER_EMAIL}>`,
      to: params.to,
      subject: "[인생여행] 새 비밀번호가 발급되었어요",
      text: `안녕하세요, 인생여행이에요 🧳

요청하신 비밀번호 재설정이 완료되어 새 비밀번호를 보내드려요.

새 비밀번호: ${params.newPassword}

로그인 후에는 홈 화면 프로필 메뉴 > 비밀번호 변경에서 원하는 비밀번호로 바꿔주세요.
본인이 요청하지 않았다면 이 메일은 무시하셔도 괜찮아요.

즐거운 인생여행 되세요!`,
      html: `<div style="font-family:sans-serif;line-height:1.6;color:#44403c">
        <p>안녕하세요, 인생여행이에요 🧳</p>
        <p>요청하신 비밀번호 재설정이 완료되어 새 비밀번호를 보내드려요.</p>
        <p style="font-size:18px;font-weight:bold;background:#FFF1E6;padding:12px 16px;border-radius:12px;display:inline-block">
          새 비밀번호: ${params.newPassword}
        </p>
        <p>로그인 후에는 홈 화면 프로필 메뉴 &gt; 비밀번호 변경에서 원하는 비밀번호로 바꿔주세요.</p>
        <p style="color:#a8a29e;font-size:13px">본인이 요청하지 않았다면 이 메일은 무시하셔도 괜찮아요.</p>
        <p>즐거운 인생여행 되세요!</p>
      </div>`,
    });
    return { error: null };
  } catch (err) {
    return { error: `메일 발송 실패: ${String(err)}` };
  }
}
