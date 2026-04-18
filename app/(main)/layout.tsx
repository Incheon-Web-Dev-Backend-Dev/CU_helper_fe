import { Header, Footer } from "@/components/layout";

/*** 메인 레이아웃 - 모바일 중점 반응형 (max 430px) ***/
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-107.5 min-h-screen relative flex flex-col shadow-sm">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
