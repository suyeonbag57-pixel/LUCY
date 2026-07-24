/**
 * 곡 데이터와 추천에 쓰이는 타입 정의.
 *
 * 데이터 담당과 기능 담당이 함께 보는 파일이다.
 * 여기 있는 MOODS / SITUATIONS 값을 바꾸면 곡 태그·추천 로직이 함께 영향을 받으니,
 * 값을 바꾸기 전에 반드시 팀에 먼저 공유한다. (팀 규칙 7·8번)
 */

/** 지금 기분 (사용자가 고르거나, 입력 문장에서 뽑아낸다) */
export const MOODS = [
  '신남',
  '설렘',
  '벅참',
  '위로',
  '열정',
  '그리움',
  '우울',
  '외로움',
  '후련',
  '차분',
  '나른함',
  '불안',
  '분노',
] as const

export type Mood = (typeof MOODS)[number]

/** 지금 상황 */
export const SITUATIONS = [
  '출근길·등굣길',
  '새벽감성',
  '운동·러닝',
  '공부·집중',
  '드라이브',
  '이별',
  '비오는날',
  '여행',
  '시험기간',
  '친구와놀때',
  '잠들기전',
  '힘들때',
  '기분전환',
] as const

export type Situation = (typeof SITUATIONS)[number]

/** 앨범 종류. 루시 활동을 크게 나눈 것 */
export const ALBUM_TYPES = ['정규', '미니', '싱글', 'OST', '피처링'] as const

export type AlbumType = (typeof ALBUM_TYPES)[number]

/** 1 = 아주 잔잔, 5 = 아주 격렬 */
export type Energy = 1 | 2 | 3 | 4 | 5

export interface Song {
  id: string
  title: string
  /** 수록 앨범 이름 (OST면 작품 OST 이름) */
  album: string
  albumType: AlbumType
  /** 발매 연도 */
  year: number
  /** 타이틀곡이면 true */
  isTitle: boolean
  moods: Mood[]
  situations: Situation[]
  energy: Energy
  /** 이 곡이 왜 그 기분/상황에 어울리는지 한 문장 */
  reason: string
  /** OST일 때 작품(드라마 등) 이름 */
  ost?: string
  /** 피처링으로 함께한 아티스트 (있을 때만) */
  feat?: string
}

/**
 * 사용자 입력을 추천 로직이 쓸 수 있게 정리한 형태.
 * 자유 입력 문장에서 뽑은 값과, 칩으로 직접 고른 값을 합쳐서 만든다.
 */
export interface Preference {
  /** 원하는 기분들 (여러 개일 수 있다) */
  moods: Mood[]
  /** 원하는 상황들 */
  situations: Situation[]
  /** 선호 세기. null이면 상관없음 */
  energy: Energy | null
  /** 특정 앨범 종류만 보고 싶을 때 (예: 'OST'). null이면 전체 */
  albumType: AlbumType | null
  /** 사용자가 직접 입력한 문장 (결과 화면에서 보여준다) */
  text: string
}

/** 추천 결과 한 건 */
export interface Recommendation {
  song: Song
  score: number
  matchedMoods: Mood[]
  matchedSituations: Situation[]
  /** 점수 근거를 사람이 읽을 수 있게 풀어 쓴 문장 */
  explanation: string
}

export const MOOD_EMOJI: Record<Mood, string> = {
  신남: '🔥',
  설렘: '💗',
  벅참: '✨',
  위로: '🫂',
  열정: '⚡',
  그리움: '🌙',
  우울: '🌧️',
  외로움: '🕯️',
  후련: '🌈',
  차분: '🌿',
  나른함: '☁️',
  불안: '🌊',
  분노: '💢',
}

export const SITUATION_EMOJI: Record<Situation, string> = {
  '출근길·등굣길': '🚇',
  새벽감성: '🌌',
  '운동·러닝': '🏃',
  '공부·집중': '📚',
  드라이브: '🚗',
  이별: '💔',
  비오는날: '☔',
  여행: '✈️',
  시험기간: '✏️',
  친구와놀때: '🎉',
  잠들기전: '🛏️',
  힘들때: '🌱',
  기분전환: '🍀',
}

export const ALBUM_TYPE_LABEL: Record<AlbumType, string> = {
  정규: '정규앨범',
  미니: '미니앨범',
  싱글: '싱글',
  OST: 'OST',
  피처링: '피처링',
}

export const ALBUM_TYPE_EMOJI: Record<AlbumType, string> = {
  정규: '💿',
  미니: '📀',
  싱글: '🎵',
  OST: '📺',
  피처링: '🤝',
}

export const ENERGY_LABEL: Record<Energy, string> = {
  1: '아주 잔잔',
  2: '잔잔',
  3: '보통',
  4: '신남',
  5: '아주 격렬',
}
