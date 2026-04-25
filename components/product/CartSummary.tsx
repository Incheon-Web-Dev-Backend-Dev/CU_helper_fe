"use client";

import { ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  totalKinds: number;
  totalQuantity: number;
  totalPrice: number;
  onClick: () => void;
}

/*** 하단 고정 장바구니 요약 컴포넌트 ***/
export default function CartSummary({
  totalKinds,
  totalQuantity,
  totalPrice,
  onClick,
}: CartSummaryProps) {
  if (totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-5">
      <div className="w-full max-w-[430px]">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center justify-between rounded-2xl bg-[#693B97] px-5 py-3.5 shadow-lg shadow-[#693B97]/30 transition-all active:scale-[0.98] hover:bg-[#5c3485]"
        >

          {/*** 아이콘 + 수량 정보 ***/}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <ShoppingCart size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70">
                {totalKinds}종 · 총 {totalQuantity}개
              </p>
            </div>
          </div>

          {/*** 총 가격 ***/}
          <div className="text-right">
            <p className="text-base font-bold text-white">
              {totalPrice.toLocaleString("ko-KR")}원
            </p>
          </div>

        </button>
      </div>
    </div>
  );
}
