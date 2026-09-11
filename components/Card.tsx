import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-4xl bg-white/80 shadow-soft p-6 border border-peach-100 ${className}`}
    >
      {children}
    </div>
  );
}
