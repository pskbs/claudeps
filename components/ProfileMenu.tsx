"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot from "./Mascot";

const MENU_ITEMS = [
  { label: "비밀번호 변경", href: "/settings/password", icon: "🔒" },
  { label: "회원탈퇴", href: "/settings/delete-account", icon: "👋" },
  { label: "서비스 이용약관", href: "/terms", icon: "📄" },
  { label: "개인정보 처리방침", href: "/privacy", icon: "🔏" },
];

export default function ProfileMenu({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="-mx-2 -my-1 flex items-center gap-2 rounded-2xl px-2 py-1 text-left transition active:scale-95"
      >
        <Mascot size={44} />
        <div>
          <p className="text-sm text-stone-500">안녕하세요,</p>
          <p className="font-bold text-coral-500">{username}님</p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="absolute inset-0 bg-stone-900/30" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-4xl bg-white p-5 pb-8 shadow-soft">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-peach-200" />
            <p className="px-1 pb-3 font-bold text-stone-700">{username}님</p>
            <div className="flex flex-col">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-stone-700 transition hover:bg-peach-100"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-full bg-peach-100 py-3 text-sm font-bold text-coral-500"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
