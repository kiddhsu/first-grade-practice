export const TW_MODE_ORDER = ['meaning', 'speak', 'challenge'] as const
export type TwModeId = (typeof TW_MODE_ORDER)[number]

export type TwModeMeta = {
  id: TwModeId
  path: TwModeId
  tag: string
  title: string
  subtitle: string
}

export const TW_MODE_META: Record<TwModeId, Omit<TwModeMeta, 'id' | 'path'>> = {
  meaning: {
    tag: '意思',
    title: '什麼意思',
    subtitle: '看臺語，選國語意思',
  },
  speak: {
    tag: '講法',
    title: '怎麼說',
    subtitle: '看國語，選臺語講法',
  },
  challenge: {
    tag: '挑戰',
    title: '看圖選詞',
    subtitle: '看圖和國語，選臺語詞',
  },
}

export function getTwModes(): TwModeMeta[] {
  return TW_MODE_ORDER.map((id) => ({
    id,
    path: id,
    ...TW_MODE_META[id],
  }))
}

export function getTwMode(modeId: string): TwModeMeta | undefined {
  if (!TW_MODE_ORDER.includes(modeId as TwModeId)) return undefined
  return getTwModes().find((m) => m.id === modeId)
}

export const TW_MODES_PER_LESSON = TW_MODE_ORDER.length
export const TW_STARS_PER_MODE = 3
