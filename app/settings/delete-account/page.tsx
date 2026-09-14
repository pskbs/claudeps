"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "회원 탈퇴에 실패했어요.");
        setLoading(false);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("탈퇴 처리 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <Mascot size={64} mood="sleepy" />
      <h1 className="text-xl font-bold text-coral-500">회원 탈퇴</h1>
      <Card className="w-full">
        <p className="text-stone-600 leading-relaxed">
          탈퇴하면 지금까지 기록한 모든 여행 기록과 프로필 정보가 즉시 삭제되고,
          <br />이 작업은 되돌릴 수 없어요.
        </p>
        <label className="mt-4 flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
            className="h-4 w-4 rounded border-peach-300 text-coral-500 focus:ring-coral-200"
          />
          위 내용을 확인했으며, 탈퇴에 동의합니다.
        </label>
        {error && <p className="text-sm text-coral-500 mt-3">{error}</p>}
        <Button
          type="button"
          variant="primary"
          loading={loading}
          disabled={!confirmChecked}
          onClick={handleDelete}
          className="w-full mt-4"
        >
          {loading ? "탈퇴 처리 중..." : "회원 탈퇴하기"}
        </Button>
      </Card>
    </main>
  );
}
