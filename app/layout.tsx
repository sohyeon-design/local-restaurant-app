import React from "react"
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/lib/auth/context";

import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "로컬 맛집 앱 | 나만의 맛집 기록 서비스",
  description:
    "나만의 맛집을 기록하고 공유하세요. 회원가입, 맛집 관리(CRUD), 즐겨찾기, 검색 기능을 제공하는 귀여운 맛집 앱입니다.",
  keywords: ["맛집", "맛집 기록", "맛집 앱", "맛집 관리", "맛집 추천", "서울 맛집"],
  authors: [{ name: "sohyeon-design", url: "https://github.com/sohyeon-design" }],
  creator: "sohyeon-design",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://local-restaurant-app.vercel.app",
    title: "로컬 맛집 앱 | 나만의 맛집 기록 서비스",
    description: "나만의 맛집을 기록하고 공유하세요. 회원가입, 맛집 관리(CRUD), 즐겨찾기, 검색 기능을 제공하는 귀여운 맛집 앱입니다.",
    siteName: "로컬 맛집 앱",
  },
  twitter: {
    card: "summary_large_image",
    title: "로컬 맛집 앱 | 나만의 맛집 기록 서비스",
    description: "나만의 맛집을 기록하고 공유하세요. 회원가입, 맛집 관리(CRUD), 즐겨찾기, 검색 기능을 제공하는 귀여운 맛집 앱입니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#e07830",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
