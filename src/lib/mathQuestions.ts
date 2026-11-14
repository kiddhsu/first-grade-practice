import type { MathKind } from '../content/math-hanlin-g1/units'
import type { MathModeId } from './mathModes'
import { shuffle } from './speech'

export type MathQuestion = {
  id: string
  prompt: string
  /** 視覺提示：點數、長條、形狀等 */
  visual?:
    | { type: 'dots'; count: number; emoji: string }
    | { type: 'bars'; a: number; b: number; ask: 'longer' | 'shorter' }
    | { type: 'shape'; name: string }
    | { type: 'clock'; hour: number; half: boolean }
    | { type: 'coins'; ones: number; fives: number; tens: number }
  choices: string[]
  answer: string
}

const EMOJIS = ['⭐', '🍎', '🐱', '🌸', '🔵', '🍬', '🐸', '🎈']

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)]
}

function choicesAround(answer: number, pool: number[], count = 4) {
  const set = new Set<string>([String(answer)])
  const distractors = shuffle(pool.filter((n) => n !== answer))
  for (const n of distractors) {
    if (set.size >= count) break
    set.add(String(n))
  }
  while (set.size < count) set.add(String(rand(0, Math.max(10, answer + 3))))
  return shuffle([...set])
}

function makeDots(count: number): MathQuestion {
  const emoji = pick(EMOJIS)
  return {
    id: `dots-${count}-${emoji}`,
    prompt: '圖上有幾個？',
    visual: { type: 'dots', count, emoji },
    choices: choicesAround(count, Array.from({ length: 10 }, (_, i) => i + 1)),
    answer: String(count),
  }
}

function makeCompare(ask: 'longer' | 'shorter' = Math.random() > 0.5 ? 'longer' : 'shorter'): MathQuestion {
  let a = rand(3, 10)
  let b = rand(3, 10)
  while (a === b) b = rand(3, 10)
  const longer = a > b ? '左邊' : '右邊'
  const shorter = a > b ? '右邊' : '左邊'
  return {
    id: `bar-${a}-${b}-${ask}`,
    prompt: ask === 'longer' ? '哪一條比較長？' : '哪一條比較短？',
    visual: { type: 'bars', a, b, ask },
    choices: shuffle(['左邊', '右邊']),
    answer: ask === 'longer' ? longer : shorter,
  }
}

function makeOrder(): MathQuestion {
  const mode = pick(['next', 'nth', 'more'] as const)
  if (mode === 'next') {
    const start = rand(1, 8)
    const answer = start + 1
    return {
      id: `next-${start}`,
      prompt: `${start} 的下一個數字是？`,
      choices: choicesAround(answer, [start - 1, start, start + 1, start + 2].filter((n) => n >= 0)),
      answer: String(answer),
    }
  }
  if (mode === 'nth') {
    const items = ['🍎', '🍌', '🍇', '🍊', '🍉']
    const n = rand(1, items.length)
    return {
      id: `nth-${n}`,
      prompt: `從左邊數，第 ${n} 個是什麼？\n${items.join(' ')}`,
      choices: shuffle([...items]),
      answer: items[n - 1],
    }
  }
  const a = rand(2, 9)
  let b = rand(2, 9)
  while (b === a) b = rand(2, 9)
  return {
    id: `more-${a}-${b}`,
    prompt: `${a} 和 ${b}，哪個比較多？`,
    choices: shuffle([String(a), String(b)]),
    answer: String(Math.max(a, b)),
  }
}

function makeSplit(): MathQuestion {
  const total = rand(4, 10)
  const left = rand(0, total)
  const right = total - left
  const askLeft = Math.random() > 0.5
  if (askLeft) {
    return {
      id: `split-l-${total}-${right}`,
      prompt: `${total} = □ + ${right}\n□ 是多少？`,
      choices: choicesAround(left, Array.from({ length: total + 1 }, (_, i) => i)),
      answer: String(left),
    }
  }
  return {
    id: `split-r-${total}-${left}`,
    prompt: `${total} = ${left} + □\n□ 是多少？`,
    choices: choicesAround(right, Array.from({ length: total + 1 }, (_, i) => i)),
    answer: String(right),
  }
}

const SHAPES = [
  { name: '圓形', css: 'circle' },
  { name: '三角形', css: 'triangle' },
  { name: '正方形', css: 'square' },
  { name: '長方形', css: 'rect' },
]

function makeShape(): MathQuestion {
  const target = pick(SHAPES)
  return {
    id: `shape-${target.css}`,
    prompt: '這是什麼形狀？',
    visual: { type: 'shape', name: target.css },
    choices: shuffle(SHAPES.map((s) => s.name)),
    answer: target.name,
  }
}

