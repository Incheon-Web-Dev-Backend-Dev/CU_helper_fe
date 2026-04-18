import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | CU Helper",
  description: "CU Helper 서비스 이용을 위한 약관 및 조건을 확인해 보세요.",
};

export default function TermsPage() {
  return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
          이용약관
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">마지막 업데이트: 2026년 4월 18일</p>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-base">
          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              1. 약관의 승인
            </h2>
            <p>
              CU Helper에 접속하거나 서비스를 이용함으로써 귀하는 본 이용약관을 준수할 것에 동의하게 됩니다.
              본 약관에 동의하지 않으실 경우 서비스 이용을 중단해 주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              2. 서비스 이용
            </h2>
            <p>
              귀하는 적법한 목적 내에서 본 약관을 준수하여 CU Helper를 이용하는 데 동의합니다.
              서비스를 오용하거나 승인되지 않은 방법으로 접근을 시도해서는 안 됩니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              3. 계정 관리
            </h2>
            <p>
              귀하는 본인 계정 정보의 비밀을 유지할 책임이 있으며, 해당 계정에서 발생하는 모든 활동에 대한
              책임을 집니다. 무단 사용이 의심되는 경우 즉시 당사에 알려주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              4. 지식재산권
            </h2>
            <p>
              CU Helper의 모든 콘텐츠, 기능 및 서비스는 당사의 소유이며 관련 지식재산권법의 보호를 받습니다.
              사전 허가 없이 콘텐츠를 복제, 수정 또는 배포할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              5. 보증의 부인
            </h2>
            <p>
              CU Helper는 "있는 그대로" 제공되며, 어떠한 종류의 명시적 또는 묵시적 보증도 제공하지 않습니다.
              당사는 서비스가 중단 없이 운영되거나, 오류가 없음을 보장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              6. 책임의 제한
            </h2>
            <p>
              관련 법령이 허용하는 최대 범위 내에서, CU Helper는 서비스 이용으로 인해 발생하는 간접적,
              부수적 또는 결과적 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              7. 약관의 변경
            </h2>
            <p>
              당사는 언제든지 본 약관을 업데이트할 권리를 보유합니다. 약관 변경 후에도 서비스를
              계속 이용하는 것은 새로운 약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
              8. 문의처
            </h2>
            <p>
              본 약관에 대해 궁금한 점이 있으신가요? 다음 이메일로 문의해 주시기 바랍니다:{" "}
              <a
                  href="mailto:legal@cuhelper.com"
                  className="text-zinc-900 underline underline-offset-2 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
              >
                legal@cuhelper.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
  );
}