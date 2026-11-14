import type { TwVocab } from '../content/taiwanese-jenpin-g1/lessons'
import { getTwLesson } from '../content/taiwanese-jenpin-g1/lessons'
import type { TwModeId } from './twModes'
import { shuffle } from './speech'

export type TwQuestion = {
  id: string
  prompt: string
  /** 題幹下方的大字／拼音提示 */
  highlight?: string
  hint?: string
  /** 看圖選詞的圖示 */
  picture?: string
  /** 是否用田字格顯示 highlight */
  tianzi?: boolean
  choices: string[]
  answer: string
}

function distractors(pool: TwVocab[], correct: TwVocab, pickField: 'tw' | 'zh', count = 3) {
  const others = shuffle(pool.filter((v) => v.tw !== correct.tw)).slice(0, count)
  return others.map((v) => v[pickField])
}

function makeMeaning(lessonId: number, vocab: TwVocab[], item: TwVocab): TwQuestion {
  const choices = shuffle([item.zh, ...distractors(vocab, item, 'zh')])
  return {
    id: `tw-m-${lessonId}-${item.tw}`,
    prompt: '這個臺語是什麼意思？',
    highlight: item.tw,
    hint: item.roman,
    tianzi: true,
    choices,
    answer: item.zh,
  }
}

function makeSpeak(lessonId: number, vocab: TwVocab[], item: TwVocab): TwQuestion {
  const choices = shuffle([item.tw, ...distractors(vocab, item, 'tw')])
  return {
    id: `tw-s-${lessonId}-${item.zh}-${item.tw}`,
    prompt: '這句國語用臺語怎麼說？',
    highlight: item.zh,
    hint: '選正確的臺語詞',
    tianzi: true,
    choices,
    answer: item.tw,
  }
}

function makeChallenge(lessonId: number, vocab: TwVocab[], item: TwVocab): TwQuestion {
  const choices = shuffle([item.tw, ...distractors(vocab, item, 'tw')])
  return {
    id: `tw-pic-${lessonId}-${item.tw}`,
    prompt: '這張圖要用哪個臺語詞？',
    picture: item.emoji,
    /** 國語提示，避免圖示太像認不出 */
    highlight: item.zh,
    hint: '看圖和國語，選臺語',
    tianzi: false,
    choices,
    answer: item.tw,
  }
}

export function buildTwRound(
  lessonId: number,
  modeId: TwModeId,
  count = 6,
): TwQuestion[] {
  const lesson = getTwLesson(lessonId)
  if (!lesson) return []
  const pool = shuffle([...lesson.vocab])
  const picked = pool.slice(0, Math.min(count, pool.length))

  return picked.map((item) => {
    if (modeId === 'meaning') return makeMeaning(lessonId, lesson.vocab, item)
    if (modeId === 'speak') return makeSpeak(lessonId, lesson.vocab, item)
    return makeChallenge(lessonId, lesson.vocab, item)
  })
}
