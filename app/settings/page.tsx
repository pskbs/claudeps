import { getCurrentUser } from "@/lib/auth";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";
import SettingsTabs from "@/components/SettingsTabs";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <Mascot size={64} />
      <h1 className="text-xl font-bold text-coral-500">설정</h1>
      <SettingsTabs
        initialMorning={user.notification.morningTime}
        initialEvening={user.notification.eveningTime}
        initialLabel={user.notification.eveningLabel}
      />
    </main>
  );
}
