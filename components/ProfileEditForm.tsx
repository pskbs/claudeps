"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "./Input";
import Button from "./Button";

export default function ProfileEditForm({
  initialMonth,
  initialDay,
  initialHour,
}: {
  initialMonth?: number;
  initialDay?: number;
  initialHour?: number;
}) {
  const router = useRouter();
  const [birthMonth, setBirthMonth] = useState(initialMonth?.toString() ?? "");
  const [birthDay, setBirthDay] = useState(initialDay?.toString() ?? "");
  const [birthHour, setBirthHour] = useState(initialHour?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthMonth, birthDay, birthHour }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        return;
      }
      router.push("/home");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="태어난 월"
        type="number"
        placeholder="MM"
        value={birthMonth}
        onChange={(e) => setBirthMonth(e.target.value)}
      />
      <Input
        label="태어난 일"
        type="number"
        placeholder="DD"
        value={birthDay}
        onChange={(e) => setBirthDay(e.target.value)}
      />
      <Input
        label="태어난 시 (0-23시, 사주용)"
        type="number"
        placeholder="0-23"
        value={birthHour}
        onChange={(e) => setBirthHour(e.target.value)}
      />
      {error && <p className="text-sm text-coral-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : "저장하고 홈으로"}
      </Button>
    </form>
  );
}
