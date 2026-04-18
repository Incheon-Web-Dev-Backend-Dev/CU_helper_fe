import type { Metadata } from "next";
import { Zap, Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "CU Helper",
  description: "Your helpful companion",
};

const features = [
  {
    icon: Zap,
    title: "빠른 속도",
    desc: "어떤 기기에서도 최적화된 성능을 제공합니다.",
  },
  {
    icon: Shield,
    title: "안정성",
    desc: "일관성과 안정성을 최우선으로 설계되었습니다.",
  },
  {
    icon: Sparkles,
    title: "심플한 UX",
    desc: "직관적이고 깔끔한 UI로 누구나 쉽게 사용할 수 있습니다.",
  },
];

/*** 메인 홈 페이지 ***/
export default function HomePage() {
  return (
    <div className="px-5 py-8">

      {/*** 히어로 섹션 ***/}
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#693B97]/10 px-3 py-1">
          <span className="text-xs font-medium text-[#693B97]">CU Helper</span>
        </div>
        <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
          더 스마트하게,<br />더 편리하게
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-[#6B7280]">
          일상의 모든 순간을 도와주는 나만의 동반자.<br />
          지금 바로 시작해 보세요.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="#features"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#693B97] text-sm font-medium text-white transition-all duration-200 hover:bg-[#4E2C72] active:scale-95"
          >
            시작하기
          </a>
          <a
            href="#about"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-[#F8F8F8] active:scale-95"
          >
            더 알아보기
          </a>
        </div>
      </section>

      {/*** 기능 섹션 ***/}
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

      {/*** 소개 섹션 ***/}
      <section id="about" className="rounded-2xl bg-[#693B97]/5 p-5">
        <h2 className="mb-2 text-base font-semibold text-[#1A1A1A]">
          서비스 소개
        </h2>
        <p className="text-sm leading-relaxed text-[#6B7280]">
          CU Helper는 여러분의 일상을 더욱 편리하게 만들기 위해 설계되었습니다.
          개인정보 보호, 투명성, 최고의 사용자 경험 제공을 최우선으로 생각합니다.
        </p>
      </section>

    </div>
  );
}
