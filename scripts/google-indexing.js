const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = process.env.SITE_URL || 'https://stockreviewlab.xyz';

// sitemap.xml 생성
function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');

  const stocksDirectory = path.join(process.cwd(), 'src/content');
  const publicDirectory = path.join(process.cwd(), 'public');
  const urls = [];

  urls.push({
    loc: SITE_URL,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: '1.0',
  });

  if (fs.existsSync(stocksDirectory)) {
    const fileNames = fs.readdirSync(stocksDirectory);

    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .forEach((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(stocksDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        const date = data.date ? new Date(data.date).toISOString() : new Date().toISOString();

        urls.push({
          loc: `${SITE_URL}/${encodeURIComponent(slug)}`,
          lastmod: date,
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

// Google Indexing API로 URL 제출
async function submitToGoogle() {
  try {
    const publishedSlug = process.env.PUBLISHED_SLUG;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
      console.log('⚠️  Missing GOOGLE_SERVICE_ACCOUNT_JSON');
      return;
    }

    const credentials = JSON.parse(serviceAccountJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient });

    // 특정 슬러그가 있으면 해당 URL만 제출
    if (publishedSlug) {
      const fullUrl = `${SITE_URL}/${encodeURIComponent(publishedSlug)}`;
      console.log(`🔍 Submitting URL to Google: ${fullUrl}`);

      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: fullUrl,
          type: 'URL_UPDATED',
        },
      });

      console.log('✅ Successfully submitted to Google Search Console');
      console.log(`📊 Status: ${response.status}`);
      console.log(`📌 URL: ${response.data.urlNotificationMetadata?.url}`);
    }

    // 메인 페이지도 제출
    console.log(`🔍 Submitting main page to Google: ${SITE_URL}`);
    await indexing.urlNotifications.publish({
      requestBody: {
        url: SITE_URL,
        type: 'URL_UPDATED',
      },
    });
    console.log('✅ Main page submitted');

  } catch (error) {
    console.error('❌ Failed to submit to Google:', error.message);
    console.log('ℹ️  Continuing despite indexing error...');
  }
}

async function main() {
  // 1. sitemap.xml 생성
  generateSitemap();

  // 2. Google Indexing API로 제출
  await submitToGoogle();
}

main();
