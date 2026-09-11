"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecordTodayButton({ alreadyRecorded }: { alreadyRecorded: boolean }) {
  const [showToast, setShowToast] = useState(false);

  function handleDisabledClick() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  return (
    <div className="fixed left-0 right-0 z-20 bottom-24">
      <div className="relative mx-auto max-w-md px-4">
        {showToast && (
          <div className="absolute left-1/2 bottom-full mb-3 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-stone-700 px-4 py-2 text-sm font-bold text-white shadow-soft">
            오늘 하루는 이미 기록하셨어요
          </div>
        )}

        {alreadyRecorded ? (
          <button
            type="button"
            onClick={handleDisabledClick}
            className="flex w-full items-center justify-center rounded-full bg-peach-200 px-6 py-4 text-lg font-bold text-stone-400 shadow-soft"
          >
            오늘 여행 기록 완료 ✓
          </button>
        ) : (
          <Link
            href="/evening"
            className="flex w-full items-center justify-center rounded-full bg-coral-400 px-6 py-4 text-lg font-bold text-white shadow-soft transition hover:bg-coral-500 active:scale-95"
          >
            오늘 여행 기록하기
          </Link>
        )}
      </div>
    </div>
  );
}
