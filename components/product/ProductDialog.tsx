"use client";

import { useEffect, useRef } from "react";
import { X, Minus, Plus, Package } from "lucide-react";
import { Product } from "@/lib/types/product";
import { calcItemTotal, calcFreeQty } from "@/lib/utils/priceUtils";

interface ProductDialogProps {
  product: Product | null;
  cartQuantity: number;
  onClose: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

/*** 이벤트 타입 라벨 ***/
function getEventLabel(eventType: 0 | 1 | 2): string | null {
  if (eventType === 1) return "1+1";
  if (eventType === 2) return "2+1";
  return null;
}

/*** 상품 상세 다이얼로그 (바텀 시트) ***/
export default function ProductDialog({
  product,
  cartQuantity,
  onClose,
  onIncrease,
  onDecrease,
}: ProductDialogProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  if (!product) return null;

  const eventLabel = product.isEvent ? getEventLabel(product.eventType) : null;
  const freeQty = calcFreeQty(cartQuantity, product.isEvent, product.eventType);
  const itemTotal = calcItemTotal(
    product.consumerPrice,
    Math.max(cartQuantity, 1),
    product.isEvent,
    product.eventType
  );

  /*** ESC 키로 닫기 ***/
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  /*** 다이얼로그 열려있을 때 스크롤 방지 ***/
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /*** 터치 시작 ***/
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  };

  /*** 터치 이동 - 아래로만 이동 허용 ***/
  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  /*** 터치 종료 - 80px 이상 내리면 닫기 ***/
  const handleTouchEnd = () => {
    const delta = touchCurrentY.current - touchStartY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "transform 0.3s ease";
    }
    if (delta > 80) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "translateY(100%)";
      }
      setTimeout(onClose, 280);
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "translateY(0)";
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">

      {/*** 백드롭 ***/}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/*** 바텀 시트 ***/}
      <div
        ref={sheetRef}
        className="relative z-10 w-full max-w-[430px] rounded-t-3xl bg-white pb-8 shadow-2xl"
        style={{ transition: "transform 0.3s ease" }}
      >

        {/*** 드래그 핸들 - 스와이프 제스처 영역 ***/}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        {/*** 닫기 버튼 ***/}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
        >
          <X size={16} />
        </button>

        {/*** 상품 이미지 ***/}
        <div className="mx-4 overflow-hidden rounded-2xl bg-zinc-100" style={{ height: "200px" }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package size={48} className="text-zinc-300" />
            </div>
          )}
        </div>

        {/*** 상품 정보 ***/}
        <div className="px-5 pt-4">

          {/*** 이벤트 배지 ***/}
          {eventLabel && (
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                product.eventType === 1 ? "bg-orange-500" : "bg-blue-500"
              }`}
            >
              {eventLabel}
            </span>
          )}

          {/*** 상품명 ***/}
          <h2 className="mt-1.5 text-lg font-bold text-[#1A1A1A]">{product.name}</h2>

          {/*** 설명 ***/}
          {product.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
              {product.description}
            </p>
          )}

          {/*** 재고 수량 ***/}
          <p className="mt-2 text-xs text-zinc-400">재고: {product.quantity}개</p>

          {/*** 구분선 ***/}
          <div className="my-4 border-t border-zinc-100" />

          {/*** 가격 + 수량 컨트롤 ***/}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">단가</p>
              <p className="text-xl font-bold text-[#693B97]">
                {product.consumerPrice.toLocaleString("ko-KR")}원
              </p>
            </div>

            {/*** 수량 조절 ***/}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onDecrease}
                disabled={cartQuantity === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 transition-all hover:border-[#693B97] hover:text-[#693B97] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[32px] text-center text-base font-bold text-[#1A1A1A]">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#693B97] transition-all hover:bg-[#4E2C72] active:scale-90"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/*** 총 금액 (이벤트 할인 반영) ***/}
          {cartQuantity > 0 && (
            <div className="mt-4 rounded-xl bg-[#693B97]/5 px-4 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  {product.consumerPrice.toLocaleString("ko-KR")}원 × {cartQuantity}개
                  {freeQty > 0 && ` (${freeQty}개 무료)`}
                </span>
                <span className="font-bold text-[#693B97]">
                  {calcItemTotal(
                    product.consumerPrice,
                    cartQuantity,
                    product.isEvent,
                    product.eventType
                  ).toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
