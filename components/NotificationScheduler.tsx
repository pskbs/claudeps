"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMorningNotificationCopy,
  getEveningNotificationCopy,
} from "@/lib/notification-copy";

const LAST_FIRED_KEY = "vl_last_notif_fired";

function getLastFired(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LAST_FIRED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLastFired(key: string, dateStr: string) {
  const current = getLastFired();
  current[key] = dateStr;
  try {
    localStorage.setItem(LAST_FIRED_KEY, JSON.stringify(current));
  } catch {
    // 저장 실패는 무시 (알림은 세션 내 재발송될 수 있음)
  }
}

export default function NotificationScheduler({
  morningTime,
  eveningTime,
  eveningLabel,
  daysSinceBirth,
}: {
  morningTime: string;
  eveningTime: string;
  eveningLabel: string;
  daysSinceBirth: number;
}) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const current = `${hh}:${mm}`;
      const today = now.toISOString().slice(0, 10);
      const lastFired = getLastFired();

      if (current === morningTime && lastFired.morning !== today) {
        const copy = getMorningNotificationCopy(daysSinceBirth);
        new Notification(copy.title, { body: copy.body });
        setLastFired("morning", today);
      }

      if (current === eveningTime && lastFired.evening !== today) {
        const copy = getEveningNotificationCopy(eveningLabel);
        const notif = new Notification(copy.title, { body: copy.body });
        notif.onclick = () => {
          window.focus();
          window.location.href = "/evening";
        };
        setLastFired("evening", today);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [permission, morningTime, eveningTime, eveningLabel, daysSinceBirth]);

  if (permission === "unsupported" || permission === "granted") return null;

  return (
    <div className="rounded-3xl bg-mint-100 border border-mint-200 p-4 text-sm text-stone-600 flex items-center justify-between gap-3">
      <p>브라우저 알림을 켜면 아침/저녁 알림을 받을 수 있어요. (탭이 열려있을 때만 동작해요)</p>
      <Link
        href="/settings"
        className="shrink-0 rounded-full bg-coral-400 text-white px-4 py-2 text-sm font-soft hover:bg-coral-500"
      >
        알림 켜기
      </Link>
    </div>
  );
}
