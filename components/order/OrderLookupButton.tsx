"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, User, Phone, Lock, AlertCircle, Loader2, ShoppingBag, CheckCircle } from "lucide-react";
import { getOrderDetail } from "@/lib/api/orderApi";
import { OrderDetailResponse } from "@/lib/types/order";

/*** 전화번호 자동 하이픈 포맷 (010-1234-5678) ***/
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/*** 매장 코드 → 매장명 변환 ***/
function getStoreName(storeCode: number): string {
  if (storeCode === 1) return "장현루벤시아21단지점";
  if (storeCode === 2) return "은계꽃길점";
  return `매장 #${storeCode}`;
}

/*** 날짜 문자열 포맷 (YYYY-MM-DD HH:mm) ***/
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  } catch {
    return dateStr;
  }
}

/*** 폼 입력값 타입 ***/
interface LookupFormValues {
  name: string;
  phoneNumber: string;
  password: string;
}

/*** 나의 예약 조회 버튼 + 다이얼로그 - 메인 페이지에서 사용 ***/
export default function OrderLookupButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<LookupFormValues>({
    name: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LookupFormValues>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderDetailResponse | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  /*** 다이얼로그 열릴 때 상태 초기화 및 포커스 ***/
  useEffect(() => {
    if (isOpen) {
      setFormValues({ name: "", phoneNumber: "", password: "" });
      setErrors({});
      setIsLoading(false);
      setApiError(null);
      setResult(null);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /*** ESC 키로 닫기 (로딩 중 제외) ***/
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading]);

  /*** 다이얼로그 열려있을 때 바디 스크롤 방지 ***/
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /*** 전화번호 입력 핸들러 ***/
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      phoneNumber: formatPhoneNumber(e.target.value),
    }));
  };

  /*** 비밀번호 입력 - 숫자 4자리만 허용 ***/
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormValues((prev) => ({ ...prev, password: digits }));
  };

  /*** 폼 유효성 검사 ***/
  const validate = (): boolean => {
    const newErrors: Partial<LookupFormValues> = {};
    if (!formValues.name.trim() || formValues.name.trim().length < 2) {
      newErrors.name = "성명을 2자 이상 입력해 주세요.";
    }
    const phoneDigits = formValues.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      newErrors.phoneNumber = "올바른 전화번호를 입력해 주세요.";
    }
    if (formValues.password.length < 4) {
      newErrors.password = "비밀번호 4자리를 입력해 주세요.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*** 조회 제출 - API 호출 ***/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const data = await getOrderDetail({
        name: formValues.name.trim(),
        phone: formValues.phoneNumber,
        password: formValues.password,
      });
      setResult(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const serverMessage = axiosErr?.response?.data?.message;
      setApiError(serverMessage ?? "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  /*** 결과 화면 - 주문 상세 내역 표시 ***/
  const ResultView = () => {
    if (!result) return null;
    const { order, items } = result;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="relative z-10 w-full max-w-[390px] rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/*** 결과 헤더 ***/}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
            <div>
              <h2 className="text-base font-bold text-[#1A1A1A]">나의 예약 내역</h2>
              <p className="mt-0.5 text-xs text-zinc-400">{getStoreName(order.storeCode)}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/*** 결과 본문 ***/}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/*** 주문 기본 정보 ***/}
            <div className="rounded-xl bg-[#693B97]/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-[#693B97]" />
                <span className="text-sm font-semibold text-[#693B97]">예약 확인</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">예약자</span>
                <span className="font-medium text-[#1A1A1A]">{order.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">예약 일시</span>
                <span className="font-medium text-[#1A1A1A]">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">결제 상태</span>
                <span className={`font-medium ${order.isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                  {order.isPaid ? "결제 완료" : "결제 예정"}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-[#693B97]/10">
                <span className="text-zinc-500 font-medium">결제 예정 금액</span>
                <span className="font-bold text-[#693B97]">
                  {order.totalPrice.toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>

            {/*** 주문 상품 목록 ***/}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag size={15} className="text-zinc-500" />
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  주문 상품 ({items.length}종)
                </span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-[#F8F8F8] px-4 py-3"
                  >
                    <div className="text-sm">
                      <span className="font-medium text-[#1A1A1A]">상품 #{item.productId}</span>
                      <span className="ml-2 text-zinc-400">×{item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {(item.price * item.quantity).toLocaleString("ko-KR")}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/*** 닫기 버튼 ***/}
          <div className="px-6 py-5 border-t border-zinc-100 shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-xl bg-[#693B97] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#4E2C72] active:scale-[0.98]"
            >
              확인
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <>
      {/*** 나의 예약 조회하기 버튼 ***/}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#693B97]/30 bg-[#693B97]/5 text-sm font-medium text-[#693B97] transition-all duration-200 hover:bg-[#693B97]/10 active:scale-95"
      >
        <Search size={15} />
        나의 예약 조회하기
      </button>

      {/*** 조회 다이얼로그 ***/}
      {isOpen && !result && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={isLoading ? undefined : () => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[390px] rounded-2xl bg-white shadow-2xl overflow-hidden">

            {/*** 모달 헤더 ***/}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">나의 예약 조회</h2>
                <p className="mt-0.5 text-xs text-zinc-400">예약 시 입력한 정보를 입력해 주세요.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-all disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/*** 조회 폼 ***/}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5" noValidate>

              {/*** API 오류 메시지 ***/}
              {apiError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}

              {/*** 예약자 성명 ***/}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                  <User size={14} className="text-[#693B97]" />
                  예약자 성명
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={formValues.name}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="홍길동"
                  autoComplete="name"
                  disabled={isLoading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-all focus:border-[#693B97] focus:ring-2 focus:ring-[#693B97]/20 disabled:opacity-60 ${
                    errors.name ? "border-red-400 bg-red-50" : "border-zinc-200 bg-zinc-50"
                  }`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/*** 전화번호 ***/}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                  <Phone size={14} className="text-[#693B97]" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={formValues.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                  inputMode="numeric"
                  disabled={isLoading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-all focus:border-[#693B97] focus:ring-2 focus:ring-[#693B97]/20 disabled:opacity-60 ${
                    errors.phoneNumber ? "border-red-400 bg-red-50" : "border-zinc-200 bg-zinc-50"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {/*** 주문확인 비밀번호 ***/}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                  <Lock size={14} className="text-[#693B97]" />
                  주문확인 비밀번호
                  <span className="text-xs font-normal text-zinc-400">(숫자 4자리)</span>
                </label>
                <input
                  type="password"
                  value={formValues.password}
                  onChange={handlePasswordChange}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-all focus:border-[#693B97] focus:ring-2 focus:ring-[#693B97]/20 disabled:opacity-60 ${
                    errors.password ? "border-red-400 bg-red-50" : "border-zinc-200 bg-zinc-50"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/*** 제출 버튼 ***/}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#693B97] py-4 text-sm font-bold text-white transition-all hover:bg-[#4E2C72] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    조회 중...
                  </>
                ) : (
                  "조회하기"
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/*** 결과 화면 ***/}
      {isOpen && result && <ResultView />}
    </>
  );
}
