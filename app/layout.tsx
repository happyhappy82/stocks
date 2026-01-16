import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-5BVWS36G";
const GA_ID = "G-2H8Y5GG1MZ";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "주식팁가이드",
  description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
  metadataBase: new URL("https://www.stocktipguide.xyz"),
  alternates: {
    canonical: "https://www.stocktipguide.xyz",
  },
  keywords: ["주식 분석", "미국주식", "한국주식", "종목 정보", "투자 가이드"],
  authors: [{ name: "주식팁가이드" }],
  creator: "주식팁가이드",
  publisher: "주식팁가이드",
  openGraph: {
    title: "주식팁가이드",
    description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://www.stocktipguide.xyz",
    siteName: "주식팁가이드",
    images: [
      {
        url: "https://www.stocktipguide.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "주식팁가이드 - 미국주식, 한국주식 투자 가이드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "주식팁가이드",
    description: "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
    images: ["https://www.stocktipguide.xyz/og-image.png"],
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
  verification: {
    google: "f446iPCo2RpFvTyD8LrwBkQ53qsMSBLe0hUZDREv1eU",
    other: {
      "naver-site-verification": ["3230acbe99fde89894436a41913060b525c54d83"],
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
    "url": "https://www.stocktipguide.xyz",
    "description": "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "주식팁가이드",
    "url": "https://www.stocktipguide.xyz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.stocktipguide.xyz/logo.png",
      "width": 180,
      "height": 40,
    },
    "description": "미국,한국주식 시장의 흐름을 전달드립니다. 기업별 종목 정보들을 편리하게 가이드해드립니다.",
  };

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="mx-auto max-w-6xl bg-white px-5 py-12 text-black">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
