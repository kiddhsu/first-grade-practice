import { useMemo } from 'react'

const COLORS = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#ff8fab',
  '#c77dff',
  '#ffa94d',
]
const EMOJIS = ['★', '🌸', '✨', '🎉', '💛', '🌺']

/** 全螢幕撒花：紙片＋表情，過關時持續慶祝 */
export function ConfettiBurst({ pieces = 48 }: { pieces?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => {
        const emoji = i % 3 === 0
        return {
          id: i,
          left: `${((i * 17) % 100) + (i % 7) * 0.3}%`,
          delay: `${(i % 16) * 0.12}s`,
          duration: `${2.4 + (i % 6) * 0.35}s`,
          drift: `${(i % 2 === 0 ? 1 : -1) * (12 + (i % 9) * 4)}px`,
          color: COLORS[i % COLORS.length],
          emoji: emoji ? EMOJIS[i % EMOJIS.length] : null,
          size: emoji ? undefined : `${8 + (i % 6)}px`,
          round: i % 4 === 0,
        }
      }),
    [pieces],
  )

  return (
    <div className="confetti-burst" aria-hidden>
      {flakes.map((f) =>
        f.emoji ? (
          <span
            key={f.id}
            className="confetti-burst__emoji"
            style={{
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.duration,
              ['--confetti-drift' as string]: f.drift,
            }}
          >
            {f.emoji}
          </span>
        ) : (
          <span
            key={f.id}
            className={`confetti-burst__piece${f.round ? ' confetti-burst__piece--round' : ''}`}
            style={{
              left: f.left,
              background: f.color,
              width: f.size,
              height: f.round ? f.size : `${Number.parseInt(f.size ?? '8', 10) + 4}px`,
              animationDelay: f.delay,
              animationDuration: f.duration,
              ['--confetti-drift' as string]: f.drift,
            }}
          />
        ),
      )}
    </div>
  )
}
