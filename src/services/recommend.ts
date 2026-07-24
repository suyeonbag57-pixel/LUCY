import type {
  Mood,
  Preference,
  Recommendation,
  Situation,
  Song,
} from '../types/song'

/**
 * 추천 점수 계산.
 *
 * 규칙은 단순하다.
 *   - 원하는 기분이 곡 태그에 있으면 크게 가산, "비슷한 기분"이면 조금 가산
 *   - 상황도 같은 방식
 *   - 세기를 골랐으면 차이만큼 감점
 *   - 타이틀곡은 살짝 가산 (대표곡이 먼저 보이도록)
 *   - 결과가 한 앨범에 쏠리지 않게 같은 앨범이 반복되면 조금 감점
 *   - "다른 곡 추천"을 누르면 seed가 바뀌어 순서가 섞인다
 * 조건에 딱 맞는 곡이 부족해도 최소 limit개를 채워서 빈 화면이 나오지 않게 한다.
 */

const RELATED_MOODS: Record<Mood, Mood[]> = {
  신남: ['벅참', '설렘', '열정'],
  설렘: ['벅참', '신남', '그리움'],
  벅참: ['신남', '설렘', '열정', '위로'],
  위로: ['차분', '벅참', '외로움'],
  열정: ['신남', '후련', '벅참'],
  그리움: ['우울', '외로움', '설렘', '차분'],
  우울: ['외로움', '그리움', '불안'],
  외로움: ['우울', '그리움', '위로'],
  후련: ['신남', '열정', '분노'],
  차분: ['나른함', '위로', '그리움'],
  나른함: ['차분', '그리움'],
  불안: ['우울', '그리움'],
  분노: ['열정', '후련'],
}

const RELATED_SITUATIONS: Record<Situation, Situation[]> = {
  '출근길·등굣길': ['기분전환', '드라이브', '운동·러닝'],
  새벽감성: ['잠들기전', '비오는날', '힘들때'],
  '운동·러닝': ['기분전환', '친구와놀때', '드라이브'],
  '공부·집중': ['시험기간', '잠들기전'],
  드라이브: ['여행', '출근길·등굣길', '기분전환'],
  이별: ['비오는날', '새벽감성', '힘들때'],
  비오는날: ['새벽감성', '이별', '잠들기전'],
  여행: ['드라이브', '친구와놀때', '기분전환'],
  시험기간: ['공부·집중', '힘들때'],
  친구와놀때: ['여행', '기분전환', '운동·러닝'],
  잠들기전: ['새벽감성', '비오는날'],
  힘들때: ['새벽감성', '이별', '시험기간'],
  기분전환: ['친구와놀때', '운동·러닝', '드라이브'],
}

const SCORE = {
  moodExact: 50,
  moodRelated: 18,
  situationExact: 34,
  situationRelated: 12,
  /** 세기 1칸 차이당 감점 */
  energyPenalty: 7,
  /** 타이틀곡 가산 */
  titleBonus: 6,
  /** 결과에서 같은 앨범이 다시 나올 때마다 감점 (앨범이 다양하게 섞이도록) */
  duplicateAlbumPenalty: 22,
} as const

/** 곡 id와 seed로 만드는 작은 흔들림. 같은 seed면 항상 같은 값이라 결과가 재현된다. */
function jitter(id: string, seed: number): number {
  let h = seed
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) % 100000
  }
  return (h % 1000) / 1000 // 0 ~ 0.999
}

interface Scored {
  song: Song
  score: number
  matchedMoods: Mood[]
  matchedSituations: Situation[]
}

