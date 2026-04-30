"use client";

import { useState, useEffect, useRef } from "react";
import { X, User, Phone, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Product, CartQuantities } from "@/lib/types/product";
import { createOrder } from "@/lib/api/orderApi";
import { OrderResponse } from "@/lib/types/order";

interface ReservationDialogProps {
  isOpen: boolean;
  totalPrice: number;
  storeCode: number;
  products: Product[];
  cartQuantities: CartQuantities;
  onClose: () => void;
  onSuccess?: () => void;
}

/*** 예약 폼 입력값 타입 ***/
interface ReservationFormValues {
  reserverName: string;
  phoneNumber: string;
  confirmPassword: string;
}

/*** 전화번호 자동 하이픈 포맷 (010-1234-5678) ***/
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/*** 예약 정보 입력 다이얼로그 - 센터 모달 방식 (바텀 시트와 구분) ***/
export default function ReservationDialog({
  isOpen,
  totalPrice,
  storeCode,
  products,
  cartQuantities,
  onClose,
  onSuccess,
}: ReservationDialogProps) {
  const [formValues, setFormValues] = useState<ReservationFormValues>({
    reserverName: "",
    phoneNumber: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ReservationFormValues>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderResponse | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  /*** 장바구니 아이템 수 계산 ***/
  const cartItemCount = products.filter((p) => (cartQuantities[p.id] ?? 0) > 0).length;

  /*** 다이얼로그 열릴 때 폼 초기화 및 포커스 ***/
  useEffect(() => {
    if (isOpen) {
      setFormValues({ reserverName: "", phoneNumber: "", confirmPassword: "" });
      setErrors({});
      setIsLoading(false);
      setApiError(null);
      setCompletedOrder(null);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /*** ESC 키로 닫기 (로딩 중 제외) ***/
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  /*** 다이얼로그 열려있을 때 바디 스크롤 방지 ***/
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

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
    setFormValues((prev) => ({ ...prev, confirmPassword: digits }));
  };

  /*** 폼 유효성 검사 ***/
  const validate = (): boolean => {
    const newErrors: Partial<ReservationFormValues> = {};

    if (!formValues.reserverName.trim() || formValues.reserverName.trim().length < 2) {
      newErrors.reserverName = "성명을 2자 이상 입력해 주세요.";
    }
    const phoneDigits = formValues.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      newErrors.phoneNumber = "올바른 전화번호를 입력해 주세요.";
    }
    if (formValues.confirmPassword.length < 4) {
      newErrors.confirmPassword = "비밀번호 4자리를 입력해 주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*** 예약 제출 - API 호출 ***/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    /*** 장바구니 상품을 order_items 형태로 변환 (eventType 포함 - 서버 검증용) ***/
    const orderItems = products
      .filter((p) => (cartQuantities[p.id] ?? 0) > 0)
      .map((p) => ({
        productId: p.id,
        price: p.consumerPrice,
        quantity: cartQuantities[p.id],
        eventType: p.eventType,
      }));

    try {
      const result = await createOrder({
        name: formValues.reserverName.trim(),
        phone: formValues.phoneNumber,
        password: formValues.confirmPassword,
        totalPrice,
        storeCode,
        items: orderItems,
      });
      setCompletedOrder(result);
    } catch (err: unknown) {
      /*** 서버에서 내려온 에러 메시지 우선 사용, 없으면 기본 메시지 ***/
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const serverMessage = axiosErr?.response?.data?.message;
      setApiError(serverMessage ?? "예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  /*** 완료 화면 닫기 ***/
  const handleCompletedClose = () => {
    onSuccess?.();
    onClose();
  };

  /*** 완료 화면 ***/
  if (completedOrder) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-[390px] rounded-2xl bg-white px-6 py-10 shadow-2xl text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={52} className="text-[#693B97]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">예약이 완료되었습니다</h2>
          <p className="text-sm text-zinc-500 mb-1">
            예약자: <span className="font-medium text-[#1A1A1A]">{completedOrder.name}</span>
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            결제 예정 금액:{" "}
            <span className="font-bold text-[#693B97]">
              {completedOrder.totalPrice.toLocaleString("ko-KR")}원
            </span>
          </p>
          <button
            type="button"
            onClick={handleCompletedClose}
            className="w-full rounded-xl bg-[#693B97] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#4E2C72] active:scale-[0.98]"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">

      {/*** 백드롭 - 블러 효과, 로딩 중 클릭 닫기 차단 ***/}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      {/*** 센터 모달 카드 ***/}
      <div className="relative z-10 w-full max-w-[390px] rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/*** 모달 헤더 ***/}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">예약 정보 입력</h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              {cartItemCount}종 · {totalPrice.toLocaleString("ko-KR")}원
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-all disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/*** 예약 폼 ***/}
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
              value={formValues.reserverName}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, reserverName: e.target.value }))
              }
              placeholder="홍길동"
              autoComplete="name"
              disabled={isLoading}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-all focus:border-[#693B97] focus:ring-2 focus:ring-[#693B97]/20 disabled:opacity-60 ${
                errors.reserverName
                  ? "border-red-400 bg-red-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            />
            {errors.reserverName && (
              <p className="mt-1.5 text-xs text-red-500">{errors.reserverName}</p>
            )}
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
                errors.phoneNumber
                  ? "border-red-400 bg-red-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1.5 text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/*** 주문확인 비밀번호 - 숫자 4자리 ***/}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
              <Lock size={14} className="text-[#693B97]" />
              주문확인 비밀번호
              <span className="text-xs font-normal text-zinc-400">(숫자 4자리)</span>
            </label>
            <input
              type="password"
              value={formValues.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••"
              inputMode="numeric"
              maxLength={4}
              autoComplete="new-password"
              disabled={isLoading}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-all focus:border-[#693B97] focus:ring-2 focus:ring-[#693B97]/20 disabled:opacity-60 ${
                errors.confirmPassword
                  ? "border-red-400 bg-red-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>
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
                예약 처리 중...
              </>
            ) : (
              "예약하기"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
