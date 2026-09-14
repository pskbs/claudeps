"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

const KEYWORD_MAX_LEN = 12;
const DETAIL_MAX_LEN = 200;

export default function EveningPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [detail, setDetail] = useState("");
  const [showDetail, setShowDetail] = useState(false);
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
        body: JSON.stringify({ keyword, detail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        setLoading(false);
        return;
      }
      setFeedback(data.aiFeedback);
      setLoading(false);
    } catch {
      setError("저장 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  function goHome() {
    router.push("/home");
    router.refresh();
  }

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <div className="w-full">
        <BackButton />
      </div>
      <Mascot size={72} mood={feedback ? "cheer" : "sleepy"} />
      <div className="text-center">
        <h1 className="text-xl font-bold text-coral-500">오늘 하루 마무리</h1>
        <p className="text-sm text-stone-500 mt-1">
          오늘의 여행을 한 단어로 표현해보세요
        </p>
      </div>

      {!feedback && (
        <Card className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={keyword}
              maxLength={KEYWORD_MAX_LEN}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 벅참, 고단함, 소소한행복"
              className="w-full rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-base text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
              required
              autoFocus
            />
            <p className="text-right text-xs text-stone-400">
              {keyword.length}/{KEYWORD_MAX_LEN}
            </p>

            {showDetail ? (
              <div className="flex flex-col gap-1">
                <textarea
                  value={detail}
                  maxLength={DETAIL_MAX_LEN}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="어떤 순간이었는지 조금 더 이야기해볼까요? (선택)"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
                />
                <p className="text-right text-xs text-stone-400">
                  {detail.length}/{DETAIL_MAX_LEN}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetail(true)}
                className="self-start text-sm text-coral-400 underline underline-offset-2"
              >
                + 추가로 설명 남기기 (선택)
              </button>
            )}

            {error && <p className="text-sm text-coral-500">{error}</p>}
            <Button type="submit" loading={loading} disabled={!keyword.trim()}>
              {loading ? "기록하는 중..." : "기록하기"}
            </Button>
          </form>
        </Card>
      )}

      {feedback && (
        <>
          <Card className="w-full bg-mint-100/60">
            <p className="text-sm text-stone-500 mb-2">오늘의 한마디</p>
            <p className="text-stone-700 leading-relaxed whitespace-pre-line">{feedback}</p>
          </Card>
          <Button onClick={goHome} className="w-full">
            홈으로 돌아가기
          </Button>
        </>
      )}
    </main>
  );
}
