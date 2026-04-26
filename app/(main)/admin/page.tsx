"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ClipboardList,
  Package,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Search,
} from "lucide-react";

/*** 상품 관리 서브메뉴 ***/
const productSubMenus = [
  {
    href: "/admin/products/new",
    icon: PlusCircle,
    label: "상품 등록",
  },
  {
    href: "/admin/products",
    icon: Search,
    label: "상품 조회",
  },
];

/*** 관리자 메인 페이지 ***/
export default function AdminPage() {
  const [productOpen, setProductOpen] = useState(false);

  return (
    <div className="pb-10">

      {/*** 상단 헤더 ***/}
      <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft size={14} />
          홈으로
        </Link>
        <h1 className="text-lg font-bold text-white">관리자 페이지</h1>
        <p className="mt-1 text-xs text-white/70">
          관리할 항목을 선택하세요.
        </p>
      </div>

      <div className="px-4 -mt-6 space-y-3">

        {/*** 주문 관리 카드 ***/}
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-colors hover:bg-[#F8F8F8] active:bg-[#693B97]/5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#693B97]/10">
            <ClipboardList size={20} className="text-[#693B97]" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-[#1A1A1A]">주문 관리</p>
            <p className="mt-0.5 text-xs text-zinc-400">접수된 주문 내역을 확인하고 처리하세요.</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-zinc-300" />
        </Link>

        {/*** 상품 관리 카드 - 토글 드롭다운 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">

          {/*** 상품 관리 토글 버튼 ***/}
          <button
            type="button"
            onClick={() => setProductOpen((prev) => !prev)}
            className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#F8F8F8] active:bg-[#693B97]/5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#693B97]/10">
              <Package size={20} className="text-[#693B97]" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-[#1A1A1A]">상품 관리</p>
              <p className="mt-0.5 text-xs text-zinc-400">상품 목록 조회 및 재고를 관리하세요.</p>
            </div>
            <ChevronDown
              size={18}
              className={`shrink-0 text-zinc-300 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/*** 서브메뉴 드롭다운 ***/}
          {productOpen && (
            <div className="border-t border-zinc-100">
              {productSubMenus.map(({ href, icon: Icon, label }, idx) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#F8F8F8] active:bg-[#693B97]/5 ${
                    idx < productSubMenus.length - 1 ? "border-b border-zinc-50" : ""
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#693B97]/10">
                    <Icon size={14} className="text-[#693B97]" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{label}</span>
                  <ChevronRight size={14} className="ml-auto shrink-0 text-zinc-300" />
                </Link>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
