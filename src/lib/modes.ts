import type { GameMode } from '../types'

export const MODE_META: Record<
  GameMode,
  { title: string; subtitle: string; tag: string; path: string }
> = {
  stroke: {
    title: '筆順田字格',
    subtitle: '看動畫，照筆順寫生字',
    tag: '寫一寫',
    path: 'stroke',
  },
  recognize: {
    title: '識字聽選',
    subtitle: '聽一聽、認一認、選一選',
    tag: '認一認',
    path: 'recognize',
  },
  radical: {
    title: '部件配對',
    subtitle: '找出同部首的好朋友',
    tag: '找朋友',
    path: 'radical',
  },
  punct: {
    title: '標點偵探',
    subtitle: '句號、逗號、問號來幫忙',
    tag: '標點',
    path: 'punct',
  },
  sentence: {
    title: '句型拼拼',
    subtitle: '重組句子，練習課文句型',
    tag: '重組句子',
    path: 'sentence',
  },
}

export const MODE_ORDER: GameMode[] = [
  'stroke',
  'recognize',
  'radical',
  'punct',
  'sentence',
]
