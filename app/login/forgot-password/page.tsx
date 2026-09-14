"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";
import BackButton from "@/components/BackButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "요청에 실패했어요.");
        return;
      }
      setMessage(data.message ?? "새 비밀번호를 보내드렸어요.");
    } catch {
      setError("요청 중 오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <div className="w-full">
        <BackButton fallbackHref="/login" />
      </div>
      <Mascot size={72} mood="sleepy" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-coral-500">비밀번호 찾기</h1>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
          가입할 때 쓴 이메일을 입력하시면
          <br />새 비밀번호를 보내드려요.
        </p>
      </div>
      <Card className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-coral-500">{error}</p>}
          {message && <p className="text-sm text-stone-600">{message}</p>}
          <Button type="submit" loading={loading}>
            {loading ? "보내는 중..." : "새 비밀번호 받기"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
