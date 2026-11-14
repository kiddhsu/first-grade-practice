import { MODE_META, MODE_ORDER } from './modes'
import { MATH_MODE_ORDER, type MathModeId } from './mathModes'
import { TW_MODE_ORDER, type TwModeId } from './twModes'
import type { GameMode } from '../types'

/** 同一關的下一個題型路徑；已是最後一種則回 null */
export function getNextChineseModePath(lessonId: number, mode: GameMode) {
  const idx = MODE_ORDER.indexOf(mode)
  if (idx < 0 || idx >= MODE_ORDER.length - 1) return null
  const next = MODE_ORDER[idx + 1]
  return `/lesson/${lessonId}/${MODE_META[next].path}`
}

export function getNextMathModePath(unitId: number, modeId: MathModeId) {
  const idx = MATH_MODE_ORDER.indexOf(modeId)
  if (idx < 0 || idx >= MATH_MODE_ORDER.length - 1) return null
  const next = MATH_MODE_ORDER[idx + 1]
  return `/math/${unitId}/${next}`
}

export function getNextTwModePath(lessonId: number, modeId: TwModeId) {
  const idx = TW_MODE_ORDER.indexOf(modeId)
  if (idx < 0 || idx >= TW_MODE_ORDER.length - 1) return null
  const next = TW_MODE_ORDER[idx + 1]
  return `/tw/${lessonId}/${next}`
}
