"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/api/adminApi";

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
}

/*** 관리자 로그인 화면 컴포넌트 - 비밀번호 입력 후 인증 성공 시 onLoginSuccess 호출 ***/
export default function AdminLoginScreen({ onLoginSuccess }: AdminLoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /*** 로그인 폼 제출 핸들러 ***/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const { adminKey } = await adminLogin(password);
      sessionStorage.setItem("adminKey", adminKey);
      onLoginSuccess();
    } catch {
      setError("비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-10">

      {/*** 상단 헤더 ***/}
      <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
        <h1 className="text-lg font-bold text-white">관리자 인증</h1>
        <p className="mt-1 text-xs text-white/70">계속하려면 관리자 비밀번호를 입력하세요.</p>
      </div>

      <div className="px-4 -mt-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm space-y-4"
        >

          {/*** 자물쇠 아이콘 ***/}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#693B97]/10">
            <Lock size={20} className="text-[#693B97]" />
          </div>

          {/*** 비밀번호 입력 필드 ***/}
          <div className="space-y-1">
            <label htmlFor="admin-password" className="block text-sm font-medium text-[#1A1A1A]">
              관리자 비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#693B97] focus:ring-1 focus:ring-[#693B97]"
            />
          </div>

          {/*** 에러 메시지 ***/}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {/*** 제출 버튼 ***/}
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full rounded-xl bg-[#693B97] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4E2C72] active:bg-[#4E2C72] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "확인 중..." : "확인"}
          </button>

        </form>
      </div>

    </div>
  );
}
