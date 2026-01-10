# 부동산리뷰Lab

부동산 매물 정보 및 투자 가이드를 제공하는 Next.js 기반 정적 사이트입니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **스타일링**: Tailwind CSS
- **콘텐츠**: Markdown + Gray Matter
- **배포**: Vercel (SSG)
- **자동화**: Notion API + GitHub Actions

## 프로젝트 구조

```
property/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지 (목록)
│   ├── [slug]/            # 동적 라우트
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── Header.tsx
│   ├── PropertyCard.tsx
│   ├── Link.tsx
│   ├── TableOfContents.tsx
│   └── QnA.tsx
├── lib/                   # 유틸리티 함수
│   ├── properties.ts
│   └── qna-utils.ts
├── content/              # 마크다운 콘텐츠
│   └── properties/       # 부동산 매물 정보
├── scripts/              # 자동화 스크립트
│   └── sync-notion.js    # Notion 동기화
└── public/               # 정적 파일
    └── notion-images/    # Notion 이미지
```

## 로컬 개발

### 설치

```bash
cd property
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 열기

### 빌드

```bash
npm run build
```

## Notion 연동

### 필요한 환경 변수

`.env.local` 파일 생성:

```
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx
```

### Notion 데이터베이스 속성

- **Title** (title): 매물 제목
- **Date** (date): 발행 날짜
- **Excerpt** (rich_text): 요약
- **Status** (status): Published / Deleted
- **LightColor** (rich_text): 밝은 테마 색상
- **DarkColor** (rich_text): 어두운 테마 색상

### 동기화 실행

```bash
node scripts/sync-notion.js
```

## 배포

Vercel에 배포 시 자동으로 빌드됩니다.

### GitHub Actions 설정

- 예약 발행: 하루 2회 자동 실행
- 웹훅: Notion 변경 시 즉시 반영

## 라이선스

Private
