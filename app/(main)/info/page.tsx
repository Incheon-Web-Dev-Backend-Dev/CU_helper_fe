import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Gift,
  Store,
  ClipboardList,
  Calendar,
  Clock,
  AlertCircle,
  Phone,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "여성용품 지원사업이란? | Withyou",
  description: "2026년 시흥시 여성청소년 생리용품 보편지원 안내",
};

/*** 지원사업 상세 정보 섹션 데이터 ***/
const infoSections = [
  {
    id: "target",
    icon: Users,
    title: "지원 대상",
    color: "bg-violet-50 text-violet-700",
    iconBg: "bg-violet-100",
    content: (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-zinc-700">
          <span className="font-semibold text-[#693B97]">자격기준</span>과{" "}
          <span className="font-semibold text-[#693B97]">연령기준</span>을
          모두 충족하는 여성청소년
        </p>
        <div className="rounded-xl bg-violet-50 px-4 py-3">
          <p className="text-xs text-violet-600">
            포스터 및 시흥시 공식 안내문을 함께 참고하시기 바랍니다.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "benefit",
    icon: Gift,
    title: "지원 내용",
    color: "bg-pink-50 text-pink-700",
    iconBg: "bg-pink-100",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3">
          <span className="text-sm text-zinc-600">월 지원금액</span>
          <span className="text-base font-bold text-[#693B97]">14,000원</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3">
          <span className="text-sm text-zinc-600">연 최대 지원</span>
          <span className="text-base font-bold text-[#693B97]">168,000원</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          생리용품 구입비 지원 —{" "}
          <span className="font-medium text-zinc-700">모바일 시루</span>로 지급
        </p>
      </div>
    ),
  },
  {
    id: "store",
    icon: Store,
    title: "사용처",
    color: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-100",
    content: (
      <div className="flex flex-wrap gap-2">
        {["CU", "GS25", "세븐일레븐"].map((store) => (
          <div
            key={store}
            className="flex-1 min-w-[80px] rounded-xl border border-zinc-100 bg-[#F8F8F8] py-3 text-center"
          >
            <p className="text-sm font-semibold text-zinc-800">{store}</p>
            <p className="text-xs text-zinc-400">관내 편의점</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "apply",
    icon: ClipboardList,
    title: "신청 방법",
    color: "bg-blue-50 text-blue-700",
    iconBg: "bg-blue-100",
    content: (
      <div className="space-y-3">
        <div className="rounded-xl border border-zinc-100 bg-[#F8F8F8] p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#693B97]">
            온라인
          </p>
          <p className="text-sm text-zinc-700">경기민원24</p>
          <a
            href="https://gg24.gg.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-[#693B97] underline underline-offset-2"
          >
            gg24.gg.go.kr <ExternalLink size={11} />
          </a>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-[#F8F8F8] p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#693B97]">
            오프라인
          </p>
          <p className="text-sm text-zinc-700">동행정복지센터 방문</p>
          <p className="mt-1 text-xs text-zinc-500">
            청소년 본인 또는 보호자·주양육자 신청 가능
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "period",
    icon: Calendar,
    title: "신청 기간",
    color: "bg-amber-50 text-amber-700",
    iconBg: "bg-amber-100",
    content: (
      <div className="space-y-3">
        <div className="rounded-xl border border-zinc-100 bg-[#F8F8F8] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#693B97]">
            온라인 신청
          </p>
          <p className="text-sm font-medium text-zinc-800">
            2026. 3. 5.(목) 14:00
          </p>
          <p className="text-sm text-zinc-400">~ 2026. 3. 31.(금) 18:00</p>
          <p className="mt-2 text-xs text-amber-600">
            예산 소진 시 조기 종료
          </p>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-[#F8F8F8] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#693B97]">
            오프라인 신청
          </p>
          <p className="text-sm font-medium text-zinc-800">2026. 3. 4.(수)</p>
          <p className="text-sm text-zinc-400">~ 2026. 11. 13.(화)</p>
          <p className="mt-2 text-xs text-amber-600">
            예산 소진 시 조기 종료
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "expiry",
    icon: Clock,
    title: "사용 기한",
    color: "bg-orange-50 text-orange-700",
    iconBg: "bg-orange-100",
    content: (
      <div className="rounded-xl bg-orange-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-800">
          2026년 12월 31일까지
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          기한 이후 잔액은 자동 소멸됩니다.
        </p>
      </div>
    ),
  },
  {
    id: "caution",
    icon: AlertCircle,
    title: "주의사항",
    color: "bg-red-50 text-red-700",
    iconBg: "bg-red-100",
    content: (
      <ul className="space-y-2">
        {[
          "이전에 신청하셨던 분들도 올해 새로 신청하셔야 합니다.",
          "예산 소진 시 온·오프라인 신청기간 무관하게 조기 종료됩니다 (선착순 마감).",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            <p className="text-sm leading-relaxed text-zinc-700">{item}</p>
          </li>
        ))}
      </ul>
    ),
  },
];

/*** 여성용품 지원사업 안내 페이지 ***/
export default function InfoPage() {
  return (
    <div className="pb-10">

      {/*** 상단 헤더 배너 ***/}
      <div className="bg-gradient-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft size={14} />
          홈으로
        </Link>
        <h1 className="text-lg font-bold leading-snug text-white">
          2026년 시흥시<br />여성청소년 생리용품<br />보편지원 안내
        </h1>
      </div>

      {/*** 정보 카드 목록 ***/}
      <div className="px-4 -mt-4 space-y-3">
        {infoSections.map(({ id, icon: Icon, title, iconBg, content }) => (
          <div
            key={id}
            className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
              >
                <Icon size={16} className="text-[#693B97]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">{title}</h2>
            </div>
            {content}
          </div>
        ))}

        {/*** 문의처 카드 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
              <Phone size={16} className="text-[#693B97]" />
            </div>
            <h2 className="text-sm font-semibold text-[#1A1A1A]">문의처</h2>
          </div>
          <div className="flex gap-2">
            {["031-310-3198", "031-310-3613"].map((tel) => (
              <a
                key={tel}
                href={`tel:${tel.replace(/-/g, "")}`}
                className="flex-1 rounded-xl border border-[#693B97]/30 bg-[#693B97]/5 py-3 text-center transition-colors hover:bg-[#693B97]/10"
              >
                <p className="text-sm font-semibold text-[#693B97]">{tel}</p>
              </a>
            ))}
          </div>
        </div>

        {/*** 출처 표기 ***/}
        <p className="text-center text-xs text-zinc-400 pb-2">
          출처: 시흥시 초등돌봄서비스 공식 공지사항
        </p>
      </div>
    </div>
  );
}
