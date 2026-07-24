import { extractFromText, type Extraction } from './keywords'
import type { AlbumType, Energy, Mood, Preference, Situation } from '../types/song'

/** HomePage에서 사용자가 고르거나 입력한 원본 값 */
export interface RawInput {
  text: string
  mood: Mood | null
  situation: Situation | null
  energy: Energy | null
  albumType: AlbumType | null
}

export interface ResolveResult {
  preference: Preference
  /** 자유 입력에서 뽑아낸 값 (화면에 "이렇게 이해했어요"로 보여준다) */
  extraction: Extraction
}

function unique<T>(list: T[]): T[] {
  return [...new Set(list)]
}

/**
 * 자유 입력 문장에서 뽑은 값과, 칩으로 직접 고른 값을 하나의 Preference로 합친다.
 * 칩으로 고른 값이 먼저 오고, 문장에서 찾은 값이 뒤에 붙는다.
 */
export function resolvePreference(input: RawInput): ResolveResult {
  const extraction = extractFromText(input.text)

  const moods = unique<Mood>([
    ...(input.mood ? [input.mood] : []),
    ...extraction.moods,
  ])
  const situations = unique<Situation>([
    ...(input.situation ? [input.situation] : []),
    ...extraction.situations,
  ])

  const preference: Preference = {
    moods,
    situations,
    energy: input.energy ?? extraction.energy,
    albumType: input.albumType ?? extraction.albumType,
    text: input.text.trim(),
  }

  return { preference, extraction }
}

/** 추천을 시작할 수 있을 만큼 입력이 있는지 */
export function hasEnoughInput(input: RawInput): boolean {
  return (
    input.text.trim().length > 0 ||
    input.mood !== null ||
    input.situation !== null ||
    input.albumType !== null
  )
}
