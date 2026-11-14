import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { TwCharGrid } from '../components/TwCharGrid'
import { twLessons } from '../content/taiwanese-jenpin-g1/lessons'
import { TW_MODE_ORDER, type TwModeId } from '../lib/twModes'
import { buildTwRound, type TwQuestion } from '../lib/twQuestions'
import {
  clearTwWrong,
  getTwLessonProgress,
  markTwWrong,
} from '../lib/twProgress'
import { loadProgress, touchSession } from '../lib/progress'
import { pickN } from '../lib/speech'
import { useQuizAdvance } from '../lib/useQuizAdvance'
import type { TwWrongItem } from '../types'

function toQuestion(item: TwWrongItem): TwQuestion {
  return {
    id: item.id,
    prompt: item.prompt,
    highlight: item.highlight,
    hint: item.hint,
    picture: item.picture,
    tianzi: item.tianzi,
    answer: item.answer,
    choices: item.choices,
  }
}

function buildReviewPool(): TwQuestion[] {
  const wrong = loadProgress().wrongTw
  if (wrong.length) {
    return pickN(wrong.map(toQuestion), Math.min(5, wrong.length))
  }

  const weak = twLessons
    .map((l) => ({ lesson: l, progress: getTwLessonProgress(l.lessonId) }))
    .filter((x) => x.progress.earned < 3 || x.progress.modesDone < x.progress.modeTotal)

  const pool = weak.length ? weak.map((x) => x.lesson) : twLessons
  const generated: TwQuestion[] = []
  for (const lesson of pickN(pool, 5)) {
    const mode = TW_MODE_ORDER[
      Math.floor(Math.random() * TW_MODE_ORDER.length)
    ] as TwModeId
    const [q] = buildTwRound(lesson.lessonId, mode, 1)
    if (q) generated.push(q)
  }
  return generated
}

export function TwReview() {
  const pool = useMemo(() => buildReviewPool(), [])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [locked, setLocked] = useState(false)
  const [done, setDone] = useState(pool.length === 0)
  const [feedback, setFeedback] = useState('')

  const current = pool[index]

  useEffect(() => {
    setLocked(false)
    setFeedback('')
  }, [index])

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: pool.length,
      setIndex,
      onFinish: () => setDone(true),
    })

  if (done || !current) {
    return (
      <div className="panel empty">
        <p className="prompt">複習收工！跟臺語擊掌啦</p>
        <Link className="btn btn-primary" to="/">
          回首頁
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to="/">
          ← 回首頁
        </Link>
      </div>
      <header className="brand">
        <h1>今天再練一輪</h1>
        <p>
          {index + 1} / {pool.length}　每題只能選一次
        </p>
      </header>
      <div className="panel game-stage">
        <p className="prompt">{current.prompt}</p>
        {current.picture && (
          <div className="tw-picture" aria-hidden>
            {current.picture}
          </div>
        )}
        {current.highlight &&
          (current.tianzi ? (
            <TwCharGrid text={current.highlight} />
          ) : (
            <p className="tw-highlight">{current.highlight}</p>
          ))}
        {current.hint && <p className="muted tw-hint">{current.hint}</p>}
        <ChoiceGrid
          choices={current.choices}
          roundKey={`${index}-${current.id}`}
          locked={locked || needContinue}
          isCorrect={(c) => c === current.answer}
          onPick={(_c, ok) => {
            touchSession()
            setLocked(true)
            if (ok) {
              clearTwWrong(current.id)
              setFeedback('著矣！給你拍拍手')
              setScore((s) => s + 1)
              afterCorrect(score + 1)
            } else {
              markTwWrong({
                id: current.id,
                lessonId: 0,
                mode: 'review',
                prompt: current.prompt,
                highlight: current.highlight,
                hint: current.hint,
                picture: current.picture,
                tianzi: current.tianzi,
                answer: current.answer,
                choices: current.choices,
              })
              setFeedback(`答錯了，正解是「${current.answer}」`)
              afterWrong(score)
            }
          }}
        />
        <div
          className={`feedback ${feedback.startsWith('著') ? 'ok' : feedback ? 'bad' : ''}`}
        >
          {feedback}
        </div>
        <ContinueButton
          show={needContinue}
          isLast={isLast}
          onContinue={() => {
            setLocked(false)
            setFeedback('')
            continueNow()
          }}
        />
      </div>
    </>
  )
}