function scoreSong(song: Song, pref: Preference, seed: number): Scored {
  let score = 0
  const matchedMoods: Mood[] = []
  const matchedSituations: Situation[] = []

  for (const mood of pref.moods) {
    if (song.moods.includes(mood)) {
      score += SCORE.moodExact
      matchedMoods.push(mood)
    } else if (RELATED_MOODS[mood].some((m) => song.moods.includes(m))) {
      score += SCORE.moodRelated
    }
  }

  for (const situation of pref.situations) {
    if (song.situations.includes(situation)) {
      score += SCORE.situationExact
      matchedSituations.push(situation)
    } else if (
      RELATED_SITUATIONS[situation].some((s) => song.situations.includes(s))
    ) {
      score += SCORE.situationRelated
    }
  }

  if (pref.energy !== null) {
    score -= Math.abs(song.energy - pref.energy) * SCORE.energyPenalty
  }

  if (song.isTitle) score += SCORE.titleBonus

  // 순위가 매번 똑같이 굳지 않도록 아주 작은 흔들림을 더한다
  score += jitter(song.id, seed) * 6

  return { song, score, matchedMoods, matchedSituations }
}

/** 앨범 종류로 먼저 후보를 거른다 ('피처링'은 feat 게스트가 있는 곡) */
function passesAlbumFilter(song: Song, pref: Preference): boolean {
  if (pref.albumType === null) return true
  if (pref.albumType === '피처링') return Boolean(song.feat)
  return song.albumType === pref.albumType
}

function buildExplanation(s: Scored): string {
  const moodText = s.matchedMoods.length > 0 ? `'${s.matchedMoods.join("'·'")}'` : ''
  const situationText =
    s.matchedSituations.length > 0 ? `'${s.matchedSituations.join("'·'")}'` : ''

  if (moodText && situationText) {
    return `${moodText} 기분과 ${situationText} 상황에 잘 어울려요.`
  }
  if (moodText) return `${moodText} 기분에 어울리는 곡이에요.`
  if (situationText) return `${situationText} 상황에 자주 어울리는 곡이에요.`
  return '입력한 분위기와 결이 비슷해서 골랐어요.'
}

export interface RecommendOptions {
  /** 몇 곡을 돌려줄지 */
  limit?: number
  /** "다른 곡 추천"을 누를 때마다 바꿔 넣는 값 */
  seed?: number
}

export function recommend(
  songs: Song[],
  pref: Preference,
  options: RecommendOptions = {},
): Recommendation[] {
  const limit = options.limit ?? 6
  const seed = options.seed ?? 1

  const pool = songs.filter((song) => passesAlbumFilter(song, pref))
  if (pool.length === 0) return []

  const scored = pool
    .map((song) => scoreSong(song, pref, seed))
    .sort((a, b) => b.score - a.score)

  // 같은 앨범이 결과를 독식하지 않도록, 이미 뽑힌 앨범은 감점하고 다시 고른다
  const picked: Scored[] = []
  const usedAlbums = new Map<string, number>()
  const remaining = [...scored]

  while (picked.length < Math.min(limit, pool.length) && remaining.length > 0) {
    let bestIndex = 0
    let bestScore = -Infinity

    for (let i = 0; i < remaining.length; i++) {
      const used = usedAlbums.get(remaining[i].song.album) ?? 0
      const adjusted = remaining[i].score - used * SCORE.duplicateAlbumPenalty
      if (adjusted > bestScore) {
        bestScore = adjusted
        bestIndex = i
      }
    }

    const [chosen] = remaining.splice(bestIndex, 1)
    usedAlbums.set(chosen.song.album, (usedAlbums.get(chosen.song.album) ?? 0) + 1)
    picked.push(chosen)
  }

  return picked.map((s) => ({
    song: s.song,
    score: Math.round(s.score),
    matchedMoods: s.matchedMoods,
    matchedSituations: s.matchedSituations,
    explanation: buildExplanation(s),
  }))
}

/** 결과 화면 상단에 쓸 한 줄 요약 */
export function summarize(pref: Preference, count: number): string {
  const parts: string[] = []
  if (pref.moods.length > 0) parts.push(pref.moods.join('·'))
  if (pref.situations.length > 0) parts.push(pref.situations.join('·'))
  if (pref.albumType !== null) parts.push(pref.albumType)
  if (pref.energy !== null) parts.push(`세기 ${'●'.repeat(pref.energy)}`)

  const head = parts.length > 0 ? `${parts.join(' · ')} — ` : ''
  return `${head}루시 노래 ${count}곡을 골랐어요`
}
