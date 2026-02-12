# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 접속하여 회원가입/로그인
2. "New Project" 버튼 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 설정
4. 프로젝트 생성 완료 (약 2분 소요)

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**환경 변수 값 확인 방법:**
1. Supabase 대시보드 → Settings → API
2. `Project URL`을 복사하여 `NEXT_PUBLIC_SUPABASE_URL`에 입력
3. `anon public` 키를 복사하여 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력

## 3. 데이터베이스 테이블 생성

Supabase 대시보드에서 SQL Editor를 열고 다음 SQL을 실행:

```sql
-- restaurants 테이블 생성
create table public.restaurants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  category text not null,
  location text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  memo text,
  visit_date date not null,
  is_favorite boolean default false,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 활성화
alter table public.restaurants enable row level security;

-- 본인이 작성한 맛집만 조회 가능
create policy "Users can view their own restaurants"
  on public.restaurants for select
  using (auth.uid() = user_id);

-- 본인이 맛집을 추가 가능
create policy "Users can insert their own restaurants"
  on public.restaurants for insert
  with check (auth.uid() = user_id);

-- 본인이 작성한 맛집만 수정 가능
create policy "Users can update their own restaurants"
  on public.restaurants for update
  using (auth.uid() = user_id);

-- 본인이 작성한 맛집만 삭제 가능
create policy "Users can delete their own restaurants"
  on public.restaurants for delete
  using (auth.uid() = user_id);

-- 업데이트 시간 자동 갱신 함수
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 트리거 생성
create trigger handle_updated_at
  before update on public.restaurants
  for each row
  execute procedure public.handle_updated_at();
```

## 4. 이메일 인증 설정 (선택사항)

기본적으로 Supabase는 이메일 인증을 요구합니다. 개발 중에는 이를 비활성화할 수 있습니다:

1. Supabase 대시보드 → Authentication → Settings
2. "Confirm email" 옵션을 비활성화

## 5. 개발 서버 재시작

```bash
npm run dev
```

## 기능 설명

### 회원가입
- 이메일과 비밀번호로 회원가입
- 이름 정보 저장

### 로그인
- 이메일/비밀번호로 로그인
- 자동 세션 관리

### 로그아웃
- 헤더의 로그아웃 버튼 클릭

### 맛집 관리
- **추가**: 로그인한 사용자만 가능
- **조회**: 모든 사용자가 가능
- **수정**: 본인이 추가한 맛집만 가능
- **삭제**: 본인이 추가한 맛집만 가능

### 보안
- Row Level Security (RLS)로 데이터 보호
- 본인 데이터만 접근 가능
