import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, ShoppingBag, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Withyou",
  description: "여성청소년 생리용품 지원사업 안내 서비스",
};

/*** 메인 페이지 기능 카드 목록 ***/
const features = [
  {
    icon: HeartHandshake,
    title: "지원사업 안내",
    desc: "시흥시 여성청소년 생리용품 보편지원 사업 내용을 확인하세요.",
  },
  {
    icon: ShoppingBag,
    title: "편의점 사용 가능",
    desc: "CU, GS25, 세븐일레븐에서 모바일 시루로 바로 사용할 수 있습니다.",
  },
  {
    icon: Bell,
    title: "신청 알림",
    desc: "신청 기간 및 예산 소진 전 알림을 받아보세요.",
  },
];

/*** 메인 홈 페이지 ***/
export default function HomePage() {
  return (
    <div className="px-5 py-8">

      {/*** 히어로 섹션 ***/}
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#693B97]/10 px-3 py-1">
          <span className="text-xs font-medium text-[#693B97]">Withyou</span>
        </div>
        <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
          당신 곁에서,<br />함께합니다
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-[#6B7280]">
          시흥시 여성청소년 생리용품 지원사업을<br />
          쉽고 빠르게 확인하고 신청하세요.
        </p>
        <div className="flex flex-col gap-3">
          {/*** 시작하기 버튼 - select 페이지로 이동 ***/}
          <Link
            href="/select"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#693B97] text-sm font-medium text-white transition-all duration-200 hover:bg-[#4E2C72] active:scale-95"
          >
            시작하기
          </Link>
          <a
            href="#features"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-[#F8F8F8] active:scale-95"
          >
            더 알아보기
          </a>
        </div>
      </section>

      {/*** 기능 카드 섹션 ***/}
      <section id="features" className="mb-10">
        <h2 className="mb-4 text-base font-semibold text-[#1A1A1A]">
          주요 기능
        </h2>
        <div className="flex flex-col gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-zinc-100 bg-[#F8F8F8] p-4 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#693B97]/10">
                <Icon size={18} className="text-[#693B97]" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-[#1A1A1A]">{title}</h3>
                <p className="text-xs leading-relaxed text-[#6B7280]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*** 서비스 소개 섹션 ***/}
      <section id="about" className="rounded-2xl bg-[#693B97]/5 p-5">
        <h2 className="mb-2 text-base font-semibold text-[#1A1A1A]">
          서비스 소개
        </h2>
        <p className="text-sm leading-relaxed text-[#6B7280]">
          Withyou는 여성청소년 생리용품 지원사업 정보를 쉽게 접근할 수 있도록
          도와주는 서비스입니다. 신청 방법부터 사용처까지 한눈에 확인하세요.
        </p>
      </section>

    </div>
  );
}
