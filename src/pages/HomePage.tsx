import { useMemo } from 'react'
import { ChipGroup } from '../components/ChipGroup'
import { EnergyPicker } from '../components/EnergyPicker'
import { MoodTextInput } from '../components/MoodTextInput'
import { extractFromText } from '../services/keywords'
import {
  ALBUM_TYPES,
  ALBUM_TYPE_EMOJI,
  MOODS,
  MOOD_EMOJI,
  SITUATIONS,
  SITUATION_EMOJI,
  type AlbumType,
  type Energy,
  type Mood,
  type Situation,
} from '../types/song'

interface HomePageProps {
  text: string
  mood: Mood | null
  situation: Situation | null
  energy: Energy | null
  albumType: AlbumType | null
  onTextChange: (value: string) => void
  onMoodChange: (value: Mood | null) => void
  onSituationChange: (value: Situation | null) => void
  onEnergyChange: (value: Energy | null) => void
  onAlbumTypeChange: (value: AlbumType | null) => void
  ready: boolean
  onSubmit: () => void
}

export function HomePage({
  text,
  mood,
  situation,
  energy,
  albumType,
  onTextChange,
  onMoodChange,
  onSituationChange,
  onEnergyChange,
  onAlbumTypeChange,
  ready,
  onSubmit,
}: HomePageProps) {
  // 입력창에 적은 문장에서 뽑아낸 기분/상황을 실시간으로 보여준다 (기능이 도는 걸 눈으로 확인)
  const detected = useMemo(() => extractFromText(text), [text])
  const hasDetection =
    detected.moods.length > 0 ||
    detected.situations.length > 0 ||
    detected.energy !== null ||
    detected.albumType !== null

  return (
    <div className="page">
      <section className="intro">
        <h2 className="intro__title">지금 기분에 맞는 루시 노래를 찾아드려요</h2>
        <p className="intro__desc">
          상황·기분을 적거나 아래에서 골라보세요. 앨범 수록곡부터 OST·피처링까지 골라드려요.
        </p>
      </section>

      <MoodTextInput value={text} onChange={onTextChange} />

      {text.trim().length > 0 && (
        <div className={`detected${hasDetection ? '' : ' detected--empty'}`}>
          {hasDetection ? (
            <>
              <span className="detected__label">이렇게 이해했어요</span>
              <span className="detected__chips">
                {detected.moods.map((m) => (
                  <span key={m} className="detected__chip">
                    {MOOD_EMOJI[m]} {m}
                  </span>
                ))}
                {detected.situations.map((s) => (
                  <span key={s} className="detected__chip detected__chip--situation">
                    {SITUATION_EMOJI[s]} {s}
                  </span>
                ))}
                {detected.albumType && (
                  <span className="detected__chip detected__chip--album">
                    {ALBUM_TYPE_EMOJI[detected.albumType]} {detected.albumType}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="detected__label">
              문장에서 기분을 못 찾았어요. 아래 칩으로 골라주면 더 잘 맞춰드려요.
            </span>
          )}
        </div>
      )}

      <ChipGroup
        label="지금 기분"
        options={MOODS}
        emoji={MOOD_EMOJI}
        selected={mood}
        onSelect={onMoodChange}
      />

      <ChipGroup
        label="지금 상황"
        options={SITUATIONS}
        emoji={SITUATION_EMOJI}
        selected={situation}
        onSelect={onSituationChange}
      />

      <ChipGroup
        label="앨범 종류"
        hint="특정 종류만 보고 싶을 때"
        options={ALBUM_TYPES}
        emoji={ALBUM_TYPE_EMOJI}
        selected={albumType}
        onSelect={onAlbumTypeChange}
        allowNone
        noneLabel="전체"
      />

      <EnergyPicker selected={energy} onSelect={onEnergyChange} />

      <div className="submit-bar">
        <button
          type="button"
          className="button button--primary"
          disabled={!ready}
          onClick={onSubmit}
        >
          {ready ? '루시 노래 추천받기' : '기분·상황을 적거나 골라주세요'}
        </button>
      </div>
    </div>
  )
}
