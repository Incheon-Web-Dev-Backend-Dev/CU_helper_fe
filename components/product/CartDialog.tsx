"use client";

import { useEffect, useRef } from "react";
import { X, Package, ShoppingBag } from "lucide-react";
import { Product, CartQuantities } from "@/lib/types/product";
import { calcItemTotal, calcFreeQty } from "@/lib/utils/priceUtils";

interface CartDialogProps {
  products: Product[];
  cartQuantities: CartQuantities;
  totalPrice: number;
  onClose: () => void;
}

/*** 장바구니 확인 다이얼로그 (바텀 시트) ***/
export default function CartDialog({
  products,
  cartQuantities,
  totalPrice,
  onClose,
}: CartDialogProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  const cartItems = products.filter((p) => (cartQuantities[p.id] ?? 0) > 0);

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
        className="relative z-10 w-full max-w-[430px] rounded-t-3xl bg-white shadow-2xl"
        style={{ transition: "transform 0.3s ease", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
      >

        {/*** 드래그 핸들 - 스와이프 제스처 영역 ***/}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        {/*** 헤더 ***/}
        <div className="flex items-center justify-between px-5 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#693B97]" />
            <h2 className="text-base font-bold text-[#1A1A1A]">장바구니</h2>
            <span className="text-sm text-zinc-400">{cartItems.length}종</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          >
            <X size={16} />
          </button>
        </div>

        {/*** 구분선 ***/}
        <div className="border-t border-zinc-100 shrink-0" />

        {/*** 상품 목록 (스크롤 가능) ***/}
        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
          {cartItems.map((product) => {
            const qty = cartQuantities[product.id];
            const freeQty = calcFreeQty(qty, product.isEvent, product.eventType);
            const lineTotal = calcItemTotal(
              product.consumerPrice,
              qty,
              product.isEvent,
              product.eventType
            );
            const eventLabel =
              product.isEvent && product.eventType === 1
                ? "1+1"
                : product.isEvent && product.eventType === 2
                ? "2+1"
                : null;

            return (
              <div key={product.id} className="flex gap-3">

                {/*** 상품 이미지 ***/}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={20} className="text-zinc-300" />
                    </div>
                  )}
                </div>

                {/*** 상품 정보 ***/}
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    {eventLabel && (
                      <span
                        className={`rounded px-1 py-0.5 text-[10px] font-bold text-white ${
                          product.eventType === 1 ? "bg-orange-500" : "bg-blue-500"
                        }`}
                      >
                        {eventLabel}
                      </span>
                    )}
                    <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{product.name}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {product.consumerPrice.toLocaleString("ko-KR")}원 × {qty}개
                    {freeQty > 0 && ` (${freeQty}개 무료)`}
                  </p>
                </div>

                {/*** 소계 ***/}
                <div className="flex items-center shrink-0">
                  <p className="text-sm font-bold text-[#693B97]">
                    {lineTotal.toLocaleString("ko-KR")}원
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/*** 하단 - 합계 + 예약하기 버튼 ***/}
        <div className="shrink-0 border-t border-zinc-100 px-5 pt-4 pb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-zinc-500">결제 예정 금액</p>
            <p className="text-lg font-bold text-[#693B97]">
              {totalPrice.toLocaleString("ko-KR")}원
            </p>
          </div>
          <button
            type="button"
            className="w-full rounded-2xl bg-[#693B97] py-4 text-base font-bold text-white transition-all hover:bg-[#4E2C72] active:scale-[0.98]"
          >
            예약하기
          </button>
        </div>

      </div>
    </div>
  );
}
