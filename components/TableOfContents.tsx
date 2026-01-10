"use client";

import { useEffect, useState } from "react";
import Link from "./Link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = document.querySelectorAll("article h2, article h3");
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      const text = heading.textContent || "";
      const level = parseInt(heading.tagName.substring(1));

      if (id && text) {
        items.push({ id, text, level });
      }
    });

    setToc(items);
  }, []);

  if (toc.length === 0) return null;

  return (
    <nav className="mt-12 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">목차</h2>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: `${(item.level - 2) * 1}rem` }}
          >
            <Link
              href={`#${item.id}`}
              className="text-blue-600 hover:underline"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
