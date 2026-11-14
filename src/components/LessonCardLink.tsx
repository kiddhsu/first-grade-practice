import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  to: string
  unlocked: boolean
  eyebrow: string
  title: string
  blurb?: string
  children?: ReactNode
}

/** 首頁關卡卡：未解鎖時不可點進，提示先玩上一關 */
export function LessonCardLink({
  to,
  unlocked,
  eyebrow,
  title,
  blurb,
  children,
}: Props) {
  if (!unlocked) {
    return (
      <div
        className="lesson-card lesson-card--locked"
        aria-disabled="true"
        title="先玩完上一關的全部玩法再來挑戰"
      >
        <span className="eyebrow">還沒解鎖</span>
        <strong>{title}</strong>
        {blurb ? <p className="card-blurb">{blurb}</p> : null}
        <p className="muted lock-hint">
          先玩完上一關的全部玩法，再來挑戰這一關
        </p>
      </div>
    )
  }

  return (
    <Link className="lesson-card" to={to}>
      <span className="eyebrow">{eyebrow}</span>
      <strong>{title}</strong>
      {blurb ? <p className="card-blurb">{blurb}</p> : null}
      {children}
    </Link>
  )
}