function makeAdd(maxSum: number): MathQuestion {
  const a = rand(0, maxSum)
  const b = rand(0, maxSum - a)
  const answer = a + b
  return {
    id: `add-${a}-${b}`,
    prompt: `${a} + ${b} = ?`,
    choices: choicesAround(answer, Array.from({ length: maxSum + 1 }, (_, i) => i)),
    answer: String(answer),
  }
}

function makeSub(max: number): MathQuestion {
  const a = rand(1, max)
  const b = rand(0, a)
  const answer = a - b
  return {
    id: `sub-${a}-${b}`,
    prompt: `${a} − ${b} = ?`,
    choices: choicesAround(answer, Array.from({ length: max + 1 }, (_, i) => i)),
    answer: String(answer),
  }
}

function makeCount30(): MathQuestion {
  if (Math.random() > 0.45) {
    const n = rand(11, 30)
    return makeDots(Math.min(n, 20)) // 視覺上限 20，較大數改填空
  }
  const start = rand(10, 25)
  const answer = start + 1
  return {
    id: `seq-${start}`,
    prompt: `${start - 1}、${start}、□、${start + 2}\n□ 是多少？`,
    choices: choicesAround(answer, [start - 1, start, start + 1, start + 2, start + 3]),
    answer: String(answer),
  }
}

function makeClock(): MathQuestion {
  const hour = rand(1, 12)
  const half = Math.random() > 0.5
  const answer = half ? `${hour} 點半` : `${hour} 點`
  const others = shuffle(
    Array.from({ length: 12 }, (_, i) => i + 1)
      .filter((h) => h !== hour)
      .slice(0, 3)
      .flatMap((h) => [`${h} 點`, `${h} 點半`]),
  ).slice(0, 3)
  return {
    id: `clock-${hour}-${half ? 'h' : 'o'}`,
    prompt: '現在幾點？',
    visual: { type: 'clock', hour, half },
    choices: shuffle([answer, ...others]),
    answer,
  }
}

function makeCount100(): MathQuestion {
  const tens = rand(1, 9)
  const ones = rand(0, 9)
  const n = tens * 10 + ones
  if (Math.random() > 0.5) {
    return {
      id: `place-${n}`,
      prompt: `${n} 的十位是多少？`,
      choices: choicesAround(tens, Array.from({ length: 10 }, (_, i) => i)),
      answer: String(tens),
    }
  }
  let m = rand(10, 99)
  while (m === n) m = rand(10, 99)
  return {
    id: `cmp100-${n}-${m}`,
    prompt: `${n} 和 ${m}，哪個比較大？`,
    choices: shuffle([String(n), String(m)]),
    answer: String(Math.max(n, m)),
  }
}

const SOLIDS = [
  { name: '球', tip: '可以滾來滾去' },
  { name: '正方體', tip: '六面都是正方形' },
  { name: '圓柱', tip: '像易開罐' },
  { name: '三角柱', tip: '兩端是三角形' },
]

function makeShape3d(): MathQuestion {
  if (Math.random() > 0.5) return makeShape()
  const target = pick(SOLIDS)
  return {
    id: `solid-${target.name}`,
    prompt: `${target.tip}，這比較像？`,
    choices: shuffle(SOLIDS.map((s) => s.name)),
    answer: target.name,
  }
}

function makeMoney(): MathQuestion {
  const ones = rand(0, 4)
  const fives = rand(0, 2)
  const tens = rand(0, 2)
  const total = ones * 1 + fives * 5 + tens * 10
  if (total === 0) return makeMoney()
  return {
    id: `money-${total}`,
    prompt: '這些錢合起來多少元？',
    visual: { type: 'coins', ones, fives, tens },
    choices: choicesAround(total, [total - 5, total - 1, total, total + 1, total + 5, total + 10].filter((n) => n > 0)),
    answer: String(total),
  }
}

const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function makeCalendar(): MathQuestion {
  const i = rand(0, 6)
  const ask = pick(['tomorrow', 'yesterday', 'month'] as const)
  if (ask === 'tomorrow') {
    const answer = WEEK[(i + 1) % 7]
    return {
      id: `cal-t-${i}`,
      prompt: `今天是${WEEK[i]}，明天是？`,
      choices: shuffle([answer, WEEK[(i + 2) % 7], WEEK[(i + 6) % 7], WEEK[i]]),
      answer,
    }
  }
  if (ask === 'yesterday') {
    const answer = WEEK[(i + 6) % 7]
    return {
      id: `cal-y-${i}`,
      prompt: `今天是${WEEK[i]}，昨天是？`,
      choices: shuffle([answer, WEEK[(i + 1) % 7], WEEK[(i + 2) % 7], WEEK[i]]),
      answer,
    }
  }
  const month = rand(1, 12)
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  return {
    id: `cal-m-${month}`,
    prompt: `${month} 月大約有幾天？（選最接近的）`,
    choices: shuffle([String(days), '20', '40', String(days === 30 ? 31 : 30)]),
    answer: String(days),
  }
}

