"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, PlusCircle, RefreshCw } from "lucide-react";
import { getAllProducts, ProductDto } from "@/lib/api/productApi";

/*** 숫자 → 원화 포맷 ***/
function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

/*** 상품 전체 조회 페이지 ***/
export default function ProductListPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*** 상품 목록 불러오기 ***/
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      setError("상품 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /*** 컴포넌트 마운트 시 상품 목록 조회 ***/
  useEffect(() => {
    fetchProducts();
  }, []);

  /*** 전체 선택/해제 핸들러 ***/
  const handleCheckAll = (checked: boolean) => {
    setCheckedIds(checked ? new Set(products.map((p) => p.id)) : new Set());
  };

  /*** 개별 체크박스 핸들러 ***/
  const handleCheck = (id: number, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const isAllChecked = products.length > 0 && checkedIds.size === products.length;
  const isIndeterminate = checkedIds.size > 0 && checkedIds.size < products.length;

  return (
    <div className="pb-10">

      {/*** 상단 헤더 ***/}
      <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft size={14} />
          관리자 홈
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">상품 조회</h1>
            <p className="mt-1 text-xs text-white/70">전체 {products.length}개</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/30"
          >
            <PlusCircle size={13} />
            상품 등록
          </Link>
        </div>
      </div>

      <div className="px-4 -mt-6">

        {/*** 로딩 상태 ***/}
        {isLoading && (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-100 bg-white shadow-sm">
            <RefreshCw size={20} className="animate-spin text-[#693B97]" />
          </div>
        )}

        {/*** 에러 상태 ***/}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="mb-3 text-sm text-red-500">{error}</p>
            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
            >
              다시 시도
            </button>
          </div>
        )}

        {/*** 빈 목록 ***/}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-100 bg-white shadow-sm">
            <p className="text-sm text-zinc-400">등록된 상품이 없습니다.</p>
            <Link
              href="/admin/products/new"
              className="rounded-full bg-[#693B97] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4E2C72]"
            >
              상품 등록하기
            </Link>
          </div>
        )}

        {/*** 상품 테이블 ***/}
        {!isLoading && !error && products.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">

            {/*** 선택 상태 표시 바 ***/}
            {checkedIds.size > 0 && (
              <div className="flex items-center justify-between border-b border-zinc-100 bg-[#693B97]/5 px-4 py-2.5">
                <span className="text-xs font-medium text-[#693B97]">
                  {checkedIds.size}개 선택됨
                </span>
              </div>
            )}

            {/*** 테이블 헤더 ***/}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px] text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-[#F8F8F8]">
                    <th className="w-10 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isAllChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleCheckAll(e.target.checked)}
                        className="h-3.5 w-3.5 cursor-pointer accent-[#693B97]"
                      />
                    </th>
                    <th className="w-10 px-2 py-3 text-center font-semibold text-zinc-500">순번</th>
                    <th className="px-3 py-3 text-left font-semibold text-zinc-500">바코드</th>
                    <th className="px-3 py-3 text-left font-semibold text-zinc-500">상품명</th>
                    <th className="px-3 py-3 text-right font-semibold text-zinc-500">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-zinc-50 last:border-0 transition-colors ${
                        checkedIds.has(product.id) ? "bg-[#693B97]/5" : "hover:bg-[#F8F8F8]"
                      }`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={checkedIds.has(product.id)}
                          onChange={(e) => handleCheck(product.id, e.target.checked)}
                          className="h-3.5 w-3.5 cursor-pointer accent-[#693B97]"
                        />
                      </td>
                      <td className="px-2 py-3 text-center text-zinc-400">{index + 1}</td>
                      <td className="px-3 py-3 font-mono text-zinc-600">{product.barcode}</td>
                      <td className="px-3 py-3 font-medium text-[#1A1A1A]">{product.name}</td>
                      <td className="px-3 py-3 text-right text-zinc-600">{formatPrice(product.consumerPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
