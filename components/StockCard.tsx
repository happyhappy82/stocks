import Link from "./Link";

interface StockCardProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  lightColor: string;
  darkColor: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function StockCard({
  title,
  date,
  excerpt,
  slug,
  lightColor,
}: StockCardProps) {
  return (
    <Link
      className="block py-4"
      href={`/${slug}`}
    >
      <article>
        <h2
          className="text-[28px] font-black leading-none mb-2 text-gray-900"
        >
          {title}
        </h2>
        <p className="text-[13px] text-gray-700">{formatDate(date)}</p>
        <p className="mt-1">{excerpt}</p>
      </article>
    </Link>
  );
}
