import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChoiceGrid } from '../components/ChoiceGrid'
import { ContinueButton } from '../components/ContinueButton'
import { GameResult } from '../components/GameResult'
import { getLesson } from '../content/grade1-vol1'
import { addStars, getLessonProgress, starsFromCorrect } from '../lib/progress'
import { getNextChineseModePath } from '../lib/modeNav'
import { speak } from '../lib/speech'
import {
  getNextChineseLessonPath,
  isChineseLessonUnlocked,
  isStageCleared,
} from '../lib/unlock'
import { useQuizAdvance } from '../lib/useQuizAdvance'

export function PunctGame() {
  const { lessonId = '1' } = useParams()
  const id = Number(lessonId)
  const lesson = getLesson(id)
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  const items = lesson?.punctuationItems ?? []
  const item = items[index]

  const { needContinue, afterCorrect, afterWrong, continueNow, isLast } =
    useQuizAdvance({
      index,
      total: items.length,
      setIndex,
      onFinish: (finalScore) => {
        addStars(id, 'punct', starsFromCorrect(finalScore, items.length))
        setDone(true)
      },
    })

  useEffect(() => {
    setIndex(0)
    setScore(0)
    setDone(false)
    setFeedback('')
  }, [lesson])

  useEffect(() => {
    if (!item) return
    setFeedback('')
    speak(`${item.before}${item.answer}${item.after}`)
  }, [item])

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
    const stars = starsFromCorrect(score, items.length)
    const progress = getLessonProgress(id)
    const stageCleared = isStageCleared(progress.modesDone, progress.modeTotal)
    const nextModePath = getNextChineseModePath(id, 'punct')
    const nextStagePath = getNextChineseLessonPath(id)
    return (
      <GameResult
        stars={stars}
        message={`一次找對 ${score} / ${items.length} 題`}
        onBack={() => navigate(`/lesson/${id}`)}
        onNextMode={nextModePath ? () => navigate(nextModePath) : undefined}
        stageCleared={stageCleared}
        onNextStage={nextStagePath ? () => navigate(nextStagePath) : undefined}
      />
    )
  }

  if (!item) {
    return <div className="panel empty">沒有標點題</div>
  }

  return (
    <>
      <div className="top-nav">
        <Link className="chip" to={`/lesson/${id}`}>
          ← 回選單
        </Link>
      </div>
      <header className="brand">
        <h1>標點偵探社</h1>
        <p>
          {index + 1} / {items.length}　每題只能選一次
        </p>
      </header>
      <div className="panel game-stage">
        <p className="prompt">這裡少了哪個標點小鬼？</p>
        <p className="big-char" style={{ fontSize: '1.6rem', textAlign: 'center' }}>
          {item.before}
          <span className="blank-mark">＿</span>
          {item.after}
        </p>
        <ChoiceGrid
          choices={item.options}
          roundKey={`${index}-${item.id}`}
          isCorrect={(opt) => opt === item.answer}
          onPick={(_opt, ok) => {
            if (ok) {
              const next = score + 1
              setScore(next)
              setFeedback('破案！線索抓到了')
              afterCorrect(next)
            } else {
              setFeedback(`答錯了，正解是「${item.answer}」`)
              afterWrong(score)
            }
          }}
        />
        <div className={`feedback ${feedback.startsWith('破案') ? 'ok' : feedback ? 'bad' : ''}`}>
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
