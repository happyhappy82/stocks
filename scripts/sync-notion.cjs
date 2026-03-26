const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const matter = require('gray-matter');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const STOCKS_DIR = path.join(process.cwd(), 'src/content');
const IMAGES_DIR = path.join(process.cwd(), 'public/notion-images');

if (!fs.existsSync(STOCKS_DIR)) {
  fs.mkdirSync(STOCKS_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function getPageProperties(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const properties = page.properties;

  console.log('   Available properties:', Object.keys(properties).join(', '));

  let status = '';
  for (const key of Object.keys(properties)) {
    if (key.toLowerCase().includes('status')) {
      status = properties[key]?.status?.name || properties[key]?.select?.name || '';
      if (status) {
        console.log(`   Found status in property '${key}': ${status}`);
        break;
      }
    }
  }

  const getFullText = (textArray) => {
    if (!textArray || !Array.isArray(textArray)) return '';
    return textArray.map(item => item.plain_text || '').join('');
  };

  return {
    pageId: page.id,
    title: getFullText(properties.Title?.title) || '',
    date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
    excerpt: getFullText(properties.Excerpt?.rich_text) || '',
    lightColor: getFullText(properties.LightColor?.rich_text) || 'lab(62.926 59.277 -1.573)',
    darkColor: getFullText(properties.DarkColor?.rich_text) || 'lab(80.993 32.329 -7.093)',
    status: status,
  };
}

function findExistingFileByPageId(pageId) {
  const files = fs.readdirSync(STOCKS_DIR).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(STOCKS_DIR, file);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      if (data.notionPageId === pageId) {
        return {
          exists: true,
          filePath: filePath,
          fileName: file,
          slug: file.replace('.md', '')
        };
      }
    } catch (err) {
      console.warn(`  ⚠️ Failed to parse ${file}, skipping: ${err.message}`);
    }
  }

  return { exists: false };
}

function deleteStockFile(slug) {
  const filePath = path.join(STOCKS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  🗑️  Deleted: ${slug}.md`);
    return true;
  }
  return false;
}

async function processPage(pageId, isNew = false) {
  const props = await getPageProperties(pageId);

  if (!props.title) {
    console.log(`⚠️  Skipping page ${pageId}: No title`);
    return null;
  }

  const slug = generateSlug(props.title);
  console.log(`\\n📝 Processing: ${props.title} (${slug})`);
  console.log(`   Status: ${props.status}, Date: ${props.date}`);

  const existingFile = findExistingFileByPageId(pageId);
  if (existingFile.exists && existingFile.slug !== slug) {
    console.log(`  🔄 Title changed, removing old file: ${existingFile.fileName}`);
    fs.unlinkSync(existingFile.filePath);
  }

  const mdblocks = await n2m.pageToMarkdown(pageId);
  let markdown = n2m.toMarkdownString(mdblocks).parent;

  // 본문에서 excerpt 자동 생성 (마크다운 문법 제거 후 첫 150자)
  const plainText = markdown
    .replace(/^#+\s+/gm, '')  // 헤딩 제거
    .replace(/!\[.*?\]\(.*?\)/g, '')  // 이미지 제거
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')  // 링크 텍스트만 유지
    .replace(/[*_~`]/g, '')  // 마크다운 문법 제거
    .replace(/\n+/g, ' ')  // 줄바꿈을 공백으로
    .trim();
  const autoExcerpt = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');

  const imageMatches = markdown.match(/!\[.*?\]\((https?:\/\/.*?)\)/g);
  if (imageMatches) {
    for (const match of imageMatches) {
      const urlMatch = match.match(/\((https?:\/\/.*?)\)/);
      if (urlMatch) {
        const imageUrl = urlMatch[1];
        const imageFilename = `${slug}-${Date.now()}-${path.basename(new URL(imageUrl).pathname)}`;
        const imagePath = path.join(IMAGES_DIR, imageFilename);

        try {
          await downloadImage(imageUrl, imagePath);
          markdown = markdown.replace(imageUrl, `/notion-images/${imageFilename}`);
          console.log(`  📷 Downloaded image: ${imageFilename}`);
        } catch (error) {
          console.error(`  ❌ Failed to download image: ${error.message}`);
        }
      }
    }
  }

  // excerpt가 없으면 autoExcerpt 사용
  const finalExcerpt = props.excerpt || autoExcerpt;

  // YAML frontmatter 값에서 큰따옴표 이스케이프
  const escYaml = (str) => str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const frontmatter = `---
title: "${escYaml(props.title)}"
date: "${props.date}"
excerpt: "${escYaml(finalExcerpt)}"
lightColor: "${escYaml(props.lightColor)}"
darkColor: "${escYaml(props.darkColor)}"
notionPageId: "${props.pageId}"
---

`;

  const fullContent = frontmatter + markdown;
  const filePath = path.join(STOCKS_DIR, `${slug}.md`);

  fs.writeFileSync(filePath, fullContent, 'utf-8');

  if (isNew) {
    console.log(`  ✅ Published: ${slug}.md`);
  } else {
    console.log(`  ✅ Updated: ${slug}.md`);
  }

  return slug;
}

