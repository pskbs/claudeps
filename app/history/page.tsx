import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesByUser } from "@/lib/storage";
import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import BottomNav from "@/components/BottomNav";

export default function HistoryPage() {
  const user = getCurrentUser();
  if (!user) return null; // middleware가 처리하지만 타입 안전을 위해 방어

  const entries = getEntriesByUser(user.id);

  return (
    <main className="flex flex-col gap-5 pb-24">
      <header className="flex items-center gap-2">
        <Mascot size={40} mood="happy" />
        <h1 className="text-2xl font-bold text-coral-500">지난 여행</h1>
      </header>

      {entries.length === 0 && (
        <Card className="text-center">
          <p className="text-stone-600">아직 기록된 여행이 없어요.</p>
          <p className="text-sm text-stone-400 mt-1">
            오늘 하루를 기록하면 여기에 하나씩 쌓여요.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <Link key={entry.id} href={`/history/${entry.id}`} className="block">
            <Card className="transition hover:border-coral-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-stone-400">{entry.date}</p>
                  <p className="text-lg font-bold text-stone-700 mt-1">{entry.content}</p>
                  <p className="text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {entry.aiFeedback}
                  </p>
                </div>
                <span className="text-2xl text-stone-300 shrink-0">›</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <BottomNav active="history" />
    </main>
  );
}
