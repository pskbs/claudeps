import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesByUser } from "@/lib/storage";
import { getDaysSinceBirth, formatDate } from "@/lib/date-utils";
import { pickDailyQuote } from "@/lib/quotes";
import Card from "@/components/Card";
import SajuSection from "@/components/SajuSection";
import LogoutButton from "@/components/LogoutButton";
import ProfileMenu from "@/components/ProfileMenu";
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
        <ProfileMenu username={user.username.split("@")[0]} />
        <div className="flex items-center gap-3">
          <Link href="/settings" className="text-sm text-stone-400 hover:text-coral-500 underline">
            알림 설정
          </Link>
          <LogoutButton />
        </div>
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
