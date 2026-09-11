"use client";

import { useState } from "react";
import { getDaysRemaining } from "@/lib/date-utils";

const MIN_AGE = 1;
const MAX_AGE = 200;
const SIZE = 260;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LifeJourneyGauge({
  birthYear,
  birthMonth,
  birthDay,
  daysSinceBirth,
  initialLifeExpectancy,
}: {
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  daysSinceBirth: number;
  initialLifeExpectancy: number;
}) {
  const [lifeExpectancy, setLifeExpectancy] = useState(initialLifeExpectancy);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(initialLifeExpectancy));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const daysRemaining = Math.max(
    getDaysRemaining({ birthYear, birthMonth, birthDay }, lifeExpectancy),
    0
  );
  const totalDays = daysSinceBirth + daysRemaining;
  const percent = totalDays > 0 ? Math.min(1, daysSinceBirth / totalDays) : 1;
  const offset = CIRCUMFERENCE * (1 - percent);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(inputValue);
    if (!Number.isInteger(value) || value < MIN_AGE || value > MAX_AGE) {
      setError(`${MIN_AGE}~${MAX_AGE}살 사이로 입력해주세요.`);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lifeExpectancy: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했어요.");
        return;
      }
      setLifeExpectancy(value);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#FFEDE1"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#FA6B5C"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-5xl font-extrabold text-coral-500 leading-tight">
            {daysSinceBirth.toLocaleString()}일째
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-full bg-coral-500 px-8 py-4 text-center shadow-md">
        <p className="text-3xl font-extrabold text-white leading-tight">
          {daysRemaining.toLocaleString()}일 남음
        </p>
      </div>

      {!editing ? (
        <button
          type="button"
          onClick={() => {
            setInputValue(String(lifeExpectancy));
            setEditing(true);
          }}
          className="text-sm text-stone-400 underline mt-2"
        >
          목표 나이 수정
        </button>
      ) : (
        <form onSubmit={handleSave} className="flex items-center gap-2 mt-2">
          <input
            type="number"
            min={MIN_AGE}
            max={MAX_AGE}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-20 rounded-2xl border border-peach-200 bg-cream-50 px-3 py-2 text-base text-stone-700 outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
            autoFocus
          />
          <span className="text-base text-stone-500">살까지</span>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-coral-400 text-white px-4 py-2 text-sm font-soft hover:bg-coral-500 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="text-sm text-stone-400 underline"
          >
            취소
          </button>
        </form>
      )}
      {error && <p className="text-sm text-coral-500 mt-2">{error}</p>}
    </div>
  );
}
