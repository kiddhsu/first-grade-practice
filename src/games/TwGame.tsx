import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { GameResult } from '../components/GameResult'
import { TwCharGrid } from '../components/TwCharGrid'
import { getTwLesson } from '../content/taiwanese-jenpin-g1/lessons'
import { getTwMode } from '../lib/twModes'
import { buildTwRound } from '../lib/twQuestions'
import {
  addTwStars,
  clearTwWrong,
  getTwLessonProgress,
  markTwWrong,
  starsFromCorrect,
} from '../lib/twProgress'
import { touchSession } from '../lib/progress'
import { getNextTwModePath } from '../lib/modeNav'
import {
  getNextTwLessonPath,
  isStageCleared,
  isTwLessonUnlocked,
} from '../lib/unlock'
import { useQuizAdvance } from '../lib/useQuizAdvance'

export function TwGame() {
  const { lessonId = '', modeId = 'meaning' } = useParams()
  const id = Number(lessonId)
  const lesson = getTwLesson(id)
  const mode = getTwMode(modeId)
  const navigate = useNavigate()
  const [seed] = useState(0)
  const questions = useMemo(
    () => (lesson && mode ? buildTwRound(lesson.lessonId, mode.id, 6) : []),
    // 只用穩定 id，避免每次 render 新 mode 物件造成整包重抽、綠框被清掉
    [lesson?.lessonId, mode?.id, seed],
  )
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [doneStars, setDoneStars] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const q = questions[index]

  // 同一 TwGame 元件在換課次／題型時不會卸載，必須重設進度
  useEffect(() => {
    setIndex(0)
    setScore(0)
    setDoneStars(null)
    setLocked(false)
  }, [lesson?.lessonId, mode?.id])

  useEffect(() => {
    setLocked(false)
  }, [index, seed])

  const finish = (finalScore: number) => {
    if (!mode) return
    const stars = starsFromCorrect(finalScore, questions.length)
    addTwStars(id, mode.id, stars)
    setDoneStars(stars)
  }

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: questions.length,
      setIndex,
      onFinish: finish,
    })

  if (!lesson || !mode) {
    return (
      <div className="panel empty">
        <p>這一關找不到了。</p>
        <Link className="btn btn-ghost" to="/">
          回首頁
        </Link>
      </div>
    )
  }

  if (!isTwLessonUnlocked(id)) {
    return <Navigate to="/" replace />
  }

  if (doneStars !== null) {
    const progress = getTwLessonProgress(lesson.lessonId)
    const stageCleared = isStageCleared(progress.modesDone, progress.modeTotal)
    const nextModePath = getNextTwModePath(lesson.lessonId, mode.id)
    const nextStagePath = getNextTwLessonPath(lesson.lessonId)
    return (
      <GameResult
        stars={doneStars}
        message={
          doneStars >= 3
            ? '講得真棒，太強了！'
            : doneStars >= 1
              ? '很棒，再玩一輪會更熟！'
              : '沒關係，再試一次就好。'
        }
        onBack={() => navigate(`/tw/${lesson.lessonId}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  if (!q) return null

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/tw/${lesson.lessonId}`}>
          ← 回選單
        </Link>
      </div>
      <header className="brand">
        <h1>{mode.title}</h1>
        <p>
          {index + 1} / {questions.length}　每題只能選一次
        </p>
      </header>
      <div className="panel game-stage">
        <p className="prompt">{q.prompt}</p>
        {q.picture && (
          <div className="tw-picture" aria-hidden>
            {q.picture}
          </div>
        )}
        {q.highlight &&
          (q.tianzi ? (
            <TwCharGrid text={q.highlight} />
          ) : (
            <p className="tw-highlight">{q.highlight}</p>
          ))}
        {q.hint && <p className="muted tw-hint">{q.hint}</p>}
        <ChoiceGrid
          choices={q.choices}
          roundKey={`${seed}-${index}-${q.id}`}
          locked={locked || needContinue}
          onPick={(_choice, ok) => {
            touchSession()
            setLocked(true)
            const next = score + (ok ? 1 : 0)
            setScore(next)
            if (ok) {
              clearTwWrong(q.id)
              afterCorrect(next)
            } else {
              markTwWrong({
                id: q.id,
                lessonId: lesson.lessonId,
                mode: mode.id,
                prompt: q.prompt,
                highlight: q.highlight,
                hint: q.hint,
                picture: q.picture,
                tianzi: q.tianzi,
                answer: q.answer,
                choices: q.choices,
              })
              afterWrong(next)
            }
          }}
          isCorrect={(c) => c === q.answer}
        />
        <ContinueButton
          show={needContinue}
          isLast={isLast}
          onContinue={() => {
            setLocked(false)
            continueNow()
          }}
        />
      </div>
    </>
  )
}
