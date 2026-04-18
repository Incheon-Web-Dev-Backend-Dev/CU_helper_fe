import Link from "next/link";

/*** 푸터 컴포넌트 ***/
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-100 bg-[#F8F8F8]">
      <div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
        <p className="text-xs text-zinc-400">
          © {year} CU Helper. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/privacy"
            className="text-xs text-zinc-400 transition-colors hover:text-[#693B97]"
          >
            개인정보 처리방침
          </Link>
          <Link
            href="/terms"
            className="text-xs text-zinc-400 transition-colors hover:text-[#693B97]"
          >
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
