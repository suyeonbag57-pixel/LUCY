import type { AlbumType, Energy, Mood, Situation } from '../types/song'

/**
 * 자유 입력 문장에서 기분·상황·세기를 뽑아내는 아주 단순한 규칙 사전.
 *
 * 로그인이나 외부 AI API 없이, 브라우저 안에서만 동작한다. (팀 규칙: 로그인·개인정보 금지)
 * "정확한 자연어 이해"가 목표가 아니라, 흔한 표현 몇 개를 알아채서
 * 어울리는 기분/상황 칩으로 바꿔 주는 정도가 목표다.
 *
 * 규칙을 늘리고 싶으면 KEYWORD_RULES 에 한 줄씩 추가하면 된다.
 * patterns 안의 단어가 입력 문장에 "포함"되면 그 규칙의 태그가 켜진다.
 */

export interface KeywordRule {
  /** 이 단어들 중 하나라도 문장에 들어 있으면 매칭 */
  patterns: string[]
  moods?: Mood[]
  situations?: Situation[]
  /** 이 표현이 나오면 곡 세기를 이 값 쪽으로 당긴다 */
  energy?: Energy
  /** 특정 앨범 종류를 콕 집어 찾을 때 */
  albumType?: AlbumType
}

export const KEYWORD_RULES: KeywordRule[] = [
  // 상황 ─ 시간/장소
  {
    patterns: ['출근', '등교', '등굣', '지각', '지하철', '버스', '아침', '월요일'],
    situations: ['출근길·등굣길'],
  },
  {
    patterns: ['새벽', '늦은 밤', '늦은밤', '야밤', '자정', '밤하늘', '한밤'],
    situations: ['새벽감성'],
    moods: ['그리움', '차분'],
  },
  {
    patterns: ['운동', '헬스', '러닝', '달리기', '조깅', '뛰', '땀', '유산소', '홈트'],
    situations: ['운동·러닝'],
    energy: 4,
  },
  {
    patterns: ['공부', '집중', '과제', '코딩', '작업', '독서실', '카공', '몰입'],
    situations: ['공부·집중'],
  },
  {
    patterns: ['드라이브', '운전', '창문', '고속도로', 'road', '노을'],
    situations: ['드라이브'],
  },
  {
    patterns: ['이별', '헤어', '차였', '실연', '전 여자', '전 남자', '전여친', '전남친', '이별했'],
    situations: ['이별'],
    moods: ['우울', '그리움'],
  },
  {
    patterns: ['비', '장마', '빗소리', '흐린', '우산', '먹구름'],
    situations: ['비오는날'],
  },
  {
    patterns: ['여행', '바다', '떠나', '휴가', '제주', '기차', '공항', '설악', '캠핑'],
    situations: ['여행'],
    moods: ['설렘'],
  },
  {
    patterns: ['시험', '중간고사', '기말', '수능', '모의고사', '발표 준비', '벼락치기'],
    situations: ['시험기간'],
    moods: ['불안'],
  },
  {
    patterns: ['친구', '모임', '파티', '술', '놀', '회식', '노래방', '생일'],
    situations: ['친구와놀때'],
    moods: ['신남'],
  },
  {
    patterns: ['자기 전', '자기전', '잘래', '졸려', '눕', '잠', '불면', '이불'],
    situations: ['잠들기전'],
    energy: 2,
  },
  {
    patterns: [
      '힘들',
      '지쳐',
      '지침',
      '지친',
      '번아웃',
      '위로',
      '버티',
      '포기',
      '무기력',
      '슬럼프',
      '토닥',
    ],
    situations: ['힘들때'],
    moods: ['위로'],
  },
  {
    patterns: ['기분전환', '환기', '리프레시', '전환', '기분 좀', '답답'],
    situations: ['기분전환'],
  },

  // 기분 ─ 감정
  {
    patterns: ['신나', '신남', '텐션', '기분 좋', '기분좋', '신난다', '흥', '들뜨'],
    moods: ['신남'],
    energy: 4,
  },
  {
    patterns: ['설레', '설렘', '두근', '짝사랑', '좋아하는 사람', '썸', '고백'],
    moods: ['설렘'],
  },
  {
    patterns: ['벅차', '벅참', '뭉클', '감동', '울컥', '도전', '새 출발', '시작', '해냈'],
    moods: ['벅참'],
  },
  {
    patterns: ['열정', '불태', '으쌰', '파이팅', '화이팅', '몰아', '이겨', '승부'],
    moods: ['열정'],
    energy: 4,
  },
  {
    patterns: ['그리워', '보고싶', '보고 싶', '추억', '옛날', '그때', '첫사랑'],
    moods: ['그리움'],
  },
  {
    patterns: ['우울', '슬퍼', '슬프', '눈물', '울고', '눈물이', '가라앉', '공허', '멜랑'],
    moods: ['우울'],
    energy: 2,
  },
  {
    patterns: ['외로', '혼자', '쓸쓸', '적적', '허전'],
    moods: ['외로움'],
  },
  {
    patterns: ['후련', '홀가분', '뻥', '시원', '털어', '벗어'],
    moods: ['후련'],
  },
  {
    patterns: ['차분', '잔잔', '고요', '평온', '여유', '차 한잔', '커피', '멍'],
    moods: ['차분'],
    energy: 2,
  },
  {
    patterns: ['나른', '늘어', '노곤', '햇살', '봄날', '졸린 오후'],
    moods: ['나른함'],
    energy: 2,
  },
  {
    patterns: ['불안', '걱정', '초조', '막막', '떨려', '긴장', '두려'],
    moods: ['불안'],
  },
  {
    patterns: ['화나', '화났', '빡쳐', '빡침', '열받', '분노', '짜증', '스트레스', '킹받'],
    moods: ['분노'],
    energy: 4,
  },

  // 앨범 종류 힌트
  {
    patterns: ['ost', 'o.s.t', '드라마', '웹툰', '사운드트랙'],
    albumType: 'OST',
  },
  {
    patterns: ['피처링', 'feat', 'featuring', '피쳐링', '게스트'],
    albumType: '피처링',
  },
]

export interface Extraction {
  moods: Mood[]
  situations: Situation[]
  /** 문장에서 유추한 세기. 여러 힌트가 있으면 평균을 반올림한다. null이면 못 찾음 */
  energy: Energy | null
  albumType: AlbumType | null
}

/** 순서를 지키면서 중복만 제거한다 */
function unique<T>(list: T[]): T[] {
  return [...new Set(list)]
}

/**
 * 입력 문장에서 기분·상황·세기·앨범종류를 뽑아낸다.
 * 아무 규칙도 안 걸리면 전부 비어 있는 결과를 돌려준다.
 */
export function extractFromText(input: string): Extraction {
  const text = input.toLowerCase()
  const moods: Mood[] = []
  const situations: Situation[] = []
  const energyHints: Energy[] = []
  let albumType: AlbumType | null = null

  for (const rule of KEYWORD_RULES) {
    const hit = rule.patterns.some((p) => text.includes(p.toLowerCase()))
    if (!hit) continue

    if (rule.moods) moods.push(...rule.moods)
    if (rule.situations) situations.push(...rule.situations)
    if (rule.energy) energyHints.push(rule.energy)
    if (rule.albumType) albumType = rule.albumType
  }

  let energy: Energy | null = null
  if (energyHints.length > 0) {
    const avg = energyHints.reduce((a, b) => a + b, 0) / energyHints.length
    energy = Math.min(5, Math.max(1, Math.round(avg))) as Energy
  }

  return {
    moods: unique(moods),
    situations: unique(situations),
    energy,
    albumType,
  }
}
