"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button, { ButtonSpinner } from "@/components/Button";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

const KEYWORD_MAX_LEN = 12;
const DETAIL_MAX_LEN = 200;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkIfAlreadyRecorded(): Promise<{ recorded: boolean; aiFeedback?: string }> {
  try {
    const res = await fetch("/api/evening/status", { cache: "no-store" });
    if (!res.ok) return { recorded: false };
    return await res.json();
  } catch {
    return { recorded: false };
  }
}

export default function EveningPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [detail, setDetail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
      // 저장 요청 자체가 끊긴 경우 (특히 iOS에서 화면이 잠기거나 앱이 백그라운드로
      // 가면 네트워크 연결이 끊길 수 있음). 서버는 계속 처리 중일 수 있으므로
      // 바로 실패로 단정하지 않고, 잠시 후 실제로 저장됐는지 몇 차례 재확인한다.
      setConfirming(true);
      let confirmed = false;
      for (let attempt = 0; attempt < 6; attempt += 1) {
        await wait(3000);
        const status = await checkIfAlreadyRecorded();
        if (status.recorded) {
          confirmed = true;
          setFeedback(status.aiFeedback ?? "오늘 하루도 잘 기록됐어요. 여기까지 온 당신을 응원해요. 🤍");
          break;
        }
      }
      setConfirming(false);
      setLoading(false);
      if (!confirmed) {
        setError("저장 중 오류가 발생했어요. 다시 시도해주세요.");
      }
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
          오늘 여행 키워드를 남겨보세요
        </p>
      </div>

      {loading && !feedback && (
        <Card className="w-full flex flex-col items-center gap-3 py-10 text-center">
          <ButtonSpinner className="h-8 w-8 text-coral-400" />
          <p className="font-bold text-stone-700">
            소중한 오늘 여행을 저장하고 있어요
          </p>
          <p className="text-sm text-stone-500">
            {confirming
              ? "연결이 잠시 끊겼지만 계속 확인하고 있어요. 조금만 기다려주세요..."
              : "AI가 오늘 하루를 정성껏 읽고 있어요. 잠시만 기다려주세요..."}
          </p>
        </Card>
      )}

      {!loading && !feedback && (
        <Card className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={keyword}
              maxLength={KEYWORD_MAX_LEN}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 벅참, 스타벅스, 야근, 소나기"
              className="w-full rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-base text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
              required
              autoFocus
            />
            <p className="text-right text-xs text-stone-400">
              {keyword.length}/{KEYWORD_MAX_LEN}
            </p>

            <div className="flex flex-col gap-1">
              <textarea
                value={detail}
                maxLength={DETAIL_MAX_LEN}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="키워드에 대해 좀 더 말씀해주시겠어요? (선택사항)"
                rows={3}
                className="w-full resize-none rounded-2xl border border-peach-200 bg-cream-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
              />
              <p className="text-right text-xs text-stone-400">
                {detail.length}/{DETAIL_MAX_LEN}
              </p>
            </div>

            {error && <p className="text-sm text-coral-500">{error}</p>}
            <Button type="submit" disabled={!keyword.trim()}>
              기록하기
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
