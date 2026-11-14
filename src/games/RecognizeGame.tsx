import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { GameResult } from '../components/GameResult'
import { allCharsForLesson, getLesson } from '../content/grade1-vol1'
import {
  addStars,
  clearWrong,
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

type Round =
  | { kind: 'listen'; target: CharEntry; choices: string[] }
  | { kind: 'word'; target: CharEntry; word: string; choices: string[] }

export function RecognizeGame() {
  const { lessonId = '1' } = useParams()
  const id = Number(lessonId)
  const lesson = getLesson(id)
  const navigate = useNavigate()

  const pool = useMemo(
    () => (lesson ? allCharsForLesson(lesson) : []),
    [lesson],
  )

  const [rounds, setRounds] = useState<Round[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  const buildRounds = () => {
    if (!lesson) return []
    const chars = pickN(pool, 4)
    const list: Round[] = chars.map((target) => ({
      kind: 'listen' as const,
      target,
      choices: shuffle([
        target.char,
        ...pickN(
          pool.map((c) => c.char).filter((c) => c !== target.char),
          3,
        ),
      ]),
    }))
    const writing = pickN(lesson.writingChars, 1)[0]
    if (writing?.words[0]) {
      list.push({
        kind: 'word',
        target: writing,
        word: writing.words[0],
        choices: shuffle([
          writing.char,
          ...pickN(
            lesson.writingChars.map((c) => c.char).filter((c) => c !== writing.char),
            3,
          ),
        ]),
      })
    }
    return list
  }

  useEffect(() => {
    setRounds(buildRounds())
    setIndex(0)
    setScore(0)
    setDone(false)
    setFeedback('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson])

  const round = rounds[index]

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: rounds.length,
      setIndex,
      onFinish: (finalScore) => {
        addStars(id, 'recognize', starsFromCorrect(finalScore, rounds.length))
        setDone(true)
      },
    })

  useEffect(() => {
    if (!round) return
    setFeedback('')
    if (round.kind === 'listen') speak(round.target.char)
    else speak(round.word)
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
    const nextModePath = getNextChineseModePath(id, 'recognize')
    const nextStagePath = getNextChineseLessonPath(id)
    return (
      <GameResult
        stars={stars}
        message={`一次答對 ${score} / ${rounds.length} 題`}
        onBack={() => navigate(`/lesson/${id}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  if (!round) {
    return <div className="panel empty">準備題目中…</div>
  }

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/lesson/${id}`}>
          ← 回選單
        </Link>
      </div>
      <header className="brand">
        <h1>耳朵點名</h1>
        <p>
          {index + 1} / {rounds.length}　每題只能選一次
        </p>
      </header>
      <div className="panel game-stage">
        <p className="prompt">
          {round.kind === 'listen'
            ? '聽聽看，是哪一個字在叫你？'
            : `「${round.word}」少了一塊拼圖`}
        </p>
        {round.kind === 'listen' ? (
          <div className="zhuyin" style={{ textAlign: 'center' }}>
            {round.target.zhuyin}
          </div>
        ) : (
          <div className="big-char" style={{ textAlign: 'center' }}>
            {round.word.replace(round.target.char, '＿')}
          </div>
        )}
        <div className="actions">
          <button
            type="button"
            className="btn btn-sun"
            onClick={() =>
              speak(round.kind === 'listen' ? round.target.char : round.word)
            }
          >
            再說一次給我聽
          </button>
        </div>
        <ChoiceGrid
          choices={round.choices}
          roundKey={`${index}-${round.target.char}`}
          isCorrect={(c) => c === round.target.char}
          onPick={(_choice, ok) => {
            if (ok) {
              clearWrong(round.target.char)
              const next = score + 1
              setScore(next)
              setFeedback('答對啦！給你拍拍手')
              afterCorrect(next)
            } else {
              markWrong(round.target.char)
              setFeedback(`答錯了，正解是「${round.target.char}」`)
              afterWrong(score)
            }
          }}
        />
        <div
          className={`feedback ${feedback.startsWith('答對') ? 'ok' : feedback ? 'bad' : ''}`}
        >
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
