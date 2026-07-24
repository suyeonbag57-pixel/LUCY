import { supabase, isSupabaseConfigured, type SongRow } from './supabase'
import { SONGS } from '../data/songs'
import {
  ALBUM_TYPES,
  MOODS,
  SITUATIONS,
  type AlbumType,
  type Energy,
  type Mood,
  type Situation,
  type Song,
} from '../types/song'

const MOOD_SET = new Set<string>(MOODS)
const SITUATION_SET = new Set<string>(SITUATIONS)
const ALBUM_TYPE_SET = new Set<string>(ALBUM_TYPES)

/**
 * Supabase에서 온 행을 앱에서 쓰는 Song으로 바꾼다.
 * 태그 오타나 빈 값이 섞여 있어도 화면이 깨지지 않도록 걸러낸다.
 */
function toSong(row: SongRow): Song | null {
  if (!row?.title || !row?.album) return null

  const moods = (row.moods ?? []).filter((m): m is Mood => MOOD_SET.has(m))
  const situations = (row.situations ?? []).filter((s): s is Situation =>
    SITUATION_SET.has(s),
  )
  if (moods.length === 0 || situations.length === 0) return null

  const energy = Math.min(5, Math.max(1, Math.round(row.energy ?? 3))) as Energy
  const albumType = (
    ALBUM_TYPE_SET.has(row.album_type) ? row.album_type : '싱글'
  ) as AlbumType

  return {
    id: String(row.id ?? `${row.album}-${row.title}`),
    title: row.title,
    album: row.album,
    albumType,
    year: Number(row.year) || 0,
    isTitle: Boolean(row.is_title),
    moods,
    situations,
    energy,
    reason: row.reason ?? '',
    ost: row.ost ?? undefined,
    feat: row.feat ?? undefined,
  }
}

export type SongSource = 'supabase' | 'local'

export interface SongLoadResult {
  songs: Song[]
  source: SongSource
  /** 사용자에게 보여줄 안내. 정상이면 null */
  notice: string | null
}

/**
 * 곡 목록을 불러온다.
 *
 * Supabase가 설정되어 있으면 songs 테이블에서 읽고,
 * 설정이 없거나 조회에 실패하면 내장 데이터로 넘어간다.
 * 어떤 경우에도 빈 화면이 나오지 않는 것이 이 함수의 역할이다.
 */
export async function loadSongs(): Promise<SongLoadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { songs: SONGS, source: 'local', notice: null }
  }

  try {
    const { data, error } = await supabase.from('songs').select('*')

    if (error) throw new Error(error.message)

    const songs = (data as SongRow[])
      .map(toSong)
      .filter((s): s is Song => s !== null)

    if (songs.length === 0) {
      return {
        songs: SONGS,
        source: 'local',
        notice: 'Supabase에 곡이 아직 없어서 기본 곡 목록으로 추천했어요.',
      }
    }

    return { songs, source: 'supabase', notice: null }
  } catch {
    return {
      songs: SONGS,
      source: 'local',
      notice: 'Supabase에 연결하지 못해서 기본 곡 목록으로 추천했어요.',
    }
  }
}
