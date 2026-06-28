const SUPA_URL = "https://ruenjdczklrczrqojivq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZW5qZGN6a2xyY3pycW9qaXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY4MTcsImV4cCI6MjA5ODE2MjgxN30.05x0XcANGxa-oJf-GPvzCCyiyl58zT98-JfZV5kacms";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// DATA — 60 chunks with linking analysis + synonyms
// ============================================================
const CHUNKS = [
  // ── 会議 ──────────────────────────────────────────────────
  {
    id: 1, text: "pick it up", katakana: "ピキラップ", meaning: "拾う／ペースを上げる",
    linkingParts: [
      { segment: "pick_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "speed it up", katakana: "スピーリラップ", meaning: "スピードを上げる" },
      { text: "step it up", katakana: "ステピラップ", meaning: "ギアを上げる" },
    ],
    swapExample: { original: "Can you pick it up?", swapped: "Can you pick it up a little?", swappedMeaning: "もう少しペースを上げてもらえますか？" },
    category: "会議",
  },
  {
    id: 2, text: "get it done", katakana: "ゲリッダン", meaning: "終わらせる・片付ける",
    linkingParts: [
      { segment: "get_it", rule: "flap T + 母音", detail: "「t」→ら行「ゲリッ」" },
      { segment: "it_done", rule: "子音+母音リンキング", detail: "「t」+「done」→「ッダン」" },
    ],
    synonyms: [
      { text: "wrap it up", katakana: "ラッピラップ", meaning: "まとめる・終わらせる" },
      { text: "knock it out", katakana: "ノキラウッ", meaning: "さっさと片付ける" },
    ],
    swapExample: { original: "We need to get it done.", swapped: "We need to get it done by Friday.", swappedMeaning: "金曜日までに仕上げてください" },
    category: "会議",
  },
  {
    id: 3, text: "work it out", katakana: "ワーキラウッ", meaning: "解決する・算出する",
    linkingParts: [
      { segment: "work_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "sort it out", katakana: "ソーリラウッ", meaning: "整理して解決する" },
      { text: "figure it out", katakana: "フィギャリラウッ", meaning: "考えて解決する" },
    ],
    swapExample: { original: "I'm sure we can work it out.", swapped: "I'm sure we can work it out together.", swappedMeaning: "一緒に解決できると思います" },
    category: "会議",
  },
  {
    id: 4, text: "put it off", katakana: "プリロッフ", meaning: "延期する",
    linkingParts: [
      { segment: "put_it", rule: "flap T + 母音", detail: "「t」→ら行「プリッ」" },
      { segment: "it_off", rule: "子音+母音リンキング", detail: "「t」+「off」→「ロッフ」" },
    ],
    synonyms: [
      { text: "push it back", katakana: "プシッバック", meaning: "後ろにずらす" },
      { text: "hold it off", katakana: "ホールリロッフ", meaning: "先延ばしにする" },
    ],
    swapExample: { original: "We can't put it off any longer.", swapped: "We can't put it off until next month.", swappedMeaning: "来月まで延期できません" },
    category: "会議",
  },
  {
    id: 5, text: "bring it up", katakana: "ブリンギラップ", meaning: "話題に出す・提起する",
    linkingParts: [
      { segment: "bring_it", rule: "子音+母音リンキング", detail: "「ng」+「it」→「ンギッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "raise it up", katakana: "レイジラップ", meaning: "（問題を）持ち上げる" },
      { text: "put it forward", katakana: "プリッフォーワッ", meaning: "提案として出す" },
    ],
    swapExample: { original: "Why didn't you bring it up earlier?", swapped: "Why didn't you bring it up at the meeting?", swappedMeaning: "なぜ会議で提起しなかったのですか？" },
    category: "会議",
  },
  {
    id: 6, text: "run it by", katakana: "ラニッバイ", meaning: "確認を取る・通す",
    linkingParts: [
      { segment: "run_it", rule: "子音+母音リンキング", detail: "「n」+「it」→「ニッ」" },
      { segment: "it_by", rule: "子音+母音リンキング", detail: "「t」+「by」→「ッバイ」" },
    ],
    synonyms: [
      { text: "check it with", katakana: "チェキッウィズ", meaning: "〜に確認する" },
      { text: "clear it with", katakana: "クリアリッウィズ", meaning: "〜の許可を取る" },
    ],
    swapExample: { original: "Let me run it by the director first.", swapped: "Let me run it by legal before we proceed.", swappedMeaning: "法務に確認してから進めます" },
    category: "会議",
  },
  {
    id: 7, text: "think it over", katakana: "シンキロウヴァ", meaning: "じっくり考える",
    linkingParts: [
      { segment: "think_it", rule: "子音+母音リンキング", detail: "「nk」+「it」→「ンキッ」" },
      { segment: "it_over", rule: "子音+母音リンキング", detail: "「t」+「over」→「ロウヴァ」" },
    ],
    synonyms: [
      { text: "sleep on it", katakana: "スリーポニッ", meaning: "一晩考える" },
      { text: "mull it over", katakana: "マリロウヴァ", meaning: "熟考する" },
    ],
    swapExample: { original: "I need some time to think it over.", swapped: "I need the weekend to think it over.", swappedMeaning: "週末に検討する時間をください" },
    category: "会議",
  },
  {
    id: 8, text: "sort it out", katakana: "ソーリラウッ", meaning: "整理する・解決する",
    linkingParts: [
      { segment: "sort_it", rule: "flap T + 母音", detail: "「t」弱化「ソーリッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "iron it out", katakana: "アイヤニラウッ", meaning: "問題をのばして解決する" },
      { text: "hash it out", katakana: "ハシラウッ", meaning: "徹底的に話し合う" },
    ],
    swapExample: { original: "Let's sort it out before the meeting.", swapped: "Let's sort it out by end of day.", swappedMeaning: "今日中に片付けましょう" },
    category: "会議",
  },
  {
    id: 9, text: "wrap it up", katakana: "ラッピラップ", meaning: "まとめる・終わりにする",
    linkingParts: [
      { segment: "wrap_it", rule: "子音+母音リンキング", detail: "「p」+「it」→「ピッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "call it a day", katakana: "コーリラデイ", meaning: "今日はここまでにする" },
      { text: "wind it down", katakana: "ワインリダウン", meaning: "徐々に終わりに向かう" },
    ],
    swapExample: { original: "Let's wrap it up in five minutes.", swapped: "Let's wrap it up before three o'clock.", swappedMeaning: "3時前に終わりにしましょう" },
    category: "会議",
  },
  {
    id: 10, text: "go over it", katakana: "ゴウオウヴァリッ", meaning: "見直す・確認する",
    linkingParts: [
      { segment: "go_over", rule: "母音+母音リンキング", detail: "「o」+「over」→「オウオウヴァ」（Wグライド）" },
      { segment: "over_it", rule: "子音+母音リンキング", detail: "「r」+「it」→「ヴァリッ」" },
    ],
    synonyms: [
      { text: "go through it", katakana: "ゴウスルーイッ", meaning: "一通り確認する" },
      { text: "run through it", katakana: "ランスルーイッ", meaning: "さっと見直す" },
    ],
    swapExample: { original: "Can we go over it one more time?", swapped: "Can we go over it before the presentation?", swappedMeaning: "プレゼン前にもう一度確認できますか？" },
    category: "会議",
  },

  // ── 電話・連絡 ────────────────────────────────────────────
  {
    id: 11, text: "look into it", katakana: "ルキンツーイッ", meaning: "調査する",
    linkingParts: [
      { segment: "look_into", rule: "子音+母音リンキング", detail: "「k」+「into」→「キントゥ」" },
      { segment: "into_it", rule: "子音+母音リンキング", detail: "「o」+「it」→「ツーイッ」" },
    ],
    synonyms: [
      { text: "check into it", katakana: "チェキンツーイッ", meaning: "詳しく調べる" },
      { text: "dig into it", katakana: "ディギンツーイッ", meaning: "深く掘り下げる" },
    ],
    swapExample: { original: "I'll look into it right away.", swapped: "I'll look into it and report back.", swappedMeaning: "調査して折り返しご報告します" },
    category: "電話",
  },
  {
    id: 12, text: "follow it up", katakana: "ファロウイラップ", meaning: "フォローアップする",
    linkingParts: [
      { segment: "follow_it", rule: "子音+母音リンキング", detail: "「w」+「it」→「ウィッ」" },
      { segment: "it_up", rule: "子音+母音リンキング", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "check back on it", katakana: "チェックバックオニッ", meaning: "後で再確認する" },
      { text: "circle back on it", katakana: "サークルバックオニッ", meaning: "後で戻って確認する" },
    ],
    swapExample: { original: "I'll follow it up with an email.", swapped: "I'll follow it up with a detailed report.", swappedMeaning: "詳細レポートでフォローアップします" },
    category: "電話",
  },
  {
    id: 13, text: "put me through", katakana: "プッミースルー", meaning: "電話を繋ぐ",
    linkingParts: [
      { segment: "put_me", rule: "子音+母音リンキング", detail: "「t」+「me」→「ッミー」（flap気味）" },
      { segment: "me_through", rule: "母音+子音リンキング", detail: "「e」+「through」→「ミースルー」" },
    ],
    synonyms: [
      { text: "connect me to", katakana: "コネクッミートゥ", meaning: "〜に繋いでください" },
      { text: "transfer me to", katakana: "トランスファーミートゥ", meaning: "〜に転送してください" },
    ],
    swapExample: { original: "Could you put me through?", swapped: "Could you put me through to the sales team?", swappedMeaning: "営業チームに繋いでいただけますか？" },
    category: "電話",
  },
  {
    id: 14, text: "get back to you", katakana: "ゲッバックトゥユー", meaning: "折り返す・返答する",
    linkingParts: [
      { segment: "get_back", rule: "子音+子音 停止", detail: "「t」が脱落し「ゲッバック」（glottal stop）" },
      { segment: "back_to", rule: "子音+母音リンキング", detail: "「k」+「to」→「クトゥ」" },
    ],
    synonyms: [
      { text: "call you back", katakana: "コーユーバック", meaning: "折り返し電話する" },
      { text: "reach out to you", katakana: "リーチャウットゥユー", meaning: "連絡を取る" },
    ],
    swapExample: { original: "I'll get back to you soon.", swapped: "I'll get back to you by end of day.", swappedMeaning: "今日中に折り返します" },
    category: "電話",
  },
  {
    id: 15, text: "hold on a moment", katakana: "ホールドノーモーメン", meaning: "少々お待ちください",
    linkingParts: [
      { segment: "hold_on", rule: "子音+母音リンキング", detail: "「d」+「on」→「ドノン」（d弱化）" },
      { segment: "on_a", rule: "子音+母音リンキング", detail: "「n」+「a」→「ナ」（ほぼ消える）" },
    ],
    synonyms: [
      { text: "one moment please", katakana: "ワンモーメンプリーズ", meaning: "少々お待ちください" },
      { text: "bear with me", katakana: "ベアウィズミー", meaning: "もう少しお待ちください" },
    ],
    swapExample: { original: "Hold on a moment, please.", swapped: "Hold on a moment while I check the records.", swappedMeaning: "記録を確認する間お待ちください" },
    category: "電話",
  },
  {
    id: 16, text: "leave a message", katakana: "リーヴァメッセジ", meaning: "伝言を残す",
    linkingParts: [
      { segment: "leave_a", rule: "母音+母音リンキング", detail: "「e」+「a」→「ヴァ」（V-glide）" },
      { segment: "a_message", rule: "母音+子音リンキング", detail: "「a」+「message」→「アメッセジ」" },
    ],
    synonyms: [
      { text: "leave a note", katakana: "リーヴァノウッ", meaning: "メモを残す" },
      { text: "drop a line", katakana: "ドロッパライン", meaning: "一言連絡する" },
    ],
    swapExample: { original: "Would you like to leave a message?", swapped: "Would you like to leave a message for Mr. Kim?", swappedMeaning: "キム様への伝言を残しますか？" },
    category: "電話",
  },

  // ── 人事・職場 ────────────────────────────────────────────
  {
    id: 17, text: "take it easy", katakana: "テイキリージー", meaning: "無理しないで",
    linkingParts: [
      { segment: "take_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_easy", rule: "flap T + 母音", detail: "「t」+「easy」→「リージー」" },
    ],
    synonyms: [
      { text: "take it slow", katakana: "テイキッスロウ", meaning: "ゆっくりやる" },
      { text: "go easy on it", katakana: "ゴウイージーオニッ", meaning: "無理しないようにする" },
    ],
    swapExample: { original: "Take it easy after the surgery.", swapped: "Take it easy for the rest of the week.", swappedMeaning: "今週の残りはゆっくりしてください" },
    category: "人事",
  },
  {
    id: 18, text: "figure it out", katakana: "フィギャリラウッ", meaning: "考えて解決する",
    linkingParts: [
      { segment: "figure_it", rule: "子音+母音リンキング", detail: "「r」+「it」→「リッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "work it out", katakana: "ワーキラウッ", meaning: "解決策を見つける" },
      { text: "puzzle it out", katakana: "パズリラウッ", meaning: "じっくり考えて解く" },
    ],
    swapExample: { original: "Don't worry, I'll figure it out.", swapped: "Don't worry, I'll figure it out on my own.", swappedMeaning: "大丈夫、自分で何とかします" },
    category: "人事",
  },
  {
    id: 19, text: "set it up", katakana: "セリラップ", meaning: "セットアップする・準備する",
    linkingParts: [
      { segment: "set_it", rule: "flap T + 母音", detail: "「t」→ら行「セリッ」" },
      { segment: "it_up", rule: "子音+母音リンキング", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "put it together", katakana: "プリットゥギャザ", meaning: "組み立てる" },
      { text: "get it ready", katakana: "ゲリッレディ", meaning: "準備を整える" },
    ],
    swapExample: { original: "Can you set it up before noon?", swapped: "Can you set it up for the presentation?", swappedMeaning: "プレゼン用にセットアップしてください" },
    category: "人事",
  },
  {
    id: 20, text: "fill it in", katakana: "フィリリン", meaning: "記入する・埋める",
    linkingParts: [
      { segment: "fill_it", rule: "子音+母音リンキング", detail: "「l」+「it」→「リッ」" },
      { segment: "it_in", rule: "flap T + 母音", detail: "「t」+「in」→「リン」" },
    ],
    synonyms: [
      { text: "fill it out", katakana: "フィリラウッ", meaning: "（書類に）記入する" },
      { text: "complete it", katakana: "コンプリーリッ", meaning: "完成させる" },
    ],
    swapExample: { original: "Please fill it in and sign at the bottom.", swapped: "Please fill it in and return by Friday.", swappedMeaning: "記入して金曜日までにご返送ください" },
    category: "人事",
  },
  {
    id: 21, text: "hand it over", katakana: "ハンリロウヴァ", meaning: "引き渡す",
    linkingParts: [
      { segment: "hand_it", rule: "flap T（d→ら行）", detail: "「d」+「it」→「リッ」" },
      { segment: "it_over", rule: "子音+母音リンキング", detail: "「t」+「over」→「ロウヴァ」" },
    ],
    synonyms: [
      { text: "pass it on", katakana: "パシロン", meaning: "次の人に渡す" },
      { text: "turn it over", katakana: "ターニロウヴァ", meaning: "引き継ぐ" },
    ],
    swapExample: { original: "Please hand it over to the team.", swapped: "Please hand it over to the client directly.", swappedMeaning: "クライアントに直接手渡してください" },
    category: "人事",
  },
  {
    id: 22, text: "keep it up", katakana: "キーピラップ", meaning: "続ける・頑張り続ける",
    linkingParts: [
      { segment: "keep_it", rule: "子音+母音リンキング", detail: "「p」+「it」→「ピッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "stick with it", katakana: "スティックウィジッ", meaning: "続けてやり遂げる" },
      { text: "keep at it", katakana: "キーパリッ", meaning: "めげずに続ける" },
    ],
    swapExample: { original: "Great job, keep it up!", swapped: "Keep it up and you'll be promoted.", swappedMeaning: "続ければ昇進できますよ" },
    category: "人事",
  },
  {
    id: 23, text: "take it on", katakana: "テイキロン", meaning: "引き受ける・担当する",
    linkingParts: [
      { segment: "take_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_on", rule: "flap T + 母音", detail: "「t」+「on」→「ロン」" },
    ],
    synonyms: [
      { text: "take it over", katakana: "テイキロウヴァ", meaning: "引き継ぐ" },
      { text: "own it", katakana: "オウニッ", meaning: "オーナーシップを持つ" },
    ],
    swapExample: { original: "Are you willing to take it on?", swapped: "Are you willing to take it on as your main project?", swappedMeaning: "メインプロジェクトとして担当しますか？" },
    category: "人事",
  },

  // ── 物流・オフィス ─────────────────────────────────────────
  {
    id: 24, text: "pick it up", katakana: "ピキラップ", meaning: "受け取りに行く（pick up）",
    linkingParts: [
      { segment: "pick_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "collect it", katakana: "コレクリッ", meaning: "回収・受け取る" },
      { text: "fetch it", katakana: "フェチィッ", meaning: "取ってくる" },
    ],
    swapExample: { original: "Could someone pick it up from the warehouse?", swapped: "Could someone pick it up before 5 PM?", swappedMeaning: "5時前に取りに来てもらえますか？" },
    category: "物流",
  },
  {
    id: 25, text: "send it out", katakana: "センリラウッ", meaning: "発送する・送り出す",
    linkingParts: [
      { segment: "send_it", rule: "子音+母音リンキング", detail: "「d」+「it」→「ディッ」（d弱化）" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "ship it out", katakana: "シピラウッ", meaning: "出荷する" },
      { text: "dispatch it", katakana: "ディスパッチィッ", meaning: "発送・配送する" },
    ],
    swapExample: { original: "We'll send it out tomorrow.", swapped: "We'll send it out first thing in the morning.", swappedMeaning: "朝一番に発送します" },
    category: "物流",
  },
  {
    id: 26, text: "drop it off", katakana: "ドロピロッフ", meaning: "届けて帰る・預けておく",
    linkingParts: [
      { segment: "drop_it", rule: "子音+母音リンキング", detail: "「p」+「it」→「ピッ」" },
      { segment: "it_off", rule: "flap T + 母音", detail: "「t」+「off」→「ロッフ」" },
    ],
    synonyms: [
      { text: "leave it there", katakana: "リーヴィッデア", meaning: "そこに置いていく" },
      { text: "deliver it", katakana: "デリヴァリッ", meaning: "配達する" },
    ],
    swapExample: { original: "Can you drop it off at the front desk?", swapped: "Can you drop it off before noon?", swappedMeaning: "正午前に預けておいてもらえますか？" },
    category: "物流",
  },
  {
    id: 27, text: "check it in", katakana: "チェキリン", meaning: "チェックインする・預ける",
    linkingParts: [
      { segment: "check_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_in", rule: "flap T + 母音", detail: "「t」+「in」→「リン」" },
    ],
    synonyms: [
      { text: "register it", katakana: "レジスタリッ", meaning: "登録する" },
      { text: "log it in", katakana: "ロギリン", meaning: "記録として入力する" },
    ],
    swapExample: { original: "You need to check it in at counter B.", swapped: "You need to check it in before the deadline.", swappedMeaning: "締め切り前に登録する必要があります" },
    category: "物流",
  },
  {
    id: 28, text: "stock it up", katakana: "ストキラップ", meaning: "在庫を補充する",
    linkingParts: [
      { segment: "stock_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "restock it", katakana: "リーストキッ", meaning: "再補充する" },
      { text: "fill it up", katakana: "フィリラップ", meaning: "（在庫を）満たす" },
    ],
    swapExample: { original: "We need to stock it up before the sale.", swapped: "We need to stock it up by next week.", swappedMeaning: "来週までに補充する必要があります" },
    category: "物流",
  },
  {
    id: 29, text: "write it down", katakana: "ライリッダウン", meaning: "書き留める",
    linkingParts: [
      { segment: "write_it", rule: "flap T + 母音", detail: "「t」→ら行「ライリッ」" },
      { segment: "it_down", rule: "子音+母音リンキング", detail: "「t」+「down」→「ッダウン」" },
    ],
    synonyms: [
      { text: "jot it down", katakana: "ジョリッダウン", meaning: "さっとメモする" },
      { text: "note it down", katakana: "ノウリッダウン", meaning: "書き留める" },
    ],
    swapExample: { original: "Please write it down so you don't forget.", swapped: "Please write it down and share it with the team.", swappedMeaning: "書き留めてチームに共有してください" },
    category: "物流",
  },

  // ── 旅行・出張 ────────────────────────────────────────────
  {
    id: 30, text: "call it off", katakana: "コーリロッフ", meaning: "中止する",
    linkingParts: [
      { segment: "call_it", rule: "子音+母音リンキング", detail: "「l」+「it」→「リッ」" },
      { segment: "it_off", rule: "子音+母音リンキング", detail: "「t」+「off」→「ロッフ」" },
    ],
    synonyms: [
      { text: "cancel it", katakana: "キャンセリッ", meaning: "キャンセルする" },
      { text: "scrap it", katakana: "スクラッピッ", meaning: "中止・廃止する" },
    ],
    swapExample: { original: "We had to call it off.", swapped: "We had to call it off due to bad weather.", swappedMeaning: "悪天候でキャンセルせざるを得ませんでした" },
    category: "旅行",
  },
  {
    id: 31, text: "check it out", katakana: "チェキラウッ", meaning: "確認する・見てみる",
    linkingParts: [
      { segment: "check_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "look it over", katakana: "ルキロウヴァ", meaning: "一通り確認する" },
      { text: "take a look", katakana: "テイカルック", meaning: "ちょっと見てみる" },
    ],
    swapExample: { original: "Check it out when you have a chance.", swapped: "Check it out before your flight.", swappedMeaning: "フライト前に確認してください" },
    category: "旅行",
  },
  {
    id: 32, text: "book it early", katakana: "ブキリーアーリー", meaning: "早めに予約する",
    linkingParts: [
      { segment: "book_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_early", rule: "flap T + 母音", detail: "「t」+「early」→「リーアーリー」" },
    ],
    synonyms: [
      { text: "reserve it ahead", katakana: "リザーヴィラヘッ", meaning: "前もって予約する" },
      { text: "lock it in", katakana: "ロキリン", meaning: "予約を確定させる" },
    ],
    swapExample: { original: "Make sure to book it early.", swapped: "Make sure to book it early to get a good rate.", swappedMeaning: "良いレートのために早めに予約してください" },
    category: "旅行",
  },
  {
    id: 33, text: "pick up a rental", katakana: "ピカッパレンタル", meaning: "レンタカーを受け取る",
    linkingParts: [
      { segment: "pick_up", rule: "子音+母音リンキング", detail: "「k」+「up」→「カップ」" },
      { segment: "up_a", rule: "母音+母音リンキング", detail: "「p」+「a」→「パ」（連結）" },
    ],
    synonyms: [
      { text: "rent a car", katakana: "レンナカー", meaning: "車を借りる" },
      { text: "get a rental", katakana: "ゲラレンタル", meaning: "レンタカーを手配する" },
    ],
    swapExample: { original: "We'll pick up a rental at the airport.", swapped: "We'll pick up a rental and drive to the hotel.", swappedMeaning: "空港でレンタカーを借りてホテルに向かいます" },
    category: "旅行",
  },

  // ── 顧客対応・営業 ────────────────────────────────────────
  {
    id: 34, text: "take care of it", katakana: "テイケアロヴィッ", meaning: "対処する・処理する",
    linkingParts: [
      { segment: "take_care", rule: "子音+母音リンキング", detail: "「k」+「care」→「ケア」" },
      { segment: "care_of", rule: "子音+母音リンキング", detail: "「r」+「of」→「ロヴ」" },
      { segment: "of_it", rule: "子音+母音リンキング", detail: "「v」+「it」→「ヴィッ」" },
    ],
    synonyms: [
      { text: "deal with it", katakana: "ディールウィジッ", meaning: "対処する" },
      { text: "handle it", katakana: "ハンドリッ", meaning: "処理する" },
    ],
    swapExample: { original: "Don't worry, I'll take care of it.", swapped: "Don't worry, I'll take care of it immediately.", swappedMeaning: "ご心配なく、すぐに対処します" },
    category: "顧客対応",
  },
  {
    id: 35, text: "make it work", katakana: "メイキッワーク", meaning: "うまくやる・解決策を見つける",
    linkingParts: [
      { segment: "make_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_work", rule: "子音+子音", detail: "「t」+「w」→弱い「ッウ」" },
    ],
    synonyms: [
      { text: "make it happen", katakana: "メイキッハプン", meaning: "実現させる" },
      { text: "pull it off", katakana: "プリロッフ", meaning: "うまくやり遂げる" },
    ],
    swapExample: { original: "We'll find a way to make it work.", swapped: "We'll find a way to make it work within budget.", swappedMeaning: "予算内で何とかします" },
    category: "顧客対応",
  },
  {
    id: 36, text: "look into it", katakana: "ルキンツーイッ", meaning: "調査・対応する",
    linkingParts: [
      { segment: "look_into", rule: "子音+母音リンキング", detail: "「k」+「into」→「キントゥ」" },
      { segment: "into_it", rule: "子音+母音リンキング", detail: "「o」+「it」→「ツーイッ」" },
    ],
    synonyms: [
      { text: "investigate it", katakana: "インヴェスティゲイリッ", meaning: "調査する" },
      { text: "look at it", katakana: "ルカリッ", meaning: "確認してみる" },
    ],
    swapExample: { original: "I'll look into it right away.", swapped: "I'll look into it and get back to you.", swappedMeaning: "調査してご連絡します" },
    category: "顧客対応",
  },
  {
    id: 37, text: "set it right", katakana: "セリッライッ", meaning: "正す・解決する",
    linkingParts: [
      { segment: "set_it", rule: "flap T + 母音", detail: "「t」→ら行「セリッ」" },
      { segment: "it_right", rule: "子音+母音リンキング", detail: "「t」+「right」→「ッライッ」" },
    ],
    synonyms: [
      { text: "make it right", katakana: "メイキッライッ", meaning: "正す・補償する" },
      { text: "fix it up", katakana: "フィキラップ", meaning: "修正・解決する" },
    ],
    swapExample: { original: "We're going to set it right.", swapped: "We're going to set it right as soon as possible.", swappedMeaning: "できる限り早く解決します" },
    category: "顧客対応",
  },
  {
    id: 38, text: "pass it along", katakana: "パシラロング", meaning: "伝言を回す・共有する",
    linkingParts: [
      { segment: "pass_it", rule: "子音+母音リンキング", detail: "「s」+「it」→「シッ」" },
      { segment: "it_along", rule: "flap T + 母音", detail: "「t」+「along」→「ラロング」" },
    ],
    synonyms: [
      { text: "share it around", katakana: "シェアリラウンド", meaning: "みんなに共有する" },
      { text: "pass it on", katakana: "パシロン", meaning: "次に回す" },
    ],
    swapExample: { original: "Please pass it along to your team.", swapped: "Please pass it along to everyone in the department.", swappedMeaning: "部署全員に共有してください" },
    category: "顧客対応",
  },
  {
    id: 39, text: "bring it about", katakana: "ブリンギラバウッ", meaning: "実現させる・引き起こす",
    linkingParts: [
      { segment: "bring_it", rule: "子音+母音リンキング", detail: "「ng」+「it」→「ンギッ」" },
      { segment: "it_about", rule: "flap T + 母音", detail: "「t」+「about」→「ラバウッ」" },
    ],
    synonyms: [
      { text: "make it happen", katakana: "メイキッハプン", meaning: "実現させる" },
      { text: "pull it through", katakana: "プリルスルー", meaning: "やり遂げる" },
    ],
    swapExample: { original: "How do we bring it about?", swapped: "How do we bring it about within the timeline?", swappedMeaning: "スケジュール内でどうやって実現しますか？" },
    category: "顧客対応",
  },

  // ── プレゼン・提案 ────────────────────────────────────────
  {
    id: 40, text: "back it up", katakana: "バキラップ", meaning: "データで裏付ける・バックアップする",
    linkingParts: [
      { segment: "back_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "support it with data", katakana: "サポーリッウィズデイタ", meaning: "データで裏付ける" },
      { text: "prove it out", katakana: "プルーヴィラウッ", meaning: "証明する" },
    ],
    swapExample: { original: "Can you back it up with numbers?", swapped: "Can you back it up with last quarter's data?", swappedMeaning: "前四半期のデータで裏付けられますか？" },
    category: "プレゼン",
  },
  {
    id: 41, text: "lay it out", katakana: "レイリラウッ", meaning: "説明する・提示する",
    linkingParts: [
      { segment: "lay_it", rule: "子音+母音リンキング", detail: "「y」+「it」→「イッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "spell it out", katakana: "スペリラウッ", meaning: "詳しく説明する" },
      { text: "walk us through it", katakana: "ウォークアススルーイッ", meaning: "順を追って説明する" },
    ],
    swapExample: { original: "Let me lay it out for you.", swapped: "Let me lay it out step by step.", swappedMeaning: "ステップごとに説明します" },
    category: "プレゼン",
  },
  {
    id: 42, text: "sum it up", katakana: "サミラップ", meaning: "まとめる・要約する",
    linkingParts: [
      { segment: "sum_it", rule: "子音+母音リンキング", detail: "「m」+「it」→「ミッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "wrap it up", katakana: "ラッピラップ", meaning: "まとめて終わる" },
      { text: "round it up", katakana: "ラウンリラップ", meaning: "締めくくる" },
    ],
    swapExample: { original: "To sum it up, we exceeded our target.", swapped: "To sum it up, we exceeded our target by 20%.", swappedMeaning: "要約すると、目標を20%上回りました" },
    category: "プレゼン",
  },
  {
    id: 43, text: "break it down", katakana: "ブレイキッダウン", meaning: "分解して説明する",
    linkingParts: [
      { segment: "break_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_down", rule: "子音+母音リンキング", detail: "「t」+「down」→「ッダウン」" },
    ],
    synonyms: [
      { text: "break it apart", katakana: "ブレイキラパーッ", meaning: "分解する" },
      { text: "take it apart", katakana: "テイキラパーッ", meaning: "細かく分析する" },
    ],
    swapExample: { original: "Let me break it down by region.", swapped: "Let me break it down by quarter and region.", swappedMeaning: "四半期・地域別に分解して説明します" },
    category: "プレゼン",
  },
  {
    id: 44, text: "back it up", katakana: "バキラップ", meaning: "（主張を）支持する証拠を出す",
    linkingParts: [
      { segment: "back_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "stand behind it", katakana: "スタンビハインリッ", meaning: "責任を持って支持する" },
      { text: "validate it", katakana: "ヴァリデイリッ", meaning: "検証・証明する" },
    ],
    swapExample: { original: "I need you to back it up with evidence.", swapped: "I need you to back it up with a case study.", swappedMeaning: "ケーススタディで裏付けてください" },
    category: "プレゼン",
  },

  // ── IT・デジタル ──────────────────────────────────────────
  {
    id: 45, text: "set it up", katakana: "セリラップ", meaning: "（システムを）設定する",
    linkingParts: [
      { segment: "set_it", rule: "flap T + 母音", detail: "「t」→ら行「セリッ」" },
      { segment: "it_up", rule: "子音+母音リンキング", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "configure it", katakana: "コンフィギャリッ", meaning: "設定・構成する" },
      { text: "install it", katakana: "インストーリッ", meaning: "インストールする" },
    ],
    swapExample: { original: "Can you set it up on my laptop?", swapped: "Can you set it up before the demo?", swappedMeaning: "デモ前にセットアップしてもらえますか？" },
    category: "IT",
  },
  {
    id: 46, text: "log into it", katakana: "ロギンツーイッ", meaning: "ログインする",
    linkingParts: [
      { segment: "log_into", rule: "子音+母音リンキング", detail: "「g」+「into」→「ギントゥ」" },
      { segment: "into_it", rule: "子音+母音リンキング", detail: "「o」+「it」→「ツーイッ」" },
    ],
    synonyms: [
      { text: "sign into it", katakana: "サイニンツーイッ", meaning: "サインインする" },
      { text: "access it", katakana: "アクセシッ", meaning: "アクセスする" },
    ],
    swapExample: { original: "You need to log into it first.", swapped: "You need to log into it with your credentials.", swappedMeaning: "認証情報でログインする必要があります" },
    category: "IT",
  },
  {
    id: 47, text: "back it up", katakana: "バキラップ", meaning: "バックアップを取る",
    linkingParts: [
      { segment: "back_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_up", rule: "flap T + 母音", detail: "「t」+「up」→「ラップ」" },
    ],
    synonyms: [
      { text: "save a copy", katakana: "セイヴァコピー", meaning: "コピーを保存する" },
      { text: "store it safely", katakana: "ストーリッセイフリー", meaning: "安全に保存する" },
    ],
    swapExample: { original: "Make sure to back it up.", swapped: "Make sure to back it up to the cloud.", swappedMeaning: "クラウドにバックアップしてください" },
    category: "IT",
  },
  {
    id: 48, text: "roll it out", katakana: "ロウリラウッ", meaning: "展開する・リリースする",
    linkingParts: [
      { segment: "roll_it", rule: "子音+母音リンキング", detail: "「l」+「it」→「リッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "launch it", katakana: "ローンチィッ", meaning: "ローンチする" },
      { text: "deploy it", katakana: "ディプロイイッ", meaning: "デプロイする" },
    ],
    swapExample: { original: "We'll roll it out next quarter.", swapped: "We'll roll it out to all branches next quarter.", swappedMeaning: "来四半期に全拠点に展開します" },
    category: "IT",
  },
  {
    id: 49, text: "phase it out", katakana: "フェイジラウッ", meaning: "段階的に廃止する",
    linkingParts: [
      { segment: "phase_it", rule: "子音+母音リンキング", detail: "「z」+「it」→「ジッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "wind it down", katakana: "ワインリダウン", meaning: "徐々に縮小する" },
      { text: "retire it", katakana: "リタイアリッ", meaning: "（システムを）廃止する" },
    ],
    swapExample: { original: "We're going to phase it out by year-end.", swapped: "We're going to phase it out and replace it with a new system.", swappedMeaning: "廃止して新システムに切り替えます" },
    category: "IT",
  },

  // ── 短縮形・弱形 ──────────────────────────────────────────
  {
    id: 50, text: "want to", katakana: "ウォナ", meaning: "〜したい（wanna）",
    linkingParts: [
      { segment: "want_to", rule: "弱形・縮約", detail: "「want」+「to」→「ウォナ」（wanna）" },
    ],
    synonyms: [
      { text: "would like to", katakana: "ウッライクトゥ", meaning: "〜したい（丁寧）" },
      { text: "feel like", katakana: "フィールライク", meaning: "〜したい気がする" },
    ],
    swapExample: { original: "Do you want to join?", swapped: "Do you want to join the call later?", swappedMeaning: "後でコールに参加しますか？" },
    category: "短縮形",
  },
  {
    id: 51, text: "going to", katakana: "ゴナ", meaning: "〜するつもり（gonna）",
    linkingParts: [
      { segment: "going_to", rule: "弱形・縮約", detail: "「going」+「to」→「ゴナ」（gonna）" },
    ],
    synonyms: [
      { text: "planning to", katakana: "プラニントゥ", meaning: "〜する予定" },
      { text: "about to", katakana: "アバウトゥ", meaning: "まさに〜しようとしている" },
    ],
    swapExample: { original: "I'm going to present first.", swapped: "I'm going to present the Q3 results first.", swappedMeaning: "まずQ3の結果を発表します" },
    category: "短縮形",
  },
  {
    id: 52, text: "have to", katakana: "ハフタ", meaning: "〜しなければならない",
    linkingParts: [
      { segment: "have_to", rule: "弱形・縮約", detail: "「have」+「to」→「ハフタ」（「v」が「f」に変化）" },
    ],
    synonyms: [
      { text: "need to", katakana: "ニードゥ", meaning: "〜する必要がある" },
      { text: "must", katakana: "マス（ト）", meaning: "〜しなければならない" },
    ],
    swapExample: { original: "We have to submit it today.", swapped: "We have to submit it by three o'clock.", swappedMeaning: "3時までに提出しなければなりません" },
    category: "短縮形",
  },
  {
    id: 53, text: "used to", katakana: "ユーストゥ", meaning: "以前は〜していた",
    linkingParts: [
      { segment: "used_to", rule: "弱形・縮約", detail: "「d」が脱落→「ユーストゥ」（末尾のdほぼ消滅）" },
    ],
    synonyms: [
      { text: "would often", katakana: "ウドゥオーフン", meaning: "よく〜していた" },
      { text: "in the past", katakana: "インナパスト", meaning: "以前は" },
    ],
    swapExample: { original: "We used to do it manually.", swapped: "We used to do it manually before automation.", swappedMeaning: "自動化以前は手動でやっていました" },
    category: "短縮形",
  },
  {
    id: 54, text: "kind of", katakana: "カインダ", meaning: "ある意味・わりと（kinda）",
    linkingParts: [
      { segment: "kind_of", rule: "弱形・縮約", detail: "「d」+「of」→「ダ」（kinda）" },
    ],
    synonyms: [
      { text: "sort of", katakana: "ソーロヴ", meaning: "ある意味（sorta）" },
      { text: "somewhat", katakana: "サムウォッ", meaning: "やや・ある程度" },
    ],
    swapExample: { original: "It's kind of hard to explain.", swapped: "It's kind of hard to explain without the data.", swappedMeaning: "データなしでは説明がちょっと難しいです" },
    category: "短縮形",
  },
  {
    id: 55, text: "out of it", katakana: "アウロヴィッ", meaning: "ぼんやりしている・蚊帳の外",
    linkingParts: [
      { segment: "out_of", rule: "子音+母音リンキング", detail: "「t」+「of」→「ロヴ」（flap）" },
      { segment: "of_it", rule: "子音+母音リンキング", detail: "「v」+「it」→「ヴィッ」" },
    ],
    synonyms: [
      { text: "not with it", katakana: "ノットウィジッ", meaning: "頭が回っていない" },
      { text: "checked out", katakana: "チェックタウッ", meaning: "集中できていない" },
    ],
    swapExample: { original: "Sorry, I'm a bit out of it today.", swapped: "Sorry, I'm a bit out of it — can you repeat that?", swappedMeaning: "すみません、ぼんやりしていました。もう一度お願いできますか？" },
    category: "短縮形",
  },

  // ── 財務・交渉 ────────────────────────────────────────────
  {
    id: 56, text: "cut it down", katakana: "カリッダウン", meaning: "削減する・切り詰める",
    linkingParts: [
      { segment: "cut_it", rule: "flap T + 母音", detail: "「t」→ら行「カリッ」" },
      { segment: "it_down", rule: "子音+母音リンキング", detail: "「t」+「down」→「ッダウン」" },
    ],
    synonyms: [
      { text: "trim it down", katakana: "トリミッダウン", meaning: "スリム化する" },
      { text: "scale it back", katakana: "スケイリッバック", meaning: "規模を縮小する" },
    ],
    swapExample: { original: "We need to cut it down by 15%.", swapped: "We need to cut it down to fit the budget.", swappedMeaning: "予算内に収めるために削減が必要です" },
    category: "財務",
  },
  {
    id: 57, text: "put it on hold", katakana: "プリロンホールド", meaning: "保留にする",
    linkingParts: [
      { segment: "put_it", rule: "flap T + 母音", detail: "「t」→ら行「プリッ」" },
      { segment: "it_on", rule: "flap T + 母音", detail: "「t」+「on」→「ロン」" },
    ],
    synonyms: [
      { text: "freeze it", katakana: "フリーズィッ", meaning: "凍結する" },
      { text: "pause it", katakana: "ポーズィッ", meaning: "一時停止する" },
    ],
    swapExample: { original: "Let's put it on hold for now.", swapped: "Let's put it on hold until Q2.", swappedMeaning: "Q2まで保留にしましょう" },
    category: "財務",
  },
  {
    id: 58, text: "work it out", katakana: "ワーキラウッ", meaning: "（数字を）計算する",
    linkingParts: [
      { segment: "work_it", rule: "子音+母音リンキング", detail: "「k」+「it」→「キッ」" },
      { segment: "it_out", rule: "flap T + 母音", detail: "「t」+「out」→「ラウッ」" },
    ],
    synonyms: [
      { text: "calculate it", katakana: "キャルキュレイリッ", meaning: "計算する" },
      { text: "crunch the numbers", katakana: "クランチナンバーズ", meaning: "数字をはじく" },
    ],
    swapExample: { original: "Can you work it out for me?", swapped: "Can you work it out and send me the breakdown?", swappedMeaning: "計算して内訳を送ってもらえますか？" },
    category: "財務",
  },
  {
    id: 59, text: "sign off on it", katakana: "サイノッフォニッ", meaning: "承認する・サインする",
    linkingParts: [
      { segment: "sign_off", rule: "子音+母音リンキング", detail: "「n」+「off」→「ノッフ」" },
      { segment: "off_on", rule: "子音+母音リンキング", detail: "「f」+「on」→「フォン」" },
      { segment: "on_it", rule: "子音+母音リンキング", detail: "「n」+「it」→「ニッ」" },
    ],
    synonyms: [
      { text: "approve it", katakana: "アプルーヴィッ", meaning: "承認する" },
      { text: "give it the green light", katakana: "ギヴィッザグリーンライッ", meaning: "ゴーサインを出す" },
    ],
    swapExample: { original: "The VP needs to sign off on it.", swapped: "The VP needs to sign off on it before we proceed.", swappedMeaning: "進める前にVPの承認が必要です" },
    category: "財務",
  },
  {
    id: 60, text: "give it a shot", katakana: "ギヴィラショッ", meaning: "試してみる",
    linkingParts: [
      { segment: "give_it", rule: "子音+母音リンキング", detail: "「v」+「it」→「ヴィッ」" },
      { segment: "it_a", rule: "flap T + 母音", detail: "「t」+「a」→「ラ」" },
    ],
    synonyms: [
      { text: "give it a try", katakana: "ギヴィラトライ", meaning: "試してみる" },
      { text: "have a go at it", katakana: "ハヴァゴウアリッ", meaning: "やってみる" },
    ],
    swapExample: { original: "Why don't we give it a shot?", swapped: "Why don't we give it a shot before deciding?", swappedMeaning: "決める前に試してみませんか？" },
    category: "財務",
  },

  // ── 会議・議論 続き ────────────────────────────────────────
  {id:61,text:"talk it over",katakana:"トーキロウヴァ",meaning:"話し合って決める",
   linkingParts:[{segment:"talk_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_over",rule:"子音+母音リンキング",detail:"「t」+「over」→「ロウヴァ」"}],
   synonyms:[{text:"discuss it",katakana:"ディスカシッ",meaning:"議論する"},{text:"hash it out",katakana:"ハシラウッ",meaning:"徹底的に話し合う"}],
   swapExample:{original:"Let's talk it over at lunch.",swapped:"Let's talk it over with the whole team.",swappedMeaning:"チーム全体で話し合いましょう"},category:"会議"},
  {id:62,text:"bring it forward",katakana:"ブリンギッフォーワッ",meaning:"前倒しにする・提案する",
   linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_forward",rule:"子音+母音リンキング",detail:"「t」+「forward」→「ッフォーワッ」"}],
   synonyms:[{text:"move it up",katakana:"ムーヴィラップ",meaning:"前倒しにする"},{text:"push it ahead",katakana:"プシラヘッ",meaning:"前に進める"}],
   swapExample:{original:"Can we bring it forward by a week?",swapped:"Can we bring it forward to Monday?",swappedMeaning:"月曜日に前倒しできますか？"},category:"会議"},
  {id:63,text:"put it on the agenda",katakana:"プリロンジアジェンダ",meaning:"議題に入れる",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"}],
   synonyms:[{text:"add it to the list",katakana:"アリットゥザリスト",meaning:"リストに加える"},{text:"table it",katakana:"テイブリッ",meaning:"議題に乗せる（米）"}],
   swapExample:{original:"Let's put it on the agenda.",swapped:"Let's put it on the agenda for next week.",swappedMeaning:"来週の議題に入れましょう"},category:"会議"},
  {id:64,text:"take it from the top",katakana:"テイキッフロムザトップ",meaning:"最初からやり直す",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"from_the",rule:"子音+母音リンキング",detail:"「m」+「the」→「ムザ」"}],
   synonyms:[{text:"start over",katakana:"スタートオウヴァ",meaning:"やり直す"},{text:"go back to the beginning",katakana:"ゴウバックトゥザビギニング",meaning:"最初に戻る"}],
   swapExample:{original:"Let's take it from the top.",swapped:"Let's take it from the top one more time.",swappedMeaning:"もう一度最初からやりましょう"},category:"会議"},
  {id:65,text:"keep it brief",katakana:"キーピッブリーフ",meaning:"手短にする",
   linkingParts:[{segment:"keep_it",rule:"子音+母音リンキング",detail:"「p」+「it」→「ピッ」"},{segment:"it_brief",rule:"子音+子音",detail:"「t」+「b」→弱い「ッブ」"}],
   synonyms:[{text:"make it short",katakana:"メイキッショーッ",meaning:"短くまとめる"},{text:"be concise",katakana:"ビーコンサイス",meaning:"簡潔にする"}],
   swapExample:{original:"Please keep it brief.",swapped:"Please keep it brief — we only have five minutes.",swappedMeaning:"5分しかないので手短にお願いします"},category:"会議"},
  {id:66,text:"nail it down",katakana:"ネイリッダウン",meaning:"確定させる・固める",
   linkingParts:[{segment:"nail_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],
   synonyms:[{text:"lock it in",katakana:"ロキリン",meaning:"確定させる"},{text:"pin it down",katakana:"ピニッダウン",meaning:"はっきりさせる"}],
   swapExample:{original:"We need to nail it down today.",swapped:"We need to nail it down before the weekend.",swappedMeaning:"週末前に確定させる必要があります"},category:"会議"},
  {id:67,text:"flag it up",katakana:"フラギラップ",meaning:"問題を指摘する・注意を促す",
   linkingParts:[{segment:"flag_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"point it out",katakana:"ポインリラウッ",meaning:"指摘する"},{text:"raise it",katakana:"レイジッ",meaning:"問題として挙げる"}],
   swapExample:{original:"Please flag it up if you see any issues.",swapped:"Please flag it up to management immediately.",swappedMeaning:"すぐに上司に報告してください"},category:"会議"},
  {id:68,text:"move it along",katakana:"ムーヴィラロング",meaning:"話を進める・スムーズに進める",
   linkingParts:[{segment:"move_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_along",rule:"flap T + 母音",detail:"「t」+「along」→「ラロング」"}],
   synonyms:[{text:"keep it moving",katakana:"キーピッムーヴィング",meaning:"進め続ける"},{text:"push it through",katakana:"プシッスルー",meaning:"押し進める"}],
   swapExample:{original:"Let's move it along, we're running late.",swapped:"Let's move it along to the next agenda item.",swappedMeaning:"次の議題に進みましょう"},category:"会議"},

  // ── 電話・連絡 続き ────────────────────────────────────────
  {id:69,text:"patch it through",katakana:"パチィッスルー",meaning:"電話を繋ぐ・転送する",
   linkingParts:[{segment:"patch_it",rule:"子音+母音リンキング",detail:"「ch」+「it」→「チィッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"put it through",katakana:"プリッスルー",meaning:"繋ぐ"},{text:"forward it",katakana:"フォーワリッ",meaning:"転送する"}],
   swapExample:{original:"I'll patch it through to the director.",swapped:"I'll patch it through right away.",swappedMeaning:"すぐに繋ぎます"},category:"電話"},
  {id:70,text:"touch base on it",katakana:"タッチベイソニッ",meaning:"確認のため連絡する",
   linkingParts:[{segment:"touch_base",rule:"子音+子音",detail:"「ch」+「b」→「チベイス」"},{segment:"base_on",rule:"子音+母音リンキング",detail:"「s」+「on」→「ソン」"}],
   synonyms:[{text:"check in on it",katakana:"チェキノニッ",meaning:"状況確認する"},{text:"follow up on it",katakana:"ファロウアポニッ",meaning:"追跡確認する"}],
   swapExample:{original:"Let's touch base on it next week.",swapped:"Let's touch base on it after the meeting.",swappedMeaning:"会議後に確認し合いましょう"},category:"電話"},
  {id:71,text:"dial it in",katakana:"ダイアリリン",meaning:"電話で参加する・精度を合わせる",
   linkingParts:[{segment:"dial_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"call in",katakana:"コーリン",meaning:"電話で参加する"},{text:"join by phone",katakana:"ジョインバイフォン",meaning:"電話参加する"}],
   swapExample:{original:"I'll dial it in from the airport.",swapped:"I'll dial it in since I can't make it in person.",swappedMeaning:"直接参加できないので電話で参加します"},category:"電話"},
  {id:72,text:"ring it through",katakana:"リンギッスルー",meaning:"電話を鳴らして繋ぐ",
   linkingParts:[{segment:"ring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"put the call through",katakana:"プッザコールスルー",meaning:"電話を繋ぐ"},{text:"connect the call",katakana:"コネクッザコール",meaning:"通話を繋ぐ"}],
   swapExample:{original:"I'll ring it through now.",swapped:"I'll ring it through to the head office.",swappedMeaning:"本社に繋ぎます"},category:"電話"},

  // ── 人事・職場 続き ────────────────────────────────────────
  {id:73,text:"walk it through",katakana:"ウォーキッスルー",meaning:"手順を説明する・案内する",
   linkingParts:[{segment:"walk_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"run it through",katakana:"ランニッスルー",meaning:"一通り説明する"},{text:"take them through it",katakana:"テイクゼムスルーイッ",meaning:"順番に説明する"}],
   swapExample:{original:"Let me walk it through step by step.",swapped:"Let me walk it through before you start.",swappedMeaning:"始める前に手順を説明します"},category:"人事"},
  {id:74,text:"own it",katakana:"オウニッ",meaning:"責任を持つ・認める",
   linkingParts:[{segment:"own_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"take responsibility",katakana:"テイクリスポンスィビリティ",meaning:"責任を取る"},{text:"stand by it",katakana:"スタンバイイッ",meaning:"それを支持する"}],
   swapExample:{original:"You need to own it.",swapped:"You need to own it and find a solution.",swappedMeaning:"責任を持って解決策を見つけてください"},category:"人事"},
  {id:75,text:"put it in writing",katakana:"プリリンライティング",meaning:"文書化する・書面にする",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"document it",katakana:"ドキュメンリッ",meaning:"記録に残す"},{text:"formalize it",katakana:"フォーマライジッ",meaning:"正式化する"}],
   swapExample:{original:"Please put it in writing.",swapped:"Please put it in writing and send it over.",swappedMeaning:"書面にして送ってください"},category:"人事"},
  {id:76,text:"get on top of it",katakana:"ゲロントッポヴィッ",meaning:"（タスクを）しっかり管理する",
   linkingParts:[{segment:"get_on",rule:"子音+母音リンキング",detail:"「t」+「on」→「ロン」（flap）"},{segment:"on_top",rule:"子音+母音リンキング",detail:"「n」+「top」→「ントップ」"}],
   synonyms:[{text:"stay on top of it",katakana:"ステイオントッポヴィッ",meaning:"把握し続ける"},{text:"manage it well",katakana:"マネジィッウェル",meaning:"うまく管理する"}],
   swapExample:{original:"You need to get on top of it.",swapped:"You need to get on top of it before it becomes a problem.",swappedMeaning:"問題になる前にしっかり管理してください"},category:"人事"},
  {id:77,text:"ease into it",katakana:"イーズィンツーイッ",meaning:"徐々に慣れる・始める",
   linkingParts:[{segment:"ease_into",rule:"母音+母音リンキング",detail:"「z」+「into」→「ジントゥ」"},{segment:"into_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「ツーイッ」"}],
   synonyms:[{text:"get used to it",katakana:"ゲッユーストゥイッ",meaning:"慣れる"},{text:"warm up to it",katakana:"ウォームアップトゥイッ",meaning:"徐々に慣れていく"}],
   swapExample:{original:"Just ease into it for the first week.",swapped:"Just ease into it — don't rush.",swappedMeaning:"焦らず徐々に慣れていってください"},category:"人事"},
  {id:78,text:"cover it",katakana:"カヴァリッ",meaning:"代わりに対応する・カバーする",
   linkingParts:[{segment:"cover_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"}],
   synonyms:[{text:"take care of it",katakana:"テイケアロヴィッ",meaning:"対処する"},{text:"fill in for it",katakana:"フィリンフォーイッ",meaning:"代わりに対応する"}],
   swapExample:{original:"Can you cover it while I'm out?",swapped:"Can you cover it for the rest of the week?",swappedMeaning:"今週の残り担当してもらえますか？"},category:"人事"},

  // ── 物流・オフィス 続き ────────────────────────────────────
  {id:79,text:"track it down",katakana:"トラキッダウン",meaning:"追跡して見つける",
   linkingParts:[{segment:"track_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],
   synonyms:[{text:"hunt it down",katakana:"ハニッダウン",meaning:"探し出す"},{text:"locate it",katakana:"ロウケイリッ",meaning:"場所を特定する"}],
   swapExample:{original:"I'll track it down for you.",swapped:"I'll track it down and update you by end of day.",swappedMeaning:"本日中に追跡してご報告します"},category:"物流"},
  {id:80,text:"log it out",katakana:"ロギラウッ",meaning:"記録して出す",
   linkingParts:[{segment:"log_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"check it out",katakana:"チェキラウッ",meaning:"チェックアウトする"},{text:"sign it out",katakana:"サイニラウッ",meaning:"記録して持ち出す"}],
   swapExample:{original:"Make sure to log it out when you're done.",swapped:"Make sure to log it out at the end of your shift.",swappedMeaning:"シフト終了時に必ず記録してください"},category:"物流"},
  {id:81,text:"cross it off",katakana:"クロシロッフ",meaning:"完了としてチェックを入れる",
   linkingParts:[{segment:"cross_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],
   synonyms:[{text:"check it off",katakana:"チェキロッフ",meaning:"チェックを入れる"},{text:"tick it off",katakana:"ティキロッフ",meaning:"（英）チェックを入れる"}],
   swapExample:{original:"Cross it off the list when it's done.",swapped:"Cross it off once you've confirmed delivery.",swappedMeaning:"配送確認後にリストから消してください"},category:"物流"},
  {id:82,text:"move it out",katakana:"ムーヴィラウッ",meaning:"移動させる・搬出する",
   linkingParts:[{segment:"move_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"shift it out",katakana:"シフリラウッ",meaning:"移動させる"},{text:"take it out",katakana:"テイキラウッ",meaning:"持ち出す"}],
   swapExample:{original:"We need to move it out by Thursday.",swapped:"We need to move it out before the inspection.",swappedMeaning:"検査前に搬出する必要があります"},category:"物流"},
  {id:83,text:"tag it",katakana:"タギッ",meaning:"タグを付ける・分類する",
   linkingParts:[{segment:"tag_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"}],
   synonyms:[{text:"label it",katakana:"レイブリッ",meaning:"ラベルを付ける"},{text:"mark it",katakana:"マーキッ",meaning:"マークする"}],
   swapExample:{original:"Make sure to tag it before shipping.",swapped:"Make sure to tag it with the order number.",swappedMeaning:"注文番号のタグを付けてから出荷してください"},category:"物流"},

  // ── 旅行・出張 続き ────────────────────────────────────────
  {id:84,text:"check it out early",katakana:"チェキラウッアーリー",meaning:"早めにチェックアウトする",
   linkingParts:[{segment:"check_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"complete checkout",katakana:"コンプリートチェックアウッ",meaning:"チェックアウトを完了する"},{text:"settle the bill",katakana:"セリルザビル",meaning:"精算する"}],
   swapExample:{original:"I'd like to check it out early.",swapped:"I'd like to check it out a day early if possible.",swappedMeaning:"できれば1日早めにチェックアウトしたいです"},category:"旅行"},
  {id:85,text:"make it on time",katakana:"メイキロンタイム",meaning:"時間に間に合う",
   linkingParts:[{segment:"make_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"}],
   synonyms:[{text:"arrive in time",katakana:"アライヴィンタイム",meaning:"間に合う"},{text:"catch it",katakana:"キャチィッ",meaning:"（乗り物に）乗り遅れない"}],
   swapExample:{original:"We'll make it on time if we leave now.",swapped:"We'll make it on time if we take the express.",swappedMeaning:"急行に乗れば時間に間に合います"},category:"旅行"},
  {id:86,text:"put it through expenses",katakana:"プリッスルーイクスペンシス",meaning:"経費申請する",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"expense it",katakana:"イクスペンシッ",meaning:"経費として申請する"},{text:"claim it back",katakana:"クレイミッバック",meaning:"（経費を）請求する"}],
   swapExample:{original:"Just put it through expenses.",swapped:"Just put it through expenses and attach the receipt.",swappedMeaning:"レシートを添付して経費申請してください"},category:"旅行"},

  // ── 顧客対応・営業 続き ────────────────────────────────────
  {id:87,text:"take it back",katakana:"テイキッバック",meaning:"撤回する・返品する",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_back",rule:"子音+子音",detail:"「t」+「b」→「ッバック」"}],
   synonyms:[{text:"withdraw it",katakana:"ウィズドローイッ",meaning:"撤回する"},{text:"return it",katakana:"リターニッ",meaning:"返品・返す"}],
   swapExample:{original:"I'd like to take it back.",swapped:"I'd like to take it back and exchange it.",swappedMeaning:"返品して交換したいです"},category:"顧客対応"},
  {id:88,text:"push it through",katakana:"プシッスルー",meaning:"承認を取り付ける・通す",
   linkingParts:[{segment:"push_it",rule:"子音+母音リンキング",detail:"「sh」+「it」→「シッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"get it approved",katakana:"ゲリラプルーヴッ",meaning:"承認を得る"},{text:"force it through",katakana:"フォーシッスルー",meaning:"強引に通す"}],
   swapExample:{original:"We need to push it through by Friday.",swapped:"We need to push it through before the quarter ends.",swappedMeaning:"四半期末までに承認を通す必要があります"},category:"顧客対応"},
  {id:89,text:"iron it out",katakana:"アイヤニラウッ",meaning:"問題をならして解決する",
   linkingParts:[{segment:"iron_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"smooth it out",katakana:"スムーリラウッ",meaning:"円滑に解決する"},{text:"resolve it",katakana:"リザルヴィッ",meaning:"解決する"}],
   swapExample:{original:"We need to iron it out before the launch.",swapped:"We need to iron it out with the client.",swappedMeaning:"クライアントと問題を解決する必要があります"},category:"顧客対応"},
  {id:90,text:"make it up to you",katakana:"メイキラップトゥユー",meaning:"埋め合わせをする",
   linkingParts:[{segment:"make_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"compensate you",katakana:"コンペンセイチュー",meaning:"補償する"},{text:"make amends",katakana:"メイカメンズ",meaning:"お詫びする"}],
   swapExample:{original:"I'll make it up to you.",swapped:"I'll make it up to you with a discount.",swappedMeaning:"割引でお詫びします"},category:"顧客対応"},
  {id:91,text:"throw it in",katakana:"スロウイリン",meaning:"おまけで付ける",
   linkingParts:[{segment:"throw_it",rule:"子音+母音リンキング",detail:"「w」+「it」→「ウィッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"include it free",katakana:"インクルードイッフリー",meaning:"無料でつける"},{text:"add it on",katakana:"アリロン",meaning:"おまけで加える"}],
   swapExample:{original:"We'll throw it in for free.",swapped:"We'll throw it in if you order today.",swappedMeaning:"今日注文すれば無料でお付けします"},category:"顧客対応"},

  // ── プレゼン 続き ─────────────────────────────────────────
  {id:92,text:"drill down into it",katakana:"ドリルダウニンツーイッ",meaning:"深く掘り下げる",
   linkingParts:[{segment:"drill_down",rule:"子音+子音",detail:"「l」+「d」→「ルダウン」"},{segment:"down_into",rule:"子音+母音リンキング",detail:"「n」+「into」→「ニントゥ」"}],
   synonyms:[{text:"dig into it",katakana:"ディギンツーイッ",meaning:"掘り下げる"},{text:"zoom in on it",katakana:"ズーミノニッ",meaning:"フォーカスする"}],
   swapExample:{original:"Let's drill down into it.",swapped:"Let's drill down into it in the Q&A.",swappedMeaning:"Q&Aで深く掘り下げましょう"},category:"プレゼン"},
  {id:93,text:"zoom out from it",katakana:"ズームアウッフロミッ",meaning:"大きな視点で見る",
   linkingParts:[{segment:"zoom_out",rule:"子音+母音リンキング",detail:"「m」+「out」→「マウッ」"},{segment:"out_from",rule:"子音+子音",detail:"「t」+「fr」→「ッフロ」"}],
   synonyms:[{text:"take a step back",katakana:"テイカステップバック",meaning:"一歩引いて見る"},{text:"look at the big picture",katakana:"ルカッザビッピクチャ",meaning:"全体像を見る"}],
   swapExample:{original:"Let's zoom out from it for a moment.",swapped:"Let's zoom out from it and look at the overall trend.",swappedMeaning:"一歩引いて全体のトレンドを見ましょう"},category:"プレゼン"},
  {id:94,text:"walk us through it",katakana:"ウォークアススルーイッ",meaning:"順を追って説明する",
   linkingParts:[{segment:"walk_us",rule:"子音+母音リンキング",detail:"「k」+「us」→「カス」"},{segment:"us_through",rule:"母音+子音",detail:"「s」+「through」→「ストゥルー」"}],
   synonyms:[{text:"take us through it",katakana:"テイカストゥルーイッ",meaning:"案内してもらう"},{text:"explain it step by step",katakana:"イクスプレイニッステップバイステップ",meaning:"ステップごとに説明する"}],
   swapExample:{original:"Could you walk us through it?",swapped:"Could you walk us through it from the beginning?",swappedMeaning:"最初から順番に説明してもらえますか？"},category:"プレゼン"},
  {id:95,text:"call it out",katakana:"コーリラウッ",meaning:"明示する・指摘する",
   linkingParts:[{segment:"call_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"point it out",katakana:"ポインリラウッ",meaning:"指摘する"},{text:"highlight it",katakana:"ハイライリッ",meaning:"強調する"}],
   swapExample:{original:"I want to call it out explicitly.",swapped:"I want to call it out so everyone is aware.",swappedMeaning:"全員が認識できるよう明示したいです"},category:"プレゼン"},

  // ── IT・デジタル 続き ──────────────────────────────────────
  {id:96,text:"boot it up",katakana:"ブーリラップ",meaning:"起動する",
   linkingParts:[{segment:"boot_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"start it up",katakana:"スターリラップ",meaning:"起動する"},{text:"power it on",katakana:"パワーリロン",meaning:"電源を入れる"}],
   swapExample:{original:"Boot it up and let me know if it works.",swapped:"Boot it up and run the diagnostic.",swappedMeaning:"起動して診断を実行してください"},category:"IT"},
  {id:97,text:"shut it down",katakana:"シャリッダウン",meaning:"シャットダウンする・閉鎖する",
   linkingParts:[{segment:"shut_it",rule:"flap T + 母音",detail:"「t」→ら行「シャリッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],
   synonyms:[{text:"power it off",katakana:"パワーリロッフ",meaning:"電源を切る"},{text:"close it down",katakana:"クロウジッダウン",meaning:"閉じる・終了する"}],
   swapExample:{original:"Please shut it down at the end of the day.",swapped:"Please shut it down after the backup.",swappedMeaning:"バックアップ後にシャットダウンしてください"},category:"IT"},
  {id:98,text:"push it out",katakana:"プシラウッ",meaning:"リリースする・デプロイする",
   linkingParts:[{segment:"push_it",rule:"子音+母音リンキング",detail:"「sh」+「it」→「シッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"roll it out",katakana:"ロウリラウッ",meaning:"展開する"},{text:"release it",katakana:"リリーシッ",meaning:"リリースする"}],
   swapExample:{original:"We'll push it out tonight.",swapped:"We'll push it out after QA approval.",swappedMeaning:"QA承認後にデプロイします"},category:"IT"},
  {id:99,text:"scale it up",katakana:"スケイリラップ",meaning:"スケールアップする",
   linkingParts:[{segment:"scale_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"ramp it up",katakana:"ランピラップ",meaning:"拡大する・増強する"},{text:"expand it",katakana:"イクスパンリッ",meaning:"拡張する"}],
   swapExample:{original:"We need to scale it up quickly.",swapped:"We need to scale it up before the product launch.",swappedMeaning:"製品ローンチ前にスケールアップする必要があります"},category:"IT"},
  {id:100,text:"patch it up",katakana:"パチィラップ",meaning:"パッチを当てる・修復する",
   linkingParts:[{segment:"patch_it",rule:"子音+母音リンキング",detail:"「ch」+「it」→「チィッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"fix it up",katakana:"フィキラップ",meaning:"修正する"},{text:"repair it",katakana:"リペアリッ",meaning:"修復する"}],
   swapExample:{original:"We need to patch it up before going live.",swapped:"We need to patch it up — there's a security hole.",swappedMeaning:"セキュリティホールがあるのでパッチが必要です"},category:"IT"},
  {id:101,text:"stress-test it",katakana:"ストレステスリッ",meaning:"負荷テストをかける",
   linkingParts:[{segment:"test_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"load test it",katakana:"ロードテスリッ",meaning:"ロードテストをする"},{text:"push it to the limit",katakana:"プシッタザリミッ",meaning:"限界まで試す"}],
   swapExample:{original:"We should stress-test it first.",swapped:"We should stress-test it before the release.",swappedMeaning:"リリース前に負荷テストをすべきです"},category:"IT"},

  // ── 短縮形・弱形 続き ──────────────────────────────────────
  {id:102,text:"got to",katakana:"ガラ",meaning:"〜しなければならない（gotta）",
   linkingParts:[{segment:"got_to",rule:"弱形・縮約",detail:"「got」+「to」→「ガラ」（gotta）flap T"}],
   synonyms:[{text:"have to",katakana:"ハフタ",meaning:"〜しなければならない"},{text:"need to",katakana:"ニードゥ",meaning:"〜する必要がある"}],
   swapExample:{original:"You've got to submit this today.",swapped:"You've got to submit this before the deadline.",swappedMeaning:"締め切り前に提出しなければなりません"},category:"短縮形"},
  {id:103,text:"ought to",katakana:"オーダ",meaning:"〜すべき",
   linkingParts:[{segment:"ought_to",rule:"弱形・縮約",detail:"「ought」+「to」→「オーダ」（tが弱化）"}],
   synonyms:[{text:"should",katakana:"シュッ",meaning:"〜すべき"},{text:"supposed to",katakana:"サポーストゥ",meaning:"〜することになっている"}],
   swapExample:{original:"You ought to check with HR.",swapped:"You ought to check with HR before deciding.",swappedMeaning:"決める前に人事に確認すべきです"},category:"短縮形"},
  {id:104,text:"let me",katakana:"レミ",meaning:"〜させてください（lemme）",
   linkingParts:[{segment:"let_me",rule:"子音+母音リンキング",detail:"「t」+「me」→「ミ」（flap、lemme）"}],
   synonyms:[{text:"allow me to",katakana:"アラウミートゥ",meaning:"〜させてください（丁寧）"},{text:"I'll",katakana:"アイル",meaning:"私が〜します"}],
   swapExample:{original:"Let me take a look at that.",swapped:"Let me take a look at that right away.",swappedMeaning:"すぐに確認させてください"},category:"短縮形"},
  {id:105,text:"give me",katakana:"ギミ",meaning:"〜をください（gimme）",
   linkingParts:[{segment:"give_me",rule:"子音+母音リンキング",detail:"「v」+「me」→「ヴミ」→「ギミ」（gimme）"}],
   synonyms:[{text:"pass me",katakana:"パッスミ",meaning:"〜を回してください"},{text:"hand me",katakana:"ハンミ",meaning:"〜を手渡してください"}],
   swapExample:{original:"Give me a second.",swapped:"Give me a second to pull up the file.",swappedMeaning:"ファイルを開く時間を少しください"},category:"短縮形"},
  {id:106,text:"could have",katakana:"クダヴ",meaning:"〜できたはずなのに",
   linkingParts:[{segment:"could_have",rule:"弱形・縮約",detail:"「could」+「have」→「クダヴ」（could've）"}],
   synonyms:[{text:"should have",katakana:"シュダヴ",meaning:"〜すべきだったのに"},{text:"would have",katakana:"ウダヴ",meaning:"〜したはずなのに"}],
   swapExample:{original:"We could have avoided this.",swapped:"We could have avoided this with better planning.",swappedMeaning:"もっと計画していれば避けられたのに"},category:"短縮形"},
  {id:107,text:"should have",katakana:"シュダヴ",meaning:"〜すべきだったのに",
   linkingParts:[{segment:"should_have",rule:"弱形・縮約",detail:"「should」+「have」→「シュダヴ」（should've）"}],
   synonyms:[{text:"ought to have",katakana:"オーダヴ",meaning:"〜すべきだった"},{text:"was supposed to",katakana:"ワズサポーストゥ",meaning:"〜するはずだった"}],
   swapExample:{original:"We should have told them earlier.",swapped:"We should have told them earlier to avoid confusion.",swappedMeaning:"混乱を避けるためもっと早く伝えるべきでした"},category:"短縮形"},
  {id:108,text:"would you",katakana:"ウジャ",meaning:"〜してもらえますか？",
   linkingParts:[{segment:"would_you",rule:"弱形・縮約",detail:"「would」+「you」→「ウジャ」（yod coalescence）"}],
   synonyms:[{text:"could you",katakana:"クジャ",meaning:"〜していただけますか？"},{text:"can you",katakana:"キャニュー",meaning:"〜してもらえますか？"}],
   swapExample:{original:"Would you like some help?",swapped:"Would you like some help with the report?",swappedMeaning:"レポートのお手伝いをしましょうか？"},category:"短縮形"},
  {id:109,text:"did you",katakana:"ディジャ",meaning:"〜しましたか？",
   linkingParts:[{segment:"did_you",rule:"弱形・縮約",detail:"「d」+「you」→「ディジャ」（yod coalescence）"}],
   synonyms:[{text:"have you",katakana:"ハヴュー",meaning:"（現在完了）〜しましたか？"},{text:"were you",katakana:"ワーユー",meaning:"〜でしたか？"}],
   swapExample:{original:"Did you get my email?",swapped:"Did you get my email about the meeting?",swappedMeaning:"会議についてのメールは届きましたか？"},category:"短縮形"},
  {id:110,text:"what do you",katakana:"ワリャ",meaning:"あなたは何を〜？",
   linkingParts:[{segment:"what_do",rule:"弱形・縮約",detail:"「what」+「do」→「ワド」（t弱化）"},{segment:"do_you",rule:"弱形・縮約",detail:"「do」+「you」→「ジャ」（yod coalescence）"}],
   synonyms:[{text:"how do you",katakana:"ハウジャ",meaning:"どのように？"},{text:"what are you",katakana:"ワラユー",meaning:"何をしているの？"}],
   swapExample:{original:"What do you think about that?",swapped:"What do you think about the new proposal?",swappedMeaning:"新しい提案についてどう思いますか？"},category:"短縮形"},
  {id:111,text:"going to have to",katakana:"ゴナハフタ",meaning:"〜せざるを得ない",
   linkingParts:[{segment:"going_to",rule:"弱形・縮約",detail:"「going to」→「ゴナ」"},{segment:"have_to",rule:"弱形・縮約",detail:"「have to」→「ハフタ」"}],
   synonyms:[{text:"will need to",katakana:"ウィルニードゥ",meaning:"〜する必要が出てくる"},{text:"be forced to",katakana:"ビーフォーストゥ",meaning:"〜せざるを得ない"}],
   swapExample:{original:"We're going to have to renegotiate.",swapped:"We're going to have to renegotiate the contract.",swappedMeaning:"契約を再交渉せざるを得ません"},category:"短縮形"},

  // ── 財務・交渉 続き ────────────────────────────────────────
  {id:112,text:"write it off",katakana:"ライリロッフ",meaning:"損金算入する・諦める",
   linkingParts:[{segment:"write_it",rule:"flap T + 母音",detail:"「t」→ら行「ライリッ」"},{segment:"it_off",rule:"子音+母音リンキング",detail:"「t」+「off」→「ロッフ」"}],
   synonyms:[{text:"expense it",katakana:"イクスペンシッ",meaning:"経費計上する"},{text:"write it down",katakana:"ライリッダウン",meaning:"評価減する"}],
   swapExample:{original:"We can write it off as a business expense.",swapped:"We can write it off on our taxes.",swappedMeaning:"税務上で損金算入できます"},category:"財務"},
  {id:113,text:"draw it up",katakana:"ドローイラップ",meaning:"（契約書・計画を）作成する",
   linkingParts:[{segment:"draw_it",rule:"子音+母音リンキング",detail:"「w」+「it」→「ウィッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"draft it up",katakana:"ドラフリラップ",meaning:"草案を作る"},{text:"write it up",katakana:"ライリラップ",meaning:"書き上げる"}],
   swapExample:{original:"I'll draw it up by end of day.",swapped:"I'll draw it up and send it for review.",swappedMeaning:"作成してレビュー用に送ります"},category:"財務"},
  {id:114,text:"ring it up",katakana:"リンギラップ",meaning:"レジを打つ・合計する",
   linkingParts:[{segment:"ring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"tally it up",katakana:"タリラップ",meaning:"集計する"},{text:"total it up",katakana:"トータリラップ",meaning:"合計する"}],
   swapExample:{original:"Can you ring it up at the register?",swapped:"Can you ring it up and give me the total?",swappedMeaning:"合計金額を出してもらえますか？"},category:"財務"},
  {id:115,text:"factor it in",katakana:"ファクタリリン",meaning:"考慮に入れる",
   linkingParts:[{segment:"factor_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"take it into account",katakana:"テイキリンツーアカウッ",meaning:"考慮に入れる"},{text:"include it",katakana:"インクルーリッ",meaning:"含める"}],
   swapExample:{original:"Make sure to factor it in.",swapped:"Make sure to factor it in when calculating the ROI.",swappedMeaning:"ROI計算時に考慮してください"},category:"財務"},
  {id:116,text:"bid on it",katakana:"ビドノニッ",meaning:"入札する",
   linkingParts:[{segment:"bid_on",rule:"子音+母音リンキング",detail:"「d」+「on」→「ドノン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"put in an offer",katakana:"プリニャノファ",meaning:"オファーを出す"},{text:"tender for it",katakana:"テンダフォーイッ",meaning:"入札する（英）"}],
   swapExample:{original:"We're going to bid on it.",swapped:"We're going to bid on it next month.",swappedMeaning:"来月入札する予定です"},category:"財務"},
  {id:117,text:"cash it out",katakana:"キャシラウッ",meaning:"現金化する",
   linkingParts:[{segment:"cash_it",rule:"子音+母音リンキング",detail:"「sh」+「it」→「シッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"liquidate it",katakana:"リクウィデイリッ",meaning:"換金・清算する"},{text:"encash it",katakana:"エンキャシッ",meaning:"現金に換える"}],
   swapExample:{original:"Should we cash it out now?",swapped:"Should we cash it out before the market drops?",swappedMeaning:"市場が下がる前に現金化すべきですか？"},category:"財務"},

  // ── ビジネス定型 ──────────────────────────────────────────
  {id:118,text:"take note of it",katakana:"テイクノウロヴィッ",meaning:"注意して聞く・メモする",
   linkingParts:[{segment:"take_note",rule:"子音+母音リンキング",detail:"「k」+「note」→「クノウッ」"},{segment:"note_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」"}],
   synonyms:[{text:"note it down",katakana:"ノウリッダウン",meaning:"書き留める"},{text:"keep it in mind",katakana:"キーピリンマインド",meaning:"頭に入れておく"}],
   swapExample:{original:"Please take note of it.",swapped:"Please take note of it for the minutes.",swappedMeaning:"議事録用にメモしておいてください"},category:"ビジネス定型"},
  {id:119,text:"check it against",katakana:"チェキラゲンスト",meaning:"〜と照合する",
   linkingParts:[{segment:"check_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_against",rule:"flap T + 母音",detail:"「t」+「against」→「ラゲンスト」"}],
   synonyms:[{text:"compare it with",katakana:"コンペアリッウィズ",meaning:"〜と比較する"},{text:"verify it against",katakana:"ヴェリファイラゲンスト",meaning:"照合して確認する"}],
   swapExample:{original:"Check it against the original.",swapped:"Check it against the contract terms.",swappedMeaning:"契約条件と照合してください"},category:"ビジネス定型"},
  {id:120,text:"table it for now",katakana:"テイブリッフォーナウ",meaning:"今は保留にする",
   linkingParts:[{segment:"table_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_for",rule:"flap T + 母音",detail:"「t」+「for」→「リフォ」"}],
   synonyms:[{text:"park it",katakana:"パーキッ",meaning:"（議論を）一時保留する"},{text:"hold it",katakana:"ホールリッ",meaning:"後回しにする"}],
   swapExample:{original:"Let's table it for now and revisit later.",swapped:"Let's table it for now and come back next week.",swappedMeaning:"今は保留にして来週また議論しましょう"},category:"ビジネス定型"},
  {id:121,text:"circle back on it",katakana:"サークルバックオニッ",meaning:"後で戻って確認する",
   linkingParts:[{segment:"back_on",rule:"子音+母音リンキング",detail:"「k」+「on」→「コン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"come back to it",katakana:"カムバックトゥイッ",meaning:"後で戻る"},{text:"revisit it",katakana:"リーヴィジリッ",meaning:"再度確認する"}],
   swapExample:{original:"Let's circle back on it after lunch.",swapped:"Let's circle back on it at the end of the week.",swappedMeaning:"週末にまた確認しましょう"},category:"ビジネス定型"},
  {id:122,text:"take it offline",katakana:"テイキロッフライン",meaning:"別途話し合う（会議外で）",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_offline",rule:"flap T + 母音",detail:"「t」+「offline」→「ロッフライン」"}],
   synonyms:[{text:"discuss it separately",katakana:"ディスカシッセパレトリ",meaning:"別途議論する"},{text:"have a side conversation",katakana:"ハヴァサイドコンヴァセイション",meaning:"別に話し合う"}],
   swapExample:{original:"Let's take it offline.",swapped:"Let's take it offline after this meeting.",swappedMeaning:"この会議後に別途話しましょう"},category:"ビジネス定型"},
  {id:123,text:"move it to",katakana:"ムーヴィトゥ",meaning:"〜に移す・変更する",
   linkingParts:[{segment:"move_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_to",rule:"子音+母音リンキング",detail:"「t」+「to」→「トゥ」"}],
   synonyms:[{text:"transfer it to",katakana:"トランスファーイットゥ",meaning:"〜に転送・移動する"},{text:"shift it to",katakana:"シフリトゥ",meaning:"〜にシフトする"}],
   swapExample:{original:"Let's move it to Thursday.",swapped:"Let's move it to a more convenient time.",swappedMeaning:"もっと都合の良い時間に変更しましょう"},category:"ビジネス定型"},
  {id:124,text:"act on it",katakana:"アクロニッ",meaning:"実行に移す",
   linkingParts:[{segment:"act_on",rule:"子音+母音リンキング",detail:"「t」+「on」→「ロン」（flap）"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"execute on it",katakana:"エクセキュートノニッ",meaning:"実行する"},{text:"follow through on it",katakana:"ファロウスルーオニッ",meaning:"やり遂げる"}],
   swapExample:{original:"We need to act on it immediately.",swapped:"We need to act on it before the opportunity closes.",swappedMeaning:"機会が閉じる前に動く必要があります"},category:"ビジネス定型"},
  {id:125,text:"run it past",katakana:"ラニッパスト",meaning:"〜に意見を聞く・通す",
   linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_past",rule:"子音+子音",detail:"「t」+「p」→「ッパスト」"}],
   synonyms:[{text:"run it by",katakana:"ラニッバイ",meaning:"確認を取る"},{text:"show it to",katakana:"ショウイットゥ",meaning:"見せて確認する"}],
   swapExample:{original:"Run it past the legal team first.",swapped:"Run it past the CFO before we finalize.",swappedMeaning:"確定前にCFOに確認してください"},category:"ビジネス定型"},

  {id:126,text:"fill out the application",katakana:"フィラウッジアプリケイション",meaning:"応募書類に記入する",linkingParts:[{segment:"fill_out",rule:"子音+母音リンキング",detail:"「l」+「out」→「ラウッ」"},{segment:"out_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"}],synonyms:[{text:"complete the form",katakana:"コンプリートザフォーム",meaning:"フォームを完成させる"},{text:"submit the application",katakana:"サブミッジアプリケイション",meaning:"申請書を提出する"}],swapExample:{original:"Please fill out the application online.",swapped:"Please fill out the application and return it by Monday.",swappedMeaning:"月曜日までに記入して返送してください"},scene:{en:"Used in recruitment when candidates apply for a position — online or paper forms.",ja:"採用プロセスで応募者に書類記入を依頼する場面。TOEICの採用・人事問題で頻出。"},category:"採用"},
  {id:127,text:"set up an interview",katakana:"セラップアニンタヴュー",meaning:"面接を設定する",linkingParts:[{segment:"set_up",rule:"子音+母音リンキング",detail:"「t」+「up」→「ラップ」（flap）"},{segment:"up_an",rule:"子音+母音リンキング",detail:"「p」+「an」→「パン」"}],synonyms:[{text:"schedule an interview",katakana:"スケジューラニンタヴュー",meaning:"面接をスケジュールする"},{text:"arrange a meeting",katakana:"アレインジャミーティング",meaning:"会議を手配する"}],swapExample:{original:"I'd like to set up an interview.",swapped:"I'd like to set up an interview for next week.",swappedMeaning:"来週面接を設定したいです"},scene:{en:"HR contacts candidates to arrange interviews. One of the most common phrases in TOEIC recruitment dialogues.",ja:"採用担当者が応募者に面接日程を設定する場面。TOEICの採用シーンで最頻出フレーズの一つ。"},category:"採用"},
  {id:128,text:"take it to the next round",katakana:"テイキットゥザネクストラウンド",meaning:"次の選考に進める",linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],synonyms:[{text:"advance them",katakana:"アドヴァンスゼム",meaning:"次に進める"},{text:"move forward with them",katakana:"ムーヴフォーワッウィズゼム",meaning:"採用を前進させる"}],swapExample:{original:"Let's take it to the next round.",swapped:"Let's take it to the next round and schedule a panel interview.",swappedMeaning:"次の選考に進めてパネル面接を設定しましょう"},scene:{en:"Used when a candidate passes a stage of the interview process and will be invited back.",ja:"採用選考で候補者を次のステージに進める場面。TOEICの採用プロセス問題でよく出る。"},category:"採用"},
  {id:129,text:"check their references",katakana:"チェッケアリファレンシス",meaning:"リファレンスチェックをする",linkingParts:[{segment:"check_their",rule:"子音+母音リンキング",detail:"「k」+「their」→「クデア」"},{segment:"their_references",rule:"子音+子音",detail:"「r」+「ref」→「デアレファ」"}],synonyms:[{text:"verify their background",katakana:"ヴェリファイデアバックグラウンド",meaning:"経歴を確認する"},{text:"contact their references",katakana:"コンタクッデアリファレンシス",meaning:"推薦者に連絡する"}],swapExample:{original:"We need to check their references first.",swapped:"We need to check their references before making an offer.",swappedMeaning:"内定を出す前にリファレンスチェックが必要です"},scene:{en:"Standard step in Western hiring — verifying a candidate's work history with former employers.",ja:"特に外資系企業での採用で必須のリファレンスチェック。TOEIC採用場面で出てくる。"},category:"採用"},
  {id:130,text:"make an offer",katakana:"メイカノファ",meaning:"内定を出す・オファーをする",linkingParts:[{segment:"make_an",rule:"子音+母音リンキング",detail:"「k」+「an」→「カン」"},{segment:"an_offer",rule:"母音+母音リンキング",detail:"「an」+「offer」→「アノファ」"}],synonyms:[{text:"extend an offer",katakana:"イクステンダノファ",meaning:"オファーを提示する"},{text:"give them the job",katakana:"ギヴゼムザジョブ",meaning:"採用する"}],swapExample:{original:"We'd like to make an offer.",swapped:"We'd like to make an offer by end of week.",swappedMeaning:"週末までに内定を出したいです"},scene:{en:"Said by HR when deciding to hire — the key phrase at the climax of any TOEIC job-offer conversation.",ja:"採用決定時にHRが候補者に内定を提示する場面。採用プロセスのクライマックスのフレーズ。"},category:"採用"},
  {id:131,text:"run it again",katakana:"ラニラゲン",meaning:"もう一度やってみる",linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_again",rule:"flap T + 母音",detail:"「t」+「again」→「ラゲン」"}],synonyms:[{text:"try it again",katakana:"トライラゲン",meaning:"もう一度試す"},{text:"repeat it",katakana:"リピーリッ",meaning:"繰り返す"}],swapExample:{original:"Let's run it again from the start.",swapped:"Let's run it again with the new settings.",swappedMeaning:"新しい設定でもう一度実行してみましょう"},scene:{en:"Used in training, software demos, or QA checks when repeating a process to verify it works.",ja:"研修・デモ・テストでプロセスを繰り返す場面。「もう一度やってみよう」という指示。"},category:"研修"},
  {id:132,text:"get a feel for it",katakana:"ゲラフィールフォーイッ",meaning:"感覚を掴む",linkingParts:[{segment:"get_a",rule:"flap T + 母音",detail:"「t」+「a」→「ラ」（flap）"},{segment:"feel_for",rule:"子音+母音リンキング",detail:"「l」+「for」→「ルフォ」"}],synonyms:[{text:"get the hang of it",katakana:"ゲッザハングオヴィッ",meaning:"コツを掴む"},{text:"get used to it",katakana:"ゲッユーストゥイッ",meaning:"慣れる"}],swapExample:{original:"It takes a while to get a feel for it.",swapped:"It takes a while to get a feel for it, but you'll pick it up.",swappedMeaning:"慣れるまで少し時間がかかりますが、すぐに覚えられますよ"},scene:{en:"Encouragement during onboarding — telling a new hire it's normal to struggle at first.",ja:"新人育成・スキルトレーニングで「慣れるまで時間がかかるよ」という励まし。"},category:"研修"},
  {id:133,text:"put it into practice",katakana:"プリリントゥプラクティス",meaning:"実践する",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_into",rule:"flap T + 母音",detail:"「t」+「into」→「リントゥ」"}],synonyms:[{text:"apply it",katakana:"アプライイッ",meaning:"適用する"},{text:"try it out",katakana:"トライラウッ",meaning:"試しにやってみる"}],swapExample:{original:"Now let's put it into practice.",swapped:"Now let's put it into practice with a real example.",swappedMeaning:"実際の例を使って実践してみましょう"},scene:{en:"Used in training when moving from theory/lecture to hands-on exercises.",ja:"研修で理論から実践に移るときの合図。「では実際にやってみましょう」の英語版。"},category:"研修"},
  {id:134,text:"pick it up quickly",katakana:"ピキラップクウィックリ",meaning:"素早く覚える",linkingParts:[{segment:"pick_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"learn it fast",katakana:"ラーニッファスト",meaning:"素早く覚える"},{text:"catch on quickly",katakana:"キャチョンクウィックリ",meaning:"すぐに理解する"}],swapExample:{original:"I'm sure you'll pick it up quickly.",swapped:"I'm sure you'll pick it up quickly — it's not that complex.",swappedMeaning:"すぐに覚えられますよ、それほど複雑ではありません"},scene:{en:"Encouragement to a new hire during onboarding. Also used when someone learns a skill faster than expected.",ja:"研修中に新入社員を励ます表現。「すぐ慣れるよ」という上司・先輩からの言葉。"},category:"研修"},
  {id:135,text:"take it in",katakana:"テイキリン",meaning:"理解する・吸収する",linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],synonyms:[{text:"absorb it",katakana:"アブゾーブィッ",meaning:"吸収する"},{text:"process it",katakana:"プロセシッ",meaning:"処理・理解する"}],swapExample:{original:"Take a moment to take it in.",swapped:"Take a moment to take it in before we move on.",swappedMeaning:"次に進む前に少し理解する時間を取ってください"},scene:{en:"Said by a presenter or trainer to give the audience time to process a large amount of information.",ja:"大量の情報を提示した後、聴衆に消化する時間を与えるときの表現。プレゼン・研修で頻出。"},category:"研修"},
  {id:136,text:"put it together",katakana:"プリットゥギャザ",meaning:"組み立てる・まとめる",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_together",rule:"flap T + 母音",detail:"「t」+「together」→「トゥギャザ」"}],synonyms:[{text:"assemble it",katakana:"アセンブリッ",meaning:"組み立てる"},{text:"build it",katakana:"ビルリッ",meaning:"製造する"}],swapExample:{original:"Can you put it together by tomorrow?",swapped:"Can you put it together for the product demo?",swappedMeaning:"製品デモ用に組み立ててもらえますか？"},scene:{en:"Used in manufacturing or project contexts when assembling something — physically or conceptually.",ja:"製造・組み立て・プロジェクトのまとめ上げ場面。工場・物流倉庫で日常的に使われる。"},category:"製造"},
  {id:137,text:"run it through quality control",katakana:"ラニッスルークウォリティコントロール",meaning:"品質管理を通す",linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],synonyms:[{text:"QC it",katakana:"キューシーイッ",meaning:"品質チェックする"},{text:"inspect it",katakana:"インスペクリッ",meaning:"検査する"}],swapExample:{original:"Run it through quality control first.",swapped:"Run it through quality control before shipping.",swappedMeaning:"出荷前に品質管理を通してください"},scene:{en:"Standard manufacturing step to ensure products meet specifications before delivery.",ja:"製造・出荷前の品質管理プロセス。工場・製造業のTOEIC問題で頻出。"},category:"製造"},
  {id:138,text:"line it up",katakana:"ラインニラップ",meaning:"整列させる・手配する",linkingParts:[{segment:"line_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"set it up",katakana:"セリラップ",meaning:"準備する"},{text:"arrange it",katakana:"アレインジィッ",meaning:"手配する"}],swapExample:{original:"Line it up for the inspection.",swapped:"Line it up on the conveyor belt in order.",swappedMeaning:"コンベヤーベルトに順番に並べてください"},scene:{en:"Used in production lines when arranging products for inspection or next processing step.",ja:"製造ライン・検査で製品を整列させる場面。工場・物流センターでよく使われる。"},category:"製造"},
  {id:139,text:"ship it out",katakana:"シピラウッ",meaning:"出荷する",linkingParts:[{segment:"ship_it",rule:"子音+母音リンキング",detail:"「p」+「it」→「ピッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"dispatch it",katakana:"ディスパッチィッ",meaning:"発送する"},{text:"send it off",katakana:"センリロッフ",meaning:"送り出す"}],swapExample:{original:"We'll ship it out first thing tomorrow.",swapped:"We'll ship it out as soon as it clears inspection.",swappedMeaning:"検査が通り次第すぐに出荷します"},scene:{en:"Used in warehouses and logistics when sending products to customers or distributors.",ja:"倉庫・物流センターから顧客・流通業者への出荷。製造・物流TOEICシーンで必須。"},category:"製造"},
  {id:140,text:"roll it out to the market",katakana:"ロウリラウットゥザマーケッ",meaning:"市場に投入する",linkingParts:[{segment:"roll_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"launch it",katakana:"ローンチィッ",meaning:"ローンチする"},{text:"bring it to market",katakana:"ブリンギットゥマーケッ",meaning:"市場に持ち込む"}],swapExample:{original:"We're ready to roll it out to the market.",swapped:"We're ready to roll it out to the market next spring.",swappedMeaning:"来春に市場投入する準備が整いました"},scene:{en:"Used in product launch meetings when a new product or feature is ready for consumers.",ja:"新製品を市場に投入するマーケティング会議。プロダクトローンチの場面で頻出。"},category:"マーケティング"},
  {id:141,text:"pitch it to the client",katakana:"ピチィットゥザクライアン",meaning:"クライアントにプレゼンする",linkingParts:[{segment:"pitch_it",rule:"子音+母音リンキング",detail:"「ch」+「it」→「チィッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],synonyms:[{text:"present it to them",katakana:"プレゼニットゥゼム",meaning:"彼らにプレゼンする"},{text:"propose it",katakana:"プロポウジィッ",meaning:"提案する"}],swapExample:{original:"We need to pitch it to the client this week.",swapped:"We need to pitch it to the client before they choose a competitor.",swappedMeaning:"競合他社を選ぶ前にクライアントにプレゼンする必要があります"},scene:{en:"Used in advertising or consulting when delivering a proposal to a client.",ja:"広告・コンサルティングでクライアント向け提案を行う場面。営業の核心フレーズ。"},category:"マーケティング"},
  {id:142,text:"get it in front of",katakana:"ゲリリンフロントオヴ",meaning:"〜の目に触れさせる",linkingParts:[{segment:"get_it",rule:"flap T + 母音",detail:"「t」→ら行「ゲリッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],synonyms:[{text:"expose it to",katakana:"イクスポウジィットゥ",meaning:"〜に見せる・露出させる"},{text:"show it to",katakana:"ショウイットゥ",meaning:"見せる"}],swapExample:{original:"We need to get it in front of decision makers.",swapped:"We need to get it in front of the right audience.",swappedMeaning:"適切な視聴者に届ける必要があります"},scene:{en:"Marketing/sales term for exposing your product or message to key stakeholders or target audience.",ja:"広告・営業で製品や提案を意思決定者・ターゲットに「見せる」場面。マーケで最頻出表現の一つ。"},category:"マーケティング"},
  {id:143,text:"test it out on users",katakana:"テスリラウッオンユーザーズ",meaning:"ユーザーでテストする",linkingParts:[{segment:"test_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"A/B test it",katakana:"エービーテスリッ",meaning:"A/Bテストする"},{text:"trial it",katakana:"トライアリッ",meaning:"試験的に使う"}],swapExample:{original:"We should test it out on users before launch.",swapped:"We should test it out on users in the beta phase.",swappedMeaning:"ベータ段階でユーザーでテストすべきです"},scene:{en:"Used in product development and digital marketing when validating ideas with real users before full launch.",ja:"製品・施策をユーザー検証する場面。デジタルマーケティング・UXリサーチで頻出。"},category:"マーケティング"},
  {id:144,text:"fix it up",katakana:"フィキラップ",meaning:"修繕する・整える",linkingParts:[{segment:"fix_it",rule:"子音+母音リンキング",detail:"「x」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"renovate it",katakana:"レノヴェイリッ",meaning:"改修する"},{text:"refurbish it",katakana:"リファービシッ",meaning:"改装する"}],swapExample:{original:"We'll need to fix it up before renting it out.",swapped:"We'll need to fix it up to meet safety standards.",swappedMeaning:"安全基準を満たすために修繕が必要です"},scene:{en:"Used in property management when a space needs repairs or improvements before occupancy.",ja:"不動産・施設管理で使用前に修繕する場面。物件改修・メンテナンスの文脈で頻出。"},category:"施設"},
  {id:145,text:"lease it out",katakana:"リーシラウッ",meaning:"賃貸に出す",linkingParts:[{segment:"lease_it",rule:"子音+母音リンキング",detail:"「z」+「it」→「ジッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"rent it out",katakana:"レニラウッ",meaning:"貸し出す"},{text:"let it out",katakana:"レリラウッ",meaning:"（英）貸し出す"}],swapExample:{original:"We've decided to lease it out.",swapped:"We've decided to lease it out to a third party.",swappedMeaning:"第三者に賃貸に出すことにしました"},scene:{en:"Used in real estate and corporate property management when renting out unused office or retail space.",ja:"オフィス・物件を他社・個人に賃貸する場面。不動産・企業施設管理で頻出。"},category:"施設"},
  {id:146,text:"check it out in person",katakana:"チェキラウッインパーソン",meaning:"現地確認する",linkingParts:[{segment:"check_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"view it",katakana:"ヴューイッ",meaning:"見学する"},{text:"inspect it",katakana:"インスペクリッ",meaning:"現場検査する"}],swapExample:{original:"We should check it out in person before signing.",swapped:"We should check it out in person this weekend.",swappedMeaning:"今週末に現地確認しましょう"},scene:{en:"Used in real estate or facility management when physically visiting a property before committing.",ja:"物件内見・施設確認の場面。不動産・施設管理のTOEIC問題でよく出る。"},category:"施設"},
  {id:147,text:"cover it under insurance",katakana:"カヴァリッアンダーインシュアランス",meaning:"保険でカバーする",linkingParts:[{segment:"cover_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"},{segment:"it_under",rule:"flap T + 母音",detail:"「t」+「under」→「ランダ」"}],synonyms:[{text:"reimburse it",katakana:"リームバーシッ",meaning:"払い戻す"},{text:"claim it",katakana:"クレイミッ",meaning:"請求する"}],swapExample:{original:"Is it covered under my insurance?",swapped:"Is it covered under my insurance plan?",swappedMeaning:"私の保険プランでカバーされますか？"},scene:{en:"Used when asking whether a medical procedure, test, or prescription is included in a health insurance plan.",ja:"医療保険適用の確認。診察・処方箋・入院手続きでよく出てくるフレーズ。"},category:"医療"},
  {id:148,text:"schedule it with the doctor",katakana:"スケジューリッウィザドクター",meaning:"医師の予約をする",linkingParts:[{segment:"schedule_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_with",rule:"子音+子音",detail:"「t」+「w」→「ッウィ」"}],synonyms:[{text:"book an appointment",katakana:"ブッカナポイントメン",meaning:"予約を取る"},{text:"make an appointment",katakana:"メイカナポイントメン",meaning:"予約する"}],swapExample:{original:"I need to schedule it with the doctor.",swapped:"I need to schedule it with the doctor as soon as possible.",swappedMeaning:"できるだけ早く医師の予約を取る必要があります"},scene:{en:"Used when booking a medical appointment. Very common in TOEIC health and workplace conversations.",ja:"医療機関の予約を取る場面。TOEICの健康・職場会話で頻出。"},category:"医療"},
  {id:149,text:"take it to go",katakana:"テイキットゥゴウ",meaning:"持ち帰りにする",linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],synonyms:[{text:"get it to go",katakana:"ゲリットゥゴウ",meaning:"持ち帰りで注文する"},{text:"make it takeaway",katakana:"メイキッテイカウェイ",meaning:"（英）テイクアウトにする"}],swapExample:{original:"I'll take it to go, please.",swapped:"I'll take it to go — I'm in a hurry.",swappedMeaning:"急いでいるので持ち帰りにします"},scene:{en:"Used in cafes and restaurants when ordering food or drinks to eat/drink elsewhere.",ja:"カフェ・レストランでのテイクアウト注文。TOEICの飲食・日常会話問題でよく出る。"},category:"飲食"},
  {id:150,text:"split it evenly",katakana:"スプリリリーヴンリ",meaning:"均等に割り勘する",linkingParts:[{segment:"split_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_evenly",rule:"flap T + 母音",detail:"「t」+「evenly」→「リーヴンリ」"}],synonyms:[{text:"divide it equally",katakana:"ディヴァイリリイクワリ",meaning:"均等に割る"},{text:"go Dutch",katakana:"ゴウダッチ",meaning:"割り勘にする"}],swapExample:{original:"Let's split it evenly.",swapped:"Let's split it evenly among the five of us.",swappedMeaning:"5人で均等に割り勘しましょう"},scene:{en:"Used when dividing a restaurant or event bill equally among several people.",ja:"会食・ランチの割り勘場面。TOEICの接待・飲食シーンで出てくる。"},category:"飲食"},
  {id:151,text:"put it on my tab",katakana:"プリロンマイタブ",meaning:"ツケにしておく",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"}],synonyms:[{text:"charge it to my account",katakana:"チャージィットゥマイアカウン",meaning:"アカウントに請求する"},{text:"add it to my bill",katakana:"アリットゥマイビル",meaning:"請求書に追加する"}],swapExample:{original:"Just put it on my tab.",swapped:"Just put it on my tab — I'll settle up at the end.",swappedMeaning:"最後に精算するのでツケにしておいてください"},scene:{en:"Used at bars or restaurants where the customer has a running account to be paid at the end.",ja:"バー・レストランでの後払いのツケの場面。TOEICの接待・会食問題で出てくる。"},category:"飲食"},
  {id:152,text:"ring it up",katakana:"リンギラップ",meaning:"レジを打つ",linkingParts:[{segment:"ring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"charge it",katakana:"チャージィッ",meaning:"料金を請求する"},{text:"total it up",katakana:"トータリラップ",meaning:"合計する"}],swapExample:{original:"I'll ring it up for you.",swapped:"I'll ring it up and give you the total.",swappedMeaning:"合計金額を出します"},scene:{en:"Used at cash registers in retail or food service when processing a payment.",ja:"レジ・会計の場面。小売・飲食業でのTOEICシーンで必ず出てくる。"},category:"飲食"},
  {id:153,text:"look into it legally",katakana:"ルキンツーイッリーガリ",meaning:"法的に調査する",linkingParts:[{segment:"look_into",rule:"子音+母音リンキング",detail:"「k」+「into」→「キントゥ」"},{segment:"into_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「ツーイッ」"}],synonyms:[{text:"have it reviewed by counsel",katakana:"ハヴィッリヴュードバイカウンセル",meaning:"弁護士にレビューしてもらう"},{text:"check it with legal",katakana:"チェキッウィズリーガル",meaning:"法務に確認する"}],swapExample:{original:"We need to look into it legally.",swapped:"We need to look into it legally before signing anything.",swappedMeaning:"何かにサインする前に法的に確認する必要があります"},scene:{en:"Used when a business decision may have legal implications requiring expert review before proceeding.",ja:"法的リスクのある決定前に法務確認する場面。契約・コンプライアンスでよく出る。"},category:"法務"},
  {id:154,text:"sign it over",katakana:"サイニロウヴァ",meaning:"サインして権利を譲渡する",linkingParts:[{segment:"sign_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_over",rule:"flap T + 母音",detail:"「t」+「over」→「ロウヴァ」"}],synonyms:[{text:"transfer it",katakana:"トランスファーリッ",meaning:"譲渡する"},{text:"hand it over",katakana:"ハンリロウヴァ",meaning:"引き渡す"}],swapExample:{original:"You'll need to sign it over to the new owner.",swapped:"You'll need to sign it over before the closing date.",swappedMeaning:"クロージング日前に権利を譲渡する必要があります"},scene:{en:"Legal/real estate term for transferring ownership or rights to another party through signed documents.",ja:"不動産・法務での所有権・権利の譲渡。「サインして権利を移す」という法律的表現。"},category:"法務"},
  {id:155,text:"put it on record",katakana:"プリロンレコード",meaning:"公式記録に残す",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"}],synonyms:[{text:"document it officially",katakana:"ドキュメンリッオフィシャリ",meaning:"公式に文書化する"},{text:"record it formally",katakana:"レコーリッフォーマリ",meaning:"正式に記録する"}],swapExample:{original:"I want to put it on record.",swapped:"I want to put it on record that we objected.",swappedMeaning:"私たちが反対したことを公式記録に残したいです"},scene:{en:"Used in legal, board, or formal meeting contexts to officially log a statement or objection.",ja:"取締役会・公式会議・法的手続きで発言を公式記録として残す場面。"},category:"法務"},
  {id:156,text:"transfer it over",katakana:"トランスファーリロウヴァ",meaning:"送金・振り替えする",linkingParts:[{segment:"transfer_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"},{segment:"it_over",rule:"flap T + 母音",detail:"「t」+「over」→「ロウヴァ」"}],synonyms:[{text:"wire it",katakana:"ワイアリッ",meaning:"電信送金する"},{text:"send it electronically",katakana:"センリリレクトロニカリ",meaning:"電子送金する"}],swapExample:{original:"Can you transfer it over today?",swapped:"Can you transfer it over to the main account?",swappedMeaning:"メインアカウントに振り込んでもらえますか？"},scene:{en:"Used when moving money between bank accounts — common in banking, accounting, and fintech contexts.",ja:"銀行口座間の資金移動。経理・財務・銀行業務でよく使う表現。デジタルバンクでも毎日使える。"},category:"銀行"},
  {id:157,text:"pay it off",katakana:"ペイリロッフ",meaning:"返済する・完済する",linkingParts:[{segment:"pay_it",rule:"子音+母音リンキング",detail:"「y」+「it」→「イッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],synonyms:[{text:"settle it",katakana:"セリリッ",meaning:"清算する"},{text:"clear the debt",katakana:"クリアザデッ",meaning:"負債を解消する"}],swapExample:{original:"I want to pay it off early.",swapped:"I want to pay it off early to avoid interest.",swappedMeaning:"利息を避けるために早期返済したいです"},scene:{en:"Used when fully repaying a loan, mortgage, or credit card balance ahead of schedule.",ja:"ローン・住宅ローン・クレジット残高の完済。TOEICの銀行・財務シーンで頻出。"},category:"銀行"},
  {id:158,text:"draw it out",katakana:"ドローイラウッ",meaning:"引き出す",linkingParts:[{segment:"draw_it",rule:"子音+母音リンキング",detail:"「w」+「it」→「ウィッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"withdraw it",katakana:"ウィズドローイッ",meaning:"引き出す"},{text:"take it out",katakana:"テイキラウッ",meaning:"取り出す"}],swapExample:{original:"I'd like to draw it out in cash.",swapped:"I'd like to draw it out and pay in person.",swappedMeaning:"現金で引き出して直接支払いたいです"},scene:{en:"Banking term for withdrawing money from an account at a branch or ATM.",ja:"ATMや銀行窓口での現金引き出し。TOEICの銀行・金融場面でよく出る。"},category:"銀行"},
  {id:159,text:"phase it out",katakana:"フェイジラウッ",meaning:"段階的に廃止する",linkingParts:[{segment:"phase_it",rule:"子音+母音リンキング",detail:"「z」+「it」→「ジッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"eliminate it gradually",katakana:"イリミネイリッグラジュアリ",meaning:"段階的に排除する"},{text:"discontinue it",katakana:"ディスコンティニューイッ",meaning:"廃止する"}],swapExample:{original:"We'll phase it out by 2030.",swapped:"We'll phase it out and switch to renewable energy.",swappedMeaning:"再生可能エネルギーに切り替えて廃止します"},scene:{en:"Used in sustainability/ESG plans when removing harmful practices or fossil fuels gradually.",ja:"企業の環境方針・脱炭素計画で有害物質や化石燃料を段階廃止する場面。"},category:"環境"},
  {id:160,text:"cut it down",katakana:"カリッダウン",meaning:"削減する（排出量など）",linkingParts:[{segment:"cut_it",rule:"flap T + 母音",detail:"「t」→ら行「カリッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],synonyms:[{text:"reduce it",katakana:"リデューシッ",meaning:"削減する"},{text:"lower it",katakana:"ロウアリッ",meaning:"下げる"}],swapExample:{original:"We need to cut it down significantly.",swapped:"We need to cut it down by 40% by next year.",swappedMeaning:"来年までに40%削減する必要があります"},scene:{en:"Used in environmental reports discussing carbon emissions or waste reduction targets.",ja:"CO2排出量・廃棄物削減の目標設定。CSRレポート・環境会議でよく使われる。"},category:"環境"},
  {id:161,text:"green it up",katakana:"グリーニラップ",meaning:"環境に優しくする",linkingParts:[{segment:"green_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"make it sustainable",katakana:"メイキッサステイナブル",meaning:"持続可能にする"},{text:"go green",katakana:"ゴウグリーン",meaning:"環境対応にする"}],swapExample:{original:"We need to green it up.",swapped:"We need to green it up before the ESG review.",swappedMeaning:"ESG審査前に環境対応を進める必要があります"},scene:{en:"Used in CSR or ESG contexts when making operations or products more environmentally friendly.",ja:"ESG・CSR推進で業務や製品を環境対応にする場面。サステナビリティ報告書でも出てくる。"},category:"環境"},
  {id:162,text:"put it out there",katakana:"プリラウッデア",meaning:"世に出す・発信する",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"release it",katakana:"リリーシッ",meaning:"リリースする"},{text:"make it public",katakana:"メイキッパブリック",meaning:"公開する"}],swapExample:{original:"Let's put it out there and see the response.",swapped:"Let's put it out there on social media first.",swappedMeaning:"まずSNSで発信して反応を見てみましょう"},scene:{en:"Used in PR/marketing when launching a message, campaign, or announcement to the public.",ja:"PRキャンペーン・SNS発信を開始する場面。マーケ・広報でよく使われる。"},category:"PR"},
  {id:163,text:"spin it positively",katakana:"スピニッポジティヴリ",meaning:"肯定的に見せる",linkingParts:[{segment:"spin_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_positively",rule:"flap T + 母音",detail:"「t」+「pos」→「ポジ」"}],synonyms:[{text:"frame it well",katakana:"フレイミッウェル",meaning:"うまく表現する"},{text:"put a positive spin on it",katakana:"プラポジティヴスピノニッ",meaning:"好意的に解釈する"}],swapExample:{original:"We need to spin it positively.",swapped:"We need to spin it positively for the press release.",swappedMeaning:"プレスリリース向けに肯定的に発信する必要があります"},scene:{en:"PR/communications term for presenting difficult news or a setback in the most favorable light possible.",ja:"ネガティブなニュースをポジティブに見せるPR・コミュニケーション戦略の場面。"},category:"PR"},
  {id:164,text:"bring it about",katakana:"ブリンギラバウッ",meaning:"実現させる・引き起こす",linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_about",rule:"flap T + 母音",detail:"「t」+「about」→「ラバウッ」"}],synonyms:[{text:"make it happen",katakana:"メイキッハプン",meaning:"実現させる"},{text:"cause it",katakana:"コーズィッ",meaning:"引き起こす"}],swapExample:{original:"How do we bring it about?",swapped:"How do we bring it about within the timeline?",swappedMeaning:"スケジュール内でどうやって実現しますか？"},scene:{en:"Used when discussing how to achieve a goal or cause a particular outcome.",ja:"目標達成の方法を議論する場面。「どうやって実現するか」を問う戦略会議でよく出る。"},category:"汎用"},
  {id:165,text:"narrow it down",katakana:"ナロウイッダウン",meaning:"絞り込む",linkingParts:[{segment:"narrow_it",rule:"子音+母音リンキング",detail:"「w」+「it」→「ウィッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],synonyms:[{text:"filter it down",katakana:"フィルタリッダウン",meaning:"フィルタリングする"},{text:"shortlist it",katakana:"ショートリスリッ",meaning:"候補を絞る"}],swapExample:{original:"Let's narrow it down to three options.",swapped:"Let's narrow it down before the final decision.",swappedMeaning:"最終決定前に候補を絞りましょう"},scene:{en:"Used in decision-making when reducing a long list of candidates, vendors, or options.",ja:"多数の選択肢から候補を絞る場面。採用・ベンダー選定・戦略策定でよく出る。"},category:"汎用"},
  {id:166,text:"put it to a vote",katakana:"プリリトゥアヴォウッ",meaning:"投票にかける",linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「リトゥ」"}],synonyms:[{text:"vote on it",katakana:"ヴォウトノニッ",meaning:"投票する"},{text:"take a vote",katakana:"テイカヴォウッ",meaning:"採決を取る"}],swapExample:{original:"Let's put it to a vote.",swapped:"Let's put it to a vote and move on.",swappedMeaning:"採決を取って先に進みましょう"},scene:{en:"Used in meetings when a decision needs to be made collectively — boards, committees, or team meetings.",ja:"会議で全員参加の採決を取る場面。株主総会・委員会・チームミーティングで頻出。"},category:"汎用"},
  {id:167,text:"hand it off",katakana:"ハンリロッフ",meaning:"引き継ぐ・バトンタッチする",linkingParts:[{segment:"hand_it",rule:"flap T（d→ら行）",detail:"「d」+「it」→「リッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],synonyms:[{text:"pass it on",katakana:"パシロン",meaning:"次に回す"},{text:"transfer responsibility",katakana:"トランスファーリスポンスィビリティ",meaning:"責任を引き渡す"}],swapExample:{original:"Let me hand it off to the next team.",swapped:"Let me hand it off to the next team before I leave.",swappedMeaning:"退職前に次のチームに引き継がせてください"},scene:{en:"Used during job transitions, project handovers, or shift changes.",ja:"退職・引っ越し・シフト交代での業務引き継ぎ。「バトンタッチ」の英語版。"},category:"汎用"},
  {id:168,text:"flesh it out",katakana:"フレシラウッ",meaning:"肉付けする・詳細を加える",linkingParts:[{segment:"flesh_it",rule:"子音+母音リンキング",detail:"「sh」+「it」→「シッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],synonyms:[{text:"develop it further",katakana:"ディヴェロピッファーザ",meaning:"さらに発展させる"},{text:"add detail to it",katakana:"アッデテイルトゥイッ",meaning:"詳細を加える"}],swapExample:{original:"Let's flesh it out in the next meeting.",swapped:"Let's flesh it out with more examples.",swappedMeaning:"もっと具体例を加えて詳細を詰めましょう"},scene:{en:"Used when an idea or plan needs more detail and concrete examples added before it's ready.",ja:"アイデアや計画を「骨格」から「肉付き」にする場面。企画・戦略立案でよく使う。"},category:"汎用"},
  {id:169,text:"kick it off",katakana:"キキロッフ",meaning:"開始する・キックオフする",linkingParts:[{segment:"kick_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],synonyms:[{text:"start it up",katakana:"スターリラップ",meaning:"開始する"},{text:"launch it",katakana:"ローンチィッ",meaning:"ローンチする"}],swapExample:{original:"Let's kick it off on Monday.",swapped:"Let's kick it off with a team lunch on Monday.",swappedMeaning:"月曜日にチームランチでキックオフしましょう"},scene:{en:"Used at the beginning of a project, campaign, or meeting. 'Kickoff meeting' is one of the most common business terms worldwide.",ja:"プロジェクト・イベントのキックオフ場面。「キックオフミーティング」はプロジェクト管理の必須語。"},category:"汎用"},
  {id:170,text:"sit on it",katakana:"シロニッ",meaning:"先延ばしにする",linkingParts:[{segment:"sit_on",rule:"子音+母音リンキング",detail:"「t」+「on」→「ロン」（flap）"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],synonyms:[{text:"hold off on it",katakana:"ホールドッフォニッ",meaning:"先送りにする"},{text:"delay acting on it",katakana:"ディレイアクティングオニッ",meaning:"行動を遅らせる"}],swapExample:{original:"Don't sit on it too long.",swapped:"Don't sit on it — we need a decision by Friday.",swappedMeaning:"先延ばしにしないで、金曜日までに決断が必要です"},scene:{en:"Informal warning against procrastination. Used when urging someone to stop delaying a decision.",ja:"決断・行動を遅らせることへの警告。「ぐずぐずするな」という意味の非公式表現。"},category:"汎用"},
  {id:171,text:"shelve it for now",katakana:"シェルヴィッフォーナウ",meaning:"棚上げにする",linkingParts:[{segment:"shelve_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_for",rule:"flap T + 母音",detail:"「t」+「for」→「フォ」"}],synonyms:[{text:"table it",katakana:"テイブリッ",meaning:"保留にする"},{text:"set it aside",katakana:"セリラサイド",meaning:"脇に置く"}],swapExample:{original:"Let's shelve it for now.",swapped:"Let's shelve it for now and revisit next quarter.",swappedMeaning:"今は棚上げにして来四半期に見直しましょう"},scene:{en:"Used when a project or idea is put on indefinite hold due to budget or priority shifts.",ja:"予算・優先順位の問題でプロジェクトを無期限保留にする場面。予算策定会議で頻出。"},category:"汎用"},
  {id:172,text:"scale it back",katakana:"スケイリッバック",meaning:"規模を縮小する",linkingParts:[{segment:"scale_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_back",rule:"子音+子音",detail:"「t」+「b」→「ッバック」"}],synonyms:[{text:"cut it back",katakana:"カリッバック",meaning:"削減する"},{text:"downsize it",katakana:"ダウンサイジィッ",meaning:"規模を縮小する"}],swapExample:{original:"We need to scale it back.",swapped:"We need to scale it back due to budget cuts.",swappedMeaning:"予算削減のため規模を縮小する必要があります"},scene:{en:"Used when a project or plan needs to be reduced in scope due to budget or resource constraints.",ja:"予算・リソース制約でプロジェクト規模を縮小する場面。財務・経営会議で頻出。"},category:"汎用"},
  {id:173,text:"pull it off",katakana:"プリロッフ",meaning:"やり遂げる・成功させる",linkingParts:[{segment:"pull_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],synonyms:[{text:"make it happen",katakana:"メイキッハプン",meaning:"実現させる"},{text:"succeed at it",katakana:"サクシーダリッ",meaning:"成功する"}],swapExample:{original:"Do you think we can pull it off?",swapped:"Do you think we can pull it off in two weeks?",swappedMeaning:"2週間でやり遂げられると思いますか？"},scene:{en:"Used when someone achieves something difficult or surprising. Very common in project completion contexts.",ja:"困難なことを達成する場面。「本当にやってのけた」という驚きを含む表現。"},category:"汎用"},
  {id:174,text:"chalk it up to",katakana:"チョーキラップトゥ",meaning:"〜として受け入れる・〜のせいにする",linkingParts:[{segment:"chalk_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],synonyms:[{text:"attribute it to",katakana:"アトリビューリットゥ",meaning:"〜に帰する"},{text:"put it down to",katakana:"プリッダウントゥ",meaning:"〜が原因と考える"}],swapExample:{original:"Let's chalk it up to experience.",swapped:"Let's chalk it up to experience and move on.",swappedMeaning:"経験として受け入れて前に進みましょう"},scene:{en:"Used after a failure or setback to reframe it as a learning opportunity rather than a pure loss.",ja:"失敗や損失を「経験値」として前向きに捉えるときの表現。振り返り会議でよく使われる。"},category:"汎用"},
  {id:175,text:"see it through",katakana:"スィーイッスルー",meaning:"最後までやり遂げる",linkingParts:[{segment:"see_it",rule:"母音+母音リンキング",detail:"「e」+「it」→「イーイッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],synonyms:[{text:"follow it through",katakana:"ファロウイッスルー",meaning:"やり遂げる"},{text:"stick with it",katakana:"スティックウィジッ",meaning:"続けてやり遂げる"}],swapExample:{original:"We need to see it through.",swapped:"We need to see it through to the end.",swappedMeaning:"最後までやり遂げる必要があります"},scene:{en:"Used to commit to completing a project or task despite challenges or obstacles.",ja:"困難があっても最後まで完遂するという決意表明。プロジェクト終盤・締め切り前によく使われる。"},category:"汎用"},
  {id:176,text:"ought to",katakana:"オーダ",meaning:"〜すべき",linkingParts:[{segment:"ought_to",rule:"弱形・縮約",detail:"「ought」+「to」→「オーダ」（tが弱化）"}],synonyms:[{text:"should",katakana:"シュッ",meaning:"〜すべき"},{text:"supposed to",katakana:"サポーストゥ",meaning:"〜することになっている"}],swapExample:{original:"You ought to check with HR.",swapped:"You ought to check with HR before deciding.",swappedMeaning:"決める前に人事に確認すべきです"},scene:{en:"Softer obligation than 'must'. Common in polite workplace conversations and formal recommendations.",ja:"「must」より柔らかい義務の表現。職場での丁寧な勧告場面でよく使われる。"},category:"短縮形"},
  {id:177,text:"kind of",katakana:"カインダ",meaning:"ある意味・わりと（kinda）",linkingParts:[{segment:"kind_of",rule:"弱形・縮約",detail:"「d」+「of」→「ダ」（kinda）"}],synonyms:[{text:"sort of",katakana:"ソーロヴ",meaning:"ある意味（sorta）"},{text:"somewhat",katakana:"サムウォッ",meaning:"やや・ある程度"}],swapExample:{original:"It's kind of hard to explain.",swapped:"It's kind of hard to explain without the data.",swappedMeaning:"データなしでは説明がちょっと難しいです"},scene:{en:"'Kinda' softens statements. Used constantly in casual meetings to hedge opinions or soften bad news.",ja:"「カインダ」は断言を和らげる表現。カジュアルな会議で意見を柔らかく言うときに多用。"},category:"短縮形"},
  {id:178,text:"all of a sudden",katakana:"オーロヴァサドン",meaning:"突然（ネイティブの速度）",linkingParts:[{segment:"all_of",rule:"子音+母音リンキング",detail:"「l」+「of」→「ロヴ」"},{segment:"of_a",rule:"子音+母音リンキング",detail:"「v」+「a」→「ヴァ」"},{segment:"a_sudden",rule:"母音+子音リンキング",detail:"「a」+「sudden」→「アサドン」"}],synonyms:[{text:"out of nowhere",katakana:"アウロヴノウウェア",meaning:"どこからともなく"},{text:"unexpectedly",katakana:"アニクスペクテッドリ",meaning:"予期せず"}],swapExample:{original:"All of a sudden, the server went down.",swapped:"All of a sudden, the client changed the requirements.",swappedMeaning:"突然クライアントが要件を変えました"},scene:{en:"Used to describe unexpected events. The linking makes it sound like one word: 'allovasudden'.",ja:"予期せぬ出来事を描写するときに使う。つながって「オーロヴァサドン」に聞こえるのが難しいポイント。"},category:"短縮形"},
  {id:179,text:"as a matter of fact",katakana:"アザマロヴファック",meaning:"実は・実際のところ",linkingParts:[{segment:"as_a",rule:"子音+母音リンキング",detail:"「s」+「a」→「ザ」"},{segment:"matter_of",rule:"flap T + 母音",detail:"「tt」→ら行「マロヴ」"},{segment:"of_fact",rule:"子音+母音リンキング",detail:"「v」+「fact」→「ヴファック」"}],synonyms:[{text:"actually",katakana:"アクチャリ",meaning:"実は"},{text:"in fact",katakana:"インファック",meaning:"実際に"}],swapExample:{original:"As a matter of fact, we already did that.",swapped:"As a matter of fact, the numbers look better than expected.",swappedMeaning:"実は、数字は予想より良い結果が出ています"},scene:{en:"Used to correct a misconception or introduce a surprising fact. Sounds like one fast phrase in natural speech.",ja:"誤解を正したり意外な事実を伝えるときに使う。自然な発音では一続きの音に聞こえる。"},category:"短縮形"},
  {id:180,text:"out of it",katakana:"アウロヴィッ",meaning:"ぼんやりしている",linkingParts:[{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],synonyms:[{text:"not with it",katakana:"ノットウィジッ",meaning:"頭が回っていない"},{text:"checked out",katakana:"チェックタウッ",meaning:"集中できていない"}],swapExample:{original:"Sorry, I'm a bit out of it today.",swapped:"Sorry, I'm a bit out of it — can you repeat that?",swappedMeaning:"すみません、ぼんやりしていました。もう一度お願いできますか？"},scene:{en:"Said when tired, jet-lagged, or unfocused. Common at early-morning meetings or after long travel.",ja:"疲れや時差ボケで頭が回らないときの表現。早朝会議や長時間労働後によく使われる。"},category:"短縮形"},
];

const STORAGE_KEY = "toeic-linking-v4";
const SESSION_SIZE = 10;

const RULE_COLORS = {
  "flap T + 母音":"#F59E0B","flap T（d→ら行）":"#F59E0B",
  "子音+母音リンキング":"#6366F1","母音+母音リンキング":"#EC4899",
  "子音+子音 停止":"#EF4444","弱形・縮約":"#10B981",
  "母音+子音リンキング":"#8B5CF6","子音+子音":"#EF4444",
};
const CAT_COLORS = {
  "会議":"#3B82F6","電話":"#8B5CF6","人事":"#EF4444","物流":"#10B981",
  "旅行":"#F59E0B","顧客対応":"#EC4899","プレゼン":"#06B6D4","IT":"#6366F1",
  "短縮形":"#84CC16","財務":"#F97316","ビジネス定型":"#14B8A6",
  "採用":"#A78BFA","研修":"#34D399","製造":"#FB923C","マーケティング":"#F472B6",
  "施設":"#60A5FA","医療":"#4ADE80","飲食":"#FBBF24","法務":"#C084FC",
  "銀行":"#2DD4BF","環境":"#86EFAC","PR":"#FDA4AF","汎用":"#94A3B8",
};

// ── Device ID (persists in localStorage) ─────────────────
function getDeviceId() {
  try {
    let id = localStorage.getItem("tl_device_id");
    if (!id) { id = "dev_" + Math.random().toString(36).slice(2,10); localStorage.setItem("tl_device_id", id); }
    return id;
  } catch { return "dev_anon"; }
}
const DEVICE_ID = getDeviceId();

// ── Supabase API ──────────────────────────────────────────
async function supaFetch(path, method="GET", body=null) {
  const opts = {
    method,
    headers: {"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Prefer":"return=representation"},
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(SUPA_URL + "/rest/v1" + path, opts);
  if (!r.ok) { const t = await r.text(); throw new Error(`${r.status}: ${t}`); }
  return r.json();
}

async function supaLoad() {
  const rows = await supaFetch(`/toeic_progress?device_id=eq.${DEVICE_ID}&select=data`);
  return rows.length > 0 ? JSON.parse(rows[0].data) : null;
}

async function supaSave(data) {
  const payload = { device_id: DEVICE_ID, data: JSON.stringify(data), updated_at: new Date().toISOString() };
  await supaFetch("/toeic_progress?on_conflict=device_id", "POST", [payload]);
}

// ── window.storage fallback ───────────────────────────────
async function localLoad() {
  try { const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function localSave(d) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

const EMPTY = { progress:{}, sessionIds:[] };

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function renderLinked(text, parts) {
  let segs = [{ t: text, linked: false }];
  parts.forEach(p => {
    const key = p.segment.replace("_", " ");
    segs = segs.flatMap(s => {
      if (s.linked) return [s];
      const i = s.t.indexOf(key);
      if (i === -1) return [s];
      return [
        { t: s.t.slice(0, i), linked: false },
        { t: key, linked: true, rule: p.rule },
        { t: s.t.slice(i + key.length), linked: false },
      ].filter(x => x.t);
    });
  });
  return segs.map((s, i) =>
    s.linked
      ? <mark key={i} style={{background:(RULE_COLORS[s.rule]||"#6366F1")+"30",color:RULE_COLORS[s.rule]||"#A5B4FC",borderBottom:`2px solid ${RULE_COLORS[s.rule]||"#6366F1"}`,borderRadius:3,padding:"0 2px"}}>{s.t}</mark>
      : <span key={i}>{s.t}</span>
  );
}

// ── Sync Badge ────────────────────────────────────────────
function SyncBadge({status, isSupabase}) {
  const map = {
    saving: {color:"#F59E0B", label:"⏳ 保存中..."},
    saved:  {color:"#10B981", label:"☁️ 同期済み"},
    local:  {color:"#6366F1", label:"💾 ローカル保存"},
    error:  {color:"#EF4444", label:"❌ 同期エラー"},
    idle:   {color:isSupabase?"#10B981":"#F59E0B", label:isSupabase?"☁️ Supabase接続中":"💾 ローカルのみ"},
  };
  const {color,label} = map[status]||map.idle;
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:color+"22",color,border:`1px solid ${color}44`}}>{label}</span>;
}

// ── Supabase Setup Panel ──────────────────────────────────
function SupabaseSetup({initUrl, initKey, deviceId, onSuccess}) {
  const [url, setUrl] = useState(initUrl);
  const [key, setKey] = useState(initKey);
  const [status, setStatus] = useState("idle"); // idle|testing|ok|error
  const [errMsg, setErrMsg] = useState("");

  const canSubmit = url.trim().length > 15 && key.trim().length > 20 && status !== "testing";

  const handleTest = async () => {
    setStatus("testing"); setErrMsg("");
    try {
      // Try to fetch (table may be empty — 200 with [] is success)
      const rows = await supaFetch(url.trim(), key.trim(),
        `/toeic_progress?device_id=eq.${deviceId}&select=data&limit=1`);
      // Success — save credentials to localStorage
      saveSupaConf(url.trim(), key.trim());
      setStatus("ok");
      onSuccess(url.trim(), key.trim(), rows.length > 0 ? JSON.parse(rows[0].data) : null);
    } catch(e) {
      setStatus("error");
      const msg = e.message || String(e);
      if (msg.includes("401")||msg.includes("403")) {
        setErrMsg("❌ 認証エラー: Anon Keyが違います。API Keys → Legacy API keys → anon の eyJhbG... を使ってください。");
      } else if (msg.includes("404")||msg.includes("URL")) {
        setErrMsg("❌ URLエラー: https://xxxx.supabase.co の形式で入力してください。");
      } else if (msg.includes("relation")||msg.includes("does not exist")) {
        setErrMsg("❌ テーブル未作成: SQL Editorで create table ... を実行してください。");
      } else {
        setErrMsg("❌ " + msg);
      }
    }
  };

  return (
    <div style={{background:"rgba(20,184,166,0.06)",border:"1px solid rgba(20,184,166,0.25)",borderRadius:12,padding:"14px",marginTop:10}}>
      <div style={{fontSize:12,fontWeight:700,color:"#14B8A6",marginBottom:10}}>☁️ Supabase設定</div>

      <div style={{fontSize:10,color:"#475569",marginBottom:10,lineHeight:1.8}}>
        <div style={{color:"#64748B",fontWeight:600,marginBottom:4}}>【初回セットアップ手順】</div>
        <div>① <a href="https://supabase.com" target="_blank" style={{color:"#14B8A6"}}>supabase.com</a> で無料アカウント作成 → New project</div>
        <div>② SQL Editor で下記を実行（1回だけ）:</div>
        <div style={{background:"rgba(0,0,0,0.45)",borderRadius:7,padding:"10px 12px",margin:"6px 0",fontFamily:"monospace",fontSize:9.5,color:"#94A3B8",whiteSpace:"pre-wrap",lineHeight:1.7}}>
{`create table if not exists toeic_progress (
  device_id text primary key,
  data text not null,
  updated_at timestamptz default now()
);
alter table toeic_progress
  enable row level security;
create policy "anon all"
  on toeic_progress for all
  using (true) with check (true);`}
        </div>
        <div>③ Settings → <strong style={{color:"#E2E8F0"}}>API Keys</strong> → <strong style={{color:"#F59E0B"}}>Legacy API keys</strong> → anon の 👁 で表示 → コピー</div>
        <div>④ 下に貼り付けて「接続テスト」</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div>
          <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>Project URL（<code style={{color:"#14B8A6"}}>/rest/v1/</code> 不要）</div>
          <input value={url} onChange={e=>{setUrl(e.target.value);setStatus("idle");}}
            placeholder="https://xxxx.supabase.co"
            style={{width:"100%",padding:"8px 10px",borderRadius:7,border:`1px solid ${status==="error"?"#EF4444":"rgba(20,184,166,0.3)"}`,background:"rgba(0,0,0,0.35)",color:"#E2E8F0",fontSize:12,boxSizing:"border-box"}}/>
        </div>
        <div>
          <div style={{fontSize:10,color:"#64748B",marginBottom:3}}>Anon Key（<code style={{color:"#F59E0B"}}>eyJhbG...</code> で始まるLegacy key）</div>
          <input value={key} onChange={e=>{setKey(e.target.value);setStatus("idle");}}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            style={{width:"100%",padding:"8px 10px",borderRadius:7,border:`1px solid ${status==="error"?"#EF4444":"rgba(20,184,166,0.3)"}`,background:"rgba(0,0,0,0.35)",color:"#E2E8F0",fontSize:12,boxSizing:"border-box"}}/>
        </div>

        {errMsg && <div style={{fontSize:11,color:"#EF4444",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:7,padding:"8px 10px",lineHeight:1.6}}>{errMsg}</div>}

        {status==="ok" && <div style={{fontSize:11,color:"#10B981",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:7,padding:"8px 10px"}}>✅ 接続成功！データを同期しました。</div>}

        <button onClick={handleTest} disabled={!canSubmit}
          style={{padding:"11px",borderRadius:9,background:canSubmit?"linear-gradient(135deg,#14B8A6,#0D9488)":"rgba(255,255,255,0.05)",color:canSubmit?"white":"#475569",border:"none",fontSize:13,fontWeight:600,cursor:canSubmit?"pointer":"not-allowed"}}>
          {status==="testing" ? "⏳ 接続テスト中..." : status==="ok" ? "✅ 接続済み" : "接続テスト＆保存"}
        </button>

        <div style={{fontSize:10,color:"#334155",textAlign:"center"}}>
          📱 デバイスID: <code style={{color:"#14B8A6"}}>{deviceId}</code> — スマホでも同じアカウントのSupabaseに繋ぐと自動同期
        </div>
      </div>
    </div>
  );
}


// ── Scene Illustration (SVG built-in per category) ───────
function SceneIllustration({ chunk }) {
  const cat = chunk.category;
  const color = CAT_COLORS[cat] || "#6366F1";
  const bg = color + "15";

  // Pick icon and SVG scene based on category
  const scenes = {
    "会議": <MeetingScene color={color} text={chunk.text} />,
    "電話": <PhoneScene color={color} text={chunk.text} />,
    "人事": <HrScene color={color} text={chunk.text} />,
    "物流": <LogisticsScene color={color} text={chunk.text} />,
    "旅行": <TravelScene color={color} text={chunk.text} />,
    "顧客対応": <CustomerScene color={color} text={chunk.text} />,
    "プレゼン": <PresentScene color={color} text={chunk.text} />,
    "IT": <ItScene color={color} text={chunk.text} />,
    "財務": <FinanceScene color={color} text={chunk.text} />,
    "採用": <HiringScene color={color} text={chunk.text} />,
    "研修": <TrainingScene color={color} text={chunk.text} />,
    "製造": <ManufScene color={color} text={chunk.text} />,
    "マーケティング": <MarketingScene color={color} text={chunk.text} />,
    "飲食": <DiningScene color={color} text={chunk.text} />,
    "銀行": <BankScene color={color} text={chunk.text} />,
    "医療": <MedScene color={color} text={chunk.text} />,
    "法務": <LegalScene color={color} text={chunk.text} />,
    "環境": <EcoScene color={color} text={chunk.text} />,
    "PR": <PrScene color={color} text={chunk.text} />,
  };

  const scene = scenes[cat] || <DefaultScene color={color} text={chunk.text} />;

  return (
    <div style={{borderRadius:12,overflow:"hidden",marginBottom:14,border:`1px solid ${color}30`,background:bg}}>
      {scene}
      <div style={{padding:"8px 12px",borderTop:`1px solid ${color}20`}}>
        <div style={{fontSize:11,color,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>{cat}</div>
        <div style={{fontSize:12,color:"#64748B",marginTop:2,fontStyle:"italic"}}>
          {chunk.scene ? chunk.scene.en : "Business context"}
        </div>
      </div>
    </div>
  );
}

// ── SVG Scene Components ─────────────────────────────────
function MeetingScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Table */}
    <ellipse cx="200" cy="110" rx="150" ry="30" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    {/* People around table */}
    {[[80,60],[140,40],[200,35],[260,40],[320,60]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="16" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
        <circle cx={x} cy={y-6} r="6" fill={color+"80"}/>
        <rect x={x-8} y={y+2} width="16" height="10" rx="3" fill={color+"80"}/>
      </g>
    ))}
    {/* Speech bubble */}
    <rect x="170" y="10" width="80" height="22" rx="11" fill={color} opacity="0.85"/>
    <polygon points="200,32 208,40 216,32" fill={color} opacity="0.85"/>
    <text x="210" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Let's discuss</text>
    {/* Laptop on table */}
    <rect x="188" y="92" width="24" height="16" rx="2" fill={color+"60"} stroke={color} strokeWidth="1"/>
    <rect x="183" y="107" width="34" height="3" rx="1" fill={color+"40"}/>
  </svg>;
}

function PhoneScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Person left */}
    <circle cx="90" cy="65" r="22" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="90" cy="55" r="9" fill={color+"70"}/>
    <rect x="78" y="67" width="24" height="16" rx="5" fill={color+"70"}/>
    {/* Phone handset */}
    <rect x="108" y="62" width="12" height="22" rx="5" fill={color} opacity="0.8"/>
    {/* Signal waves */}
    {[1,2,3].map(n=><path key={n} d={`M${126+n*14},55 Q${130+n*14},72 ${126+n*14},89`} stroke={color} strokeWidth="2" fill="none" opacity={1-n*0.25}/>)}
    {/* Person right */}
    <circle cx="310" cy="65" r="22" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="310" cy="55" r="9" fill={color+"70"}/>
    <rect x="298" y="67" width="24" height="16" rx="5" fill={color+"70"}/>
    <rect x="280" y="62" width="12" height="22" rx="5" fill={color} opacity="0.8"/>
    {/* Speech bubbles */}
    <rect x="55" y="100" width="90" height="22" rx="11" fill={color} opacity="0.8"/>
    <text x="100" y="115" textAnchor="middle" fill="white" fontSize="10">Hold on a moment</text>
    <rect x="255" y="100" width="90" height="22" rx="11" fill={color} opacity="0.6"/>
    <text x="300" y="115" textAnchor="middle" fill="white" fontSize="10">I'll get back to you</text>
  </svg>;
}

function HrScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Desk */}
    <rect x="80" y="110" width="240" height="10" rx="3" fill={color+"40"} stroke={color} strokeWidth="1"/>
    {/* Manager */}
    <circle cx="145" cy="80" r="20" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="145" cy="71" r="8" fill={color+"70"}/>
    <rect x="133" y="82" width="24" height="14" rx="4" fill={color+"70"}/>
    {/* Employee */}
    <circle cx="255" cy="80" r="20" fill={color+"20"} stroke={color} strokeWidth="1.5"/>
    <circle cx="255" cy="71" r="8" fill={color+"50"}/>
    <rect x="243" y="82" width="24" height="14" rx="4" fill={color+"50"}/>
    {/* Document */}
    <rect x="183" y="88" width="34" height="44" rx="3" fill="white" stroke={color} strokeWidth="1.5"/>
    <line x1="189" y1="97" x2="211" y2="97" stroke={color} strokeWidth="1" opacity="0.5"/>
    <line x1="189" y1="103" x2="211" y2="103" stroke={color} strokeWidth="1" opacity="0.5"/>
    <line x1="189" y1="109" x2="205" y2="109" stroke={color} strokeWidth="1" opacity="0.5"/>
    {/* Tick / approval mark */}
    <circle cx="207" cy="120" r="8" fill={color} opacity="0.85"/>
    <polyline points="203,120 206,123 212,117" stroke="white" strokeWidth="2" fill="none"/>
    {/* Star/badge */}
    <text x="200" y="52" textAnchor="middle" fill={color} fontSize="22" opacity="0.7">🏆</text>
  </svg>;
}

function LogisticsScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Conveyor belt */}
    <rect x="40" y="115" width="320" height="14" rx="7" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    {[70,130,190,250,310].map((x,i)=><circle key={i} cx={x} cy="122" r="6" fill={color+"60"}/>)}
    {/* Boxes */}
    {[[60,85],[160,85],[260,85]].map(([x,y],i)=>(
      <g key={i}>
        <rect x={x} y={y} width="50" height="40" rx="4" fill={color+(i===1?"60":"30")} stroke={color} strokeWidth="1.5"/>
        <line x1={x} y1={y+14} x2={x+50} y2={y+14} stroke={color} strokeWidth="1" opacity="0.5"/>
        <line x1={x+25} y1={y} x2={x+25} y2={y+14} stroke={color} strokeWidth="1" opacity="0.5"/>
      </g>
    ))}
    {/* Clipboard */}
    <rect x="325" y="60" width="35" height="46" rx="3" fill="white" stroke={color} strokeWidth="1.5"/>
    <rect x="335" y="56" width="15" height="9" rx="2" fill={color}/>
    {[70,78,86].map((y,i)=><line key={i} x1="330" y1={y} x2="355" y2={y} stroke={color} strokeWidth="1" opacity={i<2?0.6:0.3}/>)}
    <polyline points="330,94 336,100 350,85" stroke={color} strokeWidth="2" fill="none"/>
    {/* Arrow */}
    <path d="M340,40 L360,40 L350,30 M360,40 L350,50" stroke={color} strokeWidth="2" fill="none" opacity="0.7"/>
  </svg>;
}

function TravelScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Airplane */}
    <g transform="translate(180,55) rotate(-15)">
      <ellipse cx="0" cy="0" rx="50" ry="12" fill={color+"60"} stroke={color} strokeWidth="1.5"/>
      <polygon points="50,0 70,-8 70,8" fill={color+"80"}/>
      <polygon points="-10,-12 10,-25 20,-12" fill={color+"60"}/>
      <polygon points="-5,12 5,22 15,12" fill={color+"40"}/>
    </g>
    {/* Clouds */}
    {[[60,40],[290,55],[330,30]].map(([x,y],i)=>(
      <g key={i} opacity={0.4+i*0.1}>
        <ellipse cx={x} cy={y} rx="28" ry="14" fill="white"/>
        <ellipse cx={x-14} cy={y+4} rx="18" ry="11" fill="white"/>
        <ellipse cx={x+14} cy={y+4} rx="20" ry="11" fill="white"/>
      </g>
    ))}
    {/* Ground / airport */}
    <rect x="0" y="130" width="400" height="30" fill={color+"20"}/>
    <rect x="60" y="100" width="80" height="40" rx="4" fill={color+"30"} stroke={color} strokeWidth="1"/>
    <text x="100" y="125" textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">AIRPORT</text>
    {/* Suitcase */}
    <rect x="280" y="105" width="28" height="22" rx="3" fill={color+"50"} stroke={color} strokeWidth="1.5"/>
    <rect x="288" y="101" width="12" height="6" rx="2" fill={color} opacity="0.7"/>
    <line x1="280" y1="116" x2="308" y2="116" stroke={color} strokeWidth="1"/>
    <circle cx="284" cy="128" r="3" fill={color}/>
    <circle cx="304" cy="128" r="3" fill={color}/>
  </svg>;
}

function CustomerScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Counter */}
    <rect x="120" y="95" width="160" height="50" rx="4" fill={color+"25"} stroke={color} strokeWidth="1.5"/>
    <rect x="110" y="88" width="180" height="15" rx="4" fill={color+"50"} stroke={color} strokeWidth="1"/>
    {/* Staff */}
    <circle cx="200" cy="62" r="18" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="200" cy="54" r="7" fill={color+"70"}/>
    <rect x="190" y="64" width="20" height="12" rx="3" fill={color+"70"}/>
    {/* Customer left */}
    <circle cx="105" cy="72" r="15" fill={color+"20"} stroke={color} strokeWidth="1"/>
    <circle cx="105" cy="65" r="6" fill={color+"50"}/>
    <rect x="96" y="73" width="18" height="11" rx="3" fill={color+"50"}/>
    {/* Star rating */}
    {[0,1,2,3,4].map(i=>(
      <text key={i} x={155+i*18} y="78" fontSize="14" fill={i<4?color:"#334155"} opacity={i<4?0.9:0.3}>★</text>
    ))}
    {/* Speech bubble from staff */}
    <rect x="218" y="42" width="105" height="24" rx="12" fill={color} opacity="0.85"/>
    <polygon points="222,62 230,70 238,62" fill={color} opacity="0.85"/>
    <text x="271" y="58" textAnchor="middle" fill="white" fontSize="10">I'll take care of it!</text>
  </svg>;
}

function PresentScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Screen */}
    <rect x="80" y="20" width="200" height="110" rx="6" fill="white" stroke={color} strokeWidth="2"/>
    {/* Bar chart on screen */}
    {[[110,90,60],[145,70,85],[180,50,105],[215,80,75],[250,40,110]].map(([x,top,h],i)=>(
      <rect key={i} x={x} y={top} width="22" height={h} rx="3" fill={color} opacity={0.3+i*0.1}/>
    ))}
    <line x1="100" y1="120" x2="270" y2="120" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <polyline points="100,90 145,70 190,50 235,80 270,40" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4,3"/>
    {/* Presenter */}
    <circle cx="320" cy="75" r="20" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="320" cy="65" r="8" fill={color+"70"}/>
    <rect x="308" y="76" width="24" height="15" rx="4" fill={color+"70"}/>
    {/* Pointer */}
    <line x1="298" y1="85" x2="278" y2="95" stroke={color} strokeWidth="2"/>
    <circle cx="274" cy="97" r="3" fill={color}/>
    {/* Audience dots */}
    {[50,75,100].map((x,i)=>(
      <g key={i}>
        <circle cx={x} cy="148" r="8" fill={color+"30"} stroke={color} strokeWidth="1"/>
      </g>
    ))}
  </svg>;
}

function ItScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Monitor */}
    <rect x="110" y="25" width="180" height="110" rx="8" fill="#0F172A" stroke={color} strokeWidth="2"/>
    <rect x="118" y="33" width="164" height="90" rx="4" fill="#1E293B"/>
    {/* Code lines */}
    {[["#10B981","const deploy = () => {"],["#6366F1","  pushToProduction();"],["#F59E0B","  runTests();"],["#10B981","}"],["#64748B","// ✓ Build passed"]].map(([c,t],i)=>(
      <text key={i} x="125" y={50+i*15} fontSize="9.5" fill={c} fontFamily="monospace">{t}</text>
    ))}
    {/* Terminal cursor */}
    <rect x="125" y="118" width="8" height="11" fill={color} opacity="0.8"/>
    {/* Stand */}
    <rect x="188" y="135" width="24" height="10" rx="2" fill={color+"40"}/>
    <rect x="170" y="143" width="60" height="6" rx="3" fill={color+"30"}/>
    {/* Deploy arrow */}
    <path d="M305,70 L345,70 M335,58 L345,70 L335,82" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="350" y="58" width="30" height="24" rx="5" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
    <text x="365" y="74" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">PROD</text>
    {/* Server */}
    {[0,1,2].map(i=>(
      <rect key={i} x="40" y={45+i*22} width="50" height="16" rx="3" fill={color+"20"} stroke={color} strokeWidth="1"/>
    ))}
    <circle cx="78" cy="53" r="3" fill={color} opacity="0.8"/>
    <circle cx="78" cy="75" r="3" fill={color} opacity="0.5"/>
    <circle cx="78" cy="97" r="3" fill="#10B981" opacity="0.8"/>
  </svg>;
}

function FinanceScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Coins stack */}
    {[0,1,2,3].map(i=>(
      <ellipse key={i} cx="100" cy={130-i*14} rx="38" ry="10" fill={i===3?color:color+"60"} stroke={color} strokeWidth="1"/>
    ))}
    <rect x="62" y="88" width="76" height="42" fill={color+"50"}/>
    <ellipse cx="100" cy="88" rx="38" ry="10" fill={color} stroke={color} strokeWidth="1"/>
    <text x="100" y="92" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">$</text>
    {/* Line chart up */}
    <polyline points="170,130 210,100 250,110 290,70 330,50 360,35" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {[170,210,250,290,330,360].map((x,i,arr)=>{
      const ys=[130,100,110,70,50,35];
      return <circle key={i} cx={x} cy={ys[i]} r="4" fill={color} opacity="0.8"/>;
    })}
    {/* Axis */}
    <line x1="165" y1="20" x2="165" y2="140" stroke={color} strokeWidth="1" opacity="0.3"/>
    <line x1="165" y1="140" x2="370" y2="140" stroke={color} strokeWidth="1" opacity="0.3"/>
    {/* Up arrow */}
    <path d="M355,30 L365,18 L375,30" stroke={color} strokeWidth="2" fill="none" opacity="0.7"/>
    <line x1="365" y1="18" x2="365" y2="50" stroke={color} strokeWidth="2" opacity="0.7"/>
  </svg>;
}

function HiringScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Interview desk */}
    <rect x="100" y="105" width="200" height="10" rx="3" fill={color+"40"} stroke={color} strokeWidth="1"/>
    {/* Interviewer */}
    <circle cx="155" cy="77" r="20" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
    <circle cx="155" cy="68" r="8" fill={color+"80"}/>
    <rect x="143" y="79" width="24" height="15" rx="4" fill={color+"80"}/>
    {/* Candidate */}
    <circle cx="245" cy="77" r="20" fill={color+"20"} stroke={color} strokeWidth="1.5"/>
    <circle cx="245" cy="68" r="8" fill={color+"50"}/>
    <rect x="233" y="79" width="24" height="15" rx="4" fill={color+"50"}/>
    {/* Resume on desk */}
    <rect x="186" y="90" width="28" height="36" rx="2" fill="white" stroke={color} strokeWidth="1.5"/>
    {[96,103,110,117].map((y,i)=><line key={i} x1="190" y1={y} x2="210" y2={y} stroke={color} strokeWidth="1" opacity={i<3?0.5:0.3}/>)}
    <circle cx="199" cy="93" r="4" fill={color+"50"}/>
    {/* Offer letter */}
    <rect x="300" y="60" width="60" height="50" rx="4" fill="white" stroke={color} strokeWidth="2"/>
    <rect x="308" y="70" width="44" height="6" rx="2" fill={color+"60"}/>
    <rect x="308" y="80" width="34" height="4" rx="2" fill={color+"30"}/>
    <rect x="308" y="88" width="38" height="4" rx="2" fill={color+"30"}/>
    <text x="330" y="105" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">OFFER</text>
    <polyline points="308,108 316,102 320,106 330,96" stroke={color} strokeWidth="2" fill="none" opacity="0.8"/>
  </svg>;
}

function TrainingScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Whiteboard */}
    <rect x="60" y="20" width="200" height="100" rx="6" fill="white" stroke={color} strokeWidth="2"/>
    {/* Steps 1-3 on board */}
    {[["① Observe","#334155"],["② Practice","#334155"],["③ Master ✓",color]].map(([t,c],i)=>(
      <g key={i}>
        <rect x="75" y={35+i*26} width="170" height="18" rx="3" fill={c+"20"}/>
        <text x="85" y={48+i*26} fontSize="11" fill={c} fontWeight={i===2?"bold":"normal"}>{t}</text>
      </g>
    ))}
    {/* Trainer */}
    <circle cx="310" cy="65" r="22" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="310" cy="55" r="9" fill={color+"70"}/>
    <rect x="298" y="67" width="24" height="15" rx="4" fill={color+"70"}/>
    {/* Pointer stick */}
    <line x1="290" y1="75" x2="262" y2="68" stroke={color} strokeWidth="2"/>
    <circle cx="259" cy="67" r="3" fill={color}/>
    {/* Audience */}
    {[100,155,210].map((x,i)=>(
      <g key={i}>
        <circle cx={x} cy="145" r="11" fill={color+"30"} stroke={color} strokeWidth="1"/>
        <circle cx={x} cy="138" r="5" fill={color+"60"}/>
      </g>
    ))}
    {/* Progress stars */}
    {[0,1,2].map(i=><text key={i} x={346+i*14} y="100" fontSize="12" fill={i<2?color:"#334155"} opacity={i<2?1:0.3}>★</text>)}
  </svg>;
}

function ManufScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Factory building */}
    <rect x="40" y="70" width="120" height="80" rx="3" fill={color+"20"} stroke={color} strokeWidth="1.5"/>
    {/* Roof triangles */}
    <polygon points="40,70 70,40 100,70" fill={color+"40"}/>
    <polygon points="80,70 110,40 140,70" fill={color+"30"}/>
    <polygon points="120,70 150,40 160,70" fill={color+"40"}/>
    {/* Chimney */}
    <rect x="145" y="45" width="12" height="30" fill={color+"50"}/>
    {/* Smoke */}
    {[0,1,2].map(i=><ellipse key={i} cx={152+i*4-4} cy={38-i*10} rx={5+i*2} ry={4+i*2} fill="#94A3B8" opacity={0.2+i*0.1}/>)}
    {/* Conveyor */}
    <rect x="160" y="115" width="200" height="12" rx="6" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
    {[180,220,260,300,340].map((x,i)=><circle key={i} cx={x} cy="121" r="5" fill={color+"60"}/>)}
    {/* Boxes on belt */}
    {[[175,90],[240,90],[305,90]].map(([x,y],i)=>(
      <g key={i}>
        <rect x={x} y={y} width="35" height="30" rx="3" fill={color+(i===1?"70":"40")} stroke={color} strokeWidth="1.5"/>
        <line x1={x} y1={y+10} x2={x+35} y2={y+10} stroke={color} strokeWidth="1" opacity="0.5"/>
      </g>
    ))}
    {/* QC check mark */}
    <circle cx="355" cy="80" r="20" fill={color+"30"} stroke={color} strokeWidth="2"/>
    <polyline points="344,80 351,88 366,70" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>;
}

function MarketingScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Megaphone */}
    <polygon points="60,70 120,50 120,110 60,90" fill={color+"50"} stroke={color} strokeWidth="1.5"/>
    <rect x="30" y="72" width="32" height="18" rx="4" fill={color+"70"} stroke={color} strokeWidth="1.5"/>
    <path d="M120,80 Q145,80 155,60" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M120,80 Q145,80 155,80" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M120,80 Q145,80 155,100" stroke={color} strokeWidth="2" fill="none"/>
    {/* Target audience circles */}
    {[[230,60,14],[290,80,16],[355,55,12],[240,115,10],[310,125,13]].map(([x,y,r],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r={r} fill={color+"30"} stroke={color} strokeWidth="1.5"/>
        <circle cx={x} cy={y-3} r={r*0.4} fill={color+"60"}/>
      </g>
    ))}
    {/* Rays from megaphone */}
    {[[165,55],[168,80],[165,107]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill={color} opacity="0.6"/>
    ))}
    {/* Likes/stars */}
    {[[245,35],[305,40],[360,30]].map(([x,y],i)=>(
      <text key={i} x={x} y={y} fontSize="14" fill={color} opacity="0.7">★</text>
    ))}
  </svg>;
}

function DiningScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Table */}
    <ellipse cx="200" cy="120" rx="130" ry="28" fill={color+"20"} stroke={color} strokeWidth="1.5"/>
    {/* Plates */}
    {[[140,100],[200,95],[260,100]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="22" fill="white" stroke={color} strokeWidth="1.5"/>
        <circle cx={x} cy={y} r="14" fill={color+"20"}/>
      </g>
    ))}
    {/* Glasses */}
    {[[105,95],[295,95]].map(([x,y],i)=>(
      <g key={i}>
        <path d={`M${x-8},${y-20} Q${x-10},${y} ${x},${y+10} Q${x+10},${y} ${x+8},${y-20} Z`} fill={color+"40"} stroke={color} strokeWidth="1"/>
        <line x1={x} y1={y+10} x2={x} y2={y+20} stroke={color} strokeWidth="1.5"/>
        <line x1={x-8} y1={y+20} x2={x+8} y2={y+20} stroke={color} strokeWidth="1.5"/>
      </g>
    ))}
    {/* People */}
    {[[85,65],[200,60],[315,65]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="16" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
        <circle cx={x} cy={y-6} r="6" fill={color+"60"}/>
      </g>
    ))}
    {/* Bill/receipt */}
    <rect x="185" y="118" width="30" height="40" rx="2" fill="white" stroke={color} strokeWidth="1.5"/>
    <text x="200" y="133" textAnchor="middle" fill={color} fontSize="9">¥ split</text>
    <line x1="189" y1="138" x2="211" y2="138" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    <line x1="189" y1="143" x2="211" y2="143" stroke={color} strokeWidth="0.8" opacity="0.4"/>
  </svg>;
}

function BankScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Bank building */}
    <rect x="50" y="65" width="160" height="85" rx="3" fill={color+"20"} stroke={color} strokeWidth="1.5"/>
    <polygon points="50,65 130,25 210,65" fill={color+"40"}/>
    {[75,100,125,155,180].map((x,i)=><line key={i} x1={x} y1="65" x2={x} y2="25" stroke={color} strokeWidth="1" opacity="0.3"/>)}
    <text x="130" y="50" textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">BANK</text>
    {/* Columns */}
    {[70,100,130,160,190].map((x,i)=>(
      <rect key={i} x={x} y="65" width="10" height="85" rx="2" fill={color+"30"}/>
    ))}
    {/* ATM */}
    <rect x="240" y="65" width="60" height="90" rx="5" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <rect x="250" y="75" width="40" height="28" rx="3" fill="#1E293B"/>
    <text x="270" y="92" textAnchor="middle" fill={color} fontSize="9">ATM</text>
    {[0,1,2].map(i=><rect key={i} x="253" y={110+i*8} width="34" height="5" rx="2" fill={color+"50"}/>)}
    {/* Money arrow */}
    <path d="M305,100 L355,100 M345,88 L355,100 L345,112" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="335" y="130" textAnchor="middle" fill={color} fontSize="18" opacity="0.7">💳</text>
  </svg>;
}

function MedScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Cross symbol */}
    <rect x="165" y="20" width="70" height="70" rx="8" fill={color+"20"} stroke={color} strokeWidth="2"/>
    <rect x="185" y="28" width="30" height="54" rx="4" fill={color+"60"}/>
    <rect x="172" y="40" width="56" height="28" rx="4" fill={color+"60"}/>
    {/* Doctor */}
    <circle cx="110" cy="105" r="22" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="110" cy="95" r="9" fill={color+"70"}/>
    <rect x="98" y="107" width="24" height="15" rx="4" fill={color+"70"}/>
    {/* Stethoscope */}
    <path d="M98,112 Q85,120 82,132 Q82,140 88,140 Q94,140 94,134" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="88" cy="142" r="5" fill={color} opacity="0.7"/>
    {/* Clipboard */}
    <rect x="250" y="70" width="70" height="80" rx="4" fill="white" stroke={color} strokeWidth="1.5"/>
    <rect x="268" y="64" width="34" height="14" rx="3" fill={color}/>
    {[85,96,107,118].map((y,i)=><line key={i} x1="260" y1={y} x2="312" y2={y} stroke={color} strokeWidth="1" opacity={0.4+i*0.1}/>)}
    {/* Insurance card */}
    <rect x="255" y="125" width="60" height="18" rx="3" fill={color+"40"} stroke={color} strokeWidth="1"/>
    <text x="285" y="137" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">INSURANCE</text>
    {/* Patient */}
    <circle cx="330" cy="100" r="18" fill={color+"20"} stroke={color} strokeWidth="1"/>
    <circle cx="330" cy="92" r="7" fill={color+"40"}/>
    <rect x="320" y="101" width="20" height="12" rx="3" fill={color+"40"}/>
  </svg>;
}

function LegalScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Scale of justice */}
    <line x1="200" y1="20" x2="200" y2="130" stroke={color} strokeWidth="2.5"/>
    <line x1="140" y1="50" x2="260" y2="50" stroke={color} strokeWidth="2"/>
    <line x1="140" y1="50" x2="140" y2="80" stroke={color} strokeWidth="1.5"/>
    <line x1="260" y1="50" x2="260" y2="70" stroke={color} strokeWidth="1.5"/>
    <ellipse cx="140" cy="80" rx="28" ry="10" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
    <ellipse cx="260" cy="70" rx="28" ry="10" fill={color+"30"} stroke={color} strokeWidth="1.5"/>
    <circle cx="200" cy="20" r="6" fill={color}/>
    {/* Contract document */}
    <rect x="50" y="65" width="70" height="85" rx="4" fill="white" stroke={color} strokeWidth="1.5"/>
    {[80,90,100,110,120,130].map((y,i)=><line key={i} x1="58" y1={y} x2="112" y2={y} stroke={color} strokeWidth="0.8" opacity={0.4}/>)}
    <text x="85" y="143" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">CONTRACT</text>
    {/* Pen / signature */}
    <path d="M62,136 Q72,130 80,136" stroke={color} strokeWidth="2" fill="none"/>
    {/* Stamp */}
    <rect x="310" y="80" width="50" height="50" rx="4" fill={color+"20"} stroke={color} strokeWidth="2"/>
    <rect x="322" y="92" width="26" height="26" rx="2" fill={color+"40"}/>
    <text x="335" y="110" textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">✓</text>
    <text x="335" y="70" textAnchor="middle" fill={color} fontSize="9" opacity="0.7">APPROVED</text>
  </svg>;
}

function EcoScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Sun */}
    <circle cx="320" cy="45" r="28" fill={color+"40"} stroke={color} strokeWidth="1.5"/>
    <circle cx="320" cy="45" r="18" fill={color+"70"}/>
    {[0,45,90,135,180,225,270,315].map((deg,i)=>{
      const r=Math.PI*deg/180;
      return <line key={i} x1={320+25*Math.cos(r)} y1={45+25*Math.sin(r)} x2={320+34*Math.cos(r)} y2={45+34*Math.sin(r)} stroke={color} strokeWidth="2"/>;
    })}
    {/* Tree */}
    <rect x="185" y="105" width="16" height="45" rx="3" fill={color+"50"}/>
    {[[0,75,50],[0,55,60],[0,38,50]].map(([cx,cy,r],i)=>(
      <ellipse key={i} cx={193} cy={cy} rx={r} ry={25-i*3} fill={color+(i===0?"60":i===1?"80":"99")}/>
    ))}
    {/* Recycle arrow */}
    <path d="M70,80 A40,40 0 0,1 110,55" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M110,55 A40,40 0 0,1 130,90" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M130,90 A40,40 0 0,1 70,80" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <polygon points="68,88 60,75 75,74" fill={color}/>
    {/* CO2 down arrow */}
    <text x="255" y="60" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">CO₂</text>
    <path d="M255,65 L255,95 M245,85 L255,95 L265,85" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <text x="255" y="115" textAnchor="middle" fill={color} fontSize="10" opacity="0.7">-40%</text>
  </svg>;
}

function PrScene({color}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    {/* Smartphone */}
    <rect x="160" y="20" width="80" height="130" rx="12" fill="#0F172A" stroke={color} strokeWidth="2"/>
    <rect x="167" y="30" width="66" height="110" rx="6" fill="#1E293B"/>
    {/* Social media post */}
    <rect x="170" y="33" width="60" height="50" rx="4" fill={color+"30"}/>
    <circle cx="180" cy="43" r="6" fill={color+"70"}/>
    <line x1="190" y1="43" x2="225" y2="43" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <line x1="190" y1="50" x2="220" y2="50" stroke={color} strokeWidth="1" opacity="0.4"/>
    {/* Like/heart */}
    <text x="175" y="92" fontSize="12" fill={color} opacity="0.8">♥</text>
    <text x="191" y="92" fontSize="9" fill={color} opacity="0.6">4.2k</text>
    {/* Share waves */}
    {[1,2,3].map(n=>(
      <path key={n} d={`M${256},80 Q${256+n*18},70 ${256+n*18},80 Q${256+n*18},90 ${256},80`} stroke={color} strokeWidth="1.5" fill="none" opacity={1-n*0.25}/>
    ))}
    <circle cx="256" cy="80" r="5" fill={color}/>
    {/* Stars / metrics */}
    {[0,1,2].map(i=>(
      <g key={i}>
        <text x={45+i*70} y="60" fontSize="20" fill={color} opacity="0.6">{"★"}</text>
        <text x={48+i*70} y="80" textAnchor="start" fill={color} fontSize="9" opacity="0.5">{["1.2M","89%","#1 trend"][i]}</text>
      </g>
    ))}
  </svg>;
}

function DefaultScene({color, text}) {
  return <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
    <rect width="400" height="160" fill={color+"10"}/>
    <circle cx="200" cy="75" r="50" fill={color+"20"} stroke={color} strokeWidth="2"/>
    <circle cx="200" cy="60" r="20" fill={color+"50"}/>
    <rect x="175" y="83" width="50" height="30" rx="8" fill={color+"50"}/>
    <rect x="130" y="110" width="140" height="35" rx="6" fill={color+"20"} stroke={color} strokeWidth="1"/>
    <text x="200" y="133" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">{text}</text>
  </svg>;
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("home");
  const [session, setSession] = useState([]);
  const [sIdx, setSIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [detailChunk, setDetailChunk] = useState(null);
  const [detailFrom, setDetailFrom] = useState("study");
  const [filterCat, setFilterCat] = useState("all");
  const [sessionResult, setSessionResult] = useState({ok:0,review:0});
  const [syncStatus, setSyncStatus] = useState("idle");
  const isSupabase = SUPA_KEY !== "YOUR_ANON_KEY_HERE";

  useEffect(() => {
    const init = async () => {
      let d = null;
      if (SUPA_KEY !== "YOUR_ANON_KEY_HERE") {
        try {
          d = await supaLoad();
          if (d) await localSave(d);
        } catch(e) { console.warn("Supabase load failed:", e); }
      }
      if (!d) d = await localLoad();
      setData(d || EMPTY);
    };
    init();
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    setSyncStatus("saving");
    await localSave(next);
    if (SUPA_KEY !== "YOUR_ANON_KEY_HERE") {
      try {
        await supaSave(next);
        setSyncStatus("saved");
      } catch(e) {
        console.warn("Supabase save failed:", e);
        setSyncStatus("error");
      }
    } else {
      setSyncStatus("local");
    }
    setTimeout(() => setSyncStatus("idle"), 2500);
  }, []);

  const speak = useCallback((text, rate=0.88) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang="en-US"; u.rate=rate;
    u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const progress = data?.progress || {};
  const stats = {
    ok: CHUNKS.filter(c=>progress[c.id]==="ok").length,
    review: CHUNKS.filter(c=>progress[c.id]==="review").length,
    unseen: CHUNKS.filter(c=>!progress[c.id]).length,
    total: CHUNKS.length,
  };
  const current = session[sIdx];

  const buildSession = useCallback((mode, cat="all") => {
    let pool = cat==="all" ? CHUNKS : CHUNKS.filter(c=>c.category===cat);
    const prog = data?.progress || {};
    if (mode==="unseen") pool = pool.filter(c=>!prog[c.id]);
    else if (mode==="review") pool = pool.filter(c=>prog[c.id]==="review");
    if (!pool.length) return;
    setSession(shuffle(pool).slice(0, SESSION_SIZE));
    setSIdx(0); setRevealed(false); setSessionResult({ok:0,review:0}); setView("study");
  }, [data]);

  const judge = useCallback(async (verdict) => {
    if (!current) return;
    const newProgress = {...(data?.progress||{}), [current.id]: verdict};
    const newData = {...data, progress: newProgress};
    await persist(newData);
    setSessionResult(r => ({...r, [verdict]: r[verdict]+1}));
    const nextIdx = sIdx + 1;
    if (nextIdx < session.length) { setSIdx(nextIdx); setRevealed(false); setView("study"); }
    else setView("sessionEnd");
  }, [current, data, persist, sIdx, session.length]);

  useEffect(() => {
    if (view==="study" && current) {
      const t = setTimeout(()=>speak(current.text, slowMode?0.65:0.88), 400);
      return () => clearTimeout(t);
    }
  }, [sIdx, view, current]);

  if (!data) return (
    <div style={{...S.root,alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#475569"}}>読み込み中…</div>
    </div>
  );

  // ── HOME ─────────────────────────────────────────────────
  if (view==="home") {
    const pct = Math.round((stats.ok/stats.total)*100);
    const cats = ["all",...Array.from(new Set(CHUNKS.map(c=>c.category)))];
    const catCount = (cat, mode) => {
      const pool = cat==="all" ? CHUNKS : CHUNKS.filter(c=>c.category===cat);
      const prog = data?.progress || {};
      if (mode==="unseen") return pool.filter(c=>!prog[c.id]).length;
      if (mode==="review") return pool.filter(c=>prog[c.id]==="review").length;
      return pool.length;
    };
    return (
      <div style={S.root}>
        <div style={S.card}>
          <div style={S.eyebrow}>TOEIC Part 3/4 · {CHUNKS.length}問</div>
          <div style={{fontSize:19,fontWeight:800,color:"#E2E8F0",marginBottom:16}}>リンキング練習帳</div>

          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13,padding:"14px 16px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:10}}>
              <Stat label="習得 ✅" value={stats.ok} color="#10B981"/>
              <Stat label="復習 🔁" value={stats.review} color="#F59E0B"/>
              <Stat label="未学習" value={stats.unseen} color="#475569"/>
              <Stat label="合計" value={stats.total} color="#334155"/>
            </div>
            <div style={{height:5,background:"#1E293B",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",display:"flex"}}>
                <div style={{width:`${(stats.ok/stats.total)*100}%`,background:"#10B981",transition:"width .5s"}}/>
                <div style={{width:`${(stats.review/stats.total)*100}%`,background:"#F59E0B",transition:"width .5s"}}/>
              </div>
            </div>
            <div style={{fontSize:11,color:"#334155",marginTop:6,textAlign:"right"}}>{pct}% 習得</div>
          </div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"#475569",letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>カテゴリ絞り込み</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setFilterCat(c)} style={{
                  fontSize:11,padding:"3px 9px",borderRadius:99,cursor:"pointer",
                  background:filterCat===c?(CAT_COLORS[c]||"#6366F1")+"28":"rgba(255,255,255,0.03)",
                  border:filterCat===c?`1px solid ${CAT_COLORS[c]||"#6366F1"}`:"1px solid rgba(255,255,255,0.06)",
                  color:filterCat===c?(CAT_COLORS[c]||"#A5B4FC"):"#475569",
                }}>
                  {c==="all"?"すべて":c}
                  {c!=="all"&&<span style={{marginLeft:3,opacity:0.6}}>({CHUNKS.filter(ch=>ch.category===c).length})</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{fontSize:11,color:"#334155",marginBottom:9}}>※ 1セッション10問ずつ出題・保存</div>
          <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>
            <button onClick={()=>buildSession("unseen",filterCat)} disabled={!catCount(filterCat,"unseen")} style={{...S.btnPrimary,opacity:catCount(filterCat,"unseen")?1:0.35}}>
              📖 新規を練習 ({catCount(filterCat,"unseen")}件)
            </button>
            <button onClick={()=>buildSession("review",filterCat)} disabled={!catCount(filterCat,"review")} style={{...S.btnReview,opacity:catCount(filterCat,"review")?1:0.35}}>
              🔁 要復習を練習 ({catCount(filterCat,"review")}件)
            </button>
            <button onClick={()=>buildSession("all",filterCat)} style={S.btnSm}>
              🔀 全件シャッフル ({catCount(filterCat,"all")}件)
            </button>
          </div>
          <button onClick={()=>setView("reviewList")} style={{...S.btnGhost,width:"100%"}}>📋 復習リスト →</button>

          {(stats.ok+stats.review)>0&&(
            <button onClick={async()=>{ if(window.confirm("リセットしますか？")) await persist(EMPTY); }}
              style={{marginTop:10,fontSize:11,color:"#334155",background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"center"}}>
              データをリセット
            </button>
          )}

          {/* Sync status */}
          <div style={{marginTop:14,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:11,color:"#475569"}}>
                📱 ID: <code style={{fontSize:10,color:"#64748B",background:"rgba(0,0,0,0.3)",padding:"1px 5px",borderRadius:3}}>{DEVICE_ID}</code>
              </div>
              <SyncBadge status={syncStatus} isSupabase={isSupabase}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SESSION END ──────────────────────────────────────────
  if (view==="sessionEnd") {
    return (
      <div style={S.root}>
        <div style={S.card}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={S.eyebrow}>セッション完了</div>
            <div style={{fontSize:48,fontWeight:800,color:"#E2E8F0",lineHeight:1}}>10<span style={{fontSize:18,color:"#475569"}}> 問</span></div>
            <div style={{marginTop:12,display:"flex",gap:16,justifyContent:"center"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800,color:"#10B981"}}>{sessionResult.ok}</div><div style={{fontSize:11,color:"#475569"}}>✅ 覚えた</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800,color:"#F59E0B"}}>{sessionResult.review}</div><div style={{fontSize:11,color:"#475569"}}>🔁 要復習</div></div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
            {session.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<session.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <span style={{fontSize:14,color:(data?.progress||{})[c.id]==="ok"?"#10B981":"#F59E0B"}}>
                  {(data?.progress||{})[c.id]==="ok"?"✅":"🔁"}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#CBD5E1"}}>{c.text}</span>
                  <span style={{fontSize:11,color:"#475569",marginLeft:8}}>{c.katakana}</span>
                </div>
                <button onClick={()=>{setDetailChunk(c);setDetailFrom("home");setView("detail");}} style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",color:"#A5B4FC",cursor:"pointer"}}>解説</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setView("home")} style={{...S.btnGhost,flex:1}}>← ホーム</button>
            <button onClick={()=>buildSession("all",filterCat)} style={{...S.btnPrimary,flex:1}}>次の10問 →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW LIST ──────────────────────────────────────────
  if (view==="reviewList") {
    const rv=CHUNKS.filter(c=>(data?.progress||{})[c.id]==="review");
    const ok=CHUNKS.filter(c=>(data?.progress||{})[c.id]==="ok");
    return (
      <div style={S.root}>
        <div style={S.card}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <button onClick={()=>setView("home")} style={S.btnGhost}>← 戻る</button>
            <div style={{fontSize:15,fontWeight:700,color:"#E2E8F0"}}>復習リスト</div>
          </div>
          {rv.length>0&&<><div style={{fontSize:10,letterSpacing:2,color:"#F59E0B",textTransform:"uppercase",marginBottom:8}}>🔁 要復習 ({rv.length})</div>
            {rv.map(c=><ChunkRow key={c.id} chunk={c} color="#F59E0B" onDetail={()=>{setDetailChunk(c);setDetailFrom("reviewList");setView("detail");}} onSpeak={()=>speak(c.text)}/>)}</>}
          {ok.length>0&&<><div style={{fontSize:10,letterSpacing:2,color:"#10B981",textTransform:"uppercase",margin:"14px 0 8px"}}>✅ 習得済み ({ok.length})</div>
            {ok.map(c=><ChunkRow key={c.id} chunk={c} color="#10B981" onDetail={()=>{setDetailChunk(c);setDetailFrom("reviewList");setView("detail");}} onSpeak={()=>speak(c.text)}/>)}</>}
          {rv.length===0&&ok.length===0&&<div style={{textAlign:"center",color:"#475569",padding:"36px 0"}}>まだ学習していません</div>}
          {rv.length>0&&<button onClick={()=>buildSession("review","all")} style={{...S.btnReview,marginTop:14}}>🔁 要復習を練習する</button>}
        </div>
      </div>
    );
  }

  // ── DETAIL ───────────────────────────────────────────────
  if (view==="detail"&&detailChunk) {
    const c=detailChunk;
    const prog = data?.progress || {};
    return (
      <div style={S.root}>
        <div style={S.card}>
          <button onClick={()=>setView(detailFrom==="study"?"study":detailFrom==="home"?"sessionEnd":"reviewList")} style={{...S.btnGhost,marginBottom:14}}>← 戻る</button>
          <div style={S.eyebrow}>リンキング解説</div>
          <div style={{fontSize:22,fontWeight:800,color:"#E2E8F0",letterSpacing:1,marginBottom:3}}>{renderLinked(c.text,c.linkingParts)}</div>
          <div style={{fontSize:17,color:"#6366F1",fontWeight:700,marginBottom:2}}>📢 {c.katakana}</div>
          <div style={{fontSize:13,color:"#64748B",marginBottom:14}}>{c.meaning}</div>

          {/* Scene Illustration */}
          <SceneIllustration chunk={c}/>

          {/* Linking points */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,letterSpacing:2,color:"#334155",textTransform:"uppercase",marginBottom:7}}>リンキングポイント</div>
            {c.linkingParts.map((p,i)=>(
              <div key={i} style={{borderLeft:`3px solid ${RULE_COLORS[p.rule]||"#6366F1"}`,background:"rgba(255,255,255,0.02)",borderRadius:8,padding:"8px 12px",marginBottom:6}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                  <code style={{fontSize:12,fontWeight:700,color:RULE_COLORS[p.rule]||"#A5B4FC",background:"rgba(0,0,0,0.25)",padding:"1px 7px",borderRadius:4}}>{p.segment.replace("_"," + ")}</code>
                  <span style={{fontSize:10,color:RULE_COLORS[p.rule]||"#818CF8",background:(RULE_COLORS[p.rule]||"#6366F1")+"22",padding:"2px 7px",borderRadius:99}}>{p.rule}</span>
                </div>
                <div style={{fontSize:12,color:"#94A3B8"}}>{p.detail}</div>
              </div>
            ))}
          </div>

          {/* Synonyms */}
          {c.synonyms?.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,letterSpacing:2,color:"#334155",textTransform:"uppercase",marginBottom:7}}>同義・類義チャンク</div>
              {c.synonyms.map((s,i)=>(
                <div key={i} style={{background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.18)",borderRadius:9,padding:"8px 12px",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#6EE7B7"}}>{s.text}</div>
                    <div style={{fontSize:11,color:"#10B981"}}>📢 {s.katakana}</div>
                    <div style={{fontSize:11,color:"#475569"}}>{s.meaning}</div>
                  </div>
                  <button onClick={()=>speak(s.text)} style={{fontSize:17,background:"none",border:"none",cursor:"pointer",color:"#10B981"}}>🔊</button>
                </div>
              ))}
            </div>
          )}

          {/* Play buttons */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button onClick={()=>speak(c.text,0.88)} style={{...S.btnSm,flex:1}}>▶ 通常</button>
            <button onClick={()=>speak(c.text,0.55)} style={{...S.btnSm,flex:1,background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",color:"#FCD34D"}}>🐢 ゆっくり</button>
          </div>

          {/* Swap example */}
          <div style={{background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:11,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:10,letterSpacing:2,color:"#6366F1",textTransform:"uppercase",marginBottom:7}}>入れ替え例文</div>
            <div style={{fontSize:12,color:"#475569",marginBottom:5}}>元: <span style={{color:"#94A3B8"}}>{c.swapExample.original}</span></div>
            <div style={{fontSize:14,fontWeight:600,color:"#A5B4FC",marginBottom:3}}>{c.swapExample.swapped}</div>
            <div style={{fontSize:11,color:"#475569"}}>{c.swapExample.swappedMeaning}</div>
            <button onClick={()=>speak(c.swapExample.swapped)} style={{marginTop:9,...S.btnSm,fontSize:12}}>▶ 例文を聞く</button>
          </div>

          {/* Judge buttons — only from study flow */}
          {detailFrom==="study"&&(
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{ judge("ok"); }} style={{...S.btnOk,flex:1}}>✅ 覚えた → 次へ</button>
              <button onClick={()=>{ judge("review"); }} style={{...S.btnNg,flex:1}}>🔁 復習 → 次へ</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STUDY ────────────────────────────────────────────────
  if (view==="study"&&current) {
    const prog = data?.progress || {};
    const verdict = prog[current.id];
    return (
      <div style={S.root}>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <button onClick={()=>setView("home")} style={S.btnGhost}>← ホーム</button>
            <div style={{fontSize:12,color:"#475569"}}>{sIdx+1} / {session.length}</div>
          </div>
          <div style={{height:3,background:"#1E293B",borderRadius:2,marginBottom:18}}>
            <div style={{height:"100%",width:`${((sIdx+1)/session.length)*100}%`,background:"linear-gradient(90deg,#6366F1,#F59E0B)",borderRadius:2,transition:"width .4s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:(CAT_COLORS[current.category]||"#3B82F6")+"22",color:CAT_COLORS[current.category]||"#3B82F6",border:`1px solid ${(CAT_COLORS[current.category]||"#3B82F6")}44`}}>{current.category}</span>
            {verdict&&<span style={{fontSize:11,color:verdict==="ok"?"#10B981":"#F59E0B"}}>{verdict==="ok"?"✅ 習得済み":"🔁 要復習"}</span>}
          </div>

          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:13,color:"#475569",marginBottom:13}}>音声を聞いて、覚えているか判断してください</div>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
              <button onClick={()=>speak(current.text,slowMode?0.65:0.88)} style={{...S.playBtn,background:speaking?"rgba(99,102,241,0.25)":"rgba(99,102,241,0.1)",border:`2px solid ${speaking?"#6366F1":"rgba(99,102,241,0.3)"}`}}>
                <span>{speaking?"🔊":"▶"}</span>
                <span style={{fontSize:13,marginLeft:6,color:"#94A3B8"}}>{speaking?"再生中…":"音声を聞く"}</span>
              </button>
              <button onClick={()=>setSlowMode(s=>!s)} style={{fontSize:12,padding:"8px 12px",borderRadius:20,border:"none",cursor:"pointer",background:slowMode?"rgba(245,158,11,0.2)":"rgba(255,255,255,0.05)",color:slowMode?"#FCD34D":"#64748B"}}>
                {slowMode?"🐢":"⚡"}
              </button>
            </div>
            {!revealed&&<button onClick={()=>setRevealed(true)} style={{...S.btnGhost,fontSize:13}}>答えを見る</button>}
          </div>

          {revealed&&(
            <>
              {/* Answer card with scene illustration */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,marginBottom:10,overflow:"hidden"}}>
                <SceneIllustration chunk={current}/>
                <div style={{padding:"12px 15px",textAlign:"center"}}>
                  <div style={{fontSize:21,fontWeight:800,color:"#E2E8F0",letterSpacing:1,marginBottom:4}}>{renderLinked(current.text,current.linkingParts)}</div>
                  <div style={{fontSize:17,color:"#6366F1",fontWeight:700,marginBottom:2}}>📢 {current.katakana}</div>
                  <div style={{fontSize:12,color:"#64748B",marginBottom:6}}>{current.meaning}</div>
                  {current.scene&&(
                    <div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>{current.scene.ja}</div>
                  )}
                  {current.synonyms?.length>0&&(
                    <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{fontSize:10,color:"#334155",letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>類義チャンク</div>
                      {current.synonyms.map((s,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                          <span style={{fontSize:12,color:"#6EE7B7",fontWeight:600}}>{s.text}</span>
                          <span style={{fontSize:11,color:"#10B981"}}>{s.katakana}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:"flex",gap:9,marginBottom:9}}>
                <button onClick={()=>judge("ok")} style={{...S.btnOk,flex:1}}>✅ 覚えた</button>
                <button onClick={()=>judge("review")} style={{...S.btnNg,flex:1}}>🔁 要復習</button>
              </div>
              <button onClick={()=>{setDetailChunk(current);setDetailFrom("study");setView("detail");}} style={{...S.btnGhost,width:"100%",fontSize:13}}>
                📖 解説・例文を詳しく見る
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function Stat({label,value,color}) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:22,fontWeight:800,color}}>{value}</div>
      <div style={{fontSize:10,color:"#475569",marginTop:2}}>{label}</div>
    </div>
  );
}

function ChunkRow({chunk,color,onDetail,onSpeak}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:9,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",marginBottom:5}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:"#CBD5E1"}}>{chunk.text}</div>
        <div style={{fontSize:11,color:"#475569"}}>{chunk.katakana} · {chunk.meaning}</div>
      </div>
      <button onClick={onSpeak} style={{fontSize:15,background:"none",border:"none",cursor:"pointer",color:"#475569"}}>🔊</button>
      <button onClick={onDetail} style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:color+"14",border:`1px solid ${color}30`,color,cursor:"pointer"}}>解説</button>
    </div>
  );
}

const S = {
  root:{minHeight:"100vh",background:"#080F1A",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 14px",fontFamily:"'Inter','Helvetica Neue',sans-serif"},
  card:{width:"100%",maxWidth:480,background:"#0F1C2E",borderRadius:20,padding:"22px 18px",boxShadow:"0 24px 80px rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.05)"},
  eyebrow:{fontSize:10,letterSpacing:3,color:"#334155",textTransform:"uppercase",marginBottom:4},
  playBtn:{display:"inline-flex",alignItems:"center",padding:"12px 26px",borderRadius:50,cursor:"pointer",transition:"all .2s",fontSize:18},
  btnPrimary:{width:"100%",padding:"12px",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",border:"none",borderRadius:11,fontSize:14,fontWeight:600,cursor:"pointer"},
  btnReview:{width:"100%",padding:"12px",background:"rgba(245,158,11,0.13)",color:"#FCD34D",border:"1px solid rgba(245,158,11,0.33)",borderRadius:11,fontSize:14,fontWeight:600,cursor:"pointer"},
  btnOk:{padding:"13px",background:"rgba(16,185,129,0.14)",color:"#6EE7B7",border:"1px solid rgba(16,185,129,0.38)",borderRadius:11,fontSize:14,fontWeight:700,cursor:"pointer"},
  btnNg:{padding:"13px",background:"rgba(245,158,11,0.11)",color:"#FCD34D",border:"1px solid rgba(245,158,11,0.33)",borderRadius:11,fontSize:14,fontWeight:700,cursor:"pointer"},
  btnSm:{padding:"9px 12px",borderRadius:10,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.23)",color:"#A5B4FC",fontSize:13,cursor:"pointer"},
  btnGhost:{padding:"7px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#64748B",fontSize:13,cursor:"pointer"},
};
