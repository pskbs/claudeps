import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default function PrivacyPage() {
  return (
    <main className="flex flex-col gap-5 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <header className="flex items-center gap-2">
        <Mascot size={40} />
        <h1 className="text-xl font-bold text-coral-500">개인정보 처리방침</h1>
      </header>

      <Card className="flex flex-col gap-5 text-sm leading-relaxed text-stone-600">
        <section>
          <p>
            월백컴퍼니(이하 &quot;회사&quot;)는 &quot;인생여행&quot; 서비스(이하 &quot;서비스&quot;)를 운영하며,
            이용자의 개인정보를 소중히 다루고 관련 법령을 준수하기 위해 이 개인정보
            처리방침을 마련합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">1. 수집하는 개인정보 항목</h2>
          <p>
            회원가입 시: 이메일 주소, 비밀번호(암호화 저장), 출생연도(필수) 및 출생 월/일/시(선택)
            <br />
            서비스 이용 시: 하루 기록 키워드 및 추가 설명, 알림 설정
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">2. 개인정보의 수집 및 이용 목적</h2>
          <p>
            회원 식별 및 로그인, 서비스 제공(하루 기록 저장, 맞춤 안내 메시지 제공), 계정
            관련 문의 응대(비밀번호 재설정 등) 목적으로 개인정보를 이용합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            이용자가 회원 탈퇴를 요청하는 즉시 관련 개인정보와 기록 데이터는 지체 없이
            삭제됩니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한
            기간 동안 보관할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">4. 개인정보의 제3자 제공 및 처리위탁</h2>
          <p>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 서비스
            운영을 위해 데이터베이스 및 인증 인프라(Supabase) 등 외부 서비스를 이용하고
            있으며, 해당 서비스는 회사의 위탁 범위 내에서만 정보를 처리합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">5. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보를 조회·수정할 수 있으며, 회원 탈퇴를 통해
            개인정보 삭제를 요청할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">6. 개인정보의 안전성 확보 조치</h2>
          <p>
            비밀번호는 암호화되어 저장되며, 회사는 개인정보에 대한 불법적인 접근을 막기 위해
            합리적인 수준의 기술적·관리적 조치를 취하고 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">7. 개인정보 보호책임자</h2>
          <p>
            회사명: 월백컴퍼니
            <br />
            책임자: 김봉수
            <br />
            이메일: wol100st2@gmail.com
          </p>
        </section>

        <p className="text-xs text-stone-400 pt-2 border-t border-peach-100">
          시행일: 2026년 9월 14일
        </p>
      </Card>
    </main>
  );
}
