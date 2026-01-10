import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "주식리뷰Lab",
  description: "국내외 주식 종목 분석 및 투자 정보 및 투자 가이드를 제공하는 사이트입니다.",
  metadataBase: new URL("https://stockreviewlab.xyz"),
  keywords: ["주식 분석", "아파트 리뷰", "오피스텔 추천", "부동산 투자", "매물 정보"],
  authors: [{ name: "StockReviewLab" }],
  creator: "StockReviewLab",
  publisher: "StockReviewLab",
  openGraph: {
    title: "주식리뷰Lab",
    description: "국내외 주식 종목 분석 및 투자 정보 및 투자 가이드를 제공하는 사이트입니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://stockreviewlab.xyz",
    siteName: "주식리뷰Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "주식리뷰Lab",
    description: "국내외 주식 종목 분석 및 투자 정보 및 투자 가이드를 제공하는 사이트입니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "주식리뷰Lab",
    "alternateName": "StockReviewLab",
    "url": "https://stockreviewlab.xyz",
    "description": "국내외 주식 종목 분석 및 투자 정보 및 투자 가이드를 제공하는 사이트입니다.",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="mx-auto max-w-2xl bg-white px-5 py-12 text-black">
        {children}
      </body>
    </html>
  );
}
