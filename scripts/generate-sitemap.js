const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://stockreviewlab.xyz';
const stocksDirectory = path.join(process.cwd(), 'src/content');
const publicDirectory = path.join(process.cwd(), 'public');

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString();
}

function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');

  const urls = [];

  // 메인 페이지
  urls.push({
    loc: SITE_URL,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '1.0',
  });

  // 글 페이지들
  if (fs.existsSync(stocksDirectory)) {
    const fileNames = fs.readdirSync(stocksDirectory);

    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .forEach((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(stocksDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        urls.push({
          loc: `${SITE_URL}/${encodeURIComponent(slug)}`,
          lastmod: data.date ? formatDate(data.date) : new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
