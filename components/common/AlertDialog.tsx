"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
}

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  actions: AlertAction[];
}

/*** 커스텀 알림 다이얼로그 - 브라우저 기본 alert 대체 ***/
export default function AlertDialog({
  isOpen,
  title,
  message,
  actions,
}: AlertDialogProps) {

  /*** ESC 키로 첫 번째 액션 실행 (닫기) ***/
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") actions[0]?.onClick();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, actions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">

      {/*** 백드롭 ***/}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={actions[0]?.onClick}
      />

      {/*** 알림 카드 ***/}
      <div className="relative z-10 w-full max-w-[320px] rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/*** 상단 아이콘 + 제목 + 메시지 ***/}
        <div className="px-6 pt-7 pb-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle size={22} className="text-amber-500" />
            </div>
          </div>
          <h3 className="text-base font-bold text-[#1A1A1A]">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 whitespace-pre-line">
            {message}
          </p>
        </div>

        {/*** 구분선 ***/}
        <div className="border-t border-zinc-100" />

        {/*** 액션 버튼 영역 ***/}
        <div className={`flex ${actions.length === 1 ? "" : "divide-x divide-zinc-100"}`}>
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className={`flex-1 py-4 text-sm font-semibold transition-all active:opacity-70 ${
                action.variant === "primary"
                  ? "text-[#693B97] hover:bg-[#693B97]/5"
                  : "text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
