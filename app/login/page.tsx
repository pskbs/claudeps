"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Mascot from "@/components/Mascot";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했어요.");
        return;
      }
      router.push("/home");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <Mascot size={88} />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-coral-500">인생여행</h1>
        <p className="text-stone-500 leading-relaxed mt-2">
          인생을 하나의 긴 여행처럼.
          <br />
          오늘은 여행 며칠째인지, 앞으로 며칠 남았는지 알려드려요 🧳
        </p>
      </div>
      <Card className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-coral-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Card>
      <p className="text-sm text-stone-500">
        아직 계정이 없나요?{" "}
        <Link href="/signup" className="text-coral-500 font-medium underline">
          회원가입
        </Link>
      </p>
    </main>
  );
}
