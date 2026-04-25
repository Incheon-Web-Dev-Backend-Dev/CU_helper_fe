"use client";

/*** 백엔드 연결 확인용 TEST 버튼 컴포넌트 ***/
import { useState } from "react";
import { pingServer } from "@/lib/api/testApi";

type ConnectionStatus = "idle" | "loading" | "success" | "error";

/*** 상태별 버튼 스타일 맵 ***/
const STATUS_STYLE: Record<ConnectionStatus, string> = {
  idle: "border border-zinc-300 text-zinc-500 hover:bg-zinc-50",
  loading: "border border-zinc-200 text-zinc-400 cursor-not-allowed",
  success: "border border-green-300 text-green-600 bg-green-50",
  error: "border border-red-300 text-red-500 bg-red-50",
};

/*** 상태별 레이블 ***/
const STATUS_LABEL: Record<ConnectionStatus, string> = {
  idle: "TEST",
  loading: "연결 중...",
  success: "연결 성공",
  error: "연결 실패",
};

/*** 백엔드 연결 상태 테스트 버튼 - 개발용 ***/
export default function TestConnectionButton() {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [message, setMessage] = useState<string>("");

  /*** 서버 ping 요청 핸들러 ***/
  const handleTest = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const data = await pingServer();
      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("서버에 연결할 수 없습니다");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleTest}
        disabled={status === "loading"}
        className={`rounded-full px-6 py-2 text-xs font-medium transition-all duration-200 ${STATUS_STYLE[status]}`}
      >
        {STATUS_LABEL[status]}
      </button>
      {message && (
        <p className={`text-xs ${status === "success" ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
