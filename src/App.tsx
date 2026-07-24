import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { StateMessage } from './components/StateMessage'
import { HomePage } from './pages/HomePage'
import { ResultPage } from './pages/ResultPage'
import { recommend } from './services/recommend'
import { hasEnoughInput, resolvePreference } from './services/preference'
import { loadSongs, type SongSource } from './services/songService'
import type { AlbumType, Energy, Mood, Situation, Song } from './types/song'
import './App.css'

type Step = 'home' | 'result'
type LoadState = 'loading' | 'ready' | 'error'

export default function App() {
  // 곡 데이터 (Supabase 또는 내장)
  const [songs, setSongs] = useState<Song[]>([])
  const [source, setSource] = useState<SongSource>('local')
  const [notice, setNotice] = useState<string | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')

  // 사용자 입력
  const [step, setStep] = useState<Step>('home')
  const [text, setText] = useState('')
  const [mood, setMood] = useState<Mood | null>(null)
  const [situation, setSituation] = useState<Situation | null>(null)
  const [energy, setEnergy] = useState<Energy | null>(null)
  const [albumType, setAlbumType] = useState<AlbumType | null>(null)
  const [seed, setSeed] = useState(1)

  useEffect(() => {
    let cancelled = false

    loadSongs()
      .then((result) => {
        if (cancelled) return
        setSongs(result.songs)
        setSource(result.source)
        setNotice(result.notice)
        setLoadState(result.songs.length > 0 ? 'ready' : 'error')
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const rawInput = useMemo(
    () => ({ text, mood, situation, energy, albumType }),
    [text, mood, situation, energy, albumType],
  )

  const ready = hasEnoughInput(rawInput)

  const preference = useMemo(
    () => resolvePreference(rawInput).preference,
    [rawInput],
  )

  const recommendations = useMemo(
    () => (step === 'result' ? recommend(songs, preference, { limit: 6, seed }) : []),
    [step, songs, preference, seed],
  )

  function handleSubmit() {
    setSeed(1)
    setStep('result')
    window.scrollTo({ top: 0 })
  }

  function handleReroll() {
    setSeed((prev) => prev + 1)
    window.scrollTo({ top: 0 })
  }

  function handleBack() {
    setStep('home')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app">
      <Header onBack={step === 'result' ? handleBack : undefined} />

      <main className="app__main">
        {loadState === 'loading' && (
          <div className="page">
            <StateMessage icon="🎧" title="곡 목록을 불러오는 중이에요" />
          </div>
        )}

        {loadState === 'error' && (
          <div className="page">
            <StateMessage
              icon="⚠️"
              title="곡 목록을 불러오지 못했어요"
              description="잠시 후 새로고침해 주세요."
              actionLabel="새로고침"
              onAction={() => window.location.reload()}
            />
          </div>
        )}

        {loadState === 'ready' && step === 'home' && (
          <HomePage
            text={text}
            mood={mood}
            situation={situation}
            energy={energy}
            albumType={albumType}
            onTextChange={setText}
            onMoodChange={setMood}
            onSituationChange={setSituation}
            onEnergyChange={setEnergy}
            onAlbumTypeChange={setAlbumType}
            ready={ready}
            onSubmit={handleSubmit}
          />
        )}

        {loadState === 'ready' && step === 'result' && (
          <ResultPage
            preference={preference}
            recommendations={recommendations}
            notice={notice}
            onReroll={handleReroll}
            onBack={handleBack}
          />
        )}
      </main>

      <footer className="app__footer">
        <span>루시 노래 {songs.length}곡 중에서 골라요</span>
        <span className="app__footer-dot" aria-hidden="true">
          ·
        </span>
        <span>{source === 'supabase' ? 'Supabase 연결됨' : '내장 데이터'}</span>
      </footer>
    </div>
  )
}
