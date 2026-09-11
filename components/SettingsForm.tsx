"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "./Input";
import Button from "./Button";

export default function SettingsForm({
  initialMorning,
  initialEvening,
  initialLabel,
}: {
  initialMorning: string;
  initialEvening: string;
  initialLabel: string;
}) {
  const router = useRouter();
  const [morningTime, setMorningTime] = useState(initialMorning);
  const [eveningTime, setEveningTime] = useState(initialEvening);
  const [eveningLabel, setEveningLabel] = useState(initialLabel);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ morningTime, eveningTime, eveningLabel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        return;
      }
      setSaved(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="아침 알림 시간"
        type="time"
        value={morningTime}
        onChange={(e) => setMorningTime(e.target.value)}
        required
      />
      <Input
        label="저녁 알림 시간"
        type="time"
        value={eveningTime}
        onChange={(e) => setEveningTime(e.target.value)}
        required
      />
      <Input
        label="저녁 알림 이름 (직접 지어보세요)"
        type="text"
        maxLength={20}
        value={eveningLabel}
        onChange={(e) => setEveningLabel(e.target.value)}
        placeholder="예: 오늘 하루 마무리"
      />
      {error && <p className="text-sm text-coral-500">{error}</p>}
      {saved && <p className="text-sm text-coral-500">저장됐어요!</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : "저장하기"}
      </Button>
    </form>
  );
}
