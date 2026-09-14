"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  fallbackHref = "/home",
  className = "",
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="뒤로 가기"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-coral-500 shadow-soft transition hover:bg-peach-100 active:scale-95 ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
