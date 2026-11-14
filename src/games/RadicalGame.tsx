import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { GameResult } from '../components/GameResult'
import { allCharsForLesson, getLesson } from '../content/grade1-vol1'
import {
  addStars,
  getLessonProgress,
  markWrong,
  starsFromCorrect,
} from '../lib/progress'
import { getNextChineseModePath } from '../lib/modeNav'
import { pickN, shuffle, speak } from '../lib/speech'
import {
  getNextChineseLessonPath,
  isChineseLessonUnlocked,
  isStageCleared,
} from '../lib/unlock'
import { useQuizAdvance } from '../lib/useQuizAdvance'
import type { CharEntry } from '../types'

type Round = {
  radical: string
  target: CharEntry
  choices: CharEntry[]
}

export function RadicalGame() {
  const { lessonId = '1' } = useParams()
  const id = Number(lessonId)
  const lesson = getLesson(id)
  const navigate = useNavigate()

  const chars = useMemo(
    () => (lesson ? allCharsForLesson(lesson) : []),
    [lesson],
  )

  const [rounds, setRounds] = useState<Round[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  const build = () => {
    const grouped = new Map<string, CharEntry[]>()
    for (const c of chars) {
      const list = grouped.get(c.radical) ?? []
      list.push(c)
      grouped.set(c.radical, list)
    }
    const candidates = chars.filter((c) => (grouped.get(c.radical)?.length ?? 0) >= 1)
    const picks = pickN(candidates, Math.min(5, candidates.length))
    return picks.map((seed) => {
      const same = grouped.get(seed.radical) ?? [seed]
      const answer = pickN(same, 1)[0] ?? seed
      const others = chars.filter((c) => c.radical !== seed.radical)
      const wrong = pickN(
        others.length ? others : chars.filter((c) => c.char !== answer.char),
        3,
      )
      return {
        radical: seed.radical,
        target: answer,
        choices: shuffle([answer, ...wrong].slice(0, 4)),
      }
    })
  }

  useEffect(() => {
    setRounds(build())
    setIndex(0)
    setScore(0)
    setDone(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson])

  const round = rounds[index]

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: rounds.length,
      setIndex,
      onFinish: (finalScore) => {
        addStars(id, 'radical', starsFromCorrect(finalScore, rounds.length))
        setDone(true)
      },
    })

  useEffect(() => {
    if (!round) return
    setFeedback('')
    speak(`找出${round.radical}部的麻吉`)
  }, [round])

  if (!lesson) {
    return (
      <div className="panel empty">
        <Link to="/">回首頁</Link>
      </div>
    )
  }

  if (!isChineseLessonUnlocked(id)) {
    return <Navigate to="/" replace />
  }

  if (done) {
    const stars = starsFromCorrect(score, rounds.length)
    const progress = getLessonProgress(id)
    const stageCleared = isStageCleared(progress.modesDone, progress.modeTotal)
    const nextModePath = getNextChineseModePath(id, 'radical')
    const nextStagePath = getNextChineseLessonPath(id)
    return (
      <GameResult
        stars={stars}
        message={`一次找對 ${score} / ${rounds.length} 題`}
        onBack={() => navigate(`/lesson/${id}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  if (!round) {
    return <div className="panel empty">這一課部件還太少，先去別課玩玩。</div>
  }

  const correctChar =
    round.choices.find((c) => c.radical === round.radical)?.char ?? round.target.char

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/lesson/${id}`}>
          ← 回選單
        </Link>
      </div>
      <header className="brand">
        <h1>部首揪團</h1>
        <p>
          {index + 1} / {rounds.length}　每題只能選一次
        </p>
      </header>
      <div className="panel game-stage">
        <p className="prompt">
          「<span className="big-char">{round.radical}</span>」部的麻吉是誰？
        </p>
        <ChoiceGrid
          choices={round.choices.map((c) => c.char)}
          roundKey={`${index}-${round.radical}-${round.target.char}`}
          isCorrect={(choice) =>
            (round.choices.find((c) => c.char === choice)?.radical ?? '') ===
            round.radical
          }
          onPick={(choice, ok) => {
            if (ok) {
              const next = score + 1
              setScore(next)
              setFeedback('揪到了！進團！')
              afterCorrect(next)
            } else {
              const picked = round.choices.find((c) => c.char === choice)
              markWrong(round.target.char)
              setFeedback(
                `答錯了，「${correctChar}」才是${round.radical}部（你選的是${picked?.radical ?? ''}部）`,
              )
              afterWrong(score)
            }
          }}
        />
        <div className={`feedback ${feedback.startsWith('揪到') ? 'ok' : feedback ? 'bad' : ''}`}>
          {feedback}
        </div>
        <ContinueButton
          show={needContinue}
          isLast={isLast}
          onContinue={continueNow}
        />
      </div>
    </>
  )
}
