import { ConfettiBurst } from './ConfettiBurst'

type Props = {
  stars: number
  message: string
  onBack: () => void
  /** 兩星以上且尚有下一題型 */
  onNextMode?: () => void
  /** 本關全部題型已完成 */
  stageCleared?: boolean
  /** 全部完成後可進的下一關 */
  onNextStage?: () => void
}

export function GameResult({
  stars,
  message,
  onBack,
  onNextMode,
  stageCleared = false,
  onNextStage,
}: Props) {
  const showNextMode = !stageCleared && stars >= 2 && Boolean(onNextMode)
  const showNextStage = stageCleared && Boolean(onNextStage)

  return (
    <>
      {stageCleared && (
        <div className="celebrate-overlay" aria-hidden>
          <ConfettiBurst />
        </div>
      )}
      <div
        className={`panel game-stage result-panel${stageCleared ? ' result-panel--cleared' : ''}`}
      >
        <div className={`stars result-stars${stageCleared ? ' result-stars--pop' : ''}`}>
          {'★'.repeat(stars)}
          {'☆'.repeat(Math.max(0, 3 - stars))}
        </div>
        {stageCleared ? (
          <>
            <p className="prompt result-congrats">恭喜過關！</p>
            <p className="muted result-congrats-sub">
              全部題型都完成了，太厲害了！
            </p>
          </>
        ) : (
          <p className="prompt">{message}</p>
        )}
        <div className="actions">
          {(showNextMode || showNextStage) && (
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              回選單
            </button>
          )}
          {showNextMode && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNextMode}
            >
              前往下一個題型
            </button>
          )}
          {showNextStage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNextStage}
            >
              前往下一關
            </button>
          )}
          {!showNextMode && !showNextStage && (
            <button type="button" className="btn btn-primary" onClick={onBack}>
              回選單
            </button>
          )}
        </div>
      </div>
    </>
  )
}
