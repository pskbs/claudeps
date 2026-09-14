"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 서로 일치하지 않아요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "비밀번호 변경에 실패했어요.");
        setLoading(false);
        return;
      }
      setDone(true);
      setLoading(false);
    } catch {
      setError("변경 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="flex flex-col items-center gap-6 py-4">
        <Mascot size={72} mood="cheer" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-coral-500">비밀번호가 변경됐어요</h1>
          <p className="text-sm text-stone-500 mt-1">다음 로그인부터 새 비밀번호를 사용해주세요.</p>
        </div>
        <Button onClick={() => router.push("/home")} className="w-full max-w-xs">
          홈으로 돌아가기
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <Mascot size={64} />
      <h1 className="text-xl font-bold text-coral-500">비밀번호 변경</h1>
      <Card className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="현재 비밀번호"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-coral-500">{error}</p>}
          <Button type="submit" loading={loading}>
            {loading ? "변경하는 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
