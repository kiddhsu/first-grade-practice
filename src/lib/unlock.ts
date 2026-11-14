import { lessons } from '../content/grade1-vol1'
import { mathUnits } from '../content/math-hanlin-g1/units'
import { twLessons } from '../content/taiwanese-jenpin-g1/lessons'
import { getLessonProgress } from './progress'
import { getMathUnitProgress } from './mathProgress'
import { getTwLessonProgress } from './twProgress'

/** 上一關所有玩法都練過，才算通關可解鎖下一關 */
export function isStageCleared(modesDone: number, modeTotal: number) {
  return modeTotal > 0 && modesDone >= modeTotal
}

/**
 * 線性解鎖：第 1 關永遠開；已玩過的關保持可進；否則需上一關已通關。
 */
export function computeUnlocked(stages: { cleared: boolean; started: boolean }[]) {
  const unlocked: boolean[] = []
  for (let i = 0; i < stages.length; i += 1) {
    if (i === 0 || stages[i].started) {
      unlocked.push(true)
      continue
    }
    unlocked.push(Boolean(unlocked[i - 1] && stages[i - 1].cleared))
  }
  return unlocked
}

export function getChineseUnlockMap() {
  const stages = lessons.map((l) => {
    const p = getLessonProgress(l.lessonId)
    const started = p.modesDone > 0
    return {
      cleared: isStageCleared(p.modesDone, p.modeTotal),
      started,
    }
  })
  const flags = computeUnlocked(stages)
  const map: Record<number, boolean> = {}
  lessons.forEach((l, i) => {
    map[l.lessonId] = flags[i]
  })
  return map
}

export function getMathUnlockMap() {
  const stages = mathUnits.map((u) => {
    const p = getMathUnitProgress(u.unitId)
    const started = p.modesDone > 0
    return {
      cleared: isStageCleared(p.modesDone, p.modeTotal),
      started,
    }
  })
  const flags = computeUnlocked(stages)
  const map: Record<number, boolean> = {}
  mathUnits.forEach((u, i) => {
    map[u.unitId] = flags[i]
  })
  return map
}

export function getTwUnlockMap() {
  const stages = twLessons.map((l) => {
    const p = getTwLessonProgress(l.lessonId)
    const started = p.modesDone > 0
    return {
      cleared: isStageCleared(p.modesDone, p.modeTotal),
      started,
    }
  })
  const flags = computeUnlocked(stages)
  const map: Record<number, boolean> = {}
  twLessons.forEach((l, i) => {
    map[l.lessonId] = flags[i]
  })
  return map
}

export function isChineseLessonUnlocked(lessonId: number) {
  return Boolean(getChineseUnlockMap()[lessonId])
}

export function isMathUnitUnlocked(unitId: number) {
  return Boolean(getMathUnlockMap()[unitId])
}

export function isTwLessonUnlocked(lessonId: number) {
  return Boolean(getTwUnlockMap()[lessonId])
}

/** 剛通關後可進的下一課／單元 hub；沒有或未解鎖則回 null */
export function getNextChineseLessonPath(lessonId: number) {
  const idx = lessons.findIndex((l) => l.lessonId === lessonId)
  if (idx < 0 || idx >= lessons.length - 1) return null
  const nextId = lessons[idx + 1].lessonId
  if (!isChineseLessonUnlocked(nextId)) return null
  return `/lesson/${nextId}`
}

export function getNextMathUnitPath(unitId: number) {
  const idx = mathUnits.findIndex((u) => u.unitId === unitId)
  if (idx < 0 || idx >= mathUnits.length - 1) return null
  const nextId = mathUnits[idx + 1].unitId
  if (!isMathUnitUnlocked(nextId)) return null
  return `/math/${nextId}`
}

export function getNextTwLessonPath(lessonId: number) {
  const idx = twLessons.findIndex((l) => l.lessonId === lessonId)
  if (idx < 0 || idx >= twLessons.length - 1) return null
  const nextId = twLessons[idx + 1].lessonId
  if (!isTwLessonUnlocked(nextId)) return null
  return `/tw/${nextId}`
}
