-- Supabase SQL Editor에 붙여넣고 실행한다.
-- 데이터 담당과 프로젝트 리더가 관리하는 파일이다. (팀 규칙 8번)
-- 테이블 구조를 바꿔야 하면 먼저 팀에 공유한다.
--   공유할 내용: 테이블 이름 / 변경할 컬럼 / 데이터 형식 / 변경 이유 / 기존 기능에 미치는 영향

create table if not exists public.songs (
  id          text primary key,
  title       text    not null,
  album       text    not null,
  album_type  text    not null default '싱글',
  year        integer not null default 0,
  is_title    boolean not null default false,
  moods       text[]  not null default '{}',
  situations  text[]  not null default '{}',
  energy      integer not null default 3 check (energy between 1 and 5),
  reason      text    not null default '',
  ost         text,
  feat        text,
  created_at  timestamptz not null default now()
);

-- 로그인 기능이 없으므로 누구나 "읽기"만 할 수 있게 한다. (팀 규칙 8번: 조회 중심)
-- 쓰기 권한은 열지 않는다. 곡 추가는 Supabase 대시보드나 seed.sql로 한다.
alter table public.songs enable row level security;

drop policy if exists "songs_read_all" on public.songs;
create policy "songs_read_all"
  on public.songs
  for select
  to anon, authenticated
  using (true);

-- 추천할 때 태그로 자주 훑으므로 인덱스를 걸어둔다.
create index if not exists songs_moods_idx      on public.songs using gin (moods);
create index if not exists songs_situations_idx on public.songs using gin (situations);

-- 곡 데이터는 supabase/seed.sql 로 넣는다.
