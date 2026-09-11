import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Card from "@/components/Card";
import Mascot from "@/components/Mascot";
import ProfileEditForm from "@/components/ProfileEditForm";

export default function ProfileEditPage() {
  const user = getCurrentUser();
  if (!user) return null;

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <Mascot size={72} />
      <div className="text-center">
        <h1 className="text-xl font-bold text-coral-500">사주 정보 입력</h1>
        <p className="text-sm text-stone-500 mt-1">
          입력할수록 더 정확한 오늘의 인생사주를 볼 수 있어요.
        </p>
      </div>
      <Card className="w-full">
        <ProfileEditForm
          initialMonth={user.birthMonth}
          initialDay={user.birthDay}
          initialHour={user.birthHour}
        />
      </Card>
      <Link href="/home" className="text-sm text-stone-400 underline">
        나중에 할게요
      </Link>
    </main>
  );
}
