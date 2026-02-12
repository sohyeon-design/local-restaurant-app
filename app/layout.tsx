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
  title: "나랑가 | 현지인 맛집 기록 앱",
  description:
    "현지인만 아는 진짜 맛집을 기록하고 공유하세요. 나랑가에서 나만의 맛집 리스트를 만들어보세요. 회원가입, 맛집 관리, 즐겨찾기, 검색 기능을 제공합니다.",
  keywords: ["나랑가", "맛집", "맛집 기록", "맛집 앱", "맛집 관리", "맛집 추천", "서울 맛집", "현지인 맛집"],
  authors: [{ name: "sohyeon-design", url: "https://github.com/sohyeon-design" }],
  creator: "sohyeon-design",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://local-restaurant-app.vercel.app",
    title: "나랑가 | 현지인 맛집 기록 앱",
    description: "현지인만 아는 진짜 맛집을 기록하고 공유하세요. 나랑가에서 나만의 맛집 리스트를 만들어보세요.",
    siteName: "나랑가",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "나랑가 - 현지인 맛집 기록 앱",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "나랑가 | 현지인 맛집 기록 앱",
    description: "현지인만 아는 진짜 맛집을 기록하고 공유하세요. 나랑가에서 나만의 맛집 리스트를 만들어보세요.",
    images: ["/opengraph-image.png"],
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
