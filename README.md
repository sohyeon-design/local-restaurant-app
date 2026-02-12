# 🍜 나랑가 (Narangga)

현지인 맛집 기록 앱 - 현지인만 아는 진짜 맛집을 기록하고 공유하세요

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

## ✨ 주요 기능

### 🔐 회원 인증
- 이메일 기반 회원가입 & 로그인
- Supabase Authentication 사용
- 안전한 사용자 세션 관리

### 📝 맛집 관리 (CRUD)
- **추가**: 가게 이름, 카테고리, 위치, 별점, 방문일, 태그, 메모
- **조회**: 카테고리별 필터링, 검색 기능
- **수정**: 본인이 추가한 맛집만 수정 가능
- **삭제**: 본인이 추가한 맛집만 삭제 가능

### 💖 즐겨찾기
- 모든 맛집에 즐겨찾기 추가 가능
- 본인 맛집: Supabase에 영구 저장
- 다른 사용자 맛집: 로컬 상태로 관리

### 🔍 검색 & 필터
- 카테고리별 필터링 (전체, 한식, 중식, 일식, 양식, 분식, 디저트)
- 맛집 이름, 지역, 태그로 검색
- 실시간 검색 결과

### 🏷️ 태그 시스템
- 자유로운 태그 추가
- 인기 태그 자동 추천 (상위 5개)
- 태그 기반 검색

### 🎨 귀여운 UI/UX
- 주황색 컨셉의 따뜻한 디자인
- 이모지 활용으로 직관적인 인터페이스
- 부드러운 애니메이션
- 반응형 디자인 (모바일 최적화)

## 🛠️ 기술 스택

### Frontend
- **Next.js 16.1.6** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Lucide React** - 아이콘 라이브러리

### Backend & Database
- **Supabase** - PostgreSQL 데이터베이스
- **Supabase Auth** - 사용자 인증
- **Row Level Security (RLS)** - 데이터 보안

### Deployment
- **Vercel** - 자동 배포 & 호스팅

## 🚀 로컬 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/sohyeon-design/local-restaurant-app.git
cd local-restaurant-app
```

### 2. 의존성 설치

```bash
npm install --legacy-peer-deps
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase 설정

자세한 설정 방법은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📦 프로젝트 구조

```
local-restaurant-app/
├── app/                      # Next.js App Router
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 메인 페이지
├── components/              # React 컴포넌트
│   ├── add-restaurant-sheet.tsx
│   ├── app-header.tsx
│   ├── auth-sheet.tsx
│   ├── category-filter.tsx
│   ├── empty-state.tsx
│   ├── restaurant-card.tsx
│   └── restaurant-detail-sheet.tsx
├── lib/                     # 유틸리티 & 설정
│   ├── auth/
│   │   └── context.tsx     # 인증 Context
│   ├── supabase/
│   │   ├── client.ts       # 클라이언트 Supabase
│   │   └── server.ts       # 서버 Supabase
│   ├── types.ts            # TypeScript 타입 정의
│   └── utils.ts            # 유틸리티 함수
└── public/                  # 정적 파일
```

## 🗄️ 데이터베이스 스키마

### restaurants 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | uuid | 기본 키 |
| user_id | uuid | 사용자 ID (외래 키) |
| name | text | 가게 이름 |
| category | text | 카테고리 |
| location | text | 지역 |
| rating | integer | 별점 (1-5) |
| memo | text | 메모 |
| visit_date | text | 방문일 |
| is_favorite | boolean | 즐겨찾기 여부 |
| tags | text[] | 태그 배열 |
| created_at | timestamp | 생성 시간 |

## 🔒 보안 정책

### Row Level Security (RLS)

- **읽기**: 모든 사용자가 모든 맛집 조회 가능
- **쓰기**: 로그인한 사용자만 맛집 추가 가능
- **수정/삭제**: 본인이 추가한 맛집만 수정/삭제 가능

## 🎯 주요 기능 상세

### 권한 관리
- 미로그인 시: 조회만 가능, 추가/수정/삭제 시 로그인 유도
- 로그인 시: 모든 기능 사용 가능
- 본인 맛집: 수정/삭제 버튼 표시
- 타인 맛집: 조회만 가능

### 데이터 흐름
1. 샘플 데이터 + Supabase 데이터 통합 표시
2. 로그인 여부에 따른 권한 제어
3. 낙관적 업데이트(Optimistic Update)로 빠른 UI 반응
4. 에러 시 롤백 처리

## 📱 화면 구성

1. **메인 화면**: 맛집 카드 리스트, 카테고리 필터, 검색
2. **맛집 추가/수정**: 폼 입력, 별점 선택, 태그 추가
3. **맛집 상세**: 상세 정보, 수정/삭제 버튼 (본인 맛집만)
4. **인증 화면**: 회원가입/로그인 모달

## 💡 프로젝트 이름 유래

**나랑가 (Narangga)**는 "나랑 가자"의 줄임말로, 친구에게 맛집을 추천하며 함께 가고 싶은 마음을 담았습니다.

## 🤝 기여

이 프로젝트는 개인 프로젝트이지만, 개선 아이디어나 버그 리포트는 언제나 환영합니다!

## 📄 라이선스

MIT License

---

**Made with 🧡 by [sohyeon-design](https://github.com/sohyeon-design)**
