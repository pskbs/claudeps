import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default function TermsPage() {
  return (
    <main className="flex flex-col gap-5 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <header className="flex items-center gap-2">
        <Mascot size={40} />
        <h1 className="text-xl font-bold text-coral-500">서비스 이용약관</h1>
      </header>

      <Card className="flex flex-col gap-5 text-sm leading-relaxed text-stone-600">
        <section>
          <h2 className="font-bold text-stone-700 mb-1">제1조 (목적)</h2>
          <p>
            이 약관은 월백컴퍼니(이하 &quot;회사&quot;)가 제공하는 &quot;인생여행&quot; 서비스(이하 &quot;서비스&quot;)의
            이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제2조 (서비스의 제공)</h2>
          <p>
            회사는 이용자가 자신의 하루를 기록하고, 이를 바탕으로 한 안내 및 응원 메시지를
            제공하는 서비스를 운영합니다. 서비스의 내용은 회사의 사정에 따라 추가, 변경되거나
            중단될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제3조 (회원가입 및 계정)</h2>
          <p>
            이용자는 본인의 이메일을 이용해 회원가입을 하며, 계정 정보는 본인만 사용해야 합니다.
            타인의 계정을 무단으로 사용하거나 허위 정보로 가입하는 행위는 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제4조 (이용자의 의무)</h2>
          <p>
            이용자는 서비스를 이용함에 있어 관계 법령, 이 약관의 규정, 이용 안내 및 서비스와
            관련하여 공지한 사항을 준수해야 하며, 타인의 권리를 침해하거나 서비스 운영을
            방해하는 행위를 해서는 안 됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제5조 (콘텐츠 및 AI 응답)</h2>
          <p>
            서비스가 제공하는 안내·피드백 메시지는 인공지능을 활용해 자동으로 생성되며,
            참고용 정보로 제공됩니다. 전문적인 의학적·심리적 상담을 대체하지 않으며, 이를
            근거로 한 판단과 결정에 대한 책임은 이용자 본인에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제6조 (서비스 이용 제한 및 계약 해지)</h2>
          <p>
            이용자는 언제든지 탈퇴를 통해 이용 계약을 해지할 수 있습니다. 회사는 이용자가
            이 약관을 위반한 경우 사전 통지 후 서비스 이용을 제한할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제7조 (책임의 제한)</h2>
          <p>
            회사는 천재지변, 서비스 제공업체의 장애 등 회사의 고의 또는 중과실이 없는 사유로
            서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제8조 (약관의 변경)</h2>
          <p>
            회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 이 약관을 변경할 수 있으며,
            변경 시 서비스 내 공지를 통해 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-700 mb-1">제9조 (문의처)</h2>
          <p>
            서비스 이용과 관련한 문의는 아래로 연락해주세요.
            <br />
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
