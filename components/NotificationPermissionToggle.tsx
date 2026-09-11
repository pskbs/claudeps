"use client";

import { useEffect, useState } from "react";

export default function NotificationPermissionToggle() {
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

  if (permission === "unsupported") {
    return (
      <p className="text-sm text-stone-500">
        이 브라우저는 알림을 지원하지 않아요.
      </p>
    );
  }

  if (permission === "granted") {
    return (
      <p className="rounded-3xl bg-mint-100 border border-mint-200 p-4 text-sm text-stone-600">
        ✅ 브라우저 알림이 켜져 있어요.
      </p>
    );
  }

  return (
    <div className="rounded-3xl bg-mint-100 border border-mint-200 p-4 text-sm text-stone-600 flex items-center justify-between gap-3">
      <p>브라우저 알림을 켜면 아침/저녁 알림을 받을 수 있어요. (탭이 열려있을 때만 동작해요)</p>
      <button
        onClick={async () => {
          const result = await Notification.requestPermission();
          setPermission(result);
        }}
        className="shrink-0 rounded-full bg-coral-400 text-white px-4 py-2 text-sm font-soft hover:bg-coral-500"
      >
        알림 켜기
      </button>
    </div>
  );
}
