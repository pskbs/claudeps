"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "./Card";
import LogoutButton from "./LogoutButton";
import NotificationPermissionToggle from "./NotificationPermissionToggle";
import SettingsForm from "./SettingsForm";

type Tab = "general" | "notification";

const GENERAL_ITEMS = [
  { label: "비밀번호 변경", href: "/settings/password", icon: "🔒" },
  { label: "회원탈퇴", href: "/settings/delete-account", icon: "👋" },
  { label: "서비스 이용약관", href: "/terms", icon: "📄" },
  { label: "개인정보 처리방침", href: "/privacy", icon: "🔏" },
];

export default function SettingsTabs({
  initialMorning,
  initialEvening,
  initialLabel,
}: {
  initialMorning: string;
  initialEvening: string;
  initialLabel: string;
}) {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex gap-1 rounded-full bg-peach-100 p-1">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
            tab === "general" ? "bg-white text-coral-500 shadow-soft" : "text-stone-400"
          }`}
        >
          기본 설정
        </button>
        <button
          type="button"
          onClick={() => setTab("notification")}
          className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
            tab === "notification" ? "bg-white text-coral-500 shadow-soft" : "text-stone-400"
          }`}
        >
          알림 설정
        </button>
      </div>

      {tab === "general" ? (
        <Card className="flex flex-col gap-1">
          {GENERAL_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-stone-700 transition hover:bg-peach-100"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex justify-center border-t border-peach-100 pt-3">
            <LogoutButton />
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="-mt-2 text-center text-sm text-stone-500">
            브라우저 알림은 이 탭이 열려있을 때만 동작해요.
          </p>
          <NotificationPermissionToggle />
          <Card>
            <SettingsForm
              initialMorning={initialMorning}
              initialEvening={initialEvening}
              initialLabel={initialLabel}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
