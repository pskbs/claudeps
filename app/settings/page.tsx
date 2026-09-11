import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import SettingsForm from "@/components/SettingsForm";
import NotificationPermissionToggle from "@/components/NotificationPermissionToggle";

export default function SettingsPage() {
  const user = getCurrentUser();
  if (!user) return null;

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <Mascot size={64} />
      <h1 className="text-xl font-bold text-coral-500">알림 설정</h1>
      <p className="text-sm text-stone-500 -mt-4 text-center">
        브라우저 알림은 이 탭이 열려있을 때만 동작해요.
      </p>
      <div className="w-full">
        <NotificationPermissionToggle />
      </div>
      <Card className="w-full">
        <SettingsForm
          initialMorning={user.notification.morningTime}
          initialEvening={user.notification.eveningTime}
          initialLabel={user.notification.eveningLabel}
        />
      </Card>
      <Link href="/home" className="text-sm text-stone-400 underline">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
