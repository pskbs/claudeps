import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesByUser } from "@/lib/storage";
import { getDaysSinceBirth, formatDate } from "@/lib/date-utils";
import { pickDailyQuote } from "@/lib/quotes";
import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import SajuSection from "@/components/SajuSection";
import NotificationScheduler from "@/components/NotificationScheduler";
import LifeJourneyGauge from "@/components/LifeJourneyGauge";
import RecordTodayButton from "@/components/RecordTodayButton";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) return null; // middleware가 처리하지만 타입 안전을 위해 방어

  const today = formatDate();
  const daysSinceBirth = getDaysSinceBirth(user);
  const quote = pickDailyQuote(today, user.id);
  const entries = await getEntriesByUser(user.id);
  const hasRecordedToday = entries.some((e) => e.date === today);

  return (
    <main className="flex flex-col gap-5 pb-44">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mascot size={44} />
          <div>
            <p className="text-sm text-stone-500">안녕하세요,</p>
            <p className="font-bold text-coral-500">{user.username.split("@")[0]}님</p>
          </div>
        </div>
        <Link
          href="/settings"
          aria-label="설정"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-coral-500 shadow-soft transition hover:bg-peach-100 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.09.68.31 1 .51H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </header>

      <NotificationScheduler
        morningTime={user.notification.morningTime}
        eveningTime={user.notification.eveningTime}
        eveningLabel={user.notification.eveningLabel}
        daysSinceBirth={daysSinceBirth}
      />

      <Card>
        <p className="text-stone-500 text-base text-center">현재</p>
        <p className="text-2xl font-extrabold text-coral-500 text-center mt-1">인생여행 중</p>
        <LifeJourneyGauge
          birthYear={user.birthYear}
          birthMonth={user.birthMonth}
          birthDay={user.birthDay}
          daysSinceBirth={daysSinceBirth}
          initialLifeExpectancy={user.lifeExpectancy}
        />
      </Card>

      <SajuSection />

      <Card className="bg-cream-100/70">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💌</span>
          <h2 className="font-bold text-coral-500">오늘의 응원문구</h2>
        </div>
        <p className="text-stone-700 leading-relaxed">{quote}</p>
      </Card>

      <RecordTodayButton alreadyRecorded={hasRecordedToday} />
      <BottomNav active="today" />
    </main>
  );
}