function makeAddSub2(): MathQuestion {
  if (Math.random() > 0.5) {
    const a = rand(10, 40)
    const b = rand(1, 9)
    const answer = a + b
    return {
      id: `2add-${a}-${b}`,
      prompt: `${a} + ${b} = ?`,
      choices: choicesAround(answer, [answer - 10, answer - 1, answer, answer + 1, answer + 10].filter((n) => n > 0)),
      answer: String(answer),
    }
  }
  const a = rand(15, 50)
  const b = rand(1, 9)
  const answer = a - b
  return {
    id: `2sub-${a}-${b}`,
    prompt: `${a} − ${b} = ?`,
    choices: choicesAround(answer, [answer - 10, answer - 1, answer, answer + 1, answer + 10].filter((n) => n > 0)),
    answer: String(answer),
  }
}

function makeClassify(): MathQuestion {
  const sets = [
    { group: ['🍎', '🍌', '🍇'], odd: '🚗', prompt: '哪一個不是水果？' },
    { group: ['🐱', '🐶', '🐰'], odd: '🌳', prompt: '哪一個不是動物？' },
    { group: ['⭕', '🔺', '⬛'], odd: '3', prompt: '哪一個不是形狀？' },
    { group: ['1', '2', '3'], odd: '☆', prompt: '哪一個不是數字？' },
  ]
  const s = pick(sets)
  return {
    id: `class-${s.odd}`,
    prompt: s.prompt,
    choices: shuffle([...s.group, s.odd]),
    answer: s.odd,
  }
}

function makeNumberPickDots(): MathQuestion {
  const count = rand(1, 10)
  const emoji = pick(EMOJIS)
  const pack = (n: number) => emoji.repeat(n)
  const distractors = shuffle(
    Array.from({ length: 10 }, (_, i) => i + 1).filter((n) => n !== count),
  ).slice(0, 3)
  return {
    id: `numdots-${count}`,
    prompt: `哪一組是 ${count} 個？`,
    choices: shuffle([pack(count), ...distractors.map(pack)]),
    answer: pack(count),
  }
}

function makeMissingSeq(min: number, max: number): MathQuestion {
  const start = rand(min, max - 3)
  const miss = start + 1
  return {
    id: `miss-${start}`,
    prompt: `${start}、□、${start + 2}、${start + 3}\n□ 是多少？`,
    choices: choicesAround(miss, [start, start + 1, start + 2, start + 3]),
    answer: String(miss),
  }
}

function makeThreeBars(): MathQuestion {
  const vals = shuffle([rand(3, 6), rand(7, 9), rand(10, 12)])
  const max = Math.max(...vals)
  const labels = ['甲', '乙', '丙']
  const answer = labels[vals.indexOf(max)]
  return {
    id: `three-${vals.join('-')}`,
    prompt: `甲 ${vals[0]}　乙 ${vals[1]}　丙 ${vals[2]}\n哪一條最長？`,
    choices: shuffle([...labels]),
    answer,
  }
}

function makeMoneyPay(): MathQuestion {
  const price = pick([10, 15, 20, 25, 30])
  const pay = price + pick([0, 5, 10])
  const enough = pay >= price
  return {
    id: `pay-${price}-${pay}`,
    prompt: `東西 ${price} 元，你有 ${pay} 元，夠不夠？`,
    choices: shuffle(['夠', '不夠']),
    answer: enough ? '夠' : '不夠',
  }
}

function makeSameClass(): MathQuestion {
  const sets = [
    { keep: ['🍎', '🍌'], odd: '🐱', answer: '🍎', prompt: '和 🍌 同一類的是？', choices: ['🍎', '🐱', '🚗', '3'] },
    { keep: ['1', '2'], odd: '⭕', answer: '3', prompt: '和 1、2 同一類的是？', choices: ['3', '⭕', '🐱', '🌳'] },
  ]
  const s = pick(sets)
  return {
    id: `same-${s.answer}`,
    prompt: s.prompt,
    choices: shuffle(s.choices),
    answer: s.answer,
  }
}

