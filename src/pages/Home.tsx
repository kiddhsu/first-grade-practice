import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LessonCardLink } from '../components/LessonCardLink'
import { MathUnitProgress } from '../components/MathUnitProgress'
import { ModeProgress } from '../components/ModeProgress'
import { TwLessonProgress } from '../components/TwLessonProgress'
import { useAuthProfile } from '../context/AuthProfileContext'
import { lessons } from '../content/grade1-vol1'
import { mathUnits } from '../content/math-hanlin-g1/units'
import { twLessons } from '../content/taiwanese-jenpin-g1/lessons'
import {
  getChineseUnlockMap,
  getMathUnlockMap,
  getTwUnlockMap,
} from '../lib/unlock'

type Subject = 'chinese' | 'math' | 'taiwanese'

const SUBJECT_KEY = 'fgc-subject'

function loadSubject(): Subject {
  try {
    const saved = localStorage.getItem(SUBJECT_KEY)
    if (saved === 'math' || saved === 'taiwanese' || saved === 'chinese') {
      return saved
    }
  } catch {
    /* ignore */
  }
  return 'chinese'
}

const HOME_LINE: Record<Subject, string> = {
  chinese: '選一課，把國字逗得乖乖聽話。',
  math: '選一關，把數字逗得歪七扭八。',
  taiwanese: '選一課，一起開心練臺語。',
}

const REVIEW_PATH: Record<Subject, string> = {
  chinese: '/review',
  math: '/math-review',
  taiwanese: '/tw-review',
}

export function Home() {
  const [subject, setSubject] = useState<Subject>(loadSubject)
  const { activeProfile, clearActiveProfile, user, cloudEnabled } =
    useAuthProfile()

  useEffect(() => {
    try {
      localStorage.setItem(SUBJECT_KEY, subject)
    } catch {
      /* ignore */
    }
  }, [subject])

  const chineseUnlock = getChineseUnlockMap()
  const mathUnlock = getMathUnlockMap()
  const twUnlock = getTwUnlockMap()

  const mathUp = mathUnits.filter((u) => u.semester === '一上')
  const mathDown = mathUnits.filter((u) => u.semester === '一下')
  const twUp = twLessons.filter((l) => l.semester === '一上')
  const twDown = twLessons.filter((l) => l.semester === '一下')

  return (
    <>
      <div className="top-nav home-profile-bar">
        {activeProfile && (
          <span className="chip chip--static home-profile-chip">
            <span
              className="home-profile-dot"
              style={{ background: activeProfile.color }}
              aria-hidden
            >
              {activeProfile.emoji}
            </span>
            {activeProfile.name}
            {cloudEnabled && user ? ' · 已同步' : ''}
          </span>
        )}
        <button
          type="button"
          className="chip"
          onClick={() => clearActiveProfile()}
        >
          切換使用者
        </button>
      </div>

      <header className="brand brand--home">
        <h1>小老師就是妳😊</h1>
        <p>{HOME_LINE[subject]}</p>
      </header>

      <div className="subject-tabs" role="tablist" aria-label="科目">
        <button
          type="button"
          role="tab"
          aria-selected={subject === 'chinese'}
          className={`subject-tab${subject === 'chinese' ? ' subject-tab--on' : ''}`}
          onClick={() => setSubject('chinese')}
        >
          國語
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subject === 'math'}
          className={`subject-tab${subject === 'math' ? ' subject-tab--on' : ''}`}
          onClick={() => setSubject('math')}
        >
          數學
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subject === 'taiwanese'}
          className={`subject-tab${subject === 'taiwanese' ? ' subject-tab--on' : ''}`}
          onClick={() => setSubject('taiwanese')}
        >
          閩南語
        </button>
      </div>

      <div
        className={`home-actions${subject === 'taiwanese' ? ' home-actions--split' : ''}`}
      >
        <Link className="review-cta" to={REVIEW_PATH[subject]}>
          今天再練一輪
        </Link>
        {subject === 'taiwanese' && (
          <a
            className="tw-listen-cta"
            href="https://listen.jen-pin.com.tw/edge-agua-mxvq"
            target="_blank"
            rel="noreferrer"
          >
            聽真平課文音檔
          </a>
        )}
      </div>

      {subject === 'chinese' ? (
        <>
          <p className="section-label">國語一年級上學期</p>
          <section className="grid-cards">
            {lessons.map((lesson) => (
              <LessonCardLink
                key={lesson.lessonId}
                to={`/lesson/${lesson.lessonId}`}
                unlocked={chineseUnlock[lesson.lessonId]}
                eyebrow={`第 ${lesson.lessonId} 關 · 出發`}
                title={lesson.title}
              >
                <ModeProgress lessonId={lesson.lessonId} />
              </LessonCardLink>
            ))}
          </section>
        </>
      ) : subject === 'math' ? (
        <>
          <p className="section-label">數學一年級上學期</p>
          <section className="grid-cards">
            {mathUp.map((unit) => (
              <LessonCardLink
                key={unit.unitId}
                to={`/math/${unit.unitId}`}
                unlocked={mathUnlock[unit.unitId]}
                eyebrow={`第 ${unit.unitNo} 單元 · 出發`}
                title={unit.title}
                blurb={unit.blurb}
              >
                <MathUnitProgress unitId={unit.unitId} />
              </LessonCardLink>
            ))}
          </section>

          <p className="section-label">數學一年級下學期</p>
          <section className="grid-cards">
            {mathDown.map((unit) => (
              <LessonCardLink
                key={unit.unitId}
                to={`/math/${unit.unitId}`}
                unlocked={mathUnlock[unit.unitId]}
                eyebrow={`第 ${unit.unitNo} 單元 · 出發`}
                title={unit.title}
                blurb={unit.blurb}
              >
                <MathUnitProgress unitId={unit.unitId} />
              </LessonCardLink>
            ))}
          </section>
        </>
      ) : (
        <>
          <p className="section-label">閩南語一年級上學期</p>
          <section className="grid-cards">
            {twUp.map((lesson) => (
              <LessonCardLink
                key={lesson.lessonId}
                to={`/tw/${lesson.lessonId}`}
                unlocked={twUnlock[lesson.lessonId]}
                eyebrow={`${lesson.semester}第 ${lesson.lessonNo} 課 · 出發`}
                title={lesson.title}
                blurb={lesson.blurb}
              >
                <TwLessonProgress lessonId={lesson.lessonId} />
              </LessonCardLink>
            ))}
          </section>

          <p className="section-label">閩南語一年級下學期</p>
          <section className="grid-cards">
            {twDown.map((lesson) => (
              <LessonCardLink
                key={lesson.lessonId}
                to={`/tw/${lesson.lessonId}`}
                unlocked={twUnlock[lesson.lessonId]}
                eyebrow={`${lesson.semester}第 ${lesson.lessonNo} 課 · 出發`}
                title={lesson.title}
                blurb={lesson.blurb}
              >
                <TwLessonProgress lessonId={lesson.lessonId} />
              </LessonCardLink>
            ))}
          </section>
        </>
      )}
    </>
  )
}
