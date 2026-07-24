import {
  ALBUM_TYPE_EMOJI,
  ALBUM_TYPE_LABEL,
  ENERGY_LABEL,
  type Recommendation,
} from '../types/song'

interface SongCardProps {
  recommendation: Recommendation
  rank: number
}

/** 곡을 직접 재생할 수는 없으므로 유튜브 검색으로 연결한다 */
function youtubeSearchUrl(title: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `루시 LUCY ${title}`,
  )}`
}

export function SongCard({ recommendation, rank }: SongCardProps) {
  const { song, explanation, matchedMoods, matchedSituations } = recommendation
  const matchedMoodSet = new Set(matchedMoods)
  const matchedSituationSet = new Set(matchedSituations)

  return (
    <article className="song-card">
      <div className="song-card__rank" aria-label={`${rank}번째 추천`}>
        {rank}
      </div>

      <div className="song-card__body">
        <div className="song-card__heading">
          <h3 className="song-card__title">{song.title}</h3>
          {song.isTitle && <span className="badge badge--title">타이틀곡</span>}
        </div>

        <p className="song-card__album">
          <span className="song-card__album-type">
            <span aria-hidden="true">{ALBUM_TYPE_EMOJI[song.albumType]}</span>
            {ALBUM_TYPE_LABEL[song.albumType]}
          </span>
          <span className="song-card__album-name">{song.album}</span>
          {song.year > 0 && <span className="song-card__year">{song.year}</span>}
        </p>

        {(song.ost || song.feat) && (
          <p className="song-card__credits">
            {song.ost && <span className="badge badge--ost">📺 {song.ost} OST</span>}
            {song.feat && (
              <span className="badge badge--feat">🤝 feat. {song.feat}</span>
            )}
          </p>
        )}

        {song.reason && <p className="song-card__reason">{song.reason}</p>}

        <p className="song-card__why">
          <span className="song-card__why-icon" aria-hidden="true">
            ✓
          </span>
          {explanation}
        </p>

        <div className="song-card__tags">
          <span className="song-card__energy" title={ENERGY_LABEL[song.energy]}>
            세기 {'●'.repeat(song.energy)}
            <span className="song-card__energy-dim">{'○'.repeat(5 - song.energy)}</span>
          </span>
          {song.moods.map((mood) => (
            <span
              key={mood}
              className={`tag${matchedMoodSet.has(mood) ? ' tag--hit' : ''}`}
            >
              {mood}
            </span>
          ))}
          {song.situations.map((situation) => (
            <span
              key={situation}
              className={`tag tag--situation${
                matchedSituationSet.has(situation) ? ' tag--hit' : ''
              }`}
            >
              {situation}
            </span>
          ))}
        </div>

        <a
          className="song-card__link"
          href={youtubeSearchUrl(song.title)}
          target="_blank"
          rel="noreferrer noopener"
        >
          유튜브에서 찾아 듣기 ↗
        </a>
      </div>
    </article>
  )
}
