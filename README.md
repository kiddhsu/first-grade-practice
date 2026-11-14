# 小老師就是妳😊（first-grade-practice）

給小學一年級生、手機就能玩的**個人自製**練習網頁。首頁可切換 **國語**／**數學**／**閩南語**。

- 國語：課次對齊市售國語一上常見編排（生字表整理自教育部公開資料），**非出版社官方**  
- 數學：單元對齊均一教育平台「[類翰林版一年級](https://www.junyiacademy.org/topics/h-m1a)」編排，**非翰林官方教材原文**  
- 閩南語：課次主題對齊真平版一年級（一上／一下），語詞為教學對齊**自編**練習，**非真平官方課文／音檔**

## 怎麼玩

```bash
npm install
npm run dev
```

本機開發網址為 `http://localhost:5173/first-grade-practice/`（與 GitHub Pages 子路徑一致）。可加到主畫面（PWA）。

### 關卡解鎖

國語／數學／閩南語各自獨立線性解鎖：第 1 關永遠可玩；上一關的**全部玩法**都練過，才解鎖下一關。已練過的關會保持可進入。

### 選角與雲端同步（Firebase）

進站先選「誰要來練習」（Netflix 式選使用者）。可新增多個使用者，進度分開計算。

若設定 Firebase，可用 **Google 登入** 把使用者與進度同步到雲端，換裝置也能接著玩（免費 Spark 方案通常夠用）。

1. 到 [Firebase Console](https://console.firebase.google.com/) 新建專案  
2. 新增 **Web App**，複製設定值  
3. 啟用 **Authentication → Google**  
4. 建立 **Firestore**（生產模式後貼上本 repo 的 [`firestore.rules`](firestore.rules)）  
5. 複製 [`.env.example`](.env.example) 成 `.env.local`，填入 `VITE_FIREBASE_*`  
6. `npm run dev` 驗證登入與同步  

未填環境變數時仍可本機選角練習，只是不會跨裝置同步。GitHub Pages 需在 repo **Settings → Secrets** 或 Actions 環境注入同樣的 `VITE_FIREBASE_*`（勿把含金鑰的 `.env` 推進 git）。

Authorized domains 請加上 `localhost` 與 `kiddhsu.github.io`。

## 線上版（GitHub Pages）

正式網址：https://kiddhsu.github.io/first-grade-practice/

1. 把變更 push 到 `main`（或在 Actions 手動跑 **Deploy GitHub Pages**）
2. 第一次請到 repo **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**
3. 等 workflow 綠燈後開上述網址

### 國語

1. 選第 1～6 課  
2. 選模式練習  
3. 星星與錯字會存在本機瀏覽器

| 模式 | 課綱 | 說明 |
|------|------|------|
| 筆順田字格 | 4-I-5 | 只練**生字**，看動畫再描寫 |
| 識字聽選 | 4-I-1 | **生字＋認讀字**，聽音／看注音選字 |
| 部件配對 | 4-I-2 | 找同部首的字 |
| 標點偵探 | 6-I-1 | 句號、逗號、問號 |
| 句型拼拼 | Ac-I-2 | 詞卡排出短句 |

另有「今日複習」：優先抽出錯字與較少星星的生字。

### 數學（翰林單元架構／均一類翰林版）

**一上：** 10 以內的數、比長短、順序與多少、分與合、認識形狀、10 以內加減、30 以內的數、時間  

**一下：** 20 以內加減、長度、100 以內的數、形狀與形體、錢幣、月日星期、兩位數加減、分類整理  

每單元三種玩法（看圖／對應／挑戰），答錯會先停住看正解再繼續。

### 閩南語（真平版課次主題）

**一上：** 心肝仔囝、來去讀冊、鉛筆、鳥仔、數字歌  

**一下：** 學校的圖書館、鳥鼠食菝仔、美麗的學校、保護目睭、我的身軀  

每課三種玩法：

| 模式 | 說明 |
|------|------|
| 什麼意思 | 看臺語，選國語意思 |
| 怎麼說 | 看國語，選臺語講法 |
| 看圖選詞 | 看圖和國語提示，選臺語詞 |

課文念誦、歌曲與官方音檔請至 [真平語文線上聽](https://listen.jen-pin.com.tw/edge-agua-mxvq)。

練習約 30 分鐘會輕提示休息。

## 內容範圍

- 國語一上第 1～6 課（拍拍手 → 小路）生字表（課次依教育部公開生字詞彙表整理）  
- 認讀字、句型與標點題、數學題、閩南語語詞為教學對齊的**自編**練習，**不含課文／習作原文、不含課本圖**

### 資料來源與聲明

- 國語生字課次與課名：整理自教育部教育雲「[教育百科－生字詞彙表](https://pedia.cloud.edu.tw/Bookmark/Textword?category=%E5%9C%8B%E8%AA%9E&degree=1&press=%E5%BA%B7%E8%BB%92%E7%89%88&year=111_1)」公開資料  
- 數學單元名稱與順序：參考均一「[類翰林版](https://www.junyiacademy.org/topics/h-m1a)」；題目為自編互動練習  
- 閩南語課次名稱與主題：參考真平公開課程章節；語詞與題目為自編；音檔與課文請使用真平官方資源  
- 本站僅供家庭／班級練習參考，**與康軒文教、翰林出版、真平語文無關，亦未經授權或合作**  
- 筆順描寫：開源 [hanzi-writer](https://chanind.github.io/hanzi-writer/)  
- 語音：國語練習用瀏覽器 Web Speech API（`zh-TW`）；閩南語為文字／拼音練習，課文音檔請用真平線上聽

## 技術

Vite + React + TypeScript、react-router、vite-plugin-pwa。進度存 `localStorage`（依使用者分開）；可選 Firebase Auth（Google）＋ Firestore 跨裝置同步。
