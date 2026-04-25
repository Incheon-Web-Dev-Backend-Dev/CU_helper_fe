"use client";

import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types/product";
import { calcItemTotal, calcFreeQty } from "@/lib/utils/priceUtils";

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onIncrease: (e: React.MouseEvent) => void;
  onDecrease: (e: React.MouseEvent) => void;
  onOpenDialog: () => void;
}

/*** 이벤트 배지 라벨 반환 ***/
function getEventLabel(eventType: 0 | 1 | 2): string | null {
  if (eventType === 1) return "1+1";
  if (eventType === 2) return "2+1";
  return null;
}

/*** 상품 카드 컴포넌트 ***/
export default function ProductCard({
  product,
  cartQuantity,
  onIncrease,
  onDecrease,
  onOpenDialog,
}: ProductCardProps) {
  const eventLabel = product.isEvent ? getEventLabel(product.eventType) : null;
  const unitPrice = product.consumerPrice.toLocaleString("ko-KR");

  const itemTotal = calcItemTotal(
    product.consumerPrice,
    cartQuantity,
    product.isEvent,
    product.eventType
  );
  const freeQty = calcFreeQty(cartQuantity, product.isEvent, product.eventType);

  const displayPrice = cartQuantity > 0 ? itemTotal : product.consumerPrice;
  const formattedPrice = displayPrice.toLocaleString("ko-KR");

  return (
    <div className="relative rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md">

      {/*** 이벤트 배지 (우측 상단) ***/}
      {eventLabel && (
        <span
          className={`absolute right-3 top-3 z-10 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white ${
            product.eventType === 1 ? "bg-orange-500" : "bg-blue-500"
          }`}
        >
          {eventLabel}
        </span>
      )}

      {/*** 카드 내부 - 이미지 좌, 정보 우 ***/}
      <div className="flex gap-4 p-4">

        {/*** 상품 이미지 - 클릭 시 상세 다이얼로그 ***/}
        <button
          type="button"
          onClick={onOpenDialog}
          className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-zinc-100 focus:outline-none"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
              No Image
            </div>
          )}
        </button>

        {/*** 상품 정보 ***/}
        <div className="flex flex-1 flex-col justify-between">

          {/*** 상품명 + 설명 - 클릭 시 다이얼로그 ***/}
          <button
            type="button"
            onClick={onOpenDialog}
            className="text-left focus:outline-none"
          >
            <p className="pr-8 text-sm font-bold text-[#1A1A1A] line-clamp-1">
              {product.name}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-400 line-clamp-2">
              {product.description ?? ""}
            </p>
          </button>

          {/*** 가격 + 수량 컨트롤 - 높이 고정으로 레이아웃 안정 ***/}
          <div className="flex items-end justify-between">

            {/*** 가격 영역 - 항상 두 줄 공간 확보 ***/}
            <div className="min-h-[36px] flex flex-col justify-end">
              {/*** 단가 라인 - 항상 공간 차지, 수량 없을 때 투명 ***/}
              <p className={`text-[10px] text-zinc-400 ${cartQuantity > 0 ? "visible" : "invisible"}`}>
                {unitPrice}원/개
                {freeQty > 0 && ` · ${freeQty}개 무료`}
              </p>
              <p className="text-sm font-bold text-[#693B97]">
                {formattedPrice}원
              </p>
            </div>

            {/*** 수량 컨트롤 ***/}
            {cartQuantity === 0 ? (
              /*** 수량 0: + 버튼만 표시 ***/
              <button
                type="button"
                onClick={onIncrease}
                aria-label={`${product.name} 추가`}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#693B97] transition-all duration-200 hover:bg-[#4E2C72] active:scale-90"
              >
                <Plus size={15} className="text-white" />
              </button>
            ) : (
              /*** 수량 > 0: - n개 + 표시 ***/
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onDecrease}
                  aria-label="수량 감소"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all duration-200 hover:border-[#693B97] hover:text-[#693B97] active:scale-90"
                >
                  <Minus size={13} />
                </button>
                <span className="min-w-[28px] text-center text-xs font-semibold text-[#1A1A1A]">
                  {cartQuantity}개
                </span>
                <button
                  type="button"
                  onClick={onIncrease}
                  aria-label="수량 증가"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#693B97] transition-all duration-200 hover:bg-[#4E2C72] active:scale-90"
                >
                  <Plus size={13} className="text-white" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
