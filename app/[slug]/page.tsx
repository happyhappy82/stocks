import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";
import QnA from "@/components/QnA";
import { getStockBySlug, getSortedPropertiesData } from "@/lib/stocks";
import { extractQnA, removeQnASection } from "@/lib/qna-utils";
import type { Metadata } from "next";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stocks = getSortedPropertiesData();
  return stocks.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getStockBySlug(slug);

  if (!property) {
    return {
      title: "Not Found",
    };
  }

  const url = `https://stockreviewlab.xyz/${slug}`;

  return {
    title: property.title,
    description: property.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: property.title,
      description: property.excerpt,
      url: url,
      siteName: "주식팁가이드",
      locale: "ko_KR",
      type: "article",
      publishedTime: property.date,
      modifiedTime: property.date,
      authors: ["주식팁가이드"],
      images: [
        {
          url: "https://stockreviewlab.xyz/og-image.png",
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.excerpt,
      images: ["https://stockreviewlab.xyz/og-image.png"],
    },
  };
}

export default async function StockPage({ params }: Props) {
  const { slug } = await params;
  const property = getStockBySlug(slug);

  if (!property) {
    notFound();
  }

  const qnaItems = extractQnA(property.content);
  const contentWithoutQnA = removeQnASection(property.content);

  const articleUrl = `https://stockreviewlab.xyz/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: property.title,
    description: property.excerpt,
    image: "https://stockreviewlab.xyz/og-image.png",
    author: {
      "@type": "Organization",
      name: "주식팁가이드",
      url: "https://stockreviewlab.xyz",
    },
    publisher: {
      "@type": "Organization",
      name: "주식팁가이드",
      logo: {
        "@type": "ImageObject",
        url: "https://stockreviewlab.xyz/logo.png",
        width: 180,
        height: 40,
      },
    },
    datePublished: property.date,
    dateModified: property.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://stockreviewlab.xyz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: property.title,
        item: articleUrl,
      },
    ],
  };

  const faqSchema = qnaItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qnaItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="relative flex-1 min-w-0">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}

          <div className="mb-8">
            <h1
              className="text-[42px] font-black leading-tight mb-4"
              style={{ color: property.lightColor }}
            >
              {property.title}
            </h1>
            <div className="flex gap-4 text-sm text-gray-600">
              <time dateTime={property.date}>{formatDate(property.date)}</time>
              <span>{property.readingTime}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return <h2 id={id} {...props} />;
                },
                h3: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return <h3 id={id} {...props} />;
                },
              }}
            >
              {contentWithoutQnA}
            </ReactMarkdown>
          </div>

          <QnA items={qnaItems} />
        </article>

        <aside className="hidden lg:block w-64 flex-shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </>
  );
}