function makerFor(kind: MathKind, mode: MathModeId): () => MathQuestion {
  if (mode === 'visual') {
    const visual: Record<MathKind, () => MathQuestion> = {
      count10: () => makeDots(rand(1, 10)),
      compare: () => makeCompare(),
      order: () => makeOrder(),
      split: () => makeSplit(),
      shape: () => makeShape(),
      add10: () => makeAdd(10),
      sub10: () => makeSub(10),
      count30: () => makeCount30(),
      clock: () => makeClock(),
      add20: () => makeAdd(20),
      length: () => makeCompare(),
      sub20: () => makeSub(20),
      count100: () => makeCount100(),
      shape3d: () => makeShape3d(),
      money: () => makeMoney(),
      calendar: () => makeCalendar(),
      addSub2: () => makeAddSub2(),
      classify: () => makeClassify(),
    }
    return visual[kind]
  }

  if (mode === 'number') {
    const number: Partial<Record<MathKind, () => MathQuestion>> = {
      count10: () => makeNumberPickDots(),
      compare: () => {
        const a = rand(2, 9)
        let b = rand(2, 9)
        while (b === a) b = rand(2, 9)
        return {
          id: `ncmp-${a}-${b}`,
          prompt: `${a} 和 ${b}，哪個比較大？`,
          choices: shuffle([String(a), String(b)]),
          answer: String(Math.max(a, b)),
        }
      },
      order: () => {
        const n = rand(1, 9)
        return {
          id: `nnext-${n}`,
          prompt: `${n} 的下一個是？`,
          choices: choicesAround(n + 1, [n - 1, n, n + 1, n + 2].filter((x) => x >= 0)),
          answer: String(n + 1),
        }
      },
      split: () => makeSplit(),
      shape: () => {
        const name = pick(['圓形', '三角形', '正方形', '長方形'])
        const map: Record<string, string> = {
          圓形: 'circle',
          三角形: 'triangle',
          正方形: 'square',
          長方形: 'rect',
        }
        return {
          id: `nshape-${name}`,
          prompt: `哪一個是「${name}」？`,
          visual: { type: 'shape', name: map[name] },
          choices: shuffle(['圓形', '三角形', '正方形', '長方形']),
          answer: name,
        }
      },
      add10: () => makeAdd(10),
      sub10: () => makeSub(10),
      count30: () => makeMissingSeq(10, 28),
      clock: () => makeClock(),
      add20: () => makeAdd(20),
      length: () => makeCompare('longer'),
      sub20: () => makeSub(20),
      count100: () => makeCount100(),
      shape3d: () => makeShape3d(),
      money: () => makeMoney(),
      calendar: () => makeCalendar(),
      addSub2: () => makeAddSub2(),
      classify: () => makeSameClass(),
    }
    return number[kind] ?? (() => makeAdd(10))
  }

  // challenge
  const challenge: Partial<Record<MathKind, () => MathQuestion>> = {
    count10: () => makeMissingSeq(1, 8),
    compare: () => makeThreeBars(),
    order: () => makeOrder(),
    split: () => {
      const total = rand(5, 10)
      return {
        id: `zero-${total}`,
        prompt: `${total} = ${total} + □\n□ 是多少？`,
        choices: choicesAround(0, [0, 1, total, total - 1]),
        answer: '0',
      }
    },
    shape: () => makeClassify(),
    add10: () => makeAdd(10),
    sub10: () => makeSub(10),
    count30: () => makeMissingSeq(15, 28),
    clock: () => makeClock(),
    add20: () => {
      const a = rand(8, 14)
      const b = rand(6, 20 - a)
      return {
        id: `cadd-${a}-${b}`,
        prompt: `${a} + ${b} = ?`,
        choices: choicesAround(a + b, Array.from({ length: 21 }, (_, i) => i)),
        answer: String(a + b),
      }
    },
    length: () => makeThreeBars(),
    sub20: () => {
      const a = rand(12, 20)
      const b = rand(6, a)
      return {
        id: `csub-${a}-${b}`,
        prompt: `${a} − ${b} = ?`,
        choices: choicesAround(a - b, Array.from({ length: 21 }, (_, i) => i)),
        answer: String(a - b),
      }
    },
    count100: () => {
      const n = rand(20, 90)
      return {
        id: `nei-${n}`,
        prompt: `${n} 的下一個是？`,
        choices: choicesAround(n + 1, [n - 1, n, n + 1, n + 2]),
        answer: String(n + 1),
      }
    },
    shape3d: () => makeShape3d(),
    money: () => makeMoneyPay(),
    calendar: () => makeCalendar(),
    addSub2: () => makeAddSub2(),
    classify: () => makeSameClass(),
  }
  return challenge[kind] ?? (() => makeAdd(10))
}

export function buildMathRound(
  kind: MathKind,
  mode: MathModeId = 'visual',
  total = 6,
): MathQuestion[] {
  const make = makerFor(kind, mode)
  const out: MathQuestion[] = []
  const seen = new Set<string>()
  let guard = 0
  while (out.length < total && guard < 80) {
    guard += 1
    const q = make()
    if (seen.has(q.id)) continue
    seen.add(q.id)
    out.push(q)
  }
  return out
}
