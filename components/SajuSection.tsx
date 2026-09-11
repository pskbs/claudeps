"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Mascot from "./Mascot";

type SajuResponse = {
  completeness: "none" | "partial" | "full";
  fortune: string | null;
};

export default function SajuSection() {
  const [data, setData] = useState<SajuResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/saju")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-4xl bg-coral-100/60 border border-coral-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Mascot size={32} mood="happy" />
        <h2 className="font-bold text-coral-500">오늘의 인생사주</h2>
      </div>

      {loading && <p className="text-sm text-stone-500">오늘의 기운을 살펴보는 중...</p>}

      {!loading && data?.completeness === "none" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-stone-600">
            정보를 입력하면 사주를 봐드려요. 태어난 시/월/일을 입력해보세요.
          </p>
          <Link
            href="/profile/edit"
            className="self-start rounded-full bg-coral-400 text-white px-4 py-2 text-sm font-soft hover:bg-coral-500"
          >
            정보 입력하러 가기
          </Link>
        </div>
      )}

      {!loading && data && data.completeness !== "none" && (
        <div className="flex flex-col gap-2">
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">{data.fortune}</p>
          {data.completeness === "partial" && (
            <p className="text-xs text-coral-500">
              모든 정보를 입력하면 더 정확한 사주를 볼 수 있어요.{" "}
              <Link href="/profile/edit" className="underline">
                정보 채우러 가기
              </Link>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
