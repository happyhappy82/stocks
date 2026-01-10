# 부동산리뷰Lab 프로젝트 정보

## 완성된 구조

```
property/
├── .github/
│   └── workflows/
│       └── sync-notion.yml          # GitHub Actions 워크플로우
├── app/
│   ├── [slug]/
│   │   └── page.tsx                 # 매물 상세 페이지
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 홈페이지 (목록)
│   └── globals.css                  # 글로벌 CSS
├── components/
│   ├── Header.tsx                   # 헤더 컴포넌트
│   ├── PropertyCard.tsx             # 매물 카드
│   ├── Link.tsx                     # 링크 컴포넌트
│   ├── TableOfContents.tsx          # 목차
│   └── QnA.tsx                      # Q&A 섹션
├── content/
│   └── properties/                  # 마크다운 콘텐츠
│       ├── gangnam-apartment.md     # 강남 래미안 아파트
│       ├── pangyo-officetel.md      # 판교 오피스텔
│       └── songdo-new-city.md       # 송도 신축 아파트
├── lib/
│   ├── properties.ts                # 콘텐츠 로딩 유틸
│   └── qna-utils.ts                 # Q&A 추출 유틸
├── scripts/
│   ├── sync-notion.js               # Notion 동기화
│   └── google-indexing.js           # Google 색인 요청
├── public/
│   └── notion-images/               # Notion 이미지 저장소
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 예시 콘텐츠

### 1. 강남 래미안 아파트
- 프리미엄 주거 공간
- 교육 환경 우수
- 시세: 25억 ~ 45억

### 2. 판교 테크노밸리 오피스텔
- IT 기업 밀집 지역
- 높은 임대 수요
- 투자 및 실거주 추천

### 3. 송도 국제도시 신축 아파트
- 미래 가치 투자처
- GTX-B 개통 기대
- 합리적인 분양가

## 주요 기능

### ✅ 완성된 기능

1. **콘텐츠 관리**
   - Markdown 기반 콘텐츠
   - Frontmatter 메타데이터
   - 이미지 지원

2. **자동화**
   - Notion 데이터베이스 연동
   - page_id 기반 파일 추적
   - 제목 변경 시 자동 처리
   - 특수문자/URL 포함 제목 지원

3. **UI 컴포넌트**
   - 반응형 디자인
   - 목차 자동 생성
   - Q&A 아코디언
   - 카드형 목록

4. **SEO**
   - 정적 사이트 생성 (SSG)
   - 메타데이터 최적화
   - Schema.org 마크업
   - Google 색인 자동 요청

5. **GitHub Actions**
   - 예약 발행 (하루 2회)
   - 웹훅 즉시 발행/수정/삭제
   - 자동 배포

## 실행 방법

### 1. 로컬 개발

```bash
cd property
npm install
npm run dev
```

브라우저에서 `http://localhost:3001` 접속

### 2. 빌드

```bash
npm run build
```

`out/` 폴더에 정적 파일 생성됨

### 3. Notion 동기화

환경 변수 설정 후:

```bash
NOTION_API_KEY=xxx NOTION_DATABASE_ID=xxx node scripts/sync-notion.js
```

## Notion 데이터베이스 설정

### 필수 속성

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | title | 매물 제목 |
| Date | date | 발행 날짜 |
| Excerpt | rich_text | 요약 |
| Status | status | Published/Deleted |
| LightColor | rich_text | 밝은 색상 (선택) |
| DarkColor | rich_text | 어두운 색상 (선택) |

### Status 값

- **Published**: 발행됨
- **Deleted**: 삭제됨

## 배포

### Vercel 배포

1. GitHub 연결
2. 환경 변수 설정:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `GOOGLE_SERVICE_ACCOUNT_JSON` (선택)
3. 자동 배포

### GitHub Secrets 설정

Repository Settings → Secrets에 추가:
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

## 특징

### TechReviewLabs와 동일한 구조
- Next.js 15 + App Router
- Tailwind CSS
- SSG (Static Site Generation)
- Notion 자동화
- page_id 기반 파일 추적
- 특수문자 제목 지원

### 부동산에 맞춘 커스터마이징
- 부동산 관련 콘텐츠
- 매물 정보 포맷
- 투자 분석 섹션
- 위치/교통 정보

## 다음 단계

1. npm install 실행
2. 로컬 개발 서버로 확인
3. Notion 데이터베이스 생성
4. 환경 변수 설정
5. GitHub에 푸시
6. Vercel 배포

## 라이선스

Private
