/**
 * src/data/songs.ts 의 내장 곡 데이터를 Supabase용 seed.sql 로 바꿔 준다.
 *
 *   npm run gen:seed
 *
 * 곡을 추가/수정한 뒤 이 명령을 돌리면 supabase/seed.sql 이 새로 만들어진다.
 * seed.sql 을 Supabase SQL Editor에 붙여넣으면 songs 테이블이 채워진다.
 */
import { writeFileSync } from 'node:fs'
import { SONGS } from '../src/data/songs'

/** SQL 문자열 리터럴로 감싼다 (작은따옴표 이스케이프) */
function s(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

/** text[] 배열 리터럴 */
function arr(list: string[]): string {
  const inner = list.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(',')
  return `'{${inner}}'`
}

/** null 이거나 없으면 NULL, 있으면 따옴표 문자열 */
function nullable(value: string | undefined): string {
  return value ? s(value) : 'NULL'
}

const header = `-- 이 파일은 scripts/genSeed.ts 가 자동으로 만든다. 직접 고치지 말 것.
-- 곡을 바꾸려면 src/data/songs.ts 를 고친 뒤 \`npm run gen:seed\` 를 다시 돌린다.
-- Supabase SQL Editor에 supabase/schema.sql 을 먼저 실행한 뒤 이 파일을 붙여넣는다.

`

const rows = SONGS.map((song) => {
  const cols = [
    s(song.id),
    s(song.title),
    s(song.album),
    s(song.albumType),
    String(song.year),
    song.isTitle ? 'true' : 'false',
    arr(song.moods),
    arr(song.situations),
    String(song.energy),
    s(song.reason),
    nullable(song.ost),
    nullable(song.feat),
  ]
  return `  (${cols.join(', ')})`
}).join(',\n')

const sql = `${header}insert into public.songs
  (id, title, album, album_type, year, is_title, moods, situations, energy, reason, ost, feat)
values
${rows}
on conflict (id) do update set
  title = excluded.title,
  album = excluded.album,
  album_type = excluded.album_type,
  year = excluded.year,
  is_title = excluded.is_title,
  moods = excluded.moods,
  situations = excluded.situations,
  energy = excluded.energy,
  reason = excluded.reason,
  ost = excluded.ost,
  feat = excluded.feat;
`

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql, 'utf8')
console.log(`supabase/seed.sql 생성 완료 — ${SONGS.length}곡`)
