"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";

const MAX_LEN = 10;

export default function EveningPage() {
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/evening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        return;
      }
      setFeedback(data.aiFeedback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <Mascot size={72} mood={feedback ? "cheer" : "sleepy"} />
      <div className="text-center">
        <h1 className="text-xl font-bold text-coral-500">오늘 하루 마무리</h1>
        <p className="text-sm text-stone-500 mt-1">오늘 하루를 10자 이내로 짧게 적어주세요.</p>
      </div>

      {!feedback && (
        <Card className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={content}
              maxLength={MAX_LEN}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 힘들었지만 버텼다"
              className="w-full rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-base text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
              required
            />
            <p className="text-right text-xs text-stone-400">
              {content.length}/{MAX_LEN}
            </p>
            {error && <p className="text-sm text-coral-500">{error}</p>}
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? "기록하는 중..." : "기록하기"}
            </Button>
          </form>
        </Card>
      )}

      {feedback && (
        <Card className="w-full bg-mint-100/60">
          <p className="text-sm text-stone-500 mb-2">오늘의 한마디</p>
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">{feedback}</p>
        </Card>
      )}

      <Link href="/home" className="text-sm text-stone-400 underline">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
