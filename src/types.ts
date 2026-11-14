export type CharEntry = {
  char: string
  zhuyin: string
  radical: string
  words: string[]
}

export type SentencePattern = {
  id: string
  prompt: string
  /** 課文提示，例如缺空句，降低一年級拼句難度 */
  hint?: string
  tokens: string[]
  answer: string[]
}

export type PunctItem = {
  id: string
  before: string
  after: string
  options: string[]
  answer: string
}

export type Lesson = {
  lessonId: number
  title: string
  writingChars: CharEntry[]
  readingChars: CharEntry[]
  sentencePatterns: SentencePattern[]
  punctuationItems: PunctItem[]
}

export type GameMode =
  | 'stroke'
  | 'recognize'
  | 'radical'
  | 'punct'
  | 'sentence'

/** 數學複習用：記住答錯的題（含選項，方便重練） */
export type MathWrongItem = {
  id: string
  kind: string
  mode: string
  prompt: string
  answer: string
  choices: string[]
  visual?:
    | { type: 'dots'; count: number; emoji: string }
    | { type: 'bars'; a: number; b: number; ask: 'longer' | 'shorter' }
    | { type: 'shape'; name: string }
    | { type: 'clock'; hour: number; half: boolean }
    | { type: 'coins'; ones: number; fives: number; tens: number }
}

/** 閩南語複習用：記住答錯的題 */
export type TwWrongItem = {
  id: string
  lessonId: number
  mode: string
  prompt: string
  highlight?: string
  hint?: string
  picture?: string
  tianzi?: boolean
  answer: string
  choices: string[]
}

export type ProgressState = {
  stars: Record<string, number>
  wrongChars: string[]
  wrongMath: MathWrongItem[]
  wrongTw: TwWrongItem[]
  sessionStartedAt: number | null
  restPromptDismissedUntil: number | null
}
