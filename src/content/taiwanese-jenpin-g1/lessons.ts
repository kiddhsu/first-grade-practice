/** 對齊真平版一年級閩南語課次主題的自編練習（非真平官方課文／音檔）
 * 課次參考真平公開課程章節；練習語詞為教學對齊自編。
 */
export type TwVocab = {
  tw: string
  zh: string
  /** 臺羅拼音（輔助認讀，非考試用） */
  roman: string
  /** 看圖選詞用圖示 */
  emoji: string
}

export type TwLesson = {
  lessonId: number
  semester: '一上' | '一下'
  lessonNo: number
  title: string
  blurb: string
  theme: string
  vocab: TwVocab[]
}

export const twLessons: TwLesson[] = [
  {
    lessonId: 301,
    semester: '一上',
    lessonNo: 1,
    title: '心肝仔囝',
    blurb: '認親屬、叫得出口',
    theme: '親屬稱謂',
    vocab: [
      { tw: '阿爸', zh: '爸爸', roman: 'a-pah', emoji: '👨' },
      { tw: '阿母', zh: '媽媽', roman: 'a-bú', emoji: '👩' },
      { tw: '阿公', zh: '爺爺', roman: 'a-kong', emoji: '👴' },
      { tw: '阿媽', zh: '奶奶', roman: 'a-má', emoji: '👵' },
      { tw: '阿兄', zh: '哥哥', roman: 'a-hiann', emoji: '🧑' },
      { tw: '阿姊', zh: '姊姊', roman: 'a-tsí', emoji: '👩‍🦰' },
      { tw: '小弟', zh: '弟弟', roman: 'sió-tī', emoji: '👦' },
      { tw: '小妹', zh: '妹妹', roman: 'sió-muē', emoji: '👧' },
    ],
  },
  {
    lessonId: 302,
    semester: '一上',
    lessonNo: 2,
    title: '來去讀冊',
    blurb: '學校裡的禮貌用語',
    theme: '禮貌用語',
    vocab: [
      { tw: '𠢕早', zh: '早安', roman: 'gáu-tsá', emoji: '🌅' },
      { tw: '多謝', zh: '謝謝', roman: 'to-siā', emoji: '🙏' },
      { tw: '歹勢', zh: '不好意思', roman: 'pháinn-sè', emoji: '😅' },
      { tw: '失禮', zh: '對不起', roman: 'sit-lé', emoji: '🙇' },
      { tw: '免客氣', zh: '不客氣', roman: 'bián-kheh-khì', emoji: '😊' },
      { tw: '老師', zh: '老師', roman: 'lāu-su', emoji: '🧑‍🏫' },
      { tw: '同學', zh: '同學', roman: 'tông-o̍h', emoji: '👫' },
      { tw: '再會', zh: '再見', roman: 'tsài-huē', emoji: '👋' },
    ],
  },
  {
    lessonId: 303,
    semester: '一上',
    lessonNo: 3,
    title: '鉛筆',
    blurb: '文具盒裡有什麼',
    theme: '文具',
    vocab: [
      { tw: '鉛筆', zh: '鉛筆', roman: 'ian-pit', emoji: '✏️' },
      { tw: '尺', zh: '尺', roman: 'tshioh', emoji: '📏' },
      { tw: '鉸刀', zh: '剪刀', roman: 'ka-to', emoji: '✂️' },
      { tw: '蠟筆', zh: '蠟筆', roman: 'la̍h-pit', emoji: '🖍️' },
      { tw: '彩色筆', zh: '彩色筆', roman: 'tshái-sik-pit', emoji: '🖊️' },
      { tw: '橡皮擦', zh: '橡皮擦', roman: 'si̍t-jí-tshat', emoji: '🧼' },
      { tw: '簿仔', zh: '簿子', roman: 'phōo-á', emoji: '📓' },
      { tw: '書包', zh: '書包', roman: 'tsu-pau', emoji: '🎒' },
    ],
  },
  {
    lessonId: 304,
    semester: '一上',
    lessonNo: 4,
    title: '鳥仔',
    blurb: '可愛動物說一說',
    theme: '動物',
    vocab: [
      { tw: '鳥仔', zh: '鳥', roman: 'tsiáu-á', emoji: '🐦' },
      { tw: '雞', zh: '雞', roman: 'ke', emoji: '🐔' },
      { tw: '鴨', zh: '鴨', roman: 'ah', emoji: '🦆' },
      { tw: '狗', zh: '狗', roman: 'káu', emoji: '🐶' },
      { tw: '貓', zh: '貓', roman: 'niau', emoji: '🐱' },
      { tw: '魚', zh: '魚', roman: 'hî', emoji: '🐟' },
      { tw: '牛', zh: '牛', roman: 'gû', emoji: '🐮' },
      { tw: '豬', zh: '豬', roman: 'ti', emoji: '🐷' },
    ],
  },
  {
    lessonId: 305,
    semester: '一上',
    lessonNo: 5,
    title: '數字歌',
    blurb: '用臺語數一到十',
    theme: '數字',
    vocab: [
      { tw: '一', zh: '一', roman: 'it', emoji: '1️⃣' },
      { tw: '兩', zh: '二', roman: 'nn̄g', emoji: '2️⃣' },
      { tw: '三', zh: '三', roman: 'sann', emoji: '3️⃣' },
      { tw: '四', zh: '四', roman: 'sì', emoji: '4️⃣' },
      { tw: '五', zh: '五', roman: 'gōo', emoji: '5️⃣' },
      { tw: '六', zh: '六', roman: 'la̍k', emoji: '6️⃣' },
      { tw: '七', zh: '七', roman: 'tshit', emoji: '7️⃣' },
      { tw: '八', zh: '八', roman: 'peh', emoji: '8️⃣' },
      { tw: '九', zh: '九', roman: 'káu', emoji: '9️⃣' },
      { tw: '十', zh: '十', roman: 'tsa̍p', emoji: '🔟' },
    ],
  },
  {
    lessonId: 401,
    semester: '一下',
    lessonNo: 1,
    title: '學校的圖書館',
    blurb: '學校和圖書館的語詞',
    theme: '學校生活',
    vocab: [
      { tw: '學校', zh: '學校', roman: 'ha̍k-hāu', emoji: '🏫' },
      { tw: '圖書館', zh: '圖書館', roman: 'tôo-su-kuán', emoji: '📚' },
      { tw: '冊', zh: '書', roman: 'tsheh', emoji: '📖' },
      { tw: '讀', zh: '讀', roman: 'tha̍k', emoji: '👀' },
      { tw: '老師', zh: '老師', roman: 'lāu-su', emoji: '🧑‍🏫' },
      { tw: '同學', zh: '同學', roman: 'tông-o̍h', emoji: '👫' },
      { tw: '教室', zh: '教室', roman: 'kàu-sik', emoji: '🚪' },
      { tw: '操場', zh: '操場', roman: 'tshau-tiûnn', emoji: '🏞️' },
    ],
  },
  {
    lessonId: 402,
    semester: '一下',
    lessonNo: 2,
    title: '鳥鼠食菝仔',
    blurb: '顏色和動物一起來',
    theme: '顏色',
    vocab: [
      { tw: '紅', zh: '紅色', roman: 'âng', emoji: '🔴' },
      { tw: '黃', zh: '黃色', roman: 'n̂g', emoji: '🟡' },
      { tw: '青', zh: '綠色', roman: 'tshenn', emoji: '🟢' },
      { tw: '白', zh: '白色', roman: 'pe̍h', emoji: '⚪' },
      { tw: '烏', zh: '黑色', roman: 'oo', emoji: '⚫' },
      { tw: '鳥鼠', zh: '老鼠', roman: 'niáu-tshí', emoji: '🐭' },
      { tw: '食', zh: '吃', roman: 'tsia̍h', emoji: '🍽️' },
      { tw: '菝仔', zh: '葡萄', roman: 'pua̍t-á', emoji: '🍇' },
    ],
  },
  {
    lessonId: 403,
    semester: '一下',
    lessonNo: 3,
    title: '美麗的學校',
    blurb: '校園裡美麗的地方',
    theme: '校園',
    vocab: [
      { tw: '美麗', zh: '美麗', roman: 'bí-lē', emoji: '✨' },
      { tw: '花', zh: '花', roman: 'hue', emoji: '🌸' },
      { tw: '樹', zh: '樹', roman: 'tshiū', emoji: '🌳' },
      { tw: '學校', zh: '學校', roman: 'ha̍k-hāu', emoji: '🏫' },
      { tw: '草', zh: '草', roman: 'tsháu', emoji: '🌿' },
      { tw: '天', zh: '天空', roman: 'thinn', emoji: '☁️' },
      { tw: '日頭', zh: '太陽', roman: 'jit-thâu', emoji: '☀️' },
      { tw: '風', zh: '風', roman: 'hong', emoji: '💨' },
    ],
  },
  {
    lessonId: 404,
    semester: '一下',
    lessonNo: 4,
    title: '保護目睭',
    blurb: '愛惜我們的眼睛',
    theme: '五官',
    vocab: [
      { tw: '目睭', zh: '眼睛', roman: 'ba̍k-tsiu', emoji: '👁️' },
      { tw: '耳仔', zh: '耳朵', roman: 'hīnn-á', emoji: '👂' },
      { tw: '鼻仔', zh: '鼻子', roman: 'phīnn-á', emoji: '👃' },
      { tw: '喙', zh: '嘴巴', roman: 'tshuì', emoji: '👄' },
      { tw: '看', zh: '看', roman: 'khuànn', emoji: '👀' },
      { tw: '聽', zh: '聽', roman: 'thiann', emoji: '🎧' },
      { tw: '保護', zh: '保護', roman: 'pó-hōo', emoji: '🛡️' },
      { tw: '光', zh: '光', roman: 'kng', emoji: '💡' },
    ],
  },
  {
    lessonId: 405,
    semester: '一下',
    lessonNo: 5,
    title: '我的身軀',
    blurb: '身體各部位說清楚',
    theme: '身體',
    vocab: [
      { tw: '頭', zh: '頭', roman: 'thâu', emoji: '🗣️' },
      { tw: '手', zh: '手', roman: 'tshiú', emoji: '✋' },
      { tw: '跤', zh: '腳', roman: 'kha', emoji: '🦶' },
      { tw: '身軀', zh: '身體', roman: 'sin-khu', emoji: '🧍' },
      { tw: '腹肚', zh: '肚子', roman: 'pak-tóo', emoji: '🤰' },
      { tw: '肩胛', zh: '肩膀', roman: 'keng-kah', emoji: '💪' },
      { tw: '骨力', zh: '勤勞', roman: 'kut-la̍t', emoji: '🏃' },
      { tw: '勇健', zh: '健康', roman: 'ióng-kiānn', emoji: '❤️' },
    ],
  },
]

export function getTwLesson(id: number) {
  return twLessons.find((l) => l.lessonId === id)
}
