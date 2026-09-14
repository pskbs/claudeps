import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getEntryById } from "@/lib/storage";
import { pickDailyQuote } from "@/lib/quotes";
import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default async function HistoryDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null; // middleware가 처리하지만 타입 안전을 위해 방어

  const entry = await getEntryById(params.id);
  if (!entry || entry.userId !== user.id) {
    notFound();
  }

  const quote = pickDailyQuote(entry.date, user.id);

  return (
    <main className="flex flex-col gap-5 py-4">
      <BackButton fallbackHref="/history" />
      <header className="flex items-center gap-2">
        <Mascot size={40} mood="happy" />
        <div>
          <p className="text-sm font-bold text-stone-400">{entry.date}</p>
          <h1 className="text-xl font-bold text-coral-500">그날의 여행</h1>
        </div>
      </header>

      {entry.sajuFortune && (
        <Card className="bg-coral-100/60">
          <p className="text-sm font-bold text-coral-500 mb-2">그날의 인생사주</p>
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">
            {entry.sajuFortune}
          </p>
        </Card>
      )}

      <Card className="bg-cream-100/70">
        <p className="text-sm font-bold text-stone-500 mb-2">그날의 응원문구</p>
        <p className="text-stone-700 leading-relaxed">{quote}</p>
      </Card>

      <Card>
        <p className="text-sm font-bold text-stone-400 mb-2">내 하루 키워드</p>
        <p className="text-xl font-bold text-stone-700">#{entry.keyword}</p>
        {entry.detail && (
          <p className="text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
            {entry.detail}
          </p>
        )}
        <div className="mt-3 pt-3 border-t border-peach-100">
          <p className="text-sm font-bold text-stone-400 mb-1">AI의 한마디</p>
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">
            {entry.aiFeedback}
          </p>
        </div>
      </Card>
    </main>
  );
}
