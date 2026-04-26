import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CU Helper",
    template: "%s | CU Helper",
  },
  description: "Your helpful companion",
};

/*** 루트 레이아웃 - 라이트 모드 고정 ***/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`} style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className="h-full bg-white text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
