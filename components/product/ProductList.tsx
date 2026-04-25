"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, PackageSearch } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductDialog from "@/components/product/ProductDialog";
import CartSummary from "@/components/product/CartSummary";
import CartDialog from "@/components/product/CartDialog";
import { Product, CartQuantities } from "@/lib/types/product";
import { calcItemTotal } from "@/lib/utils/priceUtils";

const BATCH_SIZE = 5;

interface ProductListProps {
  products: Product[];
  storeName: string;
}

/*** 상품 목록 - 검색 + 무한 스크롤 + 장바구니 상태 관리 ***/
export default function ProductList({ products, storeName }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /*** 장바구니 합계 계산 (이벤트 할인 반영) ***/
  const totalKinds = Object.values(cartQuantities).filter((q) => q > 0).length;
  const totalQuantity = Object.values(cartQuantities).reduce((sum, q) => sum + q, 0);
  const totalPrice = products.reduce(
    (sum, p) =>
      sum + calcItemTotal(p.consumerPrice, cartQuantities[p.id] || 0, p.isEvent, p.eventType),
    0
  );

  /*** 수량 증가 ***/
  const handleIncrease = useCallback((productId: number) => {
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }, []);

  /*** 수량 감소 (0 미만 방지) ***/
  const handleDecrease = useCallback((productId: number) => {
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  }, []);

  /*** 검색어 기반 필터링 ***/
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  /*** 화면에 표시할 상품 - 검색 중엔 전체, 아니면 페이지 단위 ***/
  const visibleProducts = searchQuery.trim()
    ? filteredProducts
    : filteredProducts.slice(0, displayCount);

  const hasMore = !searchQuery.trim() && displayCount < products.length;

  /*** 다음 배치 로드 ***/
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + BATCH_SIZE, products.length));
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, hasMore, products.length]);

  /*** 하단 센티넬 IntersectionObserver ***/
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "100px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  /*** 검색어 변경 시 표시 개수 초기화 ***/
  useEffect(() => {
    setDisplayCount(BATCH_SIZE);
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-col">

        {/*** 상단 헤더 - 매장명 + 검색바 ***/}
        <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pb-8 pt-6">
          <p className="text-xs font-medium text-white/70">상품 목록</p>
          <h1 className="mt-0.5 text-lg font-bold text-white">{storeName}</h1>

          {/*** 검색 입력창 ***/}
          <div className="relative mt-4">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명으로 검색"
              className="w-full rounded-xl bg-white py-2.5 pl-9 pr-9 text-sm text-[#1A1A1A] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#693B97]/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/*** 상품 개수 표시 ***/}
        <div className="px-4 pb-1 pt-4">
          <p className="text-xs text-zinc-400">
            {searchQuery.trim()
              ? `"${searchQuery}" 검색 결과 ${filteredProducts.length}개`
              : `전체 ${products.length}개`}
          </p>
        </div>

        {/*** 상품 카드 목록 - CartSummary 높이만큼 하단 패딩 확보 ***/}
        <div className="space-y-3 px-4 pb-28">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartQuantities[product.id] || 0}
              onIncrease={(e) => { e.stopPropagation(); handleIncrease(product.id); }}
              onDecrease={(e) => { e.stopPropagation(); handleDecrease(product.id); }}
              onOpenDialog={() => setSelectedProduct(product)}
            />
          ))}

          {/*** 검색 결과 없음 ***/}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PackageSearch size={40} className="text-zinc-200" />
              <p className="mt-3 text-sm font-medium text-zinc-400">검색 결과가 없습니다</p>
              <p className="mt-1 text-xs text-zinc-300">다른 검색어를 입력해보세요</p>
            </div>
          )}

          {/*** 무한 스크롤 센티넬 ***/}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-[#693B97]" />
                  불러오는 중...
                </div>
              )}
            </div>
          )}

          {!hasMore && filteredProducts.length > 0 && !searchQuery && (
            <p className="py-4 text-center text-xs text-zinc-300">모든 상품을 불러왔습니다</p>
          )}
        </div>

      </div>

      {/*** 상품 상세 다이얼로그 ***/}
      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          cartQuantity={cartQuantities[selectedProduct.id] || 0}
          onClose={() => setSelectedProduct(null)}
          onIncrease={() => handleIncrease(selectedProduct.id)}
          onDecrease={() => handleDecrease(selectedProduct.id)}
        />
      )}

      {/*** 장바구니 확인 다이얼로그 ***/}
      {isCartDialogOpen && (
        <CartDialog
          products={products}
          cartQuantities={cartQuantities}
          totalPrice={totalPrice}
          onClose={() => setIsCartDialogOpen(false)}
        />
      )}

      {/*** 하단 고정 장바구니 요약 ***/}
      <CartSummary
        totalKinds={totalKinds}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        onClick={() => setIsCartDialogOpen(true)}
      />
    </>
  );
}
