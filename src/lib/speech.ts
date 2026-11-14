export function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'zh-TW'
  /** 一年級聽讀宜慢一點；可傳 rate 微調 */
  utter.rate = rate
  const voices = window.speechSynthesis.getVoices()
  const tw =
    voices.find((v) => v.lang === 'zh-TW') ||
    voices.find((v) => v.lang.startsWith('zh'))
  if (tw) utter.voice = tw
  window.speechSynthesis.speak(utter)
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function pickN<T>(items: T[], n: number): T[] {
  return shuffle(items).slice(0, Math.min(n, items.length))
}
