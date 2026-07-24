import { SongCard } from '../components/SongCard'
import { StateMessage } from '../components/StateMessage'
import { summarize } from '../services/recommend'
import {
  ALBUM_TYPE_EMOJI,
  MOOD_EMOJI,
  SITUATION_EMOJI,
  type Preference,
  type Recommendation,
} from '../types/song'

interface ResultPageProps {
  preference: Preference
  recommendations: Recommendation[]
  /** Supabase 대신 내장 데이터를 썼을 때 등의 안내 문구 */
  notice: string | null
  onReroll: () => void
  onBack: () => void
}

export function ResultPage({
  preference,
  recommendations,
  notice,
  onReroll,
  onBack,
}: ResultPageProps) {
  if (recommendations.length === 0) {
    return (
      <div className="page">
        <StateMessage
          icon="🔍"
          title="어울리는 곡을 찾지 못했어요"
          description="앨범 종류 필터를 풀거나, 기분·상황을 바꿔서 다시 골라볼까요?"
          actionLabel="조건 바꾸기"
          onAction={onBack}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <section className="result-head">
        <div className="result-head__chips">
          {preference.moods.map((mood) => (
            <span key={mood} className="chip chip--static">
              <span aria-hidden="true">{MOOD_EMOJI[mood]}</span>
              {mood}
            </span>
          ))}
          {preference.situations.map((situation) => (
            <span key={situation} className="chip chip--static">
              <span aria-hidden="true">{SITUATION_EMOJI[situation]}</span>
              {situation}
            </span>
          ))}
          {preference.albumType && (
            <span className="chip chip--static">
              <span aria-hidden="true">
                {ALBUM_TYPE_EMOJI[preference.albumType]}
              </span>
              {preference.albumType}
            </span>
          )}
        </div>

        {preference.text && (
          <p className="result-head__quote">“{preference.text}”</p>
        )}

        <p className="result-head__summary">
          {summarize(preference, recommendations.length)}
        </p>
      </section>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="result-list">
        {recommendations.map((recommendation, index) => (
          <SongCard
            key={recommendation.song.id}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </div>

      <div className="submit-bar submit-bar--row">
        <button type="button" className="button button--ghost" onClick={onBack}>
          조건 바꾸기
        </button>
        <button type="button" className="button button--primary" onClick={onReroll}>
          다른 곡 추천받기
        </button>
      </div>
    </div>
  )
}
