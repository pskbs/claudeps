import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import { LinkButton } from "@/components/Button";

export default function ForgotPasswordSentPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email ?? "";

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] gap-6 py-4">
      <Mascot size={72} mood="cheer" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-coral-500">새 비밀번호를 보내드렸어요</h1>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
          {email && (
            <>
              <span className="font-bold text-stone-700">{email}</span>
              <br />
            </>
          )}
          메일함을 확인해서 새 비밀번호로 로그인해주세요.
        </p>
      </div>
      <Card className="w-full text-center text-sm text-stone-500">
        메일이 보이지 않으면 스팸함도 확인해보세요.
      </Card>
      <LinkButton href="/login" className="w-full max-w-xs">
        로그인하러 가기
      </LinkButton>
    </main>
  );
}
