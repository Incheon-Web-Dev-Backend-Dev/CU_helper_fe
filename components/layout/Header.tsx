"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ShieldCheck, HeartHandshake } from "lucide-react";

/*** 햄버거 메뉴 항목 정의 ***/
const navLinks = [
  {
    href: "/select",
    label: "사용자",
    icon: User,
    desc: "서비스 이용 안내",
  },
  {
    href: "/admin",
    label: "관리자",
    icon: ShieldCheck,
    desc: "관리자 전용 페이지",
  },
  {
    href: "/info",
    label: "여성용품 지원사업이란?",
    icon: HeartHandshake,
    desc: "시흥시 생리용품 보편지원 안내",
  },
];

/*** 헤더 컴포넌트 - 모바일 햄버거 메뉴 포함 ***/
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-[#693B97]"
        >
          Withyou
        </Link>

        {/*** 햄버거 토글 버튼 ***/}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-[#F8F8F8] hover:text-[#693B97]"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/*** 모바일 드롭다운 메뉴 - absolute 오버레이로 페이지 밀림 방지 ***/}
      {menuOpen && (
        <>
          {/*** 배경 클릭 시 메뉴 닫기 ***/}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-0 right-0 z-50 border-t border-zinc-100 bg-white shadow-lg">
            {navLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#F8F8F8] border-b border-zinc-50 last:border-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#693B97]/10">
                  <Icon size={16} className="text-[#693B97]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{label}</p>
                  <p className="text-xs text-zinc-400">{desc}</p>
                </div>
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
