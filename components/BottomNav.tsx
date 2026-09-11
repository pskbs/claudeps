import Link from "next/link";

export default function BottomNav({ active }: { active: "today" | "history" }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-peach-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
        <Link
          href="/home"
          className={`flex flex-col items-center gap-0.5 rounded-2xl px-6 py-1 text-base font-bold transition ${
            active === "today" ? "text-coral-500" : "text-stone-400"
          }`}
        >
          <span className="text-2xl">🧳</span>
          오늘의 여행
        </Link>
        <Link
          href="/history"
          className={`flex flex-col items-center gap-0.5 rounded-2xl px-6 py-1 text-base font-bold transition ${
            active === "history" ? "text-coral-500" : "text-stone-400"
          }`}
        >
          <span className="text-2xl">📖</span>
          지난 여행
        </Link>
      </div>
    </nav>
  );
}