async function scheduledSync() {
  console.log('📅 Running scheduled sync...');

  const databaseId = process.env.NOTION_DATABASE_ID;
  const now = new Date().toISOString();

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Status',
          status: {
            equals: 'Published',
          },
        },
        {
          property: 'Date',
          date: {
            before: now,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  console.log(`📚 Found ${response.results.length} published stocks (date < now)`);

  let newPublishedSlugs = [];

  for (const page of response.results) {
    const pageId = page.id;
    const props = await getPageProperties(pageId);

    if (!props.title) continue;

    const slug = generateSlug(props.title);
    const existingFile = findExistingFileByPageId(pageId);

    if (!existingFile.exists) {
      console.log(`\\n✨ New property detected: ${slug}`);
      const publishedSlug = await processPage(pageId, true);
      if (publishedSlug) {
        newPublishedSlugs.push(publishedSlug);
      }
    } else {
      console.log(`\\nℹ️  Already published: ${slug} (skipping)`);
    }
  }

  if (newPublishedSlugs.length > 0) {
    fs.writeFileSync('.published-slug', newPublishedSlugs[0], 'utf-8');
    console.log(`\\n📌 New published slug saved: ${newPublishedSlugs[0]}`);
  } else {
    if (fs.existsSync('.published-slug')) {
      fs.unlinkSync('.published-slug');
    }
    console.log(`\\nℹ️  No new stocks published`);
  }

  return newPublishedSlugs.length > 0;
}

async function webhookSync() {
  console.log('⚡ Running webhook sync...');

  const pageId = process.env.SYNC_PAGE_ID;

  if (!pageId) {
    console.log('⚠️  No page_id provided, skipping webhook sync');
    return false;
  }

  console.log(`📄 Processing page: ${pageId}`);

  const props = await getPageProperties(pageId);

  if (!props.title) {
    console.log(`⚠️  Page has no title, skipping`);
    return false;
  }

  const slug = generateSlug(props.title);
  const status = props.status;

  console.log(`   Title: ${props.title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Status: ${status}`);

  if (status === 'Deleted') {
    console.log(`\\n🗑️  Deleting property: ${slug}`);
    const deleted = deleteStockFile(slug);
    return deleted;
  }

  if (status === 'Published') {
    const existingFile = findExistingFileByPageId(pageId);

    if (existingFile.exists) {
      console.log(`\\n✏️  Updating existing property: ${slug}`);
      await processPage(pageId, false);
      return true;
    } else {
      console.log(`\\n✨ Publishing new property: ${slug}`);
      const publishedSlug = await processPage(pageId, true);
      if (publishedSlug) {
        fs.writeFileSync('.published-slug', publishedSlug, 'utf-8');
        console.log(`📌 New published slug saved: ${publishedSlug}`);
      }
      return true;
    }
  }

  console.log(`⚠️  Unknown status: ${status}`);
  return false;
}

async function syncNotionToProperties() {
  try {
    console.log('🔄 Starting Notion sync...');
    console.log(`   Trigger: ${process.env.TRIGGER_TYPE || 'unknown'}`);

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not set');
    }

    const triggerType = process.env.TRIGGER_TYPE;
    let hasChanges = false;

    if (triggerType === 'repository_dispatch') {
      hasChanges = await webhookSync();
    } else {
      hasChanges = await scheduledSync();
    }

    if (!hasChanges) {
      console.log('\\nℹ️  No changes made');
    }

    console.log('\\n✅ Notion sync completed!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncNotionToProperties();
