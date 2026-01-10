import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const stocksDirectory = path.join(process.cwd(), 'content/stocks');

export interface Stock {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  lightColor: string;
  darkColor: string;
  readingTime: string;
  notionPageId?: string;
}

export function getSortedPropertiesData(): Stock[] {
  if (!fs.existsSync(stocksDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(stocksDirectory);
  const allPropertiesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(stocksDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        content,
        lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
        darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
        readingTime: readingTime(content).text,
        notionPageId: data.notionPageId,
      };
    });

  return allPropertiesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getStockBySlug(slug: string): Stock | null {
  const fullPath = path.join(stocksDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    content,
    lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
    darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
    readingTime: readingTime(content).text,
    notionPageId: data.notionPageId,
  };
}
