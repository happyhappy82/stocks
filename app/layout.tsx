import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "주식팁가이드",
  description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
  metadataBase: new URL("https://stockreviewlab.xyz"),
  keywords: ["주식 분석", "미국주식", "한국주식", "종목 정보", "투자 가이드"],
  authors: [{ name: "주식팁가이드" }],
  creator: "주식팁가이드",
  publisher: "주식팁가이드",
  openGraph: {
    title: "주식팁가이드",
    description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://stockreviewlab.xyz",
    siteName: "주식팁가이드",
  },
  twitter: {
    card: "summary_large_image",
    title: "주식팁가이드",
    description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
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
    "name": "주식팁가이드",
    "alternateName": "StockTipGuide",
    "url": "https://stockreviewlab.xyz",
    "description": "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="mx-auto max-w-6xl bg-white px-5 py-12 text-black">
        {children}
      </body>
    </html>
  );
}
