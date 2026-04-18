import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "CU Helper가 사용자의 데이터를 수집, 이용 및 보호하는 방법에 대해 안내해 드립니다.",
};

const sections = [
  {
    title: "1. 수집하는 정보",
    content:
      "귀하가 계정을 생성하거나 서비스를 이용하고, 고객 지원을 위해 당사에 연락할 때 직접 제공하는 정보를 수집합니다. 이에는 이름, 이메일 주소 및 서비스 이용 기록 등이 포함될 수 있습니다.",
  },
  {
    title: "2. 정보 활용 방법",
    content:
      "수집된 정보는 서비스 제공, 유지 및 개선, 사용자 소통, 그리고 법적 의무 준수를 위해 사용됩니다.",
  },
  {
    title: "3. 정보의 공유",
    content:
      "당사는 귀하의 개인정보를 제3자에게 판매하지 않습니다. 다만, 비밀 유지 계약을 체결한 서비스 제공업체가 플랫폼 운영을 지원하는 경우에 한해 정보를 공유할 수 있습니다.",
  },
  {
    title: "4. 쿠키(Cookies)",
    content:
      "사용자 경험을 개선하기 위해 쿠키 및 유사한 추적 기술을 사용합니다. 브라우저 설정에서 쿠키를 비활성화할 수 있으나, 이 경우 서비스의 일부 기능이 정상적으로 작동하지 않을 수 있습니다.",
  },
  {
    title: "6. 방침의 변경",
    content:
      "본 개인정보 처리방침은 수시로 업데이트될 수 있습니다. 중요한 변경 사항이 있을 경우, 본 페이지에 업데이트된 날짜와 함께 게시하여 알려드립니다.",
  },
];

/*** 개인정보 처리방침 페이지 ***/
export default function PrivacyPage() {
  return (
    <div className="px-5 py-8">

      {/*** 페이지 헤더 ***/}
      <div className="mb-6 border-b border-zinc-100 pb-5">
        <h1 className="mb-1 text-xl font-bold text-[#1A1A1A]">
          개인정보 처리방침
        </h1>
        <p className="text-xs text-[#6B7280]">마지막 업데이트: 2026년 4월 18일</p>
      </div>

      {/*** 섹션 목록 ***/}
      <div className="space-y-5">
        {sections.map(({ title, content }) => (
          <section key={title} className="rounded-2xl border border-zinc-100 bg-[#F8F8F8] p-4">
            <h2 className="mb-2 text-sm font-semibold text-[#693B97]">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-[#6B7280]">{content}</p>
          </section>
        ))}

        {/*** 사용자 권리 섹션 (이메일 링크 포함) ***/}
        <section className="rounded-2xl border border-zinc-100 bg-[#F8F8F8] p-4">
          <h2 className="mb-2 text-sm font-semibold text-[#693B97]">
            5. 사용자의 권리
          </h2>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            귀하는 언제든지 자신의 개인정보를 조회, 수정 또는 삭제할 권리가 있습니다.
            관련 요청은{" "}
            <a
              href="mailto:privacy@cuhelper.com"
              className="font-medium text-[#693B97] underline underline-offset-2 transition-colors hover:text-[#4E2C72]"
            >
              privacy@cuhelper.com
            </a>
            으로 문의해 주시기 바랍니다.
          </p>
        </section>
      </div>

    </div>
  );
}
