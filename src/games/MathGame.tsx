import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { GameResult } from '../components/GameResult'
import { getMathUnit } from '../content/math-hanlin-g1/units'
import { getMathMode } from '../lib/mathModes'
import { buildMathRound } from '../lib/mathQuestions'
import {
  addMathStars,
  clearMathWrong,
  getMathUnitProgress,
  markMathWrong,
  starsFromCorrect,
} from '../lib/mathProgress'
import { touchSession } from '../lib/progress'
import { getNextMathModePath } from '../lib/modeNav'
import {
  getNextMathUnitPath,
  isMathUnitUnlocked,
  isStageCleared,
} from '../lib/unlock'
import { useQuizAdvance } from '../lib/useQuizAdvance'

function MathVisual({
  visual,
}: {
  visual: NonNullable<ReturnType<typeof buildMathRound>[0]['visual']>
}) {
  if (visual.type === 'dots') {
    return (
      <div className="math-dots" aria-hidden>
        {Array.from({ length: visual.count }, (_, i) => (
          <span key={i}>{visual.emoji}</span>
        ))}
      </div>
    )
  }
  if (visual.type === 'bars') {
    return (
      <div className="math-bars" aria-hidden>
        <div className="math-bar-col">
          <span className="muted">左邊</span>
          <div className="math-bar" style={{ width: `${visual.a * 10}%` }} />
        </div>
        <div className="math-bar-col">
          <span className="muted">右邊</span>
          <div className="math-bar math-bar--b" style={{ width: `${visual.b * 10}%` }} />
        </div>
      </div>
    )
  }
  if (visual.type === 'shape') {
    return <div className={`math-shape math-shape--${visual.name}`} aria-hidden />
  }
  if (visual.type === 'clock') {
    const minuteDeg = visual.half ? 180 : 0
    const hourDeg = (visual.hour % 12) * 30 + (visual.half ? 15 : 0)
    return (
      <div className="math-clock" aria-hidden>
        <div className="math-clock__face">
          <span
            className="math-clock__hand math-clock__hand--hour"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <span
            className="math-clock__hand math-clock__hand--minute"
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />
          <span className="math-clock__center" />
        </div>
      </div>
    )
  }
  if (visual.type === 'coins') {
    return (
      <div className="math-coins" aria-hidden>
        {Array.from({ length: visual.tens }, (_, i) => (
          <span key={`t${i}`} className="coin coin--10">
            10
          </span>
        ))}
        {Array.from({ length: visual.fives }, (_, i) => (
          <span key={`f${i}`} className="coin coin--5">
            5
          </span>
        ))}
        {Array.from({ length: visual.ones }, (_, i) => (
          <span key={`o${i}`} className="coin coin--1">
            1
          </span>
        ))}
      </div>
    )
  }
  return null
}

export function MathGame() {
  const { unitId = '', modeId = 'visual' } = useParams()
  const id = Number(unitId)
  const unit = getMathUnit(id)
  const mode = unit ? getMathMode(unit.kind, modeId) : undefined
  const navigate = useNavigate()
  const [seed] = useState(0)
  const questions = useMemo(
    () =>
      unit && mode
        ? buildMathRound(unit.kind, mode.id, 6)
        : [],
    // 只用穩定 id，避免每次 render 新 mode 物件造成整包重抽、綠框被清掉
    [unit?.unitId, unit?.kind, mode?.id, seed],
  )
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [doneStars, setDoneStars] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  // 同一 MathGame 元件在換單元／題型時不會卸載，必須重設進度
  useEffect(() => {
    setIndex(0)
    setScore(0)
    setDoneStars(null)
    setLocked(false)
  }, [unit?.unitId, mode?.id])

  useEffect(() => {
    setLocked(false)
  }, [index, seed])

  const finish = (finalScore: number) => {
    if (!mode) return
    const stars = starsFromCorrect(finalScore, questions.length)
    addMathStars(id, mode.id, stars)
    setDoneStars(stars)
  }

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: questions.length,
      setIndex,
      onFinish: finish,
    })

  if (!unit || !mode) {
    return (
      <div className="panel empty">
        <p>這一關找不到了。</p>
        <Link className="btn btn-ghost" to="/">
          回首頁
        </Link>
      </div>
    )
  }

  if (!isMathUnitUnlocked(id)) {
    return <Navigate to="/" replace />
  }

  if (doneStars !== null) {
    const progress = getMathUnitProgress(unit.unitId)
    const stageCleared = isStageCleared(progress.modesDone, progress.modeTotal)
    const nextModePath = getNextMathModePath(unit.unitId, mode.id)
    const nextStagePath = getNextMathUnitPath(unit.unitId)
    return (
      <GameResult
        stars={doneStars}
        message={
          doneStars >= 3
            ? '算得又快又準，太強了！'
            : doneStars >= 1
              ? '很棒，再玩一輪會更熟！'
              : '沒關係，再試一次就好。'
        }
        onBack={() => navigate(`/math/${unit.unitId}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  const q = questions[index]
  if (!q) return null

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/math/${unit.unitId}`}>
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
        <p className="prompt" style={{ whiteSpace: 'pre-line' }}>
          {q.prompt}
        </p>
        {q.visual && <MathVisual visual={q.visual} />}
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
              clearMathWrong(q.id)
              afterCorrect(next)
            } else {
              markMathWrong({
                id: q.id,
                kind: unit.kind,
                mode: mode.id,
                prompt: q.prompt,
                answer: q.answer,
                choices: q.choices,
                visual: q.visual,
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
