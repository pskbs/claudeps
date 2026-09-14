"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    birthYear: "",
    lifeExpectancy: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "회원가입에 실패했어요.");
        setLoading(false);
        return;
      }
      window.location.href = "/home";
    } catch {
      setError("회원가입 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center gap-6 py-4">
      <Mascot size={72} mood="cheer" />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-coral-500">인생여행 시작하기</h1>
        <p className="text-stone-500 leading-relaxed mt-2">
          태어난 날부터 지금까지, 당신은 이미 인생이라는 여행 중이에요.
          <br />
          오늘은 몇 일째, 앞으로 며칠 남았는지 함께 확인해봐요 🧳
        </p>
      </div>
      <Card className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일 (아이디로 사용해요)"
            type="email"
            placeholder="example@email.com"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          <Input
            label="태어난 연도 (필수)"
            type="number"
            placeholder="예: 1996"
            value={form.birthYear}
            onChange={(e) => update("birthYear", e.target.value)}
            required
          />
          <Input
            label="몇 살까지 인생여행 하고 싶나요? (필수)"
            type="number"
            placeholder="예: 90"
            min={1}
            max={200}
            value={form.lifeExpectancy}
            onChange={(e) => update("lifeExpectancy", e.target.value)}
            required
          />

          <div className="pt-2 border-t border-peach-100">
            <p className="text-sm text-stone-500 mb-3">
              선택 입력 — 있으면 여행 일수를 더 정확하게 계산하고, 하루의 기운도 함께 볼 수 있어요.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="태어난 월"
                type="number"
                placeholder="MM"
                value={form.birthMonth}
                onChange={(e) => update("birthMonth", e.target.value)}
              />
              <Input
                label="태어난 일"
                type="number"
                placeholder="DD"
                value={form.birthDay}
                onChange={(e) => update("birthDay", e.target.value)}
              />
              <Input
                label="태어난 시"
                type="number"
                placeholder="0-23"
                value={form.birthHour}
                onChange={(e) => update("birthHour", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-coral-500">{error}</p>}
          <Button type="submit" loading={loading}>
            {loading ? "여행 시작 준비 중..." : "여행 시작하기"}
          </Button>
        </form>
      </Card>
      <p className="text-sm text-stone-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="text-coral-500 font-medium underline">
          로그인
        </Link>
      </p>
    </main>
  );
}
