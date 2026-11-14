import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import HanziWriter from 'hanzi-writer'
import { GameResult } from '../components/GameResult'
import { getLesson } from '../content/grade1-vol1'
import { addStars, getLessonProgress, markWrong } from '../lib/progress'
import { getNextChineseModePath } from '../lib/modeNav'
import { pickN, speak } from '../lib/speech'
import {
  getNextChineseLessonPath,
  isChineseLessonUnlocked,
  isStageCleared,
} from '../lib/unlock'

type Phase = 'loading' | 'demo' | 'write' | 'done-char'

export function StrokeGame() {
  const { lessonId = '1' } = useParams()
  const id = Number(lessonId)
  const lesson = getLesson(id)
  const navigate = useNavigate()
  const hostRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const genRef = useRef(0)

  const [queue, setQueue] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState(false)
  const [phase, setPhase] = useState<Phase>('loading')
  const [status, setStatus] = useState('準備中…')
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (!lesson) return
    setQueue(pickN(lesson.writingChars.map((c) => c.char), 5))
    setIndex(0)
    setScore(0)
    setMistakes(0)
    setDone(false)
  }, [lesson])

  const current = queue[index]
  const entry = lesson?.writingChars.find((c) => c.char === current)

  const advance = (gained: number) => {
    setScore((s) => {
      const next = s + gained
      window.setTimeout(() => {
        if (index + 1 >= queue.length) {
          const stars = Math.max(1, Math.min(3, 1 + Math.floor(next / 2)))
          addStars(id, 'stroke', stars)
          setDone(true)
        } else {
          setIndex((i) => i + 1)
        }
      }, 700)
      return next
    })
  }

  const startQuiz = (writer: HanziWriter, char: string, gen: number) => {
    if (gen !== genRef.current) return
    setPhase('write')
    setStatus('輪到你了！用手指在格子裡一筆一筆描')
    writer.hideCharacter()
    writer.showOutline()
    writer.quiz({
      onMistake: () => {
        if (gen !== genRef.current) return
        markWrong(char)
        setMistakes((m) => m + 1)
        setStatus('筆順不對，從這一筆再試')
      },
      onCorrectStroke: () => {
        if (gen !== genRef.current) return
        setStatus('很好，繼續下一筆')
      },
      onComplete: (result) => {
        if (gen !== genRef.current) return
        setPhase('done-char')
        setStatus('寫完了！')
        advance(result.totalMistakes === 0 ? 1 : 0)
      },
    })
  }

  const playDemoThenQuiz = (writer: HanziWriter, char: string, gen: number) => {
    if (gen !== genRef.current) return
    setPhase('demo')
    setStatus('先看一遍筆順…看完就可以自己寫')
    writer.cancelQuiz()
    writer.showOutline()
    writer.animateCharacter({
      onComplete: () => startQuiz(writer, char, gen),
    })
  }

  useEffect(() => {
    if (!current || !hostRef.current || done) return

    const gen = ++genRef.current
    const host = hostRef.current
    host.innerHTML = ''
    setFallback(false)
    setPhase('loading')
    setStatus('載入筆順中…')
    speak(current, 0.65)

    let writer: HanziWriter
    try {
      writer = HanziWriter.create(host, current, {
        width: 280,
        height: 280,
        padding: 20,
        strokeColor: '#243447',
        radicalColor: '#3aa0ff',
        outlineColor: '#d7eaff',
        drawingColor: '#3dce9a',
        drawingWidth: 28,
        showCharacter: false,
        showOutline: true,
        strokeAnimationSpeed: 0.55,
        delayBetweenStrokes: 500,
      })
      writerRef.current = writer
      playDemoThenQuiz(writer, current, gen)
    } catch {
      if (gen === genRef.current) {
        setFallback(true)
        setPhase('write')
        setStatus('這個字暫時只能看注音練習')
      }
    }

    return () => {
      genRef.current += 1
      writerRef.current?.cancelQuiz()
      writerRef.current = null
    }
    // 刻意不依賴 score，避免寫完一筆就重掛載把描寫清掉
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, done, id])

  if (!lesson) {
    return (
      <div className="panel empty">
        <p>找不到這一課</p>
        <Link to="/">回首頁</Link>
      </div>
    )
  }

  if (!isChineseLessonUnlocked(id)) {
    return <Navigate to="/" replace />
  }

  if (done) {
    const stars = Math.max(1, Math.min(3, 1 + Math.floor(score / 2)))
    const progress = getLessonProgress(id)
    const stageCleared = isStageCleared(progress.modesDone, progress.modeTotal)
    const nextModePath = getNextChineseModePath(id, 'stroke')
    const nextStagePath = getNextChineseLessonPath(id)
    return (
      <GameResult
        stars={stars}
        message={`寫對 ${score} 個字，失誤 ${mistakes} 次`}
        onBack={() => navigate(`/lesson/${id}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/lesson/${id}`}>
          ← 模式
        </Link>
      </div>
      <header className="brand">
        <h1>筆順田字格</h1>
        <p>
          {index + 1} / {queue.length || 1}　用手指寫一寫
        </p>
      </header>
      <div className="panel game-stage">
        <div className="prompt">
          <span className="big-char">{current}</span>
          <div className="zhuyin">{entry?.zhuyin}</div>
        </div>
        <div
          className={`writer-wrap${phase === 'write' ? ' writer-wrap--active' : ''}`}
          ref={hostRef}
        />
        {fallback && (
          <p className="muted" style={{ textAlign: 'center' }}>
            請用手指在空中書空，或看注音記住這個字。
          </p>
        )}
        <div className="actions">
          {phase === 'demo' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const writer = writerRef.current
                if (!writer || !current) return
                writer.cancelQuiz()
                startQuiz(writer, current, genRef.current)
              }}
            >
              跳過，開始描寫
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const writer = writerRef.current
              if (!writer || !current) return
              playDemoThenQuiz(writer, current, genRef.current)
            }}
          >
            再看筆順
          </button>
          <button
            type="button"
            className="btn btn-sun"
            onClick={() => current && speak(current, 0.65)}
          >
            聽讀音
          </button>
          {fallback && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => advance(1)}
            >
              看過了，下一個
            </button>
          )}
        </div>
        <div className={`feedback ${phase === 'write' ? 'ok' : ''}`}>{status}</div>
      </div>
    </>
  )
}
