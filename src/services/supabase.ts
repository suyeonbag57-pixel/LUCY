import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase 연결.
 *
 * .env.local 에 아래 두 값을 넣으면 Supabase의 songs 테이블을 쓰고,
 * 값이 없으면 앱은 src/data/songs.ts 의 내장 곡 데이터로 동작한다.
 * (수업 중 키가 아직 없어도 앱이 멈추지 않게 하기 위한 구조다.)
 *
 *   VITE_SUPABASE_URL=...
 *   VITE_SUPABASE_ANON_KEY=...
 *
 * 키는 절대 GitHub에 올리지 않는다. .env.local 은 .gitignore에 들어 있다. (팀 규칙 9번)
 */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

/**
 * Supabase songs 테이블의 컬럼 구조.
 * 테이블을 바꿔야 하면 데이터 담당이 팀에 먼저 공유한다. (팀 규칙 8번)
 */
export interface SongRow {
  id: string
  title: string
  album: string
  album_type: string
  year: number
  is_title: boolean
  moods: string[]
  situations: string[]
  energy: number
  reason: string
  ost: string | null
  feat: string | null
}
