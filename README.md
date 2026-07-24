# 오늘의 루시 🎻 — LUCY 노래 추천

지금 **상황과 기분**을 적거나 고르면, 그에 어울리는 밴드 **루시(LUCY)** 노래를 추천해 주는 웹 서비스입니다.
앨범 수록곡부터 드라마·웹툰 **OST**, **피처링** 곡까지 한곳에서 골라 줍니다.

> 예) `시험 망해서 새벽에 혼자 걷는 중` → 결국 아무것도 알 수 없었지만 · Grey · Missing Call …

## ✨ 주요 기능

- **자유 입력 + 칩 선택 둘 다** — 문장을 적으면 키워드에서 기분·상황을 뽑아내고, 칩으로 직접 골라도 됩니다.
- **"이렇게 이해했어요" 미리보기** — 입력한 문장에서 어떤 기분·상황을 읽었는지 실시간으로 보여줍니다.
- **앨범 종류 필터** — 정규 / 미니 / 싱글 / OST / 피처링 중에서 골라 볼 수 있습니다.
- **추천 근거 표시** — 각 곡이 왜 뽑혔는지 한 줄로 설명하고, 앨범·OST·피처링·타이틀곡을 배지로 보여줍니다.
- 로그인·회원가입 없이 바로 사용, 모바일·PC 모두 대응.

## 🛠 기술 스택

React + Vite + TypeScript + Supabase + Vercel + GitHub (팀 공용 스택)

추천 로직과 키워드 추출은 **외부 AI API 없이 브라우저 안에서** 동작합니다.
(개인정보를 받지 않고, 키를 쓰지 않기 위한 선택입니다.)

## 🚀 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

빌드 / 미리보기:

```bash
npm run build
npm run preview
```

## 🗄 Supabase 연결 (선택)

**Supabase 값이 없어도 앱은 `src/data/songs.ts`의 내장 곡 데이터로 그대로 동작합니다.**
공용 DB로 곡을 관리하고 싶을 때만 아래를 설정하세요.

1. `.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.
   ```bash
   cp .env.example .env.local   # Windows: copy .env.example .env.local
   ```
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
2. Supabase SQL Editor에서 `supabase/schema.sql`을 실행해 `songs` 테이블을 만듭니다.
3. `supabase/seed.sql`을 실행해 곡 데이터를 넣습니다.

> ⚠️ `.env.local`은 **절대 커밋하지 않습니다.** (`.gitignore`에 포함되어 있음)
> 조회만 가능한 RLS 정책이라 로그인 없이 안전하게 읽기만 됩니다.

### 곡 데이터 바꾸기

곡은 `src/data/songs.ts`에서 관리합니다. 여기를 고친 뒤 아래 명령으로 `seed.sql`을 다시 만들 수 있습니다.

```bash
npm run gen:seed
```

## ☁️ 배포

- **Vercel (공식 배포)** — GitHub 저장소를 Vercel에 연결하면 `main` 병합 시 자동 배포됩니다.
  Supabase를 쓴다면 Vercel 프로젝트의 **Environment Variables**에 위 두 값을 등록하세요. (base 설정 불필요)
- **GitHub Pages (미리보기)** — `.github/workflows/deploy.yml`이 `main` 푸시마다 자동 배포합니다.
  저장소 **Settings → Pages → Source**를 **GitHub Actions**로 한 번 바꿔주면 됩니다.

## 📁 폴더 구조

```
src/
  components/   Header, ChipGroup, MoodTextInput, EnergyPicker, SongCard, StateMessage
  pages/        HomePage(입력), ResultPage(결과)
  services/     keywords(키워드 추출) · preference(입력 합치기) · recommend(추천) · supabase · songService
  data/         songs.ts (루시 곡 내장 데이터)
  types/        song.ts (기분/상황/앨범종류 정의 — 바꾸기 전 팀 공유)
supabase/       schema.sql · seed.sql
scripts/        genSeed.ts (songs.ts → seed.sql)
```

## 👥 팀 협업 규칙 (요약)

- `main`에 직접 푸시하지 않습니다. `feature/기능이름` 브랜치 → Pull Request → 리더 확인 → 병합.
- 커밋 메시지는 `feat:` / `fix:` / `style:` / `docs:` 접두사로 시작합니다.
- 로그인·회원가입·인증 기능은 만들지 않고, 이름·전화번호·이메일 같은 개인정보는 받지 않습니다.
- API 키·Supabase 값은 GitHub·팀 채팅방에 올리지 않습니다.
- `src/App.tsx`와 `src/types/song.ts`는 팀 공용 파일이라 바꾸기 전에 팀에 먼저 공유합니다.
- 작업은 화면·컴포넌트 단위로 나눠서, 같은 파일을 동시에 고치지 않습니다.
