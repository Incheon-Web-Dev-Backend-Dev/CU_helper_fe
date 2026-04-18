"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
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
          CU Helper
        </Link>

        {/* 햄버거 버튼 */}
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

      {/*** 모바일 드롭다운 - absolute 오버레이로 페이지 밀림 방지 ***/}
      {menuOpen && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-0 right-0 z-50 border-t border-zinc-100 bg-white shadow-md">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-[#F8F8F8] hover:text-[#693B97]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
