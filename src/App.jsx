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

  // ── 追加：会議・議事 ─────────────────────────────────────
  {id:181,text:"call it a day",katakana:"コーリラデイ",meaning:"今日はここまでにする",
   linkingParts:[{segment:"call_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_a",rule:"flap T + 母音",detail:"「t」+「a」→「ラ」"}],
   synonyms:[{text:"wrap it up",katakana:"ラッピラップ",meaning:"終わりにする"},{text:"call it quits",katakana:"コーリックウィッツ",meaning:"切り上げる"}],
   swapExample:{original:"Let's call it a day.",swapped:"Let's call it a day and pick this up tomorrow.",swappedMeaning:"今日はここまでにして明日続けましょう"},
   scene:{en:"Said at the end of a long meeting or workday to signal it's time to stop.",ja:"長い会議や業務の終わりに「今日はここまで」と切り上げる定番フレーズ。"},category:"会議"},
  {id:182,text:"run it by me again",katakana:"ラニッバイミーアゲン",meaning:"もう一度説明して",
   linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_by",rule:"子音+母音リンキング",detail:"「t」+「by」→「ッバイ」"}],
   synonyms:[{text:"say it again",katakana:"セイリラゲン",meaning:"もう一度言って"},{text:"repeat that",katakana:"リピートザッ",meaning:"繰り返して"}],
   swapExample:{original:"Can you run it by me again?",swapped:"Can you run it by me again more slowly?",swappedMeaning:"もう少しゆっくりもう一度説明してもらえますか？"},
   scene:{en:"Used when you didn't fully understand something and need it repeated or clarified.",ja:"説明を聞き逃したときや理解できなかったときの「もう一度お願いします」。"},category:"会議"},
  {id:183,text:"get the ball rolling",katakana:"ゲッザボールロウリング",meaning:"話を始める・スタートを切る",
   linkingParts:[{segment:"get_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"ball_rolling",rule:"子音+母音リンキング",detail:"「l」+「rolling」→「ルロウリング」"}],
   synonyms:[{text:"kick it off",katakana:"キキロッフ",meaning:"始める"},{text:"get started",katakana:"ゲッスターリッ",meaning:"スタートする"}],
   swapExample:{original:"Let's get the ball rolling.",swapped:"Let's get the ball rolling with a quick update.",swappedMeaning:"簡単な近況報告から始めましょう"},
   scene:{en:"Used to start a meeting, project, or discussion. Very common as an opening phrase.",ja:"会議やプロジェクトの開始を促すときの慣用句。会議の冒頭でよく使われる。"},category:"会議"},
  {id:184,text:"touch on it",katakana:"タッチョニッ",meaning:"軽く触れる・取り上げる",
   linkingParts:[{segment:"touch_on",rule:"子音+母音リンキング",detail:"「ch」+「on」→「チョン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"mention it briefly",katakana:"メンショニッブリーフリ",meaning:"簡単に言及する"},{text:"cover it briefly",katakana:"カヴァリッブリーフリ",meaning:"軽くカバーする"}],
   swapExample:{original:"I'll touch on it briefly.",swapped:"I'll touch on it briefly in the next section.",swappedMeaning:"次のセクションで軽く触れます"},
   scene:{en:"Used in presentations when covering a topic briefly without going into depth.",ja:"プレゼンで詳しくは説明せず軽く触れる場面。「ちなみに」程度に言及するときに使う。"},category:"プレゼン"},
  {id:185,text:"take it up with",katakana:"テイキラップウィズ",meaning:"〜に直接話を持っていく",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"bring it to",katakana:"ブリンギットゥ",meaning:"〜に持っていく"},{text:"raise it with",katakana:"レイジッウィズ",meaning:"〜に提起する"}],
   swapExample:{original:"You should take it up with HR.",swapped:"You should take it up with the manager directly.",swappedMeaning:"マネージャーに直接話を持っていくべきです"},
   scene:{en:"Used when directing someone to address a concern with the appropriate person or department.",ja:"問題を適切な担当者・部署に持ち込むよう促す場面。「それは〇〇に言って」の英語版。"},category:"人事"},
  // ── 追加：電話・メール ────────────────────────────────────
  {id:186,text:"copy me in",katakana:"コピーミーイン",meaning:"CCに入れる",
   linkingParts:[{segment:"copy_me",rule:"子音+母音リンキング",detail:"「y」+「me」→「イミ」"},{segment:"me_in",rule:"母音+母音リンキング",detail:"「e」+「in」→「ミーイン」"}],
   synonyms:[{text:"CC me",katakana:"スィースィーミー",meaning:"CCする"},{text:"keep me in the loop",katakana:"キーピーインザループ",meaning:"情報共有し続ける"}],
   swapExample:{original:"Can you copy me in on that?",swapped:"Can you copy me in on all emails with the client?",swappedMeaning:"クライアントとのメールは全てCCに入れてください"},
   scene:{en:"Used when requesting to be included on email threads. Very common in office email culture.",ja:"メールのCCに自分を追加するよう頼む場面。「CCに入れておいて」の英語版。"},category:"電話"},
  {id:187,text:"loop me in",katakana:"ループミーイン",meaning:"情報を共有してほしい",
   linkingParts:[{segment:"loop_me",rule:"子音+母音リンキング",detail:"「p」+「me」→「プミ」"},{segment:"me_in",rule:"母音+母音リンキング",detail:"「e」+「in」→「ミーイン」"}],
   synonyms:[{text:"keep me posted",katakana:"キーピーポウスティッ",meaning:"随時連絡して"},{text:"fill me in",katakana:"フィルミーイン",meaning:"情報を教えて"}],
   swapExample:{original:"Please loop me in.",swapped:"Please loop me in on any updates from the client.",swappedMeaning:"クライアントからの更新情報は随時共有してください"},
   scene:{en:"Used to request ongoing updates on a project or situation. Very common in US workplaces.",ja:"プロジェクトの進捗を随時共有してほしいときの表現。アメリカのビジネス文化で多用される。"},category:"電話"},
  {id:188,text:"reach out to them",katakana:"リーチャウットゥゼム",meaning:"連絡を取る",
   linkingParts:[{segment:"reach_out",rule:"子音+母音リンキング",detail:"「ch」+「out」→「チャウッ」"},{segment:"out_to",rule:"子音+母音リンキング",detail:"「t」+「to」→「ットゥ」"}],
   synonyms:[{text:"contact them",katakana:"コンタクッゼム",meaning:"連絡する"},{text:"get in touch",katakana:"ゲリンタッチ",meaning:"連絡を取る"}],
   swapExample:{original:"I'll reach out to them today.",swapped:"I'll reach out to them and set up a call.",swappedMeaning:"連絡を取ってコールを設定します"},
   scene:{en:"Used when initiating contact with a client, partner, or colleague. Very popular in modern business.",ja:"クライアントや同僚に自分から連絡を取る場面。現代ビジネスで「contact」の代わりによく使われる。"},category:"電話"},
  // ── 追加：ビジネス定型 ────────────────────────────────────
  {id:189,text:"move the needle",katakana:"ムーヴザニードル",meaning:"効果を出す・変化をもたらす",
   linkingParts:[{segment:"move_the",rule:"子音+母音リンキング",detail:"「v」+「the」→「ヴザ」"},{segment:"the_needle",rule:"子音+母音リンキング",detail:"「e」+「needle」→「ザニードル」"}],
   synonyms:[{text:"make an impact",katakana:"メイカニンパクッ",meaning:"影響を与える"},{text:"drive results",katakana:"ドライヴリザルツ",meaning:"成果を出す"}],
   swapExample:{original:"This strategy will move the needle.",swapped:"This strategy will move the needle on customer retention.",swappedMeaning:"この戦略は顧客維持率に効果をもたらします"},
   scene:{en:"Business jargon for making a measurable difference. Very common in strategy and KPI discussions.",ja:"KPIや戦略の議論で「数字を動かす」「効果を出す」という意味で使われるビジネス定型句。"},category:"ビジネス定型"},
  {id:190,text:"on the same page",katakana:"オンザセイムペイジ",meaning:"認識が一致している",
   linkingParts:[{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"same_page",rule:"子音+母音リンキング",detail:"「m」+「page」→「ムペイジ」"}],
   synonyms:[{text:"aligned on it",katakana:"アラインドオニッ",meaning:"一致している"},{text:"in agreement",katakana:"イナグリーメン",meaning:"合意している"}],
   swapExample:{original:"Are we on the same page?",swapped:"Are we on the same page about the timeline?",swappedMeaning:"スケジュールについて認識は合っていますか？"},
   scene:{en:"Used to confirm everyone has the same understanding before proceeding.",ja:"話を進める前に全員の認識が一致しているか確認する場面。会議の要所で必ず出てくる。"},category:"ビジネス定型"},
  {id:191,text:"at the end of the day",katakana:"アッジエンドオヴザデイ",meaning:"結局のところ",
   linkingParts:[{segment:"at_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"end_of",rule:"子音+母音リンキング",detail:"「d」+「of」→「ドオヴ」"}],
   synonyms:[{text:"ultimately",katakana:"アルティミトリ",meaning:"最終的に"},{text:"when all is said and done",katakana:"ウェノーリズセッドアンダン",meaning:"全て言い終わったら"}],
   swapExample:{original:"At the end of the day, results matter.",swapped:"At the end of the day, it's about customer satisfaction.",swappedMeaning:"結局のところ、大切なのは顧客満足度です"},
   scene:{en:"Used to summarize the most important point after a long discussion.",ja:"長い議論の後に最も重要な点をまとめるときの表現。会議の締めくくりによく使われる。"},category:"ビジネス定型"},
  {id:192,text:"going forward",katakana:"ゴウイングフォーワッ",meaning:"今後は・これからは",
   linkingParts:[{segment:"going_forward",rule:"子音+母音リンキング",detail:"「ng」+「forward」→「ングフォーワッ」"}],
   synonyms:[{text:"from now on",katakana:"フロムナウオン",meaning:"今後は"},{text:"moving forward",katakana:"ムーヴィングフォーワッ",meaning:"今後に向けて"}],
   swapExample:{original:"Going forward, please send reports weekly.",swapped:"Going forward, all decisions require approval.",swappedMeaning:"今後は全ての決定に承認が必要です"},
   scene:{en:"Used to set new expectations or rules starting from now. Very common in business communications.",ja:"今後のルールや期待値を設定する場面。ビジネスメール・会議で非常によく使われる。"},category:"ビジネス定型"},
  {id:193,text:"touch base",katakana:"タッチベイス",meaning:"連絡を取る・確認する",
   linkingParts:[{segment:"touch_base",rule:"子音+子音",detail:"「ch」+「b」→「チベイス」"}],
   synonyms:[{text:"check in",katakana:"チェキン",meaning:"様子を確認する"},{text:"connect briefly",katakana:"コネクッブリーフリ",meaning:"短く連絡する"}],
   swapExample:{original:"Let's touch base tomorrow.",swapped:"Let's touch base before the presentation.",swappedMeaning:"プレゼン前に一度確認しましょう"},
   scene:{en:"Very common in US business culture — a quick check-in without a formal meeting.",ja:"正式な会議なしに軽く状況確認する場面。アメリカのビジネス文化で毎日のように使われる。"},category:"ビジネス定型"},
  // ── 追加：財務・交渉 ──────────────────────────────────────
  {id:194,text:"bottom line it",katakana:"ボトムラインイッ",meaning:"要点を言う・利益を言う",
   linkingParts:[{segment:"bottom_line",rule:"子音+母音リンキング",detail:"「m」+「line」→「ムライン」"},{segment:"line_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"cut to the chase",katakana:"カットゥザチェイス",meaning:"要点を言う"},{text:"give me the short version",katakana:"ギヴミーザショートヴァージョン",meaning:"簡潔に教えて"}],
   swapExample:{original:"Bottom line it for me.",swapped:"Bottom line it — are we profitable?",swappedMeaning:"ずばり聞きますが、利益は出ていますか？"},
   scene:{en:"Used when demanding a summary of the most important financial or strategic point.",ja:"最も重要な数字や結論を直接求める場面。経営会議・財務報告でよく出る。"},category:"財務"},
  {id:195,text:"break even on it",katakana:"ブレイキーヴノニッ",meaning:"損益分岐点に達する",
   linkingParts:[{segment:"break_even",rule:"子音+母音リンキング",detail:"「k」+「even」→「キーヴン」"},{segment:"even_on",rule:"母音+母音リンキング",detail:"「n」+「on」→「ノン」"}],
   synonyms:[{text:"cover costs",katakana:"カヴァコスツ",meaning:"コストをカバーする"},{text:"recoup it",katakana:"リクープイッ",meaning:"回収する"}],
   swapExample:{original:"We'll break even on it by Q3.",swapped:"We'll break even on it within 18 months.",swappedMeaning:"18ヶ月以内に損益分岐点に達します"},
   scene:{en:"Used in financial planning when discussing when a project will recover its costs.",ja:"プロジェクトの投資回収時期を議論する場面。財務計画・事業計画でよく出る。"},category:"財務"},
  {id:196,text:"put it on the books",katakana:"プリロンザブックス",meaning:"帳簿に記録する・正式に計上する",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"}],
   synonyms:[{text:"record it officially",katakana:"レコーリッオフィシャリ",meaning:"正式に記録する"},{text:"book it",katakana:"ブキッ",meaning:"計上する"}],
   swapExample:{original:"Make sure to put it on the books.",swapped:"Make sure to put it on the books before year-end.",swappedMeaning:"年末までに帳簿に計上してください"},
   scene:{en:"Accounting term used when recording a transaction officially in the financial records.",ja:"取引を帳簿に正式記録する場面。経理・会計業務でよく使われる表現。"},category:"財務"},
  // ── 追加：人事・職場 ──────────────────────────────────────
  {id:197,text:"bring them up to speed",katakana:"ブリンゼマップトゥスピード",meaning:"最新情報を共有する",
   linkingParts:[{segment:"bring_them",rule:"子音+母音リンキング",detail:"「ng」+「them」→「ングゼム」"},{segment:"up_to",rule:"子音+母音リンキング",detail:"「p」+「to」→「プトゥ」"}],
   synonyms:[{text:"fill them in",katakana:"フィルゼミン",meaning:"情報を伝える"},{text:"catch them up",katakana:"キャッチゼマップ",meaning:"追いつかせる"}],
   swapExample:{original:"Can you bring them up to speed?",swapped:"Can you bring them up to speed on the project status?",swappedMeaning:"プロジェクトの状況を共有してもらえますか？"},
   scene:{en:"Used when a new team member or absent colleague needs to be updated on recent developments.",ja:"新メンバーや休んでいた同僚に現状を共有する場面。引き継ぎ・オンボーディングで必須。"},category:"人事"},
  {id:198,text:"step up to it",katakana:"ステパップトゥイッ",meaning:"立ち向かう・責任を引き受ける",
   linkingParts:[{segment:"step_up",rule:"子音+母音リンキング",detail:"「p」+「up」→「パップ」"},{segment:"up_to",rule:"子音+母音リンキング",detail:"「p」+「to」→「プトゥ」"}],
   synonyms:[{text:"rise to the challenge",katakana:"ライズトゥザチャレンジ",meaning:"挑戦に立ち向かう"},{text:"take it on",katakana:"テイキロン",meaning:"引き受ける"}],
   swapExample:{original:"I need you to step up to it.",swapped:"I need you to step up to it while I'm away.",swappedMeaning:"私の不在中は責任を持って対応してください"},
   scene:{en:"Used when asking someone to take on greater responsibility or handle a difficult situation.",ja:"困難な状況や大きな責任を引き受けるよう促す場面。リーダーシップ・昇進文脈でよく出る。"},category:"人事"},
  {id:199,text:"put it behind us",katakana:"プリリバインダス",meaning:"過去のことにする・水に流す",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_behind",rule:"flap T + 母音",detail:"「t」+「behind」→「リバインド」"}],
   synonyms:[{text:"move past it",katakana:"ムーヴパスリッ",meaning:"乗り越える"},{text:"let it go",katakana:"レリゴウ",meaning:"手放す"}],
   swapExample:{original:"Let's put it behind us.",swapped:"Let's put it behind us and focus on the future.",swappedMeaning:"過去のことは水に流して未来に集中しましょう"},
   scene:{en:"Used after a conflict, mistake, or setback to encourage moving forward.",ja:"ミスや対立の後に「過去のことは忘れて前に進もう」という場面。謝罪・和解のシーンで頻出。"},category:"人事"},
  {id:200,text:"run it past legal",katakana:"ラニッパストリーガル",meaning:"法務に確認する",
   linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_past",rule:"子音+子音",detail:"「t」+「p」→「ッパスト」"}],
   synonyms:[{text:"check with legal",katakana:"チェックウィズリーガル",meaning:"法務に確認する"},{text:"get legal approval",katakana:"ゲッリーガルアプルーヴァル",meaning:"法務承認を得る"}],
   swapExample:{original:"We need to run it past legal first.",swapped:"We need to run it past legal before signing.",swappedMeaning:"サイン前に法務確認が必要です"},
   scene:{en:"Used before finalizing contracts or decisions that could have legal implications.",ja:"法的影響がある決定の前に法務部門に確認する場面。契約・コンプライアンスで必須。"},category:"法務"},
  // ── 追加：IT・デジタル ─────────────────────────────────────
  {id:201,text:"spin it up",katakana:"スピニラップ",meaning:"（サーバー等を）立ち上げる",
   linkingParts:[{segment:"spin_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"launch it",katakana:"ローンチィッ",meaning:"立ち上げる"},{text:"bring it online",katakana:"ブリンギロンライン",meaning:"オンライン状態にする"}],
   swapExample:{original:"Can you spin it up quickly?",swapped:"Can you spin up a test environment?",swappedMeaning:"テスト環境を立ち上げてもらえますか？"},
   scene:{en:"DevOps term for starting up a server, container, or cloud instance.",ja:"サーバーやクラウドインスタンスを起動する場面。インフラ・DevOpsエンジニアが毎日使う表現。"},category:"IT"},
  {id:202,text:"wire it up",katakana:"ワイアリラップ",meaning:"接続する・連携させる",
   linkingParts:[{segment:"wire_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"hook it up",katakana:"フキラップ",meaning:"繋げる"},{text:"connect it",katakana:"コネクリッ",meaning:"接続する"}],
   swapExample:{original:"Can you wire it up to the API?",swapped:"Can you wire it up to the payment gateway?",swappedMeaning:"決済ゲートウェイに接続してもらえますか？"},
   scene:{en:"Used in software development when connecting components, APIs, or systems together.",ja:"APIやシステム間の連携・接続を実装する場面。バックエンド開発でよく使われる。"},category:"IT"},
  {id:203,text:"ship it",katakana:"シピッ",meaning:"リリースする（口語）",
   linkingParts:[{segment:"ship_it",rule:"子音+母音リンキング",detail:"「p」+「it」→「ピッ」"}],
   synonyms:[{text:"release it",katakana:"リリーシッ",meaning:"リリースする"},{text:"go live",katakana:"ゴウライヴ",meaning:"公開する"}],
   swapExample:{original:"Let's just ship it.",swapped:"Let's ship it and iterate based on feedback.",swappedMeaning:"まずリリースしてフィードバックで改善しましょう"},
   scene:{en:"Startup/tech culture phrase meaning to release code or a product. Often said to overcome perfectionism.",ja:"スタートアップ・テック文化で「とりあえずリリースしよう」という意味。完璧主義を乗り越える掛け声。"},category:"IT"},
  // ── 追加：短縮形・リンキング ──────────────────────────────
  {id:204,text:"I'm going to",katakana:"アイマゴナ",meaning:"〜するつもり（I'm gonna）",
   linkingParts:[{segment:"I'm_going",rule:"子音+母音リンキング",detail:"「m」+「going」→「マゴウイング」"},{segment:"going_to",rule:"弱形・縮約",detail:"「going to」→「ゴナ」"}],
   synonyms:[{text:"I plan to",katakana:"アイプラントゥ",meaning:"〜するつもり"},{text:"I'll",katakana:"アイル",meaning:"〜します"}],
   swapExample:{original:"I'm going to look into it.",swapped:"I'm going to look into it right away.",swappedMeaning:"すぐに調べます"},
   scene:{en:"'I'm gonna' is extremely common. The linking of 'I'm going to' makes it sound like one word.",ja:"「アイマゴナ」は最もよく使われる縮約形の一つ。TOEICリスニングで頻出。"},category:"短縮形"},
  {id:205,text:"out of the question",katakana:"アウロヴザクウェスチョン",meaning:"論外・問題外",
   linkingParts:[{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_the",rule:"子音+母音リンキング",detail:"「v」+「the」→「ヴザ」"}],
   synonyms:[{text:"absolutely not",katakana:"アブソルートリノッ",meaning:"絶対ダメ"},{text:"not a chance",katakana:"ノラチャンス",meaning:"あり得ない"}],
   swapExample:{original:"That's out of the question.",swapped:"A two-week deadline is out of the question.",swappedMeaning:"2週間の締め切りは論外です"},
   scene:{en:"Used to firmly reject a proposal or idea. Common in negotiations and business discussions.",ja:"提案を強く拒否する場面。交渉・ビジネス議論でよく出てくる断定的な表現。"},category:"短縮形"},
  {id:206,text:"a lot of it",katakana:"アロロヴィッ",meaning:"その多くは・かなりの部分は",
   linkingParts:[{segment:"a_lot",rule:"母音+母音リンキング",detail:"「a」+「lot」→「アロッ」"},{segment:"lot_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"much of it",katakana:"マッチォヴィッ",meaning:"その多くは"},{text:"a large portion",katakana:"アラージポーション",meaning:"大部分は"}],
   swapExample:{original:"A lot of it depends on timing.",swapped:"A lot of it comes down to budget.",swappedMeaning:"その多くは予算次第です"},
   scene:{en:"The flap T and linking make 'a lot of it' sound like 'alodovit'. Very hard for Japanese speakers.",ja:"「アロロヴィッ」と聞こえる典型的なリンキング。日本人が聞き取りにくい音の連続の代表例。"},category:"短縮形"},
  {id:207,text:"a lot of them",katakana:"アロロヴェム",meaning:"それらの多くは",
   linkingParts:[{segment:"a_lot",rule:"母音+母音リンキング",detail:"「a」+「lot」→「アロッ」"},{segment:"lot_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"many of them",katakana:"メニオヴェム",meaning:"それらの多くは"},{text:"most of them",katakana:"モウストオヴェム",meaning:"それらのほとんどは"}],
   swapExample:{original:"A lot of them were interested.",swapped:"A lot of them signed up immediately.",swappedMeaning:"その多くがすぐに申し込みました"},
   scene:{en:"Similar to 'a lot of it' — the rapid linking is a classic TOEIC listening challenge.",ja:"「アロロヴェム」と聞こえる。TOEICリスニングで数量・割合を表す場面で頻出。"},category:"短縮形"},
  {id:208,text:"what are you",katakana:"ワラユー",meaning:"何をしているの？",
   linkingParts:[{segment:"what_are",rule:"子音+母音リンキング",detail:"「t」+「are」→「タラ」（flap）"},{segment:"are_you",rule:"母音+母音リンキング",detail:"「r」+「you」→「ラユー」"}],
   synonyms:[{text:"what do you",katakana:"ワリャ",meaning:"あなたは何を〜？"},{text:"how are you",katakana:"ハワユー",meaning:"お元気ですか？"}],
   swapExample:{original:"What are you working on?",swapped:"What are you planning to do about it?",swappedMeaning:"それについてどう対処するつもりですか？"},
   scene:{en:"'Whaddaya' or 'whatcha' — the rapid speech form is a key TOEIC listening challenge.",ja:"「ワラユー」と聞こえる。TOEICのカジュアル会話シーンで必ず出てくる速読みパターン。"},category:"短縮形"},
  // ── 追加：顧客対応 ────────────────────────────────────────
  {id:209,text:"look into it for you",katakana:"ルキンツーイッフォーユー",meaning:"お客様のために調べます",
   linkingParts:[{segment:"look_into",rule:"子音+母音リンキング",detail:"「k」+「into」→「キントゥ」"},{segment:"into_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「ツーイッ」"}],
   synonyms:[{text:"check it for you",katakana:"チェキッフォーユー",meaning:"確認します"},{text:"find out for you",katakana:"ファインダウッフォーユー",meaning:"調べます"}],
   swapExample:{original:"I'll look into it for you right away.",swapped:"I'll look into it for you and call you back.",swappedMeaning:"調べて折り返しご連絡します"},
   scene:{en:"Customer service phrase combining a promise to investigate with a personal touch.",ja:"顧客への「調べます」という約束に丁寧さを加えた表現。コールセンター・接客で必須。"},category:"顧客対応"},
  {id:210,text:"process it right away",katakana:"プロセシッライラウェイ",meaning:"すぐに処理します",
   linkingParts:[{segment:"process_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"},{segment:"it_right",rule:"子音+母音リンキング",detail:"「t」+「right」→「ッライッ」"}],
   synonyms:[{text:"handle it immediately",katakana:"ハンドリッイミーディアトリ",meaning:"すぐに対応する"},{text:"take care of it now",katakana:"テイケアロヴィッナウ",meaning:"今すぐ対処する"}],
   swapExample:{original:"I'll process it right away.",swapped:"I'll process your refund right away.",swappedMeaning:"すぐに返金処理をいたします"},
   scene:{en:"Used in customer service when committing to immediate action on a request.",ja:"注文・返金・申請をすぐ処理するという約束。カスタマーサービスの定番表現。"},category:"顧客対応"},
  // ── 追加：プレゼン ─────────────────────────────────────────
  {id:211,text:"put it in perspective",katakana:"プリリンパースペクティヴ",meaning:"正しく見る・文脈に置く",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"contextualize it",katakana:"コンテクスチュアライジッ",meaning:"文脈に置く"},{text:"frame it properly",katakana:"フレイミップロパリ",meaning:"適切に枠組みする"}],
   swapExample:{original:"Let me put it in perspective.",swapped:"Let me put it in perspective with last year's numbers.",swappedMeaning:"去年の数字と比較して正しく見てみましょう"},
   scene:{en:"Used in presentations to help the audience understand data or events in proper context.",ja:"データや出来事を正しい文脈で理解してもらうためにプレゼンで使う表現。"},category:"プレゼン"},
  {id:212,text:"bring it to life",katakana:"ブリンギットゥライフ",meaning:"具体的にイメージさせる・実現する",
   linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],
   synonyms:[{text:"make it tangible",katakana:"メイキッタンジブル",meaning:"具体化する"},{text:"visualize it",katakana:"ヴィジュアライジッ",meaning:"視覚化する"}],
   swapExample:{original:"This case study will bring it to life.",swapped:"These visuals will bring it to life for the audience.",swappedMeaning:"このビジュアルで聴衆にイメージしてもらえます"},
   scene:{en:"Used in presentations when using examples or visuals to make abstract concepts concrete.",ja:"抽象的な概念を具体例やビジュアルで「目に見える形にする」プレゼン技法。"},category:"プレゼン"},
  // ── 追加：採用・研修 ──────────────────────────────────────
  {id:213,text:"bring it to the table",katakana:"ブリンギットゥザテイブル",meaning:"強みや価値を持ってくる",
   linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],
   synonyms:[{text:"offer it",katakana:"オファーリッ",meaning:"提供する"},{text:"contribute it",katakana:"コントリビューリッ",meaning:"貢献する"}],
   swapExample:{original:"What do you bring to the table?",swapped:"What unique skills do you bring to the table?",swappedMeaning:"あなたはどんなユニークなスキルを持っていますか？"},
   scene:{en:"Classic interview question — what value or skills does a candidate offer the organization?",ja:"面接での「あなたは何を持ってきてくれますか？」という定番質問。TOEICの採用シーンで頻出。"},category:"採用"},
  {id:214,text:"get up to speed on it",katakana:"ゲラップトゥスピードノニッ",meaning:"習得する・追いつく",
   linkingParts:[{segment:"get_up",rule:"子音+母音リンキング",detail:"「t」+「up」→「ラップ」（flap）"},{segment:"up_to",rule:"子音+母音リンキング",detail:"「p」+「to」→「プトゥ」"}],
   synonyms:[{text:"learn it quickly",katakana:"ラーニックウィックリ",meaning:"素早く習得する"},{text:"catch up on it",katakana:"キャッチャポニッ",meaning:"追いつく"}],
   swapExample:{original:"You'll need to get up to speed on it.",swapped:"You'll need to get up to speed on the new system.",swappedMeaning:"新しいシステムを習得する必要があります"},
   scene:{en:"Used when someone needs to quickly learn something new, often in onboarding contexts.",ja:"新しい業務やシステムを素早く習得する必要がある場面。研修・オンボーディングで頻出。"},category:"研修"},
  // ── 追加：汎用 ────────────────────────────────────────────
  {id:215,text:"work around it",katakana:"ワーカラウンリッ",meaning:"回避策を取る",
   linkingParts:[{segment:"work_around",rule:"子音+母音リンキング",detail:"「k」+「around」→「カラウンド」"},{segment:"around_it",rule:"子音+母音リンキング",detail:"「d」+「it」→「ディッ」"}],
   synonyms:[{text:"find a workaround",katakana:"ファインダワーカラウンド",meaning:"回避策を見つける"},{text:"get around it",katakana:"ゲララウンリッ",meaning:"回避する"}],
   swapExample:{original:"We'll have to work around it.",swapped:"We'll have to work around the budget constraint.",swappedMeaning:"予算の制約を回避する方法を考える必要があります"},
   scene:{en:"Used when facing an obstacle that can't be removed, so an alternative approach is needed.",ja:"障害を取り除けないときに「迂回路を見つける」場面。問題解決・プロジェクト管理でよく出る。"},category:"汎用"},
  {id:216,text:"make the most of it",katakana:"メイクザモウストオヴィッ",meaning:"最大限に活用する",
   linkingParts:[{segment:"make_the",rule:"子音+母音リンキング",detail:"「k」+「the」→「クザ」"},{segment:"most_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「トオヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"maximize it",katakana:"マクシマイジッ",meaning:"最大化する"},{text:"take full advantage",katakana:"テイクフルアドヴァンテジ",meaning:"十分に活用する"}],
   swapExample:{original:"Let's make the most of it.",swapped:"Let's make the most of this opportunity.",swappedMeaning:"このチャンスを最大限に活用しましょう"},
   scene:{en:"Used when encouraging someone to fully utilize a limited opportunity or resource.",ja:"限られた機会やリソースを最大限に活用するよう促す場面。前向きな決断の場面でよく使われる。"},category:"汎用"},
  {id:217,text:"get on with it",katakana:"ゲロンウィジッ",meaning:"さっさと取りかかる",
   linkingParts:[{segment:"get_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」（flap）"},{segment:"on_with",rule:"子音+子音",detail:"「n」+「w」→「ンウィ」"}],
   synonyms:[{text:"get to it",katakana:"ゲットゥイッ",meaning:"取りかかる"},{text:"start on it",katakana:"スタートノニッ",meaning:"始める"}],
   swapExample:{original:"Let's just get on with it.",swapped:"Stop overthinking and get on with it.",swappedMeaning:"考えすぎずにさっさと取りかかりましょう"},
   scene:{en:"Used to urge someone to stop delaying and start working. Can sound impatient.",ja:"ぐずぐずせずに取りかかるよう促す表現。少し苛立ちを含む場合もある。"},category:"汎用"},
  {id:218,text:"follow up on it",katakana:"ファロウアポニッ",meaning:"追跡確認する",
   linkingParts:[{segment:"follow_up",rule:"子音+母音リンキング",detail:"「w」+「up」→「ウラップ」"},{segment:"up_on",rule:"子音+母音リンキング",detail:"「p」+「on」→「ポン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"check back on it",katakana:"チェックバックノニッ",meaning:"後で確認する"},{text:"circle back on it",katakana:"サークルバックノニッ",meaning:"後で戻って確認する"}],
   swapExample:{original:"I'll follow up on it tomorrow.",swapped:"I'll follow up on it and report back by Friday.",swappedMeaning:"追跡確認して金曜日までに報告します"},
   scene:{en:"Essential phrase for professional follow-through. Used constantly in email and meeting contexts.",ja:"プロフェッショナルな業務追跡の必須表現。メール・会議の後続対応でほぼ毎日使われる。"},category:"汎用"},
  {id:219,text:"get ahead of it",katakana:"ゲラヘドオヴィッ",meaning:"先手を打つ・予防策を取る",
   linkingParts:[{segment:"get_ahead",rule:"子音+母音リンキング",detail:"「t」+「ahead」→「ラヘッ」（flap）"},{segment:"ahead_of",rule:"母音+母音リンキング",detail:"「d」+「of」→「ドオヴ」"}],
   synonyms:[{text:"stay ahead of it",katakana:"ステイアヘドオヴィッ",meaning:"先を行く"},{text:"be proactive about it",katakana:"ビープロウアクティヴアバウリッ",meaning:"先手を打つ"}],
   swapExample:{original:"We need to get ahead of it.",swapped:"We need to get ahead of it before it becomes a crisis.",swappedMeaning:"危機になる前に先手を打つ必要があります"},
   scene:{en:"Used in risk management or communications when taking proactive steps before a problem escalates.",ja:"問題が大きくなる前に先手を打つ場面。リスク管理・危機対応でよく使われる。"},category:"汎用"},
  {id:220,text:"push back on it",katakana:"プシュバックノニッ",meaning:"反論する・異議を唱える",
   linkingParts:[{segment:"push_back",rule:"子音+子音",detail:"「sh」+「b」→「シュバック」"},{segment:"back_on",rule:"子音+母音リンキング",detail:"「k」+「on」→「コン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"challenge it",katakana:"チャレンジィッ",meaning:"異議を唱える"},{text:"object to it",katakana:"オブジェクッツーイッ",meaning:"反対する"}],
   swapExample:{original:"I'm going to push back on it.",swapped:"I'm going to push back on the timeline.",swappedMeaning:"スケジュールに異議を唱えます"},
   scene:{en:"Used in negotiations or meetings to respectfully disagree or challenge a decision.",ja:"会議・交渉で提案や決定に対して丁寧に反論する場面。リーダーシップ・意思決定でよく出る。"},category:"汎用"},
,

  // ══ 追加バッチ 221-350 ══════════════════════════════════

  // ── 会議・議事 追加 ──────────────────────────────────────
  {id:221,text:"set it aside",katakana:"セリラサイド",meaning:"一旦脇に置く",
   linkingParts:[{segment:"set_it",rule:"flap T + 母音",detail:"「t」→ら行「セリッ」"},{segment:"it_aside",rule:"flap T + 母音",detail:"「t」+「aside」→「ラサイド」"}],
   synonyms:[{text:"put it on hold",katakana:"プリロンホールド",meaning:"保留にする"},{text:"park it",katakana:"パーキッ",meaning:"一時保留"}],
   swapExample:{original:"Let's set it aside for now.",swapped:"Let's set it aside and come back to it later.",swappedMeaning:"一旦置いておいて後で戻りましょう"},
   scene:{en:"Used to pause a side discussion and return to the main agenda.",ja:"脇道に逸れた議論を一旦止めてメイン議題に戻る場面。ファシリテーターがよく使う。"},category:"会議"},
  {id:222,text:"open it up",katakana:"オウプニラップ",meaning:"議論を開く・公開する",
   linkingParts:[{segment:"open_it",rule:"母音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"open the floor",katakana:"オウプンザフロア",meaning:"フロアを開く"},{text:"throw it open",katakana:"スロウイロウプン",meaning:"議論に開放する"}],
   swapExample:{original:"Let's open it up to questions.",swapped:"Let's open it up to the whole team.",swappedMeaning:"チーム全体に議論を開きましょう"},
   scene:{en:"Used at the end of a presentation to invite questions or broader discussion.",ja:"プレゼン後に質疑応答や全体討議に移るときの一言。"},category:"会議"},
  {id:223,text:"put it to rest",katakana:"プリットゥレスト",meaning:"決着をつける・終わらせる",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],
   synonyms:[{text:"settle it once and for all",katakana:"セリリワンスアンフォーオール",meaning:"一度で決着をつける"},{text:"close it out",katakana:"クロウジラウッ",meaning:"締め切る"}],
   swapExample:{original:"Let's put it to rest today.",swapped:"Let's put this debate to rest once and for all.",swappedMeaning:"この議論に今日こそ決着をつけましょう"},
   scene:{en:"Used to end a recurring debate or issue definitively.",ja:"繰り返される議論に決着をつける場面。長引く問題の解決宣言として使われる。"},category:"会議"},
  {id:224,text:"lay it on the table",katakana:"レイロンザテイブル",meaning:"全て明かす・正直に話す",
   linkingParts:[{segment:"lay_it",rule:"子音+母音リンキング",detail:"「y」+「it」→「イッ」"},{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"}],
   synonyms:[{text:"put it all out there",katakana:"プリロールアウッデア",meaning:"全てさらけ出す"},{text:"be transparent",katakana:"ビートランスペアレン",meaning:"透明性を持つ"}],
   swapExample:{original:"I'm going to lay it on the table.",swapped:"Let's lay everything on the table before deciding.",swappedMeaning:"決める前に全てを明かしましょう"},
   scene:{en:"Used when someone is about to be completely honest about all facts or concerns.",ja:"交渉や議論で全ての情報を正直に開示する場面。信頼構築の場面でよく出る。"},category:"会議"},
  {id:225,text:"weigh in on it",katakana:"ウェイイノニッ",meaning:"意見を言う・参加する",
   linkingParts:[{segment:"weigh_in",rule:"子音+母音リンキング",detail:"「gh」+「in」→「イン」"},{segment:"in_on",rule:"母音+母音リンキング",detail:"「n」+「on」→「ノン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"chime in on it",katakana:"チャイミノニッ",meaning:"口を挟む"},{text:"give your input",katakana:"ギヴユアインプット",meaning:"意見を述べる"}],
   swapExample:{original:"Do you want to weigh in on it?",swapped:"Would anyone else like to weigh in on it?",swappedMeaning:"他に意見がある方はいますか？"},
   scene:{en:"Used to invite someone's opinion on a topic under discussion.",ja:"議論中のトピックについて意見を求める場面。会議でファシリテーターがよく使う。"},category:"会議"},

  // ── 電話・連絡 追加 ──────────────────────────────────────
  {id:226,text:"call it in",katakana:"コーリリン",meaning:"電話で報告する・注文する",
   linkingParts:[{segment:"call_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"report it",katakana:"リポーリッ",meaning:"報告する"},{text:"phone it in",katakana:"フォウニリン",meaning:"電話で伝える"}],
   swapExample:{original:"Just call it in.",swapped:"Just call it in to the main office.",swappedMeaning:"本社に電話で報告してください"},
   scene:{en:"Used when reporting something by phone, such as an order, incident, or delivery.",ja:"注文・インシデント・配達報告を電話で行う場面。物流・コールセンターでよく出る。"},category:"電話"},
  {id:227,text:"check back with me",katakana:"チェックバックウィズミー",meaning:"後で確認してください",
   linkingParts:[{segment:"check_back",rule:"子音+子音",detail:"「k」+「b」→「ックバック」"},{segment:"back_with",rule:"子音+子音",detail:"「k」+「w」→「クウィズ」"}],
   synonyms:[{text:"follow up with me",katakana:"ファロウアップウィズミー",meaning:"後でフォローしてください"},{text:"come back to me",katakana:"カムバックトゥミー",meaning:"また来てください"}],
   swapExample:{original:"Check back with me tomorrow.",swapped:"Check back with me after you've spoken to them.",swappedMeaning:"先方と話してから改めて連絡してください"},
   scene:{en:"Used to ask someone to return with an update or answer after getting more information.",ja:"情報を集めてから後で連絡をくれるよう頼む場面。業務の連鎖的な確認でよく使われる。"},category:"電話"},
  {id:228,text:"put you on hold",katakana:"プチュオンホールド",meaning:"保留にする",
   linkingParts:[{segment:"put_you",rule:"flap T + 母音",detail:"「t」+「you」→「チュ」（yod）"},{segment:"you_on",rule:"母音+母音リンキング",detail:"「u」+「on」→「ウォン」"}],
   synonyms:[{text:"hold the line",katakana:"ホールドザライン",meaning:"そのままお待ちください"},{text:"keep you waiting",katakana:"キープユーウェイティング",meaning:"お待たせする"}],
   swapExample:{original:"I'm going to put you on hold briefly.",swapped:"I'm going to put you on hold while I check.",swappedMeaning:"確認している間少々お待ちください"},
   scene:{en:"Said by phone operators or receptionists when they need to pause the call.",ja:"電話を保留にするときの定番フレーズ。受付・コールセンターで必ず使われる。"},category:"電話"},
  {id:229,text:"keep me posted",katakana:"キーピーポウスティッ",meaning:"随時連絡してください",
   linkingParts:[{segment:"keep_me",rule:"子音+母音リンキング",detail:"「p」+「me」→「ピミー」"},{segment:"me_posted",rule:"母音+子音リンキング",detail:"「e」+「posted」→「ミーポウスティッ」"}],
   synonyms:[{text:"keep me updated",katakana:"キーピーアップデイティッ",meaning:"最新情報を教えて"},{text:"let me know",katakana:"レミノウ",meaning:"知らせてください"}],
   swapExample:{original:"Keep me posted on any developments.",swapped:"Keep me posted on the client's response.",swappedMeaning:"クライアントの返答があれば随時連絡してください"},
   scene:{en:"Used to request ongoing updates. One of the most common phrases in business email sign-offs.",ja:"進捗を随時報告してほしいときの定番表現。ビジネスメールの締めでも頻繁に使われる。"},category:"電話"},
  {id:230,text:"get back to me on it",katakana:"ゲッバックトゥミーオニッ",meaning:"後で返答してください",
   linkingParts:[{segment:"get_back",rule:"子音+子音 停止",detail:"「t」停止+「b」→「ゲッバック」"},{segment:"back_to",rule:"子音+母音リンキング",detail:"「k」+「to」→「クトゥ」"},{segment:"me_on",rule:"母音+母音リンキング",detail:"「e」+「on」→「ミーオン」"}],
   synonyms:[{text:"let me know",katakana:"レミノウ",meaning:"知らせてください"},{text:"reply when ready",katakana:"リプライウェンレディ",meaning:"準備ができたら返答して"}],
   swapExample:{original:"Get back to me on it when you can.",swapped:"Get back to me on it before end of day.",swappedMeaning:"今日中に返答をください"},
   scene:{en:"A polite request for a response. The 'get back' linking is a classic listening challenge.",ja:"返答を依頼する丁寧な表現。「ゲッバック」のリンキングはTOEICでの頻出リスニング難所。"},category:"電話"},

  // ── 人事・職場 追加 ──────────────────────────────────────
  {id:231,text:"sign off on it",katakana:"サイノッフォニッ",meaning:"最終承認する",
   linkingParts:[{segment:"sign_off",rule:"子音+母音リンキング",detail:"「n」+「off」→「ノッフ」"},{segment:"off_on",rule:"子音+母音リンキング",detail:"「f」+「on」→「フォン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"approve it",katakana:"アプルーヴィッ",meaning:"承認する"},{text:"greenlight it",katakana:"グリーンライリッ",meaning:"ゴーサインを出す"}],
   swapExample:{original:"The director needs to sign off on it.",swapped:"The director needs to sign off on it before we proceed.",swappedMeaning:"進める前に部長の最終承認が必要です"},
   scene:{en:"Final approval step in corporate processes. Without this, projects cannot move forward.",ja:"稟議・承認フローの最終ステップ。「サインオフ」はTOEIC組織問題で頻出。"},category:"人事"},
  {id:232,text:"take it on",katakana:"テイキロン",meaning:"引き受ける",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"}],
   synonyms:[{text:"accept it",katakana:"アクセプリッ",meaning:"受け入れる"},{text:"handle it",katakana:"ハンドリッ",meaning:"対応する"}],
   swapExample:{original:"Are you willing to take it on?",swapped:"Are you willing to take it on as your main project?",swappedMeaning:"メインプロジェクトとして引き受けてもらえますか？"},
   scene:{en:"Used when assigning or accepting responsibility for a task or project.",ja:"タスクやプロジェクトの責任を引き受ける・割り当てる場面。業務アサインでよく使われる。"},category:"人事"},
  {id:233,text:"let go of it",katakana:"レゴウオヴィッ",meaning:"手放す・諦める",
   linkingParts:[{segment:"let_go",rule:"子音+母音リンキング",detail:"「t」+「go」→「ゴウ」（flap）"},{segment:"go_of",rule:"母音+母音リンキング",detail:"「o」+「of」→「ゴウオヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"move on from it",katakana:"ムーヴォンフロミッ",meaning:"乗り越える"},{text:"release it",katakana:"リリーシッ",meaning:"手放す"}],
   swapExample:{original:"You need to let go of it.",swapped:"You need to let go of it and focus on what's next.",swappedMeaning:"過去のことは手放して次に集中しましょう"},
   scene:{en:"Used to encourage someone to stop worrying about a past mistake or lost opportunity.",ja:"過去のミスや失敗を引きずっている人に「手放して前を向け」と励ます場面。"},category:"人事"},
  {id:234,text:"work it out together",katakana:"ワーキラウットゥギャザ",meaning:"一緒に解決する",
   linkingParts:[{segment:"work_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"},{segment:"out_together",rule:"子音+母音リンキング",detail:"「t」+「together」→「トゥギャザ」"}],
   synonyms:[{text:"collaborate on it",katakana:"コラボレイロニッ",meaning:"協力して取り組む"},{text:"solve it as a team",katakana:"ソルヴィラサチーム",meaning:"チームで解決する"}],
   swapExample:{original:"I'm sure we can work it out together.",swapped:"I'm sure we can work it out together if we communicate.",swappedMeaning:"コミュニケーションを取れば一緒に解決できると思います"},
   scene:{en:"Collaborative problem-solving phrase. Common in team meetings and conflict resolution.",ja:"チームで問題を解決する姿勢を示す表現。対立解消・チームビルディングの場面で頻出。"},category:"人事"},
  {id:235,text:"pass it down",katakana:"パシッダウン",meaning:"伝承する・下に伝える",
   linkingParts:[{segment:"pass_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],
   synonyms:[{text:"transfer knowledge",katakana:"トランスファーノリッジ",meaning:"知識を移転する"},{text:"hand it down",katakana:"ハンリッダウン",meaning:"下に伝える"}],
   swapExample:{original:"We need to pass it down to the new team.",swapped:"We need to pass this knowledge down before retiring.",swappedMeaning:"退職前にこの知識を伝承する必要があります"},
   scene:{en:"Used in knowledge management and succession planning contexts.",ja:"知識移転・後継者育成の場面。ベテランから若手への技術継承でよく使われる。"},category:"人事"},

  // ── 物流・オフィス 追加 ──────────────────────────────────
  {id:236,text:"load it up",katakana:"ロウリラップ",meaning:"積み込む・ロードする",
   linkingParts:[{segment:"load_it",rule:"子音+母音リンキング",detail:"「d」+「it」→「ディッ」（d弱化）"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"fill it up",katakana:"フィリラップ",meaning:"満杯にする"},{text:"pack it in",katakana:"パキリン",meaning:"詰め込む"}],
   swapExample:{original:"Load it up and get it ready.",swapped:"Load it up before six o'clock.",swappedMeaning:"6時までに積み込んで準備してください"},
   scene:{en:"Used in logistics when loading cargo onto trucks, ships, or systems.",ja:"トラック・船・システムへの積み込み作業の指示。物流・製造現場でよく使われる。"},category:"物流"},
  {id:237,text:"check it over",katakana:"チェキロウヴァ",meaning:"全体を確認する",
   linkingParts:[{segment:"check_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_over",rule:"flap T + 母音",detail:"「t」+「over」→「ロウヴァ」"}],
   synonyms:[{text:"look it over",katakana:"ルキロウヴァ",meaning:"全体を見渡す"},{text:"review it",katakana:"リヴューイッ",meaning:"レビューする"}],
   swapExample:{original:"Can you check it over before we send it?",swapped:"Can you check it over one more time?",swappedMeaning:"もう一度全体を確認してもらえますか？"},
   scene:{en:"Used before submitting or shipping to do a final review of documents or products.",ja:"書類・製品を提出・出荷する前の最終確認。品質管理・校正でよく使われる。"},category:"物流"},
  {id:238,text:"back it up",katakana:"バキラップ",meaning:"バックアップする・後退する",
   linkingParts:[{segment:"back_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"make a copy",katakana:"メイカコピー",meaning:"コピーを作る"},{text:"save it",katakana:"セイヴィッ",meaning:"保存する"}],
   swapExample:{original:"Make sure to back it up.",swapped:"Make sure to back it up to the cloud.",swappedMeaning:"クラウドにバックアップしておいてください"},
   scene:{en:"Used in IT when copying data for safety, or in driving when reversing a vehicle.",ja:"データのバックアップ取得（IT）または車のバック（運転）の両方に使える表現。"},category:"物流"},
  {id:239,text:"clear it out",katakana:"クリアリラウッ",meaning:"片付ける・在庫を処分する",
   linkingParts:[{segment:"clear_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"clean it out",katakana:"クリーニラウッ",meaning:"きれいに片付ける"},{text:"dispose of it",katakana:"ディスポウズオヴィッ",meaning:"処分する"}],
   swapExample:{original:"We need to clear it out by Friday.",swapped:"We need to clear it out before the new stock arrives.",swappedMeaning:"新しい在庫が来る前に片付ける必要があります"},
   scene:{en:"Used in retail or warehousing when clearing space or selling off old inventory.",ja:"倉庫や店舗で場所を確保したり旧在庫を処分する場面。小売・物流でよく出る。"},category:"物流"},
  {id:240,text:"run it through the system",katakana:"ラニッスルーザシステム",meaning:"システムに通す・処理する",
   linkingParts:[{segment:"run_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"},{segment:"through_the",rule:"子音+母音リンキング",detail:"「gh」+「the」→「ザ」"}],
   synonyms:[{text:"process it",katakana:"プロセシッ",meaning:"処理する"},{text:"enter it in",katakana:"エンタリリン",meaning:"入力する"}],
   swapExample:{original:"Let me run it through the system.",swapped:"Let me run it through the system and check the status.",swappedMeaning:"システムで処理して状況を確認します"},
   scene:{en:"Used when processing a transaction, order, or request through a computer system.",ja:"注文・取引・申請をシステムで処理する場面。窓口業務・カスタマーサービスで頻出。"},category:"物流"},

  // ── 顧客対応 追加 ────────────────────────────────────────
  {id:241,text:"send it back",katakana:"センリッバック",meaning:"返送する",
   linkingParts:[{segment:"send_it",rule:"子音+母音リンキング",detail:"「d」+「it」→「ディッ」"},{segment:"it_back",rule:"子音+子音",detail:"「t」+「b」→「ッバック」"}],
   synonyms:[{text:"return it",katakana:"リターニッ",meaning:"返品する"},{text:"ship it back",katakana:"シピッバック",meaning:"返送する"}],
   swapExample:{original:"Please send it back to us.",swapped:"Please send it back within 30 days.",swappedMeaning:"30日以内に返送してください"},
   scene:{en:"Used in customer service for product returns or document corrections.",ja:"商品の返品・書類の差し戻しを依頼する場面。カスタマーサービスで頻出。"},category:"顧客対応"},
  {id:242,text:"pass it on to",katakana:"パシロントゥ",meaning:"〜に転送する・引き継ぐ",
   linkingParts:[{segment:"pass_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"},{segment:"on_to",rule:"子音+母音リンキング",detail:"「n」+「to」→「ントゥ」"}],
   synonyms:[{text:"forward it to",katakana:"フォーワリットゥ",meaning:"転送する"},{text:"hand it to",katakana:"ハンリットゥ",meaning:"渡す"}],
   swapExample:{original:"I'll pass it on to the right department.",swapped:"I'll pass it on to someone who can help.",swappedMeaning:"対応できる担当者に引き継ぎます"},
   scene:{en:"Used when transferring a call, complaint, or task to a more appropriate person.",ja:"担当外の問い合わせを適切な部署・担当者に引き継ぐ場面。受付・コールセンターで必須。"},category:"顧客対応"},
  {id:243,text:"credit it back",katakana:"クレリッバック",meaning:"返金する・クレジットする",
   linkingParts:[{segment:"credit_it",rule:"flap T + 母音",detail:"「t」→ら行「クレリッ」"},{segment:"it_back",rule:"子音+子音",detail:"「t」+「b」→「ッバック」"}],
   synonyms:[{text:"refund it",katakana:"リーファンリッ",meaning:"返金する"},{text:"reimburse it",katakana:"リームバーシッ",meaning:"払い戻す"}],
   swapExample:{original:"We'll credit it back to your account.",swapped:"We'll credit it back within 3 to 5 business days.",swappedMeaning:"3〜5営業日以内に口座に返金します"},
   scene:{en:"Used in banking and retail when returning money to a customer's account.",ja:"返金・クレジット処理の場面。銀行・小売・サブスクリプションサービスでよく出る。"},category:"顧客対応"},
  {id:244,text:"waive it",katakana:"ウェイヴィッ",meaning:"免除する・放棄する",
   linkingParts:[{segment:"waive_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"waive the fee",katakana:"ウェイヴザフィー",meaning:"手数料を免除する"},{text:"drop it",katakana:"ドロピッ",meaning:"放棄する"}],
   swapExample:{original:"We'll waive it this time.",swapped:"We'll waive the cancellation fee this time.",swappedMeaning:"今回はキャンセル料を免除します"},
   scene:{en:"Used in customer service when waiving fees as a goodwill gesture.",ja:"手数料・違約金を免除するときの表現。クレーム対応・優良顧客へのサービスでよく出る。"},category:"顧客対応"},
  {id:245,text:"escalate it",katakana:"エスカレイリッ",meaning:"上位にエスカレーションする",
   linkingParts:[{segment:"escalate_it",rule:"flap T + 母音",detail:"「t」→ら行「エスカレイリッ」"}],
   synonyms:[{text:"raise it to management",katakana:"レイジィットゥマネジメン",meaning:"上司に上げる"},{text:"take it higher",katakana:"テイキッハイア",meaning:"上位に持っていく"}],
   swapExample:{original:"I'll need to escalate it.",swapped:"I'll need to escalate it to my supervisor.",swappedMeaning:"上司にエスカレーションする必要があります"},
   scene:{en:"Used when a customer complaint or issue requires management attention.",ja:"クレームや問題が現場で解決できず上位者の対応が必要な場面。コールセンターで頻出。"},category:"顧客対応"},

  // ── 財務・交渉 追加 ──────────────────────────────────────
  {id:246,text:"offset it",katakana:"オッセリッ",meaning:"相殺する",
   linkingParts:[{segment:"offset_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"balance it out",katakana:"バランシラウッ",meaning:"バランスを取る"},{text:"cancel it out",katakana:"キャンセリラウッ",meaning:"打ち消す"}],
   swapExample:{original:"We can offset it with savings elsewhere.",swapped:"We can offset it with the cost reductions in Q3.",swappedMeaning:"Q3のコスト削減で相殺できます"},
   scene:{en:"Used in financial analysis when balancing gains against losses or costs.",ja:"損益の相殺・コスト削減との調整を議論する場面。財務分析・予算管理でよく出る。"},category:"財務"},
  {id:247,text:"bump it up",katakana:"バンピラップ",meaning:"引き上げる・増やす",
   linkingParts:[{segment:"bump_it",rule:"子音+母音リンキング",detail:"「p」+「it」→「ピッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"increase it",katakana:"インクリーシッ",meaning:"増加させる"},{text:"raise it",katakana:"レイジッ",meaning:"引き上げる"}],
   swapExample:{original:"Can we bump it up by 10%?",swapped:"Can we bump up the offer to close the deal?",swappedMeaning:"契約を決めるためにオファーを引き上げられますか？"},
   scene:{en:"Used in negotiations or budget discussions when increasing a number or offer.",ja:"交渉・予算議論で数字やオファーを引き上げる場面。営業・人事評価でよく出る。"},category:"財務"},
  {id:248,text:"cut it in half",katakana:"カリリンハーフ",meaning:"半分に削減する",
   linkingParts:[{segment:"cut_it",rule:"flap T + 母音",detail:"「t」→ら行「カリッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"halve it",katakana:"ハーヴィッ",meaning:"半分にする"},{text:"reduce it by 50%",katakana:"リデューシッバイフィフティパーセン",meaning:"50%削減する"}],
   swapExample:{original:"We need to cut it in half.",swapped:"We need to cut the timeline in half.",swappedMeaning:"スケジュールを半分に短縮する必要があります"},
   scene:{en:"Used in budget cuts or project compression discussions.",ja:"コスト半減・スケジュール短縮を議論する場面。経営会議・プロジェクト管理でよく出る。"},category:"財務"},
  {id:249,text:"lock in the price",katakana:"ロキンザプライス",meaning:"価格を固定する",
   linkingParts:[{segment:"lock_in",rule:"子音+母音リンキング",detail:"「k」+「in」→「キン」"},{segment:"in_the",rule:"母音+子音リンキング",detail:"「n」+「the」→「ンザ」"}],
   synonyms:[{text:"fix the price",katakana:"フィックスザプライス",meaning:"価格を固定する"},{text:"freeze the rate",katakana:"フリーズザレイト",meaning:"レートを凍結する"}],
   swapExample:{original:"Can we lock in the price today?",swapped:"Can we lock in the price before the rate goes up?",swappedMeaning:"レートが上がる前に価格を固定できますか？"},
   scene:{en:"Used in purchasing or contracts when securing a price to protect against future increases.",ja:"将来の値上がりを防ぐために価格を確定する場面。調達・契約交渉で頻出。"},category:"財務"},
  {id:250,text:"foot the bill",katakana:"フッザビル",meaning:"支払いをする・費用を持つ",
   linkingParts:[{segment:"foot_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"the_bill",rule:"子音+子音",detail:"「e」+「bill」→「ザビル」"}],
   synonyms:[{text:"pay for it",katakana:"ペイフォーイッ",meaning:"支払う"},{text:"cover the cost",katakana:"カヴァザコスト",meaning:"費用をカバーする"}],
   swapExample:{original:"Who's going to foot the bill?",swapped:"The company will foot the bill for travel.",swappedMeaning:"出張費用は会社が持ちます"},
   scene:{en:"Used when discussing who will pay for something, especially unexpected expenses.",ja:"費用の負担者を決める場面。接待・出張・プロジェクトの費用負担でよく出る。"},category:"財務"},

  // ── IT・デジタル 追加 ─────────────────────────────────────
  {id:251,text:"roll it back",katakana:"ロウリッバック",meaning:"ロールバックする・元に戻す",
   linkingParts:[{segment:"roll_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_back",rule:"子音+子音",detail:"「t」+「b」→「ッバック」"}],
   synonyms:[{text:"revert it",katakana:"リヴァーリッ",meaning:"元に戻す"},{text:"undo it",katakana:"アンドゥーイッ",meaning:"取り消す"}],
   swapExample:{original:"We need to roll it back immediately.",swapped:"We need to roll it back to the previous version.",swappedMeaning:"前のバージョンにロールバックする必要があります"},
   scene:{en:"Used in DevOps when reverting a bad deployment to a previous stable version.",ja:"本番環境の問題デプロイを前のバージョンに戻す場面。インフラ・DevOpsで必須の表現。"},category:"IT"},
  {id:252,text:"migrate it over",katakana:"マイグレイリロウヴァ",meaning:"移行する",
   linkingParts:[{segment:"migrate_it",rule:"flap T + 母音",detail:"「t」→ら行「マイグレイリッ」"},{segment:"it_over",rule:"flap T + 母音",detail:"「t」+「over」→「ロウヴァ」"}],
   synonyms:[{text:"move it over",katakana:"ムーヴィロウヴァ",meaning:"移動させる"},{text:"transfer it",katakana:"トランスファーリッ","meaning":"移行する"}],
   swapExample:{original:"We'll migrate it over this weekend.",swapped:"We'll migrate it over to the new cloud platform.",swappedMeaning:"新しいクラウドプラットフォームに移行します"},
   scene:{en:"Used in IT projects when moving data or systems from one platform to another.",ja:"データやシステムを別のプラットフォームに移行する場面。DX・システム刷新で頻出。"},category:"IT"},
  {id:253,text:"debug it",katakana:"ディバギッ",meaning:"デバッグする",
   linkingParts:[{segment:"debug_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"}],
   synonyms:[{text:"fix the bug",katakana:"フィックスザバグ",meaning:"バグを直す"},{text:"troubleshoot it",katakana:"トラブルシューリッ",meaning:"原因を調査する"}],
   swapExample:{original:"I'll debug it and let you know.",swapped:"I'll debug it and have a fix by tomorrow.",swappedMeaning:"デバッグして明日中に修正します"},
   scene:{en:"Used in software development when identifying and fixing errors in code.",ja:"コードのエラーを見つけて修正する場面。開発者の日常会話で最もよく使われる表現の一つ。"},category:"IT"},
  {id:254,text:"automate it",katakana:"オートメイリッ",meaning:"自動化する",
   linkingParts:[{segment:"automate_it",rule:"flap T + 母音",detail:"「t」→ら行「オートメイリッ」"}],
   synonyms:[{text:"script it",katakana:"スクリプリッ",meaning:"スクリプト化する"},{text:"systematize it",katakana:"シスタマイジィッ",meaning:"体系化する"}],
   swapExample:{original:"We should automate it.",swapped:"We should automate it to save time.",swappedMeaning:"時間を節約するために自動化すべきです"},
   scene:{en:"Used in IT and operations when replacing manual processes with automated systems.",ja:"手動プロセスをシステムで自動化する場面。DX推進・業務効率化でよく出る。"},category:"IT"},
  {id:255,text:"flag it as",katakana:"フラギラズ",meaning:"〜としてフラグを立てる・分類する",
   linkingParts:[{segment:"flag_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"},{segment:"it_as",rule:"flap T + 母音",detail:"「t」+「as」→「ラズ」"}],
   synonyms:[{text:"mark it as",katakana:"マーキラズ",meaning:"〜としてマークする"},{text:"tag it as",katakana:"タギラズ",meaning:"〜としてタグ付けする"}],
   swapExample:{original:"Flag it as urgent.",swapped:"Flag it as high priority in the system.",swappedMeaning:"システムで高優先度としてフラグを立ててください"},
   scene:{en:"Used in project management and IT systems when categorizing issues or tasks.",ja:"タスク・バグ・メールを分類・優先度付けする場面。プロジェクト管理・IT業務で頻出。"},category:"IT"},

  // ── 短縮形 追加 ──────────────────────────────────────────
  {id:256,text:"isn't it",katakana:"イズニッ",meaning:"〜ですよね？（付加疑問文）",
   linkingParts:[{segment:"isn't_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）「イズニリッ」"}],
   synonyms:[{text:"right?",katakana:"ライッ",meaning:"そうですよね？"},{text:"don't you think?",katakana:"ドンチュシンク",meaning:"そう思いませんか？"}],
   swapExample:{original:"That's a great idea, isn't it?",swapped:"The deadline is tomorrow, isn't it?",swappedMeaning:"締め切りは明日ですよね？"},
   scene:{en:"Tag questions are very common in British and Australian English on TOEIC.",ja:"付加疑問文はTOEICのBritish/Australianアクセント問題で頻出。「イズニッ」と聞こえる。"},category:"短縮形"},
  {id:257,text:"don't you",katakana:"ドンチュ",meaning:"〜しませんか？（付加疑問）",
   linkingParts:[{segment:"don't_you",rule:"弱形・縮約",detail:"「t」+「you」→「チュ」（yod coalescence）"}],
   synonyms:[{text:"wouldn't you",katakana:"ウドンチュ",meaning:"〜ではないですか？"},{text:"can't you",katakana:"キャンチュ",meaning:"〜できないんですか？"}],
   swapExample:{original:"Don't you think we should reconsider?",swapped:"Don't you think this is too risky?",swappedMeaning:"これはリスクが高すぎると思いませんか？"},
   scene:{en:"Yod coalescence makes 'don't you' sound like 'dontcha'. Very common in natural speech.",ja:"「ドンチュ」と聞こえる。意見を求めたり説得するときのTOEIC頻出パターン。"},category:"短縮形"},
  {id:258,text:"I should have",katakana:"アイシュダヴ",meaning:"〜すべきだった",
   linkingParts:[{segment:"should_have",rule:"弱形・縮約",detail:"「should」+「have」→「シュダヴ」（should've）"}],
   synonyms:[{text:"I ought to have",katakana:"アイオーダヴ",meaning:"〜すべきだった"},{text:"I was supposed to",katakana:"アイワズサポーストゥ",meaning:"〜するはずだった"}],
   swapExample:{original:"I should have called you sooner.",swapped:"I should have double-checked the figures.",swappedMeaning:"数字をもっと確認すべきでした"},
   scene:{en:"Expresses regret. The contraction 'shoulda' is very common in American English.",ja:"後悔の表現。「シュダヴ」または「シュダ」と聞こえる。振り返り会議で頻出。"},category:"短縮形"},
  {id:259,text:"I would have",katakana:"アイウダヴ",meaning:"〜したはずなのに",
   linkingParts:[{segment:"would_have",rule:"弱形・縮約",detail:"「would」+「have」→「ウダヴ」（would've）"}],
   synonyms:[{text:"I'd have",katakana:"アイドハヴ",meaning:"〜しただろうに"},{text:"I was going to",katakana:"アイワズゴナ",meaning:"〜するつもりだった"}],
   swapExample:{original:"I would have told you if I'd known.",swapped:"I would have handled it differently.",swappedMeaning:"私だったら違うやり方をしていました"},
   scene:{en:"'Woulda' is the casual spoken form. Used in hypotheticals and post-mortems.",ja:"「ウダヴ/ウダ」と聞こえる仮定法過去完了。振り返り・たられば議論で使われる。"},category:"短縮形"},
  {id:260,text:"I could have",katakana:"アイクダヴ",meaning:"〜できたはずなのに",
   linkingParts:[{segment:"could_have",rule:"弱形・縮約",detail:"「could」+「have」→「クダヴ」（could've）"}],
   synonyms:[{text:"I was able to",katakana:"アイワズエイブルトゥ",meaning:"〜できた"},{text:"I had the chance to",katakana:"アイハッザチャンストゥ",meaning:"〜する機会があった"}],
   swapExample:{original:"I could have done it faster.",swapped:"I could have prevented it with more data.",swappedMeaning:"もっとデータがあれば防げたはずです"},
   scene:{en:"'Coulda' expresses missed potential. Very common in business post-mortems.",ja:"「クダヴ/クダ」と聞こえる。やればできたのにという後悔の表現。分析業務の振り返りで頻出。"},category:"短縮形"},
  {id:261,text:"there is",katakana:"ゼリズ",meaning:"〜があります（there's）",
   linkingParts:[{segment:"there_is",rule:"子音+母音リンキング",detail:"「r」+「is」→「リズ」（there's）"}],
   synonyms:[{text:"there's",katakana:"ゼアーズ",meaning:"〜がある"},{text:"we have",katakana:"ウィハヴ",meaning:"〜があります"}],
   swapExample:{original:"There is a problem we need to address.",swapped:"There is a discrepancy in the numbers.",swappedMeaning:"数字に不一致があります"},
   scene:{en:"'There's' is always contracted in speech. The linking makes it sound like 'theriz'.",ja:"「ゼリズ」と聞こえる。TOEICで状況説明や問題提起でほぼ毎問使われる。"},category:"短縮形"},
  {id:262,text:"that is",katakana:"ザリズ",meaning:"つまり・それは（that's）",
   linkingParts:[{segment:"that_is",rule:"flap T + 母音",detail:"「t」→ら行「ザリズ」（that's）"}],
   synonyms:[{text:"that's",katakana:"ザッツ",meaning:"それは"},{text:"in other words",katakana:"イナザワーズ",meaning:"言い換えれば"}],
   swapExample:{original:"That is exactly what we need.",swapped:"That is why we need to act now.",swappedMeaning:"だからこそ今行動する必要があります"},
   scene:{en:"'That's' with linking sounds like 'thatis' or 'thaddis' in fast speech.",ja:"「ザリズ」と聞こえる。強調・補足説明でよく使われるTOEIC頻出表現。"},category:"短縮形"},
  {id:263,text:"what is it",katakana:"ワリジッ",meaning:"それは何ですか？",
   linkingParts:[{segment:"what_is",rule:"flap T + 母音",detail:"「t」→ら行「ワリズ」（flap）"},{segment:"is_it",rule:"母音+母音リンキング",detail:"「z」+「it」→「ジッ」"}],
   synonyms:[{text:"what's that",katakana:"ワッツザッ",meaning:"それは何？"},{text:"can you explain",katakana:"キャニュイクスプレイン",meaning:"説明してもらえますか？"}],
   swapExample:{original:"What is it you're looking for?",swapped:"What is it that's bothering you?",swappedMeaning:"何が気になっているんですか？"},
   scene:{en:"'What is it' in fast speech sounds like 'whadizit'. Common in problem-solving conversations.",ja:"「ワリジッ」と聞こえる速読みパターン。問題の本質を尋ねる場面でよく出る。"},category:"短縮形"},
  {id:264,text:"want you to",katakana:"ウォニュートゥ",meaning:"〜してほしい",
   linkingParts:[{segment:"want_you",rule:"弱形・縮約",detail:"「t」+「you」→「チュ」→「ウォンチュ」"},{segment:"you_to",rule:"母音+母音リンキング",detail:"「u」+「to」→「ユートゥ」"}],
   synonyms:[{text:"need you to",katakana:"ニージュートゥ",meaning:"〜してもらう必要がある"},{text:"ask you to",katakana:"アスキュートゥ",meaning:"〜するようお願いする"}],
   swapExample:{original:"I want you to handle this.",swapped:"I want you to take the lead on this project.",swappedMeaning:"このプロジェクトをリードしてほしいです"},
   scene:{en:"'Want you to' sounds like 'wantcha to' or 'woncha'. Constant in workplace instructions.",ja:"「ウォニュートゥ」と聞こえる。上司から部下への指示でほぼ毎回使われるパターン。"},category:"短縮形"},
  {id:265,text:"going on",katakana:"ゴウイングオン",meaning:"起きている・進行中",
   linkingParts:[{segment:"going_on",rule:"子音+母音リンキング",detail:"「ng」+「on」→「ングオン」"}],
   synonyms:[{text:"happening",katakana:"ハプニング",meaning:"起きている"},{text:"taking place",katakana:"テイキングプレイス",meaning:"進行中"}],
   swapExample:{original:"What's going on?",swapped:"What's going on with the shipment?",swappedMeaning:"荷物はどうなっていますか？"},
   scene:{en:"'What's going on' is one of the most common phrases in TOEIC Part 3 conversations.",ja:"「何が起きているの？」という状況確認。TOEICのPart3会話でほぼ毎回登場する。"},category:"短縮形"},

  // ── プレゼン 追加 ─────────────────────────────────────────
  {id:266,text:"drive it home",katakana:"ドライヴィホーム",meaning:"強調して印象づける",
   linkingParts:[{segment:"drive_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_home",rule:"flap T + 母音",detail:"「t」+「home」→「ホーム」"}],
   synonyms:[{text:"hammer it home",katakana:"ハマリホーム",meaning:"叩き込む"},{text:"emphasize it",katakana:"エンファサイジッ",meaning:"強調する"}],
   swapExample:{original:"I want to drive it home one more time.",swapped:"I want to drive home the key message before we close.",swappedMeaning:"締める前にキーメッセージを印象づけたいです"},
   scene:{en:"Used in presentations to reinforce the most important point before concluding.",ja:"プレゼンの締めで最重要ポイントを強く印象づける場面。締めのトーク技法として頻出。"},category:"プレゼン"},
  {id:267,text:"unpack it",katakana:"アンパキッ",meaning:"詳しく説明する・展開する",
   linkingParts:[{segment:"unpack_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"}],
   synonyms:[{text:"elaborate on it",katakana:"イラボレイロニッ",meaning:"詳しく述べる"},{text:"expand on it",katakana:"イクスパンドオニッ",meaning:"展開する"}],
   swapExample:{original:"Let me unpack it a bit more.",swapped:"Let me unpack it with a concrete example.",swappedMeaning:"具体例を使って詳しく説明させてください"},
   scene:{en:"Used when breaking down a complex idea into its components for clearer explanation.",ja:"複雑な概念を分解して丁寧に説明する場面。アカデミック・ビジネスプレゼンで頻出。"},category:"プレゼン"},
  {id:268,text:"illustrate it",katakana:"イラストレイリッ",meaning:"図示する・例で示す",
   linkingParts:[{segment:"illustrate_it",rule:"flap T + 母音",detail:"「t」→ら行「イラストレイリッ」"}],
   synonyms:[{text:"show it visually",katakana:"ショウイッヴィジュアリ",meaning:"視覚的に見せる"},{text:"demonstrate it",katakana:"デモンストレイリッ",meaning:"実演する"}],
   swapExample:{original:"Let me illustrate it with a chart.",swapped:"Let me illustrate it with a real-world example.",swappedMeaning:"実例で示させてください"},
   scene:{en:"Used when using visuals, charts, or examples to clarify a point in a presentation.",ja:"グラフや実例を使ってポイントを明確にするプレゼン技法の表現。"},category:"プレゼン"},
  {id:269,text:"reference it",katakana:"レファレンシッ",meaning:"参照する",
   linkingParts:[{segment:"reference_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"}],
   synonyms:[{text:"refer to it",katakana:"リファートゥイッ",meaning:"〜に言及する"},{text:"cite it",katakana:"サイリッ",meaning:"引用する"}],
   swapExample:{original:"I'll reference it in my report.",swapped:"I'll reference it on slide seven.",swappedMeaning:"スライド7で参照します"},
   scene:{en:"Used when directing audience attention to a specific source or slide during a presentation.",ja:"プレゼン中に特定のスライドや資料を参照させるときの表現。"},category:"プレゼン"},

  // ── 採用 追加 ─────────────────────────────────────────────
  {id:270,text:"narrow it down to",katakana:"ナロウイッダウントゥ",meaning:"〜に絞り込む",
   linkingParts:[{segment:"narrow_it",rule:"子音+母音リンキング",detail:"「w」+「it」→「ウィッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"},{segment:"down_to",rule:"子音+母音リンキング",detail:"「n」+「to」→「ントゥ」"}],
   synonyms:[{text:"shortlist to",katakana:"ショートリストトゥ",meaning:"〜に絞る"},{text:"filter down to",katakana:"フィルタダウントゥ",meaning:"〜にフィルタリングする"}],
   swapExample:{original:"We've narrowed it down to three candidates.",swapped:"We've narrowed it down to the final two.",swappedMeaning:"最終候補2名に絞りました"},
   scene:{en:"Used in hiring when reducing the candidate pool before final interviews.",ja:"採用選考で候補者を絞る場面。最終面接前のショートリスト作成でよく使われる。"},category:"採用"},
  {id:271,text:"onboard them",katakana:"オンボードゼム",meaning:"オンボーディングする",
   linkingParts:[{segment:"onboard_them",rule:"子音+母音リンキング",detail:"「d」+「them」→「ドゼム」"}],
   synonyms:[{text:"orient them",katakana:"オリエンリッゼム",meaning:"オリエンテーションする"},{text:"get them started",katakana:"ゲッゼムスターリッ",meaning:"スタートさせる"}],
   swapExample:{original:"We need to onboard them quickly.",swapped:"We need to onboard them before the project kicks off.",swappedMeaning:"プロジェクト開始前にオンボーディングする必要があります"},
   scene:{en:"Used in HR when integrating new employees into the organization.",ja:"新入社員を組織に統合するオンボーディングプロセスの場面。採用・HR部門で頻出。"},category:"採用"},

  // ── 研修 追加 ─────────────────────────────────────────────
  {id:272,text:"go over it again",katakana:"ゴウオウヴァリラゲン",meaning:"もう一度見直す",
   linkingParts:[{segment:"go_over",rule:"母音+母音リンキング",detail:"「o」+「over」→「オウオウヴァ」"},{segment:"over_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「ヴァリッ」"},{segment:"it_again",rule:"flap T + 母音",detail:"「t」+「again」→「ラゲン」"}],
   synonyms:[{text:"review it again",katakana:"リヴューイラゲン",meaning:"もう一度見直す"},{text:"run through it again",katakana:"ランスルーイラゲン",meaning:"もう一度確認する"}],
   swapExample:{original:"Let's go over it again together.",swapped:"Let's go over it again from the beginning.",swappedMeaning:"最初からもう一度一緒に確認しましょう"},
   scene:{en:"Used in training when repeating a process or lesson to reinforce understanding.",ja:"研修で理解を深めるためにもう一度繰り返す場面。学習・トレーニングの基本表現。"},category:"研修"},
  {id:273,text:"shadow them",katakana:"シャドウゼム",meaning:"先輩について学ぶ（OJT）",
   linkingParts:[{segment:"shadow_them",rule:"子音+母音リンキング",detail:"「w」+「them」→「ウゼム」"}],
   synonyms:[{text:"observe them",katakana:"オブザーヴゼム",meaning:"観察する"},{text:"follow their lead",katakana:"ファロウゼアリード",meaning:"先輩のやり方に倣う"}],
   swapExample:{original:"You'll shadow them for the first week.",swapped:"You'll shadow them until you feel confident.",swappedMeaning:"自信がつくまで先輩のそばで学んでください"},
   scene:{en:"Used in on-the-job training (OJT) when a new employee observes an experienced colleague.",ja:"新入社員が経験豊富な先輩の仕事ぶりを見ながら学ぶOJTの場面。研修・採用問題で出る。"},category:"研修"},

  // ── マーケティング 追加 ──────────────────────────────────
  {id:274,text:"build on it",katakana:"ビルドノニッ",meaning:"発展させる・土台にする",
   linkingParts:[{segment:"build_on",rule:"子音+母音リンキング",detail:"「d」+「on」→「ドノン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"expand on it",katakana:"イクスパンドノニッ",meaning:"拡張する"},{text:"leverage it",katakana:"レヴァリジッ",meaning:"活用する"}],
   swapExample:{original:"Let's build on what we have.",swapped:"Let's build on the momentum from last quarter.",swappedMeaning:"前四半期の勢いを活かして発展させましょう"},
   scene:{en:"Used in strategy discussions to leverage existing strengths or successes.",ja:"既存の強みや成功を基盤に発展させる戦略議論でよく使われる表現。"},category:"マーケティング"},
  {id:275,text:"position it as",katakana:"ポジショニラズ",meaning:"〜として位置づける",
   linkingParts:[{segment:"position_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_as",rule:"flap T + 母音",detail:"「t」+「as」→「ラズ」"}],
   synonyms:[{text:"brand it as",katakana:"ブランリラズ",meaning:"〜としてブランド化する"},{text:"market it as",katakana:"マーキリラズ",meaning:"〜として売り込む"}],
   swapExample:{original:"Let's position it as a premium product.",swapped:"Let's position it as an eco-friendly solution.",swappedMeaning:"環境にやさしいソリューションとして位置づけましょう"},
   scene:{en:"Used in marketing strategy when determining how to present a product to target consumers.",ja:"製品をターゲット顧客にどう見せるかのマーケティング戦略を決める場面でよく出る。"},category:"マーケティング"},
  {id:276,text:"leverage it",katakana:"レヴァリジッ",meaning:"活用する・てことにする",
   linkingParts:[{segment:"leverage_it",rule:"子音+母音リンキング",detail:"「j」+「it」→「ジッ」"}],
   synonyms:[{text:"capitalize on it",katakana:"キャピタライズノニッ",meaning:"〜を利用する"},{text:"make use of it",katakana:"メイクユーズオヴィッ",meaning:"活用する"}],
   swapExample:{original:"We should leverage it to grow faster.",swapped:"We should leverage our existing network.",swappedMeaning:"既存のネットワークを活用すべきです"},
   scene:{en:"Business buzzword for using an asset to maximum advantage. Extremely common in strategy meetings.",ja:"資産を最大限に活用するビジネス用語。戦略会議・マーケティングでほぼ毎回出てくる。"},category:"マーケティング"},

  // ── 施設 追加 ─────────────────────────────────────────────
  {id:277,text:"seal it off",katakana:"シーリロッフ",meaning:"封鎖する・閉鎖する",
   linkingParts:[{segment:"seal_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],
   synonyms:[{text:"block it off",katakana:"ブロキロッフ",meaning:"通行止めにする"},{text:"close it off",katakana:"クロウジロッフ",meaning:"閉鎖する"}],
   swapExample:{original:"We need to seal it off immediately.",swapped:"We need to seal it off for safety reasons.",swappedMeaning:"安全のため封鎖する必要があります"},
   scene:{en:"Used in facilities management or emergencies when restricting access to an area.",ja:"施設管理・緊急時にエリアへのアクセスを制限する場面。安全管理でよく出る。"},category:"施設"},
  {id:278,text:"book it out",katakana:"ブキラウッ",meaning:"予約で埋める・貸し切る",
   linkingParts:[{segment:"book_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"reserve it",katakana:"リザーヴィッ",meaning:"予約する"},{text:"hire it out",katakana:"ハイアリラウッ",meaning:"貸し出す"}],
   swapExample:{original:"We've booked it out for the conference.",swapped:"We've booked out the entire venue for the event.",swappedMeaning:"イベントのために会場全体を貸し切りました"},
   scene:{en:"Used when reserving a space or facility exclusively for an event.",ja:"会場を貸し切り予約する場面。ホテル・会議室・イベント施設の手配でよく出る。"},category:"施設"},

  // ── 医療 追加 ─────────────────────────────────────────────
  {id:279,text:"refer them to",katakana:"リファーゼムトゥ",meaning:"〜に紹介する（医療）",
   linkingParts:[{segment:"refer_them",rule:"子音+母音リンキング",detail:"「r」+「them」→「ゼム」"},{segment:"them_to",rule:"子音+母音リンキング",detail:"「m」+「to」→「ムトゥ」"}],
   synonyms:[{text:"send them to",katakana:"センゼムトゥ",meaning:"〜に送る"},{text:"recommend them to",katakana:"レコメンゼムトゥ",meaning:"〜を推薦する"}],
   swapExample:{original:"I'll refer them to a specialist.",swapped:"I'll refer them to the cardiology department.",swappedMeaning:"循環器科に紹介します"},
   scene:{en:"Used in medical contexts when directing a patient to a specialist or another facility.",ja:"患者を専門医や別の医療機関に紹介する場面。TOEICの医療・健康シーンで頻出。"},category:"医療"},
  {id:280,text:"get it checked out",katakana:"ゲリッチェックタウッ",meaning:"診てもらう",
   linkingParts:[{segment:"get_it",rule:"flap T + 母音",detail:"「t」→ら行「ゲリッ」"},{segment:"it_checked",rule:"flap T + 母音",detail:"「t」+「checked」→「チェックタウッ」"}],
   synonyms:[{text:"see a doctor about it",katakana:"スィーアドクターアバウリッ",meaning:"医者に診てもらう"},{text:"have it examined",katakana:"ハヴィリグザミンド",meaning:"検査してもらう"}],
   swapExample:{original:"You should get it checked out.",swapped:"You should get it checked out as soon as possible.",swappedMeaning:"できるだけ早く診てもらうべきです"},
   scene:{en:"Used when advising someone to seek medical attention for a health concern.",ja:"健康上の懸念について医師の診察を勧める場面。職場の健康管理・医療TOEICでよく出る。"},category:"医療"},

  // ── 環境 追加 ─────────────────────────────────────────────
  {id:281,text:"offset it with",katakana:"オフセリッウィズ",meaning:"〜で相殺する（環境）",
   linkingParts:[{segment:"offset_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_with",rule:"子音+子音",detail:"「t」+「w」→「ッウィズ」"}],
   synonyms:[{text:"compensate with",katakana:"コンペンセイトウィズ",meaning:"〜で補償する"},{text:"balance with",katakana:"バランスウィズ",meaning:"〜でバランスを取る"}],
   swapExample:{original:"We'll offset it with renewable energy credits.",swapped:"We can offset it with carbon credits.",swappedMeaning:"カーボンクレジットで相殺できます"},
   scene:{en:"Used in sustainability when compensating for emissions through credits or other actions.",ja:"CO2排出量をカーボンクレジット等で相殺する場面。ESG・カーボンニュートラルの文脈で頻出。"},category:"環境"},
  {id:282,text:"phase it in",katakana:"フェイジリン",meaning:"段階的に導入する",
   linkingParts:[{segment:"phase_it",rule:"子音+母音リンキング",detail:"「z」+「it」→「ジッ」"},{segment:"it_in",rule:"flap T + 母音",detail:"「t」+「in」→「リン」"}],
   synonyms:[{text:"roll it out gradually",katakana:"ロウリラウッグラジュアリ",meaning:"段階的に展開する"},{text:"introduce it step by step",katakana:"イントロデュースィッステップバイステップ",meaning:"ステップごとに導入する"}],
   swapExample:{original:"We'll phase it in over two years.",swapped:"We'll phase in the new policy gradually.",swappedMeaning:"新しいポリシーを段階的に導入します"},
   scene:{en:"Used when implementing changes or new systems gradually rather than all at once.",ja:"新制度・システムを一度に導入せず段階的に展開する場面。組織変革・環境政策でよく出る。"},category:"環境"},

  // ── 銀行 追加 ─────────────────────────────────────────────
  {id:283,text:"set it up automatically",katakana:"セリラップオートマティカリ",meaning:"自動設定する",
   linkingParts:[{segment:"set_it",rule:"flap T + 母音",detail:"「t」→ら行「セリッ」"},{segment:"it_up",rule:"子音+母音リンキング",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"automate it",katakana:"オートメイリッ",meaning:"自動化する"},{text:"put it on auto-pay",katakana:"プリロンオートペイ",meaning:"自動払いに設定する"}],
   swapExample:{original:"I'd like to set it up automatically.",swapped:"I'd like to set up automatic monthly payments.",swappedMeaning:"毎月の自動支払いを設定したいです"},
   scene:{en:"Used in banking when setting up automatic transfers or bill payments.",ja:"口座引き落とし・自動送金を設定する場面。銀行・保険・サブスクリプション契約で頻出。"},category:"銀行"},
  {id:284,text:"open it up",katakana:"オウプニラップ",meaning:"口座を開設する",
   linkingParts:[{segment:"open_it",rule:"母音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"open an account",katakana:"オウプナナカウン",meaning:"口座を開く"},{text:"start an account",katakana:"スターラナカウン",meaning:"口座を開始する"}],
   swapExample:{original:"I'd like to open it up today.",swapped:"I'd like to open up a savings account.",swappedMeaning:"普通預金口座を開設したいです"},
   scene:{en:"Used in banking when requesting to open a new account.",ja:"銀行で口座開設を申し込む場面。TOEICの銀行・金融シーンで頻出。"},category:"銀行"},

  // ── 汎用 追加 ─────────────────────────────────────────────
  {id:285,text:"think outside of it",katakana:"シンカウトサイドオヴィッ",meaning:"枠にとらわれず考える",
   linkingParts:[{segment:"think_outside",rule:"子音+母音リンキング",detail:"「k」+「out」→「カウッ」"},{segment:"outside_of",rule:"子音+母音リンキング",detail:"「d」+「of」→「ドオヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"think creatively",katakana:"シンククリエイティヴリ",meaning:"創造的に考える"},{text:"be innovative",katakana:"ビーイノヴェイティヴ",meaning:"革新的になる"}],
   swapExample:{original:"We need to think outside of it.",swapped:"We need to think outside of the box on this one.",swappedMeaning:"この問題は枠にとらわれずに考える必要があります"},
   scene:{en:"Based on 'think outside the box' — encouraging creative solutions beyond conventional approaches.",ja:"「型にはまらない発想」を促す表現。ブレインストーミング・イノベーション会議でよく出る。"},category:"汎用"},
  {id:286,text:"leave it at that",katakana:"リーヴィラザッ",meaning:"それで終わりにする",
   linkingParts:[{segment:"leave_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_at",rule:"flap T + 母音",detail:"「t」+「at」→「ラッ」"},{segment:"at_that",rule:"子音+母音リンキング",detail:"「t」+「that」→「ラザッ」"}],
   synonyms:[{text:"call it a day",katakana:"コーリラデイ",meaning:"今日はここまで"},{text:"stop there",katakana:"ストップデア",meaning:"そこで止める"}],
   swapExample:{original:"Let's leave it at that.",swapped:"I'll leave it at that for now.",swappedMeaning:"今はここまでにしておきます"},
   scene:{en:"Used to signal the end of a discussion or to avoid saying more than necessary.",ja:"議論を終わらせたり、必要以上に言わないようにする場面。会議の締めでよく使われる。"},category:"汎用"},
  {id:287,text:"keep at it",katakana:"キーパリッ",meaning:"めげずに続ける",
   linkingParts:[{segment:"keep_at",rule:"子音+母音リンキング",detail:"「p」+「at」→「パッ」"},{segment:"at_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"persist",katakana:"パーシスト",meaning:"粘り強く続ける"},{text:"stick with it",katakana:"スティックウィジッ",meaning:"続けてやり遂げる"}],
   swapExample:{original:"Keep at it and you'll get there.",swapped:"Keep at it — you're almost there.",swappedMeaning:"続けてください、もうすぐですよ"},
   scene:{en:"Encouragement to persist through difficulty. Common in coaching and feedback conversations.",ja:"困難の中で続けることを励ます表現。コーチング・業績評価でよく使われる。"},category:"汎用"},
  {id:288,text:"look at it this way",katakana:"ルカリッジスウェイ",meaning:"こう考えてみてください",
   linkingParts:[{segment:"look_at",rule:"子音+母音リンキング",detail:"「k」+「at」→「カッ」"},{segment:"at_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_this",rule:"子音+子音",detail:"「t」+「th」→「ッジス」"}],
   synonyms:[{text:"consider it this way",katakana:"コンシダリッジスウェイ",meaning:"こう考えると"},{text:"see it from this angle",katakana:"スィーイッフロムジスアングル",meaning:"この角度から見ると"}],
   swapExample:{original:"Look at it this way.",swapped:"Look at it this way — it's a learning opportunity.",swappedMeaning:"こう考えてみてください、これは学びの機会です"},
   scene:{en:"Used to offer a reframing perspective in a discussion or after a setback.",ja:"問題や失敗を別の視点から捉え直すよう促す場面。説得・コーチングでよく出る。"},category:"汎用"},
  {id:289,text:"let it slide",katakana:"レリッスライド",meaning:"見逃す・見過ごす",
   linkingParts:[{segment:"let_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"},{segment:"it_slide",rule:"子音+子音",detail:"「t」+「sl」→「ッスライド」"}],
   synonyms:[{text:"overlook it",katakana:"オウヴァルキッ",meaning:"見逃す"},{text:"let it go",katakana:"レリゴウ",meaning:"手放す"}],
   swapExample:{original:"I'll let it slide this time.",swapped:"I'll let it slide, but don't let it happen again.",swappedMeaning:"今回は見逃しますが、二度としないでください"},
   scene:{en:"Used when choosing not to address a minor mistake or rule violation.",ja:"小さなミスやルール違反を今回だけ見逃す場面。上司が部下に言う場面でよく出る。"},category:"汎用"},
  {id:290,text:"lay it on thick",katakana:"レイロンシック",meaning:"大げさに言う・おべっかを使う",
   linkingParts:[{segment:"lay_it",rule:"子音+母音リンキング",detail:"「y」+「it」→「イッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"},{segment:"on_thick",rule:"子音+子音",detail:"「n」+「th」→「ンシック」"}],
   synonyms:[{text:"overstate it",katakana:"オウヴァステイリッ",meaning:"誇張する"},{text:"be over the top",katakana:"ビーオウヴァザトップ",meaning:"大げさにする"}],
   swapExample:{original:"You're really laying it on thick.",swapped:"Don't lay it on too thick — keep it genuine.",swappedMeaning:"あまり大げさにしないで、誠実に話してください"},
   scene:{en:"Used when someone is exaggerating compliments or praise beyond what's natural.",ja:"お世辞や誉め言葉が度を越して不自然になっている場面で使う口語表現。"},category:"汎用"},
  {id:291,text:"jump on it",katakana:"ジャンポニッ",meaning:"すぐに飛びつく・即対応する",
   linkingParts:[{segment:"jump_on",rule:"子音+母音リンキング",detail:"「p」+「on」→「ポン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"act on it immediately",katakana:"アクロニッイミーディアトリ",meaning:"すぐに行動する"},{text:"pounce on it",katakana:"パウンソニッ",meaning:"飛びかかる"}],
   swapExample:{original:"We need to jump on it right away.",swapped:"Jump on it before the opportunity disappears.",swappedMeaning:"機会が消える前にすぐ行動してください"},
   scene:{en:"Used when urging someone to act quickly on an opportunity or urgent task.",ja:"チャンスや緊急タスクにすぐ飛びつくよう促す場面。営業・スピード感が求められる職場でよく出る。"},category:"汎用"},
  {id:292,text:"nail it",katakana:"ネイリッ",meaning:"完璧にやる・成功させる",
   linkingParts:[{segment:"nail_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"}],
   synonyms:[{text:"ace it",katakana:"エイシッ",meaning:"完璧にこなす"},{text:"hit it out of the park",katakana:"ヒリラウロヴザパーク",meaning:"大成功させる"}],
   swapExample:{original:"You're going to nail it.",swapped:"You nailed it — best presentation I've seen.",swappedMeaning:"完璧でした。今まで見た中で最高のプレゼンです"},
   scene:{en:"Used to express that someone performed perfectly. Common encouragement before and after performances.",ja:"完璧にやり遂げることの表現。発表・面接前の励ましや事後の称賛でよく使われる。"},category:"汎用"},
  {id:293,text:"wrap your head around it",katakana:"ラップユアヘダラウンリッ",meaning:"理解する・飲み込む",
   linkingParts:[{segment:"wrap_your",rule:"子音+母音リンキング",detail:"「p」+「your」→「ピュア」"},{segment:"head_around",rule:"子音+母音リンキング",detail:"「d」+「around」→「ダラウンド」"}],
   synonyms:[{text:"get your head around it",katakana:"ゲチュアヘダラウンリッ",meaning:"理解する"},{text:"make sense of it",katakana:"メイクセンスオヴィッ",meaning:"意味を理解する"}],
   swapExample:{original:"It's hard to wrap your head around it.",swapped:"Take your time wrapping your head around it.",swappedMeaning:"時間をかけて理解してください"},
   scene:{en:"Used when something is complex or counterintuitive and takes time to understand.",ja:"複雑で理解が難しいことを頭の中で整理する場面。新しいシステム・概念を学ぶ研修でよく出る。"},category:"汎用"},
  {id:294,text:"run with it",katakana:"ランウィジッ",meaning:"自分で進める・突き進む",
   linkingParts:[{segment:"run_with",rule:"子音+子音",detail:"「n」+「w」→「ンウィズ」"},{segment:"with_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"}],
   synonyms:[{text:"go ahead with it",katakana:"ゴウアヘッウィジッ",meaning:"進める"},{text:"take it and go",katakana:"テイキランゴウ",meaning:"持って進む"}],
   swapExample:{original:"Just run with it.",swapped:"You have my approval — just run with it.",swappedMeaning:"承認しました、自分で進めてください"},
   scene:{en:"Used when delegating authority to let someone proceed independently with a plan.",ja:"部下に自主的に進めるよう委任する場面。任せる系のリーダーシップでよく使われる。"},category:"汎用"},
  {id:295,text:"move it forward",katakana:"ムーヴィッフォーワッ",meaning:"前進させる・推進する",
   linkingParts:[{segment:"move_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_forward",rule:"子音+母音リンキング",detail:"「t」+「forward」→「ッフォーワッ」"}],
   synonyms:[{text:"advance it",katakana:"アドヴァンシッ",meaning:"前進させる"},{text:"push it ahead",katakana:"プシラヘッ",meaning:"前に進める"}],
   swapExample:{original:"Let's move it forward.",swapped:"Let's move it forward to the next stage.",swappedMeaning:"次のステージに前進させましょう"},
   scene:{en:"Used in project management when progressing to the next phase or stage.",ja:"プロジェクトを次のフェーズに進める場面。プロジェクト管理・戦略会議で頻出。"},category:"汎用"},
  {id:296,text:"tie it together",katakana:"タイリトゥギャザ",meaning:"まとめ上げる・統合する",
   linkingParts:[{segment:"tie_it",rule:"母音+母音リンキング",detail:"「e」+「it」→「イーイッ」"},{segment:"it_together",rule:"flap T + 母音",detail:"「t」+「together」→「トゥギャザ」"}],
   synonyms:[{text:"bring it all together",katakana:"ブリンギロールトゥギャザ",meaning:"全部まとめる"},{text:"integrate it",katakana:"インテグレイリッ",meaning:"統合する"}],
   swapExample:{original:"The conclusion should tie it together.",swapped:"Let me tie it together with a final summary.",swappedMeaning:"最後にまとめで統合させてください"},
   scene:{en:"Used at the end of a presentation or project to show how all parts connect.",ja:"プレゼン・プロジェクトの最後に全ての要素を統合する場面。締めくくりの表現として頻出。"},category:"汎用"},
  {id:297,text:"hold it together",katakana:"ホールリトゥギャザ",meaning:"まとまりを保つ・持ちこたえる",
   linkingParts:[{segment:"hold_it",rule:"子音+母音リンキング",detail:"「d」+「it」→「ディッ」（d弱化）"},{segment:"it_together",rule:"flap T + 母音",detail:"「t」+「together」→「トゥギャザ」"}],
   synonyms:[{text:"keep it together",katakana:"キーピトゥギャザ",meaning:"まとめを保つ"},{text:"stay cohesive",katakana:"ステイコウヒーシヴ",meaning:"まとまりを保つ"}],
   swapExample:{original:"We need to hold it together until the end.",swapped:"Hold it together — we're almost done.",swappedMeaning:"もう少しで終わります、踏ん張ってください"},
   scene:{en:"Used when encouraging a team to stay focused and united through a difficult period.",ja:"困難な時期にチームのまとまりを保つよう励ます場面。プロジェクト終盤・危機管理でよく出る。"},category:"汎用"},
  {id:298,text:"bounce it off",katakana:"バウンシロッフ",meaning:"意見を聞く・試しに言ってみる",
   linkingParts:[{segment:"bounce_it",rule:"子音+母音リンキング",detail:"「s」+「it」→「シッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"}],
   synonyms:[{text:"run it by",katakana:"ラニッバイ",meaning:"確認を取る"},{text:"get feedback on it",katakana:"ゲッフィードバックオニッ",meaning:"フィードバックをもらう"}],
   swapExample:{original:"Can I bounce it off you?",swapped:"Let me bounce it off you before the meeting.",swappedMeaning:"会議前にあなたの意見を聞かせてください"},
   scene:{en:"Used when seeking a quick, informal opinion on an idea before making it official.",ja:"アイデアを正式にする前に非公式に意見を聞く場面。ブレスト・アイデア検討でよく使われる。"},category:"汎用"},
  {id:299,text:"hold off on it",katakana:"ホールドッフォニッ",meaning:"〜を控える・待つ",
   linkingParts:[{segment:"hold_off",rule:"子音+母音リンキング",detail:"「d」+「off」→「ドッフ」"},{segment:"off_on",rule:"子音+母音リンキング",detail:"「f」+「on」→「フォン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"wait on it",katakana:"ウェイロニッ",meaning:"待機する"},{text:"delay it",katakana:"ディレイイッ",meaning:"遅らせる"}],
   swapExample:{original:"Hold off on it until we hear back.",swapped:"Hold off on signing until legal reviews it.",swappedMeaning:"法務がレビューするまでサインを控えてください"},
   scene:{en:"Used when postponing an action until more information or approval is received.",ja:"承認や情報を待ってから行動するよう指示する場面。意思決定プロセスでよく出る。"},category:"汎用"},
  {id:300,text:"make it count",katakana:"メイキッカウン",meaning:"有意義にする・無駄にしない",
   linkingParts:[{segment:"make_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_count",rule:"flap T + 母音",detail:"「t」+「count」→「カウン」"}],
   synonyms:[{text:"make it matter",katakana:"メイキッマラ",meaning:"意味のあるものにする"},{text:"make it worthwhile",katakana:"メイキッワースワイル",meaning:"価値あるものにする"}],
   swapExample:{original:"Let's make it count.",swapped:"We only have one shot — let's make it count.",swappedMeaning:"チャンスは一度だけ、有意義にしましょう"},
   scene:{en:"Used to encourage full commitment and quality effort, especially in one-time opportunities.",ja:"一度きりのチャンスや重要な場面で「全力を尽くそう」と励ます表現。"},category:"汎用"},
,

  // ══ 追加バッチ 301-420 ══════════════════════════════════

  // ── 短縮形 完全版 ────────────────────────────────────────
  {id:301,text:"used to",katakana:"ユーストゥ",meaning:"かつて〜だった",
   linkingParts:[{segment:"used_to",rule:"弱形・縮約",detail:"「d」+「to」→「ストゥ」（d弱化・連結）"}],
   synonyms:[{text:"would often",katakana:"ウドオフン",meaning:"よく〜したものだ"},{text:"in the past",katakana:"インザパスト",meaning:"かつては"}],
   swapExample:{original:"We used to do it differently.",swapped:"We used to meet every Monday.",swappedMeaning:"以前は毎週月曜に会議をしていました"},
   scene:{en:"Describes past habits or states that no longer exist. Sounds like 'yoosta' in fast speech.",ja:"「ユーストゥ」が「ユースタ」に聞こえる。過去の習慣を表しTOEICの職場変化の話題でよく出る。"},category:"短縮形"},
  {id:302,text:"supposed to",katakana:"サポーストゥ",meaning:"〜するはずだった・〜することになっている",
   linkingParts:[{segment:"supposed_to",rule:"弱形・縮約",detail:"「d」+「to」→「ストゥ」（d弱化）"}],
   synonyms:[{text:"expected to",katakana:"イクスペクティッ",meaning:"〜と予想される"},{text:"meant to",katakana:"メントゥ",meaning:"〜するつもりだった"}],
   swapExample:{original:"It's supposed to arrive today.",swapped:"The report is supposed to be on my desk by noon.",swappedMeaning:"レポートは正午までに届くはずです"},
   scene:{en:"'Supposed to' sounds like 'sposta' in fast speech. Used for expectations and obligations.",ja:"「スポスタ」と聞こえる。予定・期待・義務を表しTOEICの業務指示場面で頻出。"},category:"短縮形"},
  {id:303,text:"sort of",katakana:"ソーロヴ",meaning:"ある意味・どちらかというと（sorta）",
   linkingParts:[{segment:"sort_of",rule:"弱形・縮約",detail:"「t」+「of」→「ロヴ」（flap+弱化）"}],
   synonyms:[{text:"kind of",katakana:"カインダ",meaning:"ある意味（kinda）"},{text:"somewhat",katakana:"サムワッ",meaning:"やや"}],
   swapExample:{original:"It's sort of complicated.",swapped:"It's sort of what I expected.",swappedMeaning:"ある意味予想通りでした"},
   scene:{en:"'Sorta' softens statements. Interchangeable with 'kinda'. Very common in casual meetings.",ja:"「ソーラ」と聞こえる。「kinda」と同様に断言を和らげる表現。カジュアルな会話で多用される。"},category:"短縮形"},
  {id:304,text:"a bit of",katakana:"アビロヴ",meaning:"少しの〜",
   linkingParts:[{segment:"a_bit",rule:"母音+子音リンキング",detail:"「a」+「bit」→「アビッ」"},{segment:"bit_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"}],
   synonyms:[{text:"a little",katakana:"アリトル",meaning:"少し"},{text:"somewhat",katakana:"サムワッ",meaning:"多少"}],
   swapExample:{original:"It's a bit of a challenge.",swapped:"It's a bit of a surprise, to be honest.",swappedMeaning:"正直なところ、少し驚きです"},
   scene:{en:"'A bit of' links into 'abitov'. Used to soften statements in professional settings.",ja:"「アビロヴ」と聞こえる。状況を柔らかく表現するときに使う。TOEICの日常会話場面で頻出。"},category:"短縮形"},
  {id:305,text:"one of them",katakana:"ワノヴェム",meaning:"そのうちの一つ",
   linkingParts:[{segment:"one_of",rule:"子音+母音リンキング",detail:"「n」+「of」→「ノヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"one of those",katakana:"ワノヴゾウズ",meaning:"そのようなもの"},{text:"any of them",katakana:"エニオヴェム",meaning:"そのうちのどれか"}],
   swapExample:{original:"It's one of them.",swapped:"One of them will need to present tomorrow.",swappedMeaning:"そのうちの一人が明日発表する必要があります"},
   scene:{en:"'One of them' links into 'wunuvem'. Very common when referring to items or people in a group.",ja:"「ワノヴェム」と聞こえる。グループの中の一つ・一人を指すときに頻繁に使われる。"},category:"短縮形"},
  {id:306,text:"some of it",katakana:"サモヴィッ",meaning:"その一部は",
   linkingParts:[{segment:"some_of",rule:"子音+母音リンキング",detail:"「m」+「of」→「モヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"part of it",katakana:"パーロヴィッ",meaning:"その一部"},{text:"a portion of it",katakana:"アポーションオヴィッ",meaning:"その割合"}],
   swapExample:{original:"Some of it is still unclear.",swapped:"Some of it will need to be revised.",swappedMeaning:"その一部は修正が必要です"},
   scene:{en:"'Some of it' links into 'sumovit'. Used constantly when discussing partial information or tasks.",ja:"「サモヴィッ」と聞こえる。部分的な情報やタスクを話すときに頻繁に使われる。"},category:"短縮形"},
  {id:307,text:"most of it",katakana:"モウストオヴィッ",meaning:"その大半は",
   linkingParts:[{segment:"most_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"the majority of it",katakana:"ザマジョリティオヴィッ",meaning:"その大部分"},{text:"nearly all of it",katakana:"ニアリオーロヴィッ",meaning:"ほぼ全部"}],
   swapExample:{original:"Most of it is done.",swapped:"Most of it has been approved already.",swappedMeaning:"その大半はすでに承認されています"},
   scene:{en:"'Most of it' with flap T sounds like 'mosovit'. Used in progress reports and data analysis.",ja:"「モウストオヴィッ」が速いと「モソヴィッ」に聞こえる。進捗報告・データ分析で頻出。"},category:"短縮形"},
  {id:308,text:"none of it",katakana:"ナノヴィッ",meaning:"そのどれも〜ない",
   linkingParts:[{segment:"none_of",rule:"子音+母音リンキング",detail:"「n」+「of」→「ノヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"not any of it",katakana:"ノタニオヴィッ",meaning:"何一つ〜ない"},{text:"nothing",katakana:"ナシング",meaning:"何もない"}],
   swapExample:{original:"None of it makes sense.",swapped:"None of it has been confirmed yet.",swappedMeaning:"そのどれもまだ確認されていません"},
   scene:{en:"'None of it' links into 'nunovit'. Used to negate all items in a set.",ja:"「ナノヴィッ」と聞こえる。全否定の場面でよく使われ、TOEICの問題・クレーム場面で出る。"},category:"短縮形"},
  {id:309,text:"all of it",katakana:"オーロヴィッ",meaning:"その全部",
   linkingParts:[{segment:"all_of",rule:"子音+母音リンキング",detail:"「l」+「of」→「ロヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"the whole thing",katakana:"ザホウルシング",meaning:"全体"},{text:"everything",katakana:"エヴリシング",meaning:"全て"}],
   swapExample:{original:"We reviewed all of it.",swapped:"All of it needs to be redone.",swappedMeaning:"全部やり直す必要があります"},
   scene:{en:"'All of it' links into 'allovit'. One of the most frequent quantifier phrases in TOEIC.",ja:"「オーロヴィッ」と聞こえる。数量表現の中でTOEICで最も頻繁に登場するパターンの一つ。"},category:"短縮形"},
  {id:310,text:"as long as",katakana:"アズロングアズ",meaning:"〜である限り・〜さえすれば",
   linkingParts:[{segment:"as_long",rule:"子音+母音リンキング",detail:"「z」+「long」→「ズロング」"},{segment:"long_as",rule:"子音+母音リンキング",detail:"「ng」+「as」→「ングアズ」"}],
   synonyms:[{text:"provided that",katakana:"プロヴァイデッザッ",meaning:"〜という条件で"},{text:"on the condition that",katakana:"オンザコンディションザッ",meaning:"〜の条件で"}],
   swapExample:{original:"As long as it's within budget.",swapped:"As long as it meets the deadline, we're good.",swappedMeaning:"締め切りに間に合う限り問題ありません"},
   scene:{en:"Conditional phrase extremely common in TOEIC contracts and negotiations.",ja:"「〜さえすれば」という条件を表す。TOEICの契約・交渉場面でほぼ必ず出てくる。"},category:"短縮形"},
  {id:311,text:"as soon as",katakana:"アズスーナズ",meaning:"〜したらすぐに",
   linkingParts:[{segment:"as_soon",rule:"子音+母音リンキング",detail:"「z」+「soon」→「ズスーン」"},{segment:"soon_as",rule:"子音+母音リンキング",detail:"「n」+「as」→「ナズ」"}],
   synonyms:[{text:"the moment",katakana:"ザモウメン",meaning:"〜した瞬間"},{text:"right after",katakana:"ライタフタ",meaning:"〜した直後"}],
   swapExample:{original:"As soon as it's ready, send it.",swapped:"As soon as it arrives, let me know.",swappedMeaning:"届いたらすぐに知らせてください"},
   scene:{en:"'As soon as' is one of the most common time expressions in TOEIC. Links into 'azsoonaz'.",ja:"「アズスーナズ」が速いと「アズスナズ」に聞こえる。TOEICで最頻出の時間表現の一つ。"},category:"短縮形"},
  {id:312,text:"even if",katakana:"イーヴニフ",meaning:"たとえ〜でも",
   linkingParts:[{segment:"even_if",rule:"母音+母音リンキング",detail:"「n」+「if」→「ニフ」（even if→イーヴニフ）"}],
   synonyms:[{text:"regardless of",katakana:"リガードレスオヴ",meaning:"〜に関わらず"},{text:"whether or not",katakana:"ウェザーオーノッ",meaning:"〜かどうかに関わらず"}],
   swapExample:{original:"Even if it's difficult, we'll manage.",swapped:"Even if it takes longer, do it right.",swappedMeaning:"時間がかかっても正しくやってください"},
   scene:{en:"'Even if' links into 'evenif' — one word. Very common in negotiations and problem-solving.",ja:"「イーヴニフ」が一語のように聞こえる。条件・譲歩を表し交渉・問題解決場面で頻出。"},category:"短縮形"},
  {id:313,text:"in case of",katakana:"インケイスオヴ",meaning:"〜の場合は",
   linkingParts:[{segment:"in_case",rule:"母音+子音リンキング",detail:"「n」+「case」→「ンケイス」"},{segment:"case_of",rule:"子音+母音リンキング",detail:"「s」+「of」→「ソヴ」"}],
   synonyms:[{text:"if there is",katakana:"イフゼアリズ",meaning:"〜がある場合"},{text:"should there be",katakana:"シュドゼアビー",meaning:"〜があれば"}],
   swapExample:{original:"In case of emergency, call this number.",swapped:"In case of delays, please notify us.",swappedMeaning:"遅延が生じた場合はご連絡ください"},
   scene:{en:"Used in instructions, contracts, and emergency procedures. Very common in TOEIC notices.",ja:"緊急時・遅延時の対処手順を示す場面。TOEICのお知らせ・契約書問題で必ず出てくる。"},category:"短縮形"},
  {id:314,text:"as of",katakana:"アゾヴ",meaning:"〜時点で・〜付けで",
   linkingParts:[{segment:"as_of",rule:"子音+母音リンキング",detail:"「z」+「of」→「ゾヴ」"}],
   synonyms:[{text:"effective",katakana:"イフェクティヴ",meaning:"〜から有効"},{text:"starting from",katakana:"スターティングフロム",meaning:"〜から"}],
   swapExample:{original:"As of today, the policy changes.",swapped:"As of next Monday, the new system goes live.",swappedMeaning:"来週月曜日から新システムが稼働します"},
   scene:{en:"Used in announcements and memos to indicate an effective date. Very common in TOEIC Part 7.",ja:"規則・システム変更の発効日を示す場面。TOEICのお知らせ・社内メモで頻出。"},category:"短縮形"},
  {id:315,text:"due to",katakana:"デュートゥ",meaning:"〜のために・〜が原因で",
   linkingParts:[{segment:"due_to",rule:"子音+母音リンキング",detail:"「u」+「to」→「ュートゥ」（due to→デュートゥ）"}],
   synonyms:[{text:"because of",katakana:"ビコーゾヴ",meaning:"〜のために"},{text:"owing to",katakana:"オウイングトゥ",meaning:"〜のために"}],
   swapExample:{original:"Due to the weather, it was cancelled.",swapped:"Due to high demand, it's sold out.",swappedMeaning:"需要が高いため売り切れです"},
   scene:{en:"One of the most common cause-and-effect phrases in TOEIC. Appears in nearly every test.",ja:"原因・理由を示す最頻出フレーズの一つ。TOEICではほぼ毎回登場する必須表現。"},category:"短縮形"},

  // ── 会議 完全版 ──────────────────────────────────────────
  {id:316,text:"bring it to a close",katakana:"ブリンギットゥアクロウズ",meaning:"締めくくる",
   linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"},{segment:"to_a",rule:"子音+母音リンキング",detail:"「to」+「a」→「トゥア」"}],
   synonyms:[{text:"wrap it up",katakana:"ラッピラップ",meaning:"まとめる"},{text:"conclude it",katakana:"コンクルードィッ",meaning:"締めくくる"}],
   swapExample:{original:"Let's bring it to a close.",swapped:"I'd like to bring it to a close before three.",swappedMeaning:"3時前に締めくくりたいです"},
   scene:{en:"Formal way to end a meeting or session. Common in board meetings and formal presentations.",ja:"会議や発表の正式な締めくくり。取締役会・公式プレゼンの終了宣言でよく使われる。"},category:"会議"},
  {id:317,text:"open the floor",katakana:"オウプンザフロア",meaning:"質疑応答・討議を開く",
   linkingParts:[{segment:"open_the",rule:"母音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_floor",rule:"子音+母音リンキング",detail:"「e」+「floor」→「ザフロア」"}],
   synonyms:[{text:"take questions",katakana:"テイククウェスチョンズ",meaning:"質問を受ける"},{text:"invite discussion",katakana:"インヴァイトディスカッション",meaning:"討議を促す"}],
   swapExample:{original:"I'd like to open the floor to questions.",swapped:"Let's open the floor to the whole team.",swappedMeaning:"チーム全体に意見を求めたいと思います"},
   scene:{en:"Said by a presenter or moderator at the end of a speech to invite audience participation.",ja:"発表・講演の最後に聴衆からの質問・意見を募る場面。TOEICのプレゼン場面で頻出。"},category:"会議"},
  {id:318,text:"move to the next item",katakana:"ムーヴトゥザネクストアイテム",meaning:"次の議題に移る",
   linkingParts:[{segment:"move_to",rule:"子音+母音リンキング",detail:"「v」+「to」→「ヴトゥ」"},{segment:"to_the",rule:"子音+母音リンキング",detail:"「o」+「the」→「トゥザ」"}],
   synonyms:[{text:"go to the next point",katakana:"ゴウトゥザネクストポイン",meaning:"次のポイントへ"},{text:"proceed to",katakana:"プロシードトゥ",meaning:"〜に進む"}],
   swapExample:{original:"Let's move to the next item.",swapped:"Let's move to the next item on the agenda.",swappedMeaning:"議題の次の項目に移りましょう"},
   scene:{en:"Standard meeting facilitation phrase. Used constantly in formal and informal meetings.",ja:"会議進行の定番フレーズ。正式・非公式を問わず全ての会議で使われる。"},category:"会議"},
  {id:319,text:"any objections",katakana:"エニオブジェクションズ",meaning:"異議はありますか？",
   linkingParts:[{segment:"any_objections",rule:"母音+母音リンキング",detail:"「y」+「obj」→「ニオブ」"}],
   synonyms:[{text:"any concerns",katakana:"エニコンサーンズ",meaning:"懸念はありますか？"},{text:"does anyone disagree",katakana:"ダズエニワンディサグリー",meaning:"反対者はいますか？"}],
   swapExample:{original:"Any objections?",swapped:"Any objections before we vote?",swappedMeaning:"採決前に異議はありますか？"},
   scene:{en:"Used in formal meetings before making a decision to check for dissent.",ja:"意思決定前に異議を確認する場面。取締役会・委員会でよく使われる正式表現。"},category:"会議"},
  {id:320,text:"agenda item",katakana:"アジェンダアイテム",meaning:"議題の項目",
   linkingParts:[{segment:"agenda_item",rule:"母音+母音リンキング",detail:"「a」+「item」→「アアイテム」"}],
   synonyms:[{text:"discussion point",katakana:"ディスカッションポイン",meaning:"討議点"},{text:"topic",katakana:"トピック",meaning:"議題"}],
   swapExample:{original:"The first agenda item is the budget.",swapped:"Let's move to the next agenda item.",swappedMeaning:"次の議題項目に移りましょう"},
   scene:{en:"Core vocabulary for meeting management. Appears in almost every TOEIC meeting dialogue.",ja:"会議管理の基本語。TOEICの会議場面ではほぼ毎回登場する必須語。"},category:"会議"},

  // ── ビジネス定型 完全版 ──────────────────────────────────
  {id:321,text:"on the back burner",katakana:"オンザバックバーナ",meaning:"後回しにする",
   linkingParts:[{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"back_burner",rule:"子音+子音",detail:"「k」+「b」→「ックバーナ」"}],
   synonyms:[{text:"on hold",katakana:"オンホールド",meaning:"保留中"},{text:"shelved",katakana:"シェルヴド",meaning:"棚上げ"}],
   swapExample:{original:"Let's put it on the back burner.",swapped:"The expansion plan is on the back burner for now.",swappedMeaning:"拡張計画は今のところ後回しです"},
   scene:{en:"Idiom for deprioritizing something. Very common in strategy and budget discussions.",ja:"低優先度にする慣用句。戦略・予算会議で「今は優先しない」という場面によく出る。"},category:"ビジネス定型"},
  {id:322,text:"take it to the next level",katakana:"テイキットゥザネクストレヴェル",meaning:"次のレベルに引き上げる",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_to",rule:"flap T + 母音",detail:"「t」+「to」→「トゥ」"}],
   synonyms:[{text:"elevate it",katakana:"エレヴェイリッ",meaning:"高める"},{text:"step it up",katakana:"ステピラップ",meaning:"ギアを上げる"}],
   swapExample:{original:"It's time to take it to the next level.",swapped:"We need to take our service to the next level.",swappedMeaning:"サービスを次のレベルに引き上げる必要があります"},
   scene:{en:"Used when pushing for higher performance or expanding a successful initiative.",ja:"成功した取り組みをさらに発展させる場面。経営会議・営業戦略でよく使われる。"},category:"ビジネス定型"},
  {id:323,text:"get it off the ground",katakana:"ゲリロッフザグラウンド",meaning:"立ち上げる・軌道に乗せる",
   linkingParts:[{segment:"get_it",rule:"flap T + 母音",detail:"「t」→ら行「ゲリッ」"},{segment:"it_off",rule:"flap T + 母音",detail:"「t」+「off」→「ロッフ」"},{segment:"off_the",rule:"子音+母音リンキング",detail:"「f」+「the」→「フザ」"}],
   synonyms:[{text:"launch it",katakana:"ローンチィッ",meaning:"ローンチする"},{text:"kick it off",katakana:"キキロッフ",meaning:"開始する"}],
   swapExample:{original:"We need help to get it off the ground.",swapped:"Once we get it off the ground, it'll run itself.",swappedMeaning:"軌道に乗せれば後は自動的に動きます"},
   scene:{en:"Used when starting a new project or business and getting it running.",ja:"新プロジェクト・新事業を立ち上げて軌道に乗せる場面。スタートアップ・新規事業でよく出る。"},category:"ビジネス定型"},
  {id:324,text:"get it across",katakana:"ゲリラクロス",meaning:"伝える・理解させる",
   linkingParts:[{segment:"get_it",rule:"flap T + 母音",detail:"「t」→ら行「ゲリッ」"},{segment:"it_across",rule:"flap T + 母音",detail:"「t」+「across」→「ラクロス」"}],
   synonyms:[{text:"make it clear",katakana:"メイキックリア",meaning:"明確にする"},{text:"convey it",katakana:"コンヴェイイッ",meaning:"伝える"}],
   swapExample:{original:"I'm struggling to get it across.",swapped:"How do I get it across to the whole team?",swappedMeaning:"どうすればチーム全体に伝わりますか？"},
   scene:{en:"Used when having difficulty communicating a message effectively.",ja:"メッセージがうまく伝わらないときの表現。コミュニケーション・プレゼン改善の場面で頻出。"},category:"ビジネス定型"},
  {id:325,text:"speak to it",katakana:"スピークトゥイッ",meaning:"〜について説明する",
   linkingParts:[{segment:"speak_to",rule:"子音+母音リンキング",detail:"「k」+「to」→「クトゥ」"},{segment:"to_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「トゥイッ」"}],
   synonyms:[{text:"address it",katakana:"アドレシッ",meaning:"取り上げる"},{text:"comment on it",katakana:"コメントノニッ",meaning:"コメントする"}],
   swapExample:{original:"Can you speak to it?",swapped:"Can you speak to the data on slide five?",swappedMeaning:"スライド5のデータについて説明してもらえますか？"},
   scene:{en:"Formal phrase asking someone to address or explain a specific point.",ja:"特定のポイントについて説明を求める正式な表現。プレゼン・会議でよく使われる。"},category:"ビジネス定型"},
  {id:326,text:"in the loop",katakana:"インザループ",meaning:"情報を共有されている状態",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_loop",rule:"子音+母音リンキング",detail:"「e」+「loop」→「ザループ」"}],
   synonyms:[{text:"in the know",katakana:"インザノウ",meaning:"情報を持っている"},{text:"up to date",katakana:"アップトゥデイト",meaning:"最新情報を持っている"}],
   swapExample:{original:"Keep me in the loop.",swapped:"Is everyone in the loop on the changes?",swappedMeaning:"変更について全員に共有されていますか？"},
   scene:{en:"Used to describe being informed about ongoing developments. Common in project management.",ja:"「情報共有されている状態」を表す定番表現。プロジェクト管理・チームコミュニケーションで毎日使われる。"},category:"ビジネス定型"},
  {id:327,text:"out of the loop",katakana:"アウロヴザループ",meaning:"情報共有されていない",
   linkingParts:[{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_the",rule:"子音+母音リンキング",detail:"「v」+「the」→「ヴザ」"},{segment:"the_loop",rule:"子音+母音リンキング",detail:"「e」+「loop」→「ザループ」"}],
   synonyms:[{text:"not informed",katakana:"ノットインフォームド",meaning:"知らされていない"},{text:"left out",katakana:"レフタウッ",meaning:"除外されている"}],
   swapExample:{original:"I've been out of the loop.",swapped:"Sorry, I've been out of the loop — fill me in.",swappedMeaning:"すみません、情報が届いていないので教えてください"},
   scene:{en:"Said when you haven't received updates and need to be brought up to speed.",ja:"情報が届いていないときの表現。「loop me in」のセットで覚えておきたい必須フレーズ。"},category:"ビジネス定型"},
  {id:328,text:"on the same wavelength",katakana:"オンザセイムウェイヴレングス",meaning:"考え方が合っている",
   linkingParts:[{segment:"on_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"same_wavelength",rule:"子音+母音リンキング",detail:"「m」+「wave」→「ムウェイヴ」"}],
   synonyms:[{text:"on the same page",katakana:"オンザセイムペイジ",meaning:"認識が一致"},{text:"aligned",katakana:"アラインド",meaning:"一致している"}],
   swapExample:{original:"We're on the same wavelength.",swapped:"I think we're finally on the same wavelength.",swappedMeaning:"ようやく意見が一致したと思います"},
   scene:{en:"Used when two people share the same understanding or approach to a problem.",ja:"二人の考え方や感覚が一致している場面。チームワーク・交渉での合意形成でよく使われる。"},category:"ビジネス定型"},

  // ── 電話 完全版 ──────────────────────────────────────────
  {id:329,text:"return a call",katakana:"リターナコール",meaning:"折り返し電話する",
   linkingParts:[{segment:"return_a",rule:"子音+母音リンキング",detail:"「n」+「a」→「ナ」"},{segment:"a_call",rule:"母音+子音リンキング",detail:"「a」+「call」→「アコール」"}],
   synonyms:[{text:"call back",katakana:"コールバック",meaning:"折り返す"},{text:"get back to them",katakana:"ゲッバックトゥゼム",meaning:"折り返し連絡する"}],
   swapExample:{original:"I'll return a call in an hour.",swapped:"Can you return a call to Mr. Kim?",swappedMeaning:"キム様に折り返し電話してもらえますか？"},
   scene:{en:"Standard receptionist/secretary phrase for returning missed calls.",ja:"不在着信への折り返しを依頼・約束する場面。受付・秘書業務でよく使われる。"},category:"電話"},
  {id:330,text:"conference them in",katakana:"カンファランスゼミン",meaning:"電話会議に加える",
   linkingParts:[{segment:"conference_them",rule:"子音+母音リンキング",detail:"「s」+「them」→「スゼム」"},{segment:"them_in",rule:"子音+母音リンキング",detail:"「m」+「in」→「ミン」"}],
   synonyms:[{text:"add them to the call",katakana:"アッゼムトゥザコール",meaning:"通話に追加する"},{text:"bring them on",katakana:"ブリンゲムオン",meaning:"参加させる"}],
   swapExample:{original:"Let me conference them in.",swapped:"Can you conference the Tokyo office in?",swappedMeaning:"東京オフィスを電話会議に加えてもらえますか？"},
   scene:{en:"Used in conference calls when adding another party to an ongoing call.",ja:"進行中の電話会議に別の参加者を追加する場面。国際会議・多拠点会議でよく使われる。"},category:"電話"},
  {id:331,text:"drop the call",katakana:"ドロップザコール",meaning:"電話が切れる",
   linkingParts:[{segment:"drop_the",rule:"子音+母音リンキング",detail:"「p」+「the」→「プザ」"},{segment:"the_call",rule:"子音+子音",detail:"「e」+「call」→「ザコール」"}],
   synonyms:[{text:"lose the connection",katakana:"ルーズザコネクション",meaning:"接続が切れる"},{text:"get cut off",katakana:"ゲッカロッフ",meaning:"切断される"}],
   swapExample:{original:"Sorry, I dropped the call.",swapped:"I think we're going to drop the call — the signal is weak.",swappedMeaning:"信号が弱くて電話が切れそうです"},
   scene:{en:"Used when a phone connection is lost unintentionally during a call.",ja:"通話中に接続が切れる場面。リモートワーク・国際電話でよく起こる状況。"},category:"電話"},
  {id:332,text:"put it through to voicemail",katakana:"プリッスルートゥヴォイスメイル",meaning:"留守電に回す",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"send to voicemail",katakana:"センドトゥヴォイスメイル",meaning:"留守電に転送"},{text:"let it go to voicemail",katakana:"レリゴウトゥヴォイスメイル",meaning:"留守電にする"}],
   swapExample:{original:"Should I put it through to voicemail?",swapped:"Put it through to voicemail — I'm in a meeting.",swappedMeaning:"会議中なので留守電に回してください"},
   scene:{en:"Used by receptionists when the recipient is unavailable to take a call.",ja:"担当者が電話に出られないときに留守電に回す場面。受付・秘書業務で必須の表現。"},category:"電話"},

  // ── 旅行 完全版 ──────────────────────────────────────────
  {id:333,text:"check in early",katakana:"チェキニーアーリー",meaning:"早めにチェックインする",
   linkingParts:[{segment:"check_in",rule:"子音+母音リンキング",detail:"「k」+「in」→「キン」"},{segment:"in_early",rule:"母音+母音リンキング",detail:"「n」+「early」→「ニーアーリー」"}],
   synonyms:[{text:"arrive early",katakana:"アライヴアーリー",meaning:"早めに到着する"},{text:"get there ahead of time",katakana:"ゲッゼアアヘドオヴタイム",meaning:"時間前に到着する"}],
   swapExample:{original:"I'd like to check in early if possible.",swapped:"Can we check in early? Our flight arrives at noon.",swappedMeaning:"フライトが正午に着くので早めにチェックインできますか？"},
   scene:{en:"Used at hotels when requesting early check-in before the standard check-in time.",ja:"通常チェックイン時間前の早期チェックインを依頼する場面。ホテル・旅行TOEICシーンで頻出。"},category:"旅行"},
  {id:334,text:"extend the stay",katakana:"イクステンドザステイ",meaning:"滞在を延長する",
   linkingParts:[{segment:"extend_the",rule:"子音+母音リンキング",detail:"「d」+「the」→「ドザ」"},{segment:"the_stay",rule:"子音+子音",detail:"「e」+「stay」→「ザステイ」"}],
   synonyms:[{text:"stay longer",katakana:"ステイロンガ",meaning:"長く滞在する"},{text:"prolong the visit",katakana:"プロロングザヴィジット",meaning:"訪問を延ばす"}],
   swapExample:{original:"I'd like to extend the stay by one night.",swapped:"Is it possible to extend the stay through Sunday?",swappedMeaning:"日曜日まで滞在を延長することはできますか？"},
   scene:{en:"Used at hotels or during business trips when extending accommodation.",ja:"ホテル・出張での滞在延長を依頼する場面。TOEICの旅行・ホテル問題で頻出。"},category:"旅行"},
  {id:335,text:"upgrade it",katakana:"アップグレイリッ",meaning:"アップグレードする",
   linkingParts:[{segment:"upgrade_it",rule:"flap T + 母音",detail:"「t」→ら行「アップグレイリッ」"}],
   synonyms:[{text:"move up to",katakana:"ムーヴアップトゥ",meaning:"上のランクに移る"},{text:"get a better one",katakana:"ゲラベラワン",meaning:"より良いものにする"}],
   swapExample:{original:"Can you upgrade it to business class?",swapped:"Is there any way to upgrade it to a suite?",swappedMeaning:"スイートルームにアップグレードできますか？"},
   scene:{en:"Used when requesting a better room, seat, or service level.",ja:"ホテルの部屋や飛行機の座席をより良いランクに変更する場面。旅行・出張でよく出る。"},category:"旅行"},
  {id:336,text:"make a reservation",katakana:"メイカレザヴェイション",meaning:"予約する",
   linkingParts:[{segment:"make_a",rule:"子音+母音リンキング",detail:"「k」+「a」→「カ」"},{segment:"a_reservation",rule:"母音+子音リンキング",detail:"「a」+「res」→「アレザ」"}],
   synonyms:[{text:"book it",katakana:"ブキッ",meaning:"予約する"},{text:"reserve a spot",katakana:"リザーヴァスポッ",meaning:"席を確保する"}],
   swapExample:{original:"I'd like to make a reservation.",swapped:"I'd like to make a reservation for four people.",swappedMeaning:"4名で予約したいのですが"},
   scene:{en:"One of the most common phrases in TOEIC restaurant and hotel dialogues.",ja:"TOEICのレストラン・ホテルダイアログで最も頻出の表現の一つ。"},category:"旅行"},

  // ── 製造 完全版 ──────────────────────────────────────────
  {id:337,text:"ramp up production",katakana:"ランパップロダクション",meaning:"生産を増強する",
   linkingParts:[{segment:"ramp_up",rule:"子音+母音リンキング",detail:"「p」+「up」→「パップ」"},{segment:"up_production",rule:"子音+母音リンキング",detail:"「p」+「pro」→「ップロ」"}],
   synonyms:[{text:"increase output",katakana:"インクリースアウトプッ",meaning:"生産量を増やす"},{text:"scale up manufacturing",katakana:"スケイラップマニュファクチャリング",meaning:"製造規模を拡大する"}],
   swapExample:{original:"We need to ramp up production.",swapped:"We need to ramp up production to meet demand.",swappedMeaning:"需要に応えるため生産を増強する必要があります"},
   scene:{en:"Used in manufacturing when increasing production capacity to meet higher demand.",ja:"需要増に対応するため生産能力を引き上げる場面。製造・サプライチェーンでよく出る。"},category:"製造"},
  {id:338,text:"roll off the line",katakana:"ロウロッフザライン",meaning:"ラインから出来上がってくる",
   linkingParts:[{segment:"roll_off",rule:"子音+母音リンキング",detail:"「l」+「off」→「ロッフ」"},{segment:"off_the",rule:"子音+母音リンキング",detail:"「f」+「the」→「フザ」"},{segment:"the_line",rule:"子音+母音リンキング",detail:"「e」+「line」→「ザライン」"}],
   synonyms:[{text:"come off the assembly line",katakana:"カムオッフジアセンブリライン",meaning:"組み立てラインから出る"},{text:"be produced",katakana:"ビープロデュースト",meaning:"生産される"}],
   swapExample:{original:"Units are rolling off the line.",swapped:"A thousand units rolled off the line today.",swappedMeaning:"今日1000台がラインから生産されました"},
   scene:{en:"Used in manufacturing to describe products coming off the production/assembly line.",ja:"生産ラインで製品が完成して出てくる場面。製造業・自動車・電子機器産業でよく出る。"},category:"製造"},
  {id:339,text:"pull it from the line",katakana:"プリリフロムザライン",meaning:"ラインから外す・回収する",
   linkingParts:[{segment:"pull_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_from",rule:"flap T + 母音",detail:"「t」+「from」→「リフロム」"}],
   synonyms:[{text:"remove it",katakana:"リムーヴィッ",meaning:"取り除く"},{text:"recall it",katakana:"リコーリッ",meaning:"回収する"}],
   swapExample:{original:"We need to pull it from the line.",swapped:"Pull it from the line immediately — there's a defect.",swappedMeaning:"欠陥があるのでただちにラインから外してください"},
   scene:{en:"Used when a defective product needs to be removed from the production line.",ja:"欠陥製品を製造ラインから撤去する場面。品質管理・リコール対応でよく出る。"},category:"製造"},
  {id:340,text:"meet the quota",katakana:"ミーザクウォウタ",meaning:"ノルマを達成する",
   linkingParts:[{segment:"meet_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"the_quota",rule:"子音+母音リンキング",detail:"「e」+「quota」→「ザクウォウタ」"}],
   synonyms:[{text:"hit the target",katakana:"ヒッザターゲット",meaning:"目標を達成する"},{text:"reach the goal",katakana:"リーチザゴウル",meaning:"目標に到達する"}],
   swapExample:{original:"We need to meet the quota this month.",swapped:"Did the factory meet the quota last quarter?",swappedMeaning:"工場は前四半期にノルマを達成しましたか？"},
   scene:{en:"Used in manufacturing and sales when discussing production or sales targets.",ja:"製造・営業でノルマ・生産目標の達成を議論する場面。月次・四半期報告でよく出る。"},category:"製造"},

  // ── 飲食 完全版 ──────────────────────────────────────────
  {id:341,text:"comp it",katakana:"コンピッ",meaning:"サービスにする・無料にする",
   linkingParts:[{segment:"comp_it",rule:"子音+母音リンキング",detail:"「p」+「it」→「ピッ」"}],
   synonyms:[{text:"make it complimentary",katakana:"メイキッコンプリメンタリ",meaning:"無料にする"},{text:"give it for free",katakana:"ギヴィッフォーフリー",meaning:"無料で提供する"}],
   swapExample:{original:"We'll comp it for the inconvenience.",swapped:"The manager decided to comp the dessert.",swappedMeaning:"マネージャーがデザートをサービスにすることにしました"},
   scene:{en:"Restaurant/hotel term for providing something free of charge as compensation.",ja:"不便をかけたお詫びに料理や飲み物を無料にする場面。飲食・ホテル業でよく使われる。"},category:"飲食"},
  {id:342,text:"seat them",katakana:"シーリッゼム",meaning:"席に案内する",
   linkingParts:[{segment:"seat_them",rule:"子音+母音リンキング",detail:"「t」+「them」→「リッゼム」（flap）"}],
   synonyms:[{text:"show them to a table",katakana:"ショウゼムトゥアテイブル",meaning:"テーブルに案内する"},{text:"get them settled",katakana:"ゲッゼムセトルド",meaning:"落ち着かせる"}],
   swapExample:{original:"Can you seat them right away?",swapped:"Seat them at the window table, please.",swappedMeaning:"窓際のテーブルに案内してください"},
   scene:{en:"Restaurant staff phrase for guiding customers to their seats.",ja:"レストランのスタッフが客を席に案内する場面。飲食業のTOEICシーンで頻出。"},category:"飲食"},
  {id:343,text:"run the specials",katakana:"ランザスペシャルズ",meaning:"本日のおすすめを説明する",
   linkingParts:[{segment:"run_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_specials",rule:"子音+子音",detail:"「e」+「specials」→「ザスペシャルズ」"}],
   synonyms:[{text:"go over the specials",katakana:"ゴウオウヴァザスペシャルズ",meaning:"おすすめを説明する"},{text:"tell them the specials",katakana:"テルゼムザスペシャルズ",meaning:"おすすめを伝える"}],
   swapExample:{original:"Let me run the specials for you.",swapped:"Would you like me to run the specials first?",swappedMeaning:"まず本日のおすすめをご説明しましょうか？"},
   scene:{en:"Said by servers when listing the day's special menu items to customers.",ja:"ウェイターが本日のおすすめメニューを説明する場面。レストランTOEICシーンで頻出。"},category:"飲食"},
  {id:344,text:"get the check",katakana:"ゲッザチェック",meaning:"会計をもらう",
   linkingParts:[{segment:"get_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"the_check",rule:"子音+子音",detail:"「e」+「check」→「ザチェック」"}],
   synonyms:[{text:"ask for the bill",katakana:"アスクフォーザビル",meaning:"会計を頼む"},{text:"pay the tab",katakana:"ペイザタブ",meaning:"ツケを払う"}],
   swapExample:{original:"Can we get the check?",swapped:"Can we get the check when you have a moment?",swappedMeaning:"手が空いたときに会計をお願いできますか？"},
   scene:{en:"Used at restaurants when requesting the bill. 'Check' is American English; 'bill' is British.",ja:"レストランで会計を頼む場面。「check」は米国、「bill」は英国。TOEICの飲食シーンで必ず出る。"},category:"飲食"},

  // ── PR・メディア 完全版 ──────────────────────────────────
  {id:345,text:"issue a statement",katakana:"イシューアステイトメン",meaning:"声明を発表する",
   linkingParts:[{segment:"issue_a",rule:"母音+母音リンキング",detail:"「e」+「a」→「ユーア」"},{segment:"a_statement",rule:"母音+子音リンキング",detail:"「a」+「state」→「アステイト」"}],
   synonyms:[{text:"release a statement",katakana:"リリースアステイトメン",meaning:"声明を発表する"},{text:"make an announcement",katakana:"メイカナナウンスメン",meaning:"発表する"}],
   swapExample:{original:"The company will issue a statement.",swapped:"We'll issue a statement by end of day.",swappedMeaning:"今日中に声明を発表します"},
   scene:{en:"Used in corporate communications or PR when officially responding to an event.",ja:"企業が公式声明を発表する場面。危機管理・IR・PR問題でよく使われる。"},category:"PR"},
  {id:346,text:"go viral",katakana:"ゴウヴァイラル",meaning:"バイラルになる・拡散する",
   linkingParts:[{segment:"go_viral",rule:"母音+子音リンキング",detail:"「o」+「viral」→「ゴウヴァイラル」"}],
   synonyms:[{text:"spread rapidly",katakana:"スプレッドラピッドリ",meaning:"急速に広まる"},{text:"get shared widely",katakana:"ゲッシェアードワイドリ",meaning:"広く共有される"}],
   swapExample:{original:"The campaign went viral overnight.",swapped:"We're hoping the video goes viral.",swappedMeaning:"動画がバイラルになることを期待しています"},
   scene:{en:"Used in digital marketing when content spreads rapidly across social media.",ja:"SNSでコンテンツが急速に拡散する場面。デジタルマーケティング・PR戦略でよく使われる。"},category:"PR"},
  {id:347,text:"get traction",katakana:"ゲットラクション",meaning:"注目を集める・勢いを得る",
   linkingParts:[{segment:"get_traction",rule:"子音+母音リンキング",detail:"「t」+「traction」→「ットラクション」"}],
   synonyms:[{text:"gain momentum",katakana:"ゲインモウメンタム",meaning:"勢いを得る"},{text:"pick up steam",katakana:"ピカップスティーム",meaning:"勢いがつく"}],
   swapExample:{original:"The product is getting traction.",swapped:"Our new service is getting traction in Asia.",swappedMeaning:"アジアで新サービスが注目を集めています"},
   scene:{en:"Used in business to describe growing interest or momentum behind a product or idea.",ja:"製品・アイデアが注目を集めて勢いが出てくる場面。スタートアップ・マーケティングでよく出る。"},category:"PR"},

  // ── 法務 完全版 ──────────────────────────────────────────
  {id:348,text:"hold them liable",katakana:"ホールドゼムライアブル",meaning:"責任を負わせる",
   linkingParts:[{segment:"hold_them",rule:"子音+母音リンキング",detail:"「d」+「them」→「ドゼム」"},{segment:"them_liable",rule:"子音+母音リンキング",detail:"「m」+「liable」→「ムライアブル」"}],
   synonyms:[{text:"make them responsible",katakana:"メイクゼムリスポンスィブル",meaning:"責任を取らせる"},{text:"pursue legal action",katakana:"パーシュリーガルアクション",meaning:"法的措置を取る"}],
   swapExample:{original:"We could hold them liable.",swapped:"We could hold them liable for the damages.",swappedMeaning:"損害について責任を追及できます"},
   scene:{en:"Used in legal contexts when considering making another party legally responsible.",ja:"相手方に法的責任を負わせることを検討する場面。契約違反・損害賠償でよく出る。"},category:"法務"},
  {id:349,text:"comply with it",katakana:"コンプライウィジッ",meaning:"〜に従う・遵守する",
   linkingParts:[{segment:"comply_with",rule:"子音+子音",detail:"「y」+「w」→「イウィズ」"},{segment:"with_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"}],
   synonyms:[{text:"adhere to it",katakana:"アドヒアトゥイッ",meaning:"〜を遵守する"},{text:"follow it",katakana:"ファロウイッ",meaning:"従う"}],
   swapExample:{original:"We must comply with it.",swapped:"All employees must comply with the new regulation.",swappedMeaning:"全従業員が新規制を遵守する必要があります"},
   scene:{en:"Used in compliance and regulatory contexts when following rules or requirements.",ja:"規制・規則の遵守を求める場面。コンプライアンス・法務部門でよく使われる。"},category:"法務"},
  {id:350,text:"breach of contract",katakana:"ブリーチオヴコントラクッ",meaning:"契約違反",
   linkingParts:[{segment:"breach_of",rule:"子音+母音リンキング",detail:"「ch」+「of」→「チオヴ」"},{segment:"of_contract",rule:"子音+母音リンキング",detail:"「v」+「con」→「ヴコン」"}],
   synonyms:[{text:"violation of terms",katakana:"ヴァイオレイションオヴタームズ",meaning:"条件違反"},{text:"failure to comply",katakana:"フェイリャートゥコンプライ",meaning:"不遵守"}],
   swapExample:{original:"This constitutes a breach of contract.",swapped:"A breach of contract could result in penalties.",swappedMeaning:"契約違反はペナルティになる可能性があります"},
   scene:{en:"Key legal term used when one party fails to fulfill contract obligations.",ja:"契約義務が履行されない場面。法務・契約管理で必ず出てくる重要法律用語。"},category:"法務"},

  // ── 銀行・金融 完全版 ──────────────────────────────────
  {id:351,text:"wire it",katakana:"ワイアリッ",meaning:"電信送金する",
   linkingParts:[{segment:"wire_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"}],
   synonyms:[{text:"transfer it electronically",katakana:"トランスファーリリレクトロニカリ",meaning:"電子送金する"},{text:"send a wire",katakana:"センダワイア",meaning:"送金する"}],
   swapExample:{original:"Wire it to this account.",swapped:"Wire it over by the close of business.",swappedMeaning:"営業終了時間までに送金してください"},
   scene:{en:"Banking term for sending money electronically between banks.",ja:"銀行間の電子送金。国際取引・経理業務でよく使われる表現。"},category:"銀行"},
  {id:352,text:"waive the fee",katakana:"ウェイヴザフィー",meaning:"手数料を免除する",
   linkingParts:[{segment:"waive_the",rule:"子音+母音リンキング",detail:"「v」+「the」→「ヴザ」"},{segment:"the_fee",rule:"子音+母音リンキング",detail:"「e」+「fee」→「ザフィー」"}],
   synonyms:[{text:"waive the charge",katakana:"ウェイヴザチャージ",meaning:"料金を免除する"},{text:"no charge",katakana:"ノーチャージ",meaning:"料金なし"}],
   swapExample:{original:"We'll waive the fee this time.",swapped:"We can waive the fee for premium members.",swappedMeaning:"プレミアム会員には手数料を免除できます"},
   scene:{en:"Used in banking or customer service when removing a charge as a courtesy.",ja:"銀行・サービス業で手数料を免除する場面。優良顧客対応・クレーム解決でよく出る。"},category:"銀行"},
  {id:353,text:"accrue interest",katakana:"アクルーインタレスト",meaning:"利息が発生する",
   linkingParts:[{segment:"accrue_interest",rule:"母音+母音リンキング",detail:"「e」+「int」→「ューイン」"}],
   synonyms:[{text:"earn interest",katakana:"アーンインタレスト",meaning:"利息を得る"},{text:"build up interest",katakana:"ビルダップインタレスト",meaning:"利息が積み上がる"}],
   swapExample:{original:"Interest will accrue daily.",swapped:"The loan will accrue interest from day one.",swappedMeaning:"初日からローンに利息が発生します"},
   scene:{en:"Used in banking and finance when describing how interest builds up on accounts or loans.",ja:"口座・ローンに利息が発生・蓄積される場面。銀行・金融TOEICシーンで頻出。"},category:"銀行"},

  // ── 環境 完全版 ──────────────────────────────────────────
  {id:354,text:"reduce the footprint",katakana:"リデュースザフットプリン",meaning:"環境負荷を減らす",
   linkingParts:[{segment:"reduce_the",rule:"子音+母音リンキング",detail:"「s」+「the」→「スザ」"},{segment:"the_footprint",rule:"子音+母音リンキング",detail:"「e」+「foot」→「ザフッ」"}],
   synonyms:[{text:"lower the impact",katakana:"ロウアザインパクッ",meaning:"影響を低減する"},{text:"minimize emissions",katakana:"ミニマイズイミッションズ",meaning:"排出を最小化する"}],
   swapExample:{original:"We aim to reduce the footprint.",swapped:"We aim to reduce our carbon footprint by 50%.",swappedMeaning:"カーボンフットプリントを50%削減することを目標にしています"},
   scene:{en:"Used in sustainability reports and ESG discussions about reducing environmental impact.",ja:"環境負荷・カーボンフットプリントの削減を議論する場面。ESG・サステナビリティ報告で頻出。"},category:"環境"},
  {id:355,text:"go carbon neutral",katakana:"ゴウカーボンニュートラル",meaning:"カーボンニュートラルになる",
   linkingParts:[{segment:"go_carbon",rule:"母音+子音リンキング",detail:"「o」+「car」→「ゴウカー」"},{segment:"carbon_neutral",rule:"子音+母音リンキング",detail:"「n」+「neutral」→「ンニュートラル」"}],
   synonyms:[{text:"achieve net zero",katakana:"アチーヴネッゼロウ",meaning:"ネットゼロを達成する"},{text:"offset all emissions",katakana:"オフセットオールイミッションズ",meaning:"全排出を相殺する"}],
   swapExample:{original:"We plan to go carbon neutral by 2030.",swapped:"We'll go carbon neutral through renewable energy.",swappedMeaning:"再生可能エネルギーでカーボンニュートラルを達成します"},
   scene:{en:"Corporate sustainability goal to eliminate net carbon dioxide emissions.",ja:"企業のカーボンニュートラル目標宣言。ESG・投資家説明会でよく出てくる表現。"},category:"環境"},

  // ── 医療 完全版 ──────────────────────────────────────────
  {id:356,text:"prescribe it",katakana:"プリスクライビッ",meaning:"処方する",
   linkingParts:[{segment:"prescribe_it",rule:"子音+母音リンキング",detail:"「b」+「it」→「ビッ」"}],
   synonyms:[{text:"write a prescription",katakana:"ライラプリスクリプション",meaning:"処方箋を書く"},{text:"recommend it",katakana:"レコメンリッ",meaning:"勧める"}],
   swapExample:{original:"The doctor will prescribe it.",swapped:"I'll prescribe it for two weeks.",swappedMeaning:"2週間分を処方します"},
   scene:{en:"Used when a doctor orders medication for a patient.",ja:"医師が患者に薬を処方する場面。TOEICの医療・健康シーンで頻出。"},category:"医療"},
  {id:357,text:"follow up with the doctor",katakana:"ファロウアップウィザドクター",meaning:"医師にフォローアップする",
   linkingParts:[{segment:"follow_up",rule:"子音+母音リンキング",detail:"「w」+「up」→「ウラップ」"},{segment:"up_with",rule:"子音+子音",detail:"「p」+「w」→「ップウィズ」"}],
   synonyms:[{text:"see the doctor again",katakana:"スィーザドクターアゲン",meaning:"再診する"},{text:"schedule a follow-up",katakana:"スケジューラファロウアップ",meaning:"フォローアップを予約する"}],
   swapExample:{original:"You should follow up with the doctor.",swapped:"Please follow up with the doctor in two weeks.",swappedMeaning:"2週間後に再度医師の診察を受けてください"},
   scene:{en:"Used when advising a patient to see their doctor again after treatment.",ja:"治療後に再診を勧める場面。TOEICの医療・健康場面でよく出る。"},category:"医療"},

  // ── 施設 完全版 ──────────────────────────────────────────
  {id:358,text:"renovate it",katakana:"レノヴェイリッ",meaning:"改修する",
   linkingParts:[{segment:"renovate_it",rule:"flap T + 母音",detail:"「t」→ら行「レノヴェイリッ」"}],
   synonyms:[{text:"refurbish it",katakana:"リファービシッ",meaning:"改装する"},{text:"do it up",katakana:"ドゥーイラップ",meaning:"きれいに整える"}],
   swapExample:{original:"We're going to renovate it next year.",swapped:"We plan to renovate it during the summer closure.",swappedMeaning:"夏季休業中に改修する予定です"},
   scene:{en:"Used in facilities management or real estate when updating or improving a space.",ja:"施設・物件の改修・改装を計画する場面。不動産・施設管理のTOEIC問題でよく出る。"},category:"施設"},
  {id:359,text:"inspect it",katakana:"インスペクリッ",meaning:"検査する・点検する",
   linkingParts:[{segment:"inspect_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"check it over",katakana:"チェキロウヴァ",meaning:"全体を確認する"},{text:"examine it",katakana:"イグザミニッ",meaning:"調査する"}],
   swapExample:{original:"We need to inspect it before opening.",swapped:"The engineer will inspect it on Monday.",swappedMeaning:"エンジニアが月曜日に点検します"},
   scene:{en:"Used in facilities, manufacturing, or construction when examining for safety or compliance.",ja:"安全・コンプライアンスのための施設・設備点検の場面。建設・施設管理でよく出る。"},category:"施設"},

  // ── 採用 完全版 ──────────────────────────────────────────
  {id:360,text:"post it",katakana:"ポウスリッ",meaning:"求人を掲載する",
   linkingParts:[{segment:"post_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"advertise it",katakana:"アドヴァタイジッ",meaning:"広告する"},{text:"list it",katakana:"リスリッ",meaning:"リストに載せる"}],
   swapExample:{original:"We need to post it online.",swapped:"Let's post it on the major job boards.",swappedMeaning:"主要な求人サイトに掲載しましょう"},
   scene:{en:"Used in recruitment when publishing a job opening on job boards or websites.",ja:"求人情報を採用サイト・掲示板に掲載する場面。採用・HR業務でよく出る。"},category:"採用"},
  {id:361,text:"turn it down",katakana:"ターニッダウン",meaning:"断る・辞退する",
   linkingParts:[{segment:"turn_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"}],
   synonyms:[{text:"decline it",katakana:"ディクラインイッ",meaning:"辞退する"},{text:"reject it",katakana:"リジェクリッ",meaning:"断る"}],
   swapExample:{original:"She decided to turn it down.",swapped:"He turned down the offer for a higher salary.",swappedMeaning:"彼はより高い給与の申し出を断りました"},
   scene:{en:"Used when declining a job offer, proposal, or request.",ja:"内定・提案・依頼を辞退・断る場面。採用・営業・交渉でよく使われる。"},category:"採用"},

  // ── 研修 完全版 ──────────────────────────────────────────
  {id:362,text:"sit in on it",katakana:"シリノニッ",meaning:"見学参加する・傍聴する",
   linkingParts:[{segment:"sit_in",rule:"子音+母音リンキング",detail:"「t」+「in」→「リン」（flap）"},{segment:"in_on",rule:"母音+母音リンキング",detail:"「n」+「on」→「ノン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"observe it",katakana:"オブザーヴィッ",meaning:"観察参加する"},{text:"audit it",katakana:"オーリリッ",meaning:"聴講する"}],
   swapExample:{original:"Would you like to sit in on it?",swapped:"You're welcome to sit in on the training session.",swappedMeaning:"トレーニングセッションの見学参加を歓迎します"},
   scene:{en:"Used when inviting someone to observe a session without actively participating.",ja:"会議・研修・授業に正式参加せず見学・傍聴する場面。研修・採用でよく使われる。"},category:"研修"},
  {id:363,text:"certify them",katakana:"サーティファイゼム",meaning:"認定する",
   linkingParts:[{segment:"certify_them",rule:"子音+母音リンキング",detail:"「y」+「them」→「イゼム」"}],
   synonyms:[{text:"give them certification",katakana:"ギヴゼムサーティフィケイション",meaning:"認定証を与える"},{text:"qualify them",katakana:"クウォリファイゼム",meaning:"資格を与える"}],
   swapExample:{original:"We'll certify them after the course.",swapped:"You'll be certified once you pass the exam.",swappedMeaning:"試験に合格すると認定されます"},
   scene:{en:"Used in training programs when awarding official certification upon completion.",ja:"研修・コース修了後に公式認定を付与する場面。資格・認定プログラムでよく使われる。"},category:"研修"},

  // ── マーケティング 完全版 ──────────────────────────────────
  {id:364,text:"target it at",katakana:"ターゲリラッ",meaning:"〜をターゲットにする",
   linkingParts:[{segment:"target_it",rule:"flap T + 母音",detail:"「t」→ら行「ターゲリッ」"},{segment:"it_at",rule:"flap T + 母音",detail:"「t」+「at」→「ラッ」"}],
   synonyms:[{text:"aim it at",katakana:"エイミラッ",meaning:"〜に向ける"},{text:"direct it to",katakana:"ダイレクリットゥ",meaning:"〜に向ける"}],
   swapExample:{original:"We should target it at millennials.",swapped:"Let's target it at small business owners.",swappedMeaning:"中小企業オーナーをターゲットにしましょう"},
   scene:{en:"Used in marketing strategy when defining the intended audience for a campaign.",ja:"マーケティングキャンペーンのターゲット層を設定する場面。広告・デジタルマーケティングで頻出。"},category:"マーケティング"},
  {id:365,text:"A/B test it",katakana:"エービーテスリッ",meaning:"A/Bテストをする",
   linkingParts:[{segment:"test_it",rule:"子音+母音リンキング",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"split test it",katakana:"スプリットテスリッ",meaning:"分割テストする"},{text:"run a test on it",katakana:"ラナテストノニッ",meaning:"テストを実施する"}],
   swapExample:{original:"Let's A/B test it before launching.",swapped:"We A/B tested it and version B won.",swappedMeaning:"A/Bテストを行ってバージョンBが勝ちました"},
   scene:{en:"Used in digital marketing and product development when comparing two versions.",ja:"二つのバージョンを比較するA/Bテストの場面。デジタルマーケ・UXリサーチで必須。"},category:"マーケティング"},
  {id:366,text:"track it",katakana:"トラキッ",meaning:"追跡する・測定する",
   linkingParts:[{segment:"track_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"}],
   synonyms:[{text:"monitor it",katakana:"モニタリッ",meaning:"モニタリングする"},{text:"measure it",katakana:"メジャリッ",meaning:"測定する"}],
   swapExample:{original:"We need to track it closely.",swapped:"Track it in real time using the dashboard.",swappedMeaning:"ダッシュボードでリアルタイムに追跡してください"},
   scene:{en:"Used in analytics and project management when monitoring KPIs or shipments.",ja:"KPI・配送・キャンペーン効果を追跡する場面。データ分析・マーケティングで必須。"},category:"マーケティング"},

  // ── 汎用 完全版 ──────────────────────────────────────────
  {id:367,text:"take it or leave it",katakana:"テイキロアリーヴィッ",meaning:"受けるか断るかどちらか",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_or",rule:"flap T + 母音",detail:"「t」+「or」→「ロア」"},{segment:"or_leave",rule:"子音+母音リンキング",detail:"「r」+「leave」→「ロアリーヴ」"}],
   synonyms:[{text:"final offer",katakana:"ファイナルオファ",meaning:"最終提案"},{text:"non-negotiable",katakana:"ノンニゴウシアブル",meaning:"交渉の余地なし"}],
   swapExample:{original:"That's my offer — take it or leave it.",swapped:"It's non-negotiable — take it or leave it.",swappedMeaning:"交渉の余地なし、受けるか断るかです"},
   scene:{en:"Used in negotiations when making a final offer with no room for further discussion.",ja:"これ以上交渉できない最終提案を示す場面。交渉・営業の強硬姿勢を示す表現。"},category:"汎用"},
  {id:368,text:"bring it home",katakana:"ブリンギホーム",meaning:"勝ち取る・目標を達成する",
   linkingParts:[{segment:"bring_it",rule:"子音+母音リンキング",detail:"「ng」+「it」→「ンギッ」"},{segment:"it_home",rule:"flap T + 母音",detail:"「t」+「home」→「ホーム」"}],
   synonyms:[{text:"seal the deal",katakana:"スィールザディール",meaning:"契約を成立させる"},{text:"clinch it",katakana:"クリンチィッ",meaning:"勝ち取る"}],
   swapExample:{original:"Let's bring it home.",swapped:"We're almost there — bring it home!",swappedMeaning:"もう少しです、勝ち取りましょう！"},
   scene:{en:"Used to encourage completing a task or winning something in the final stages.",ja:"最終段階で目標達成・契約成立を促す励ましの表現。営業・プロジェクト終盤でよく使われる。"},category:"汎用"},
  {id:369,text:"come to terms with it",katakana:"カムトゥタームズウィジッ",meaning:"受け入れる・折り合いをつける",
   linkingParts:[{segment:"come_to",rule:"子音+母音リンキング",detail:"「m」+「to」→「ムトゥ」"},{segment:"terms_with",rule:"子音+子音",detail:"「z」+「w」→「ズウィズ」"},{segment:"with_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"}],
   synonyms:[{text:"accept it",katakana:"アクセプリッ",meaning:"受け入れる"},{text:"make peace with it",katakana:"メイクピースウィジッ",meaning:"折り合いをつける"}],
   swapExample:{original:"We need to come to terms with it.",swapped:"It's hard, but we need to come to terms with the changes.",swappedMeaning:"難しいですが、変化を受け入れる必要があります"},
   scene:{en:"Used when accepting an unfavorable situation or difficult reality.",ja:"受け入れがたい状況・変化を受け入れる場面。組織変革・業績悪化の対処で使われる。"},category:"汎用"},
  {id:370,text:"put it behind you",katakana:"プリリバインジュー",meaning:"過去のことにする",
   linkingParts:[{segment:"put_it",rule:"flap T + 母音",detail:"「t」→ら行「プリッ」"},{segment:"it_behind",rule:"flap T + 母音",detail:"「t」+「behind」→「リバインド」"},{segment:"behind_you",rule:"子音+母音リンキング",detail:"「d」+「you」→「ジュー」"}],
   synonyms:[{text:"move on",katakana:"ムーヴォン",meaning:"前に進む"},{text:"let it go",katakana:"レリゴウ",meaning:"手放す"}],
   swapExample:{original:"It's time to put it behind you.",swapped:"Put it behind you and focus on what's ahead.",swappedMeaning:"過去のことは忘れて前を向きましょう"},
   scene:{en:"Used when encouraging someone to stop dwelling on a past mistake or failure.",ja:"過去のミスや失敗を引きずっている人への励まし。コーチング・フィードバックでよく使われる。"},category:"汎用"},
  {id:371,text:"see it through to the end",katakana:"スィーイッスルートゥジエンド",meaning:"最後までやり遂げる",
   linkingParts:[{segment:"see_it",rule:"母音+母音リンキング",detail:"「e」+「it」→「イーイッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"},{segment:"through_to",rule:"子音+母音リンキング",detail:"「gh」+「to」→「ストゥ」"}],
   synonyms:[{text:"finish what you started",katakana:"フィニッシュワッチュスターリッ",meaning:"始めたことを終わらせる"},{text:"follow through",katakana:"ファロウスルー",meaning:"やり遂げる"}],
   swapExample:{original:"We need to see it through to the end.",swapped:"No matter what, see it through to the end.",swappedMeaning:"何があっても最後までやり遂げてください"},
   scene:{en:"Used to commit to completing something despite challenges or temptation to quit.",ja:"困難があっても最後まで完遂する意志を示す場面。プロジェクト終盤・チームの士気向上で頻出。"},category:"汎用"},
  {id:372,text:"talk it through",katakana:"トーキッスルー",meaning:"話し合って解決する",
   linkingParts:[{segment:"talk_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"work it out verbally",katakana:"ワーキラウッヴァーバリ",meaning:"言葉で解決する"},{text:"discuss it fully",katakana:"ディスカシッフリー",meaning:"十分に議論する"}],
   swapExample:{original:"Let's talk it through.",swapped:"Let's talk it through before making any decisions.",swappedMeaning:"決断する前に話し合いましょう"},
   scene:{en:"Used when resolving an issue through conversation rather than avoiding it.",ja:"問題を避けず話し合いで解決する場面。対立解消・意思決定前の確認でよく使われる。"},category:"汎用"},
  {id:373,text:"think it through",katakana:"シンキッスルー",meaning:"よく考える",
   linkingParts:[{segment:"think_it",rule:"子音+母音リンキング",detail:"「nk」+「it」→「ンキッ」"},{segment:"it_through",rule:"子音+子音",detail:"「t」+「th」→「ッスルー」"}],
   synonyms:[{text:"consider it carefully",katakana:"コンシダリッケアフリ",meaning:"慎重に考える"},{text:"think it over",katakana:"シンキロウヴァ",meaning:"じっくり考える"}],
   swapExample:{original:"Think it through before deciding.",swapped:"Think it through carefully — this is a big decision.",swappedMeaning:"大きな決断なのでよく考えてください"},
   scene:{en:"Used to advise someone to carefully consider all aspects before acting.",ja:"行動する前によく考えるよう促す場面。重大な意思決定・交渉前の助言でよく使われる。"},category:"汎用"},
  {id:374,text:"spell it out",katakana:"スペリラウッ",meaning:"はっきり説明する",
   linkingParts:[{segment:"spell_it",rule:"子音+母音リンキング",detail:"「l」+「it」→「リッ」"},{segment:"it_out",rule:"flap T + 母音",detail:"「t」+「out」→「ラウッ」"}],
   synonyms:[{text:"explain it clearly",katakana:"イクスプレイニックリアリ",meaning:"明確に説明する"},{text:"make it explicit",katakana:"メイキリクスプリシッ",meaning:"明示する"}],
   swapExample:{original:"Do I need to spell it out?",swapped:"Let me spell it out so there's no confusion.",swappedMeaning:"混乱のないようにはっきり説明します"},
   scene:{en:"Used when something needs to be explained very clearly, often with mild frustration.",ja:"当然わかるはずのことを改めて明確に説明するときの表現。若干の苛立ちを含む場合も。"},category:"汎用"},
  {id:375,text:"take it with a grain of salt",katakana:"テイキッウィザグレインオヴソルト",meaning:"話半分に聞く",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_with",rule:"flap T + 母音",detail:"「t」+「with」→「ウィズ」"},{segment:"a_grain",rule:"母音+子音リンキング",detail:"「a」+「grain」→「アグレイン」"}],
   synonyms:[{text:"be skeptical",katakana:"ビースケプティカル",meaning:"懐疑的になる"},{text:"don't believe it entirely",katakana:"ドンビリーヴィリンタイアリ",meaning:"全部信じるな"}],
   swapExample:{original:"Take it with a grain of salt.",swapped:"Take the survey results with a grain of salt.",swappedMeaning:"調査結果は話半分に受け取ってください"},
   scene:{en:"Used when advising someone not to fully trust or believe information.",ja:"情報を鵜呑みにしないよう注意する場面。データ解釈・情報収集でよく使われる。"},category:"汎用"},
,

  // ══ 最終追加バッチ 376-450 ══════════════════════════════

  // ── 数量表現 完全版 ──────────────────────────────────────
  {id:376,text:"a number of them",katakana:"アナンバロヴェム",meaning:"それらのいくつか・多数の",
   linkingParts:[{segment:"a_number",rule:"母音+子音リンキング",detail:"「a」+「number」→「アナンバ」"},{segment:"number_of",rule:"子音+母音リンキング",detail:"「r」+「of」→「ロヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"several of them",katakana:"セヴァロヴェム",meaning:"いくつかの"},{text:"many of them",katakana:"メニオヴェム",meaning:"多くの"}],
   swapExample:{original:"A number of them were absent.",swapped:"A number of them have already responded.",swappedMeaning:"そのうちの多くがすでに返答しています"},
   scene:{en:"Used when referring to an unspecified but significant quantity. Very common in TOEIC reports.",ja:"「アナンバロヴェム」と聞こえる。TOEIC報告書・会議での数量表現として頻出。"},category:"短縮形"},
  {id:377,text:"both of them",katakana:"ボウソヴェム",meaning:"両方とも",
   linkingParts:[{segment:"both_of",rule:"子音+母音リンキング",detail:"「th」+「of」→「ソヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"the two of them",katakana:"ザトゥーオヴェム",meaning:"その二人・二つとも"},{text:"either one",katakana:"イーザワン",meaning:"どちらも"}],
   swapExample:{original:"Both of them agreed.",swapped:"Both of them will present at the conference.",swappedMeaning:"二人ともカンファレンスで発表します"},
   scene:{en:"'Both of them' links into 'bothuvem'. Used constantly when referring to two people or items.",ja:"「ボウソヴェム」と聞こえる。二人・二つを指すときに頻繁に使われるTOEIC頻出表現。"},category:"短縮形"},
  {id:378,text:"each of them",katakana:"イーチョヴェム",meaning:"それぞれ",
   linkingParts:[{segment:"each_of",rule:"子音+母音リンキング",detail:"「ch」+「of」→「チョヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"every one of them",katakana:"エヴリワノヴェム",meaning:"全員それぞれ"},{text:"individually",katakana:"インディヴィジュアリ",meaning:"個別に"}],
   swapExample:{original:"Each of them has a role.",swapped:"Each of them will receive a copy.",swappedMeaning:"それぞれがコピーを受け取ります"},
   scene:{en:"'Each of them' sounds like 'eachuvem'. Used in task assignments and distributions.",ja:"「イーチョヴェム」と聞こえる。タスク割り当て・配布の場面でよく使われる。"},category:"短縮形"},
  {id:379,text:"half of it",katakana:"ハーフォヴィッ",meaning:"その半分",
   linkingParts:[{segment:"half_of",rule:"子音+母音リンキング",detail:"「f」+「of」→「フォヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"50 percent of it",katakana:"フィフティパーセントオヴィッ",meaning:"その50%"},{text:"a portion of it",katakana:"アポーションオヴィッ",meaning:"その一部"}],
   swapExample:{original:"Half of it is already done.",swapped:"Half of it needs to be revised.",swappedMeaning:"その半分は修正が必要です"},
   scene:{en:"'Half of it' links into 'halfovit'. Common in progress reports and budget discussions.",ja:"「ハーフォヴィッ」と聞こえる。進捗報告・予算議論でよく出てくる数量表現。"},category:"短縮形"},
  {id:380,text:"none of them",katakana:"ナノヴェム",meaning:"そのどれも〜ない",
   linkingParts:[{segment:"none_of",rule:"子音+母音リンキング",detail:"「n」+「of」→「ノヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"not one of them",katakana:"ノットワノヴェム",meaning:"一人も〜ない"},{text:"nobody",katakana:"ノウバディ",meaning:"誰も〜ない"}],
   swapExample:{original:"None of them responded.",swapped:"None of them were available that day.",swappedMeaning:"その日は誰も対応できませんでした"},
   scene:{en:"'None of them' sounds like 'nunavem'. Used to negate all members of a group.",ja:"「ナノヴェム」と聞こえる。グループ全員を否定する場面でよく使われる。"},category:"短縮形"},
  {id:381,text:"most of them",katakana:"モウストオヴェム",meaning:"そのほとんど",
   linkingParts:[{segment:"most_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"the majority",katakana:"ザマジョリティ",meaning:"大多数"},{text:"nearly all of them",katakana:"ニアリオーロヴェム",meaning:"ほぼ全員"}],
   swapExample:{original:"Most of them agreed.",swapped:"Most of them have already completed the training.",swappedMeaning:"そのほとんどがすでにトレーニングを完了しています"},
   scene:{en:"'Most of them' with flap T sounds like 'mosovem'. Very common in survey and meeting results.",ja:"「モウストオヴェム」が速いと「モソヴェム」に聞こえる。調査・会議結果の報告で頻出。"},category:"短縮形"},
  {id:382,text:"all of them",katakana:"オーロヴェム",meaning:"全員・全部",
   linkingParts:[{segment:"all_of",rule:"子音+母音リンキング",detail:"「l」+「of」→「ロヴ」"},{segment:"of_them",rule:"子音+母音リンキング",detail:"「v」+「them」→「ヴェム」"}],
   synonyms:[{text:"everyone",katakana:"エヴリワン",meaning:"全員"},{text:"every single one",katakana:"エヴリシングルワン",meaning:"一人残らず"}],
   swapExample:{original:"All of them passed the test.",swapped:"All of them will attend the briefing.",swappedMeaning:"全員がブリーフィングに出席します"},
   scene:{en:"'All of them' sounds like 'allovem'. One of the most frequent quantity phrases in TOEIC.",ja:"「オーロヴェム」と聞こえる。TOEICで最も頻繁に使われる数量表現の一つ。"},category:"短縮形"},

  // ── 接続詞チャンク 完全版 ────────────────────────────────
  {id:383,text:"in order to",katakana:"イノーダトゥ",meaning:"〜するために",
   linkingParts:[{segment:"in_order",rule:"母音+母音リンキング",detail:"「n」+「order」→「ノーダ」"},{segment:"order_to",rule:"子音+母音リンキング",detail:"「r」+「to」→「ダトゥ」（flap）"}],
   synonyms:[{text:"so as to",katakana:"ソウアストゥ",meaning:"〜するために"},{text:"to",katakana:"トゥ",meaning:"〜するために（不定詞）"}],
   swapExample:{original:"In order to meet the deadline, we need help.",swapped:"In order to reduce costs, we must act now.",swappedMeaning:"コスト削減のために今すぐ行動する必要があります"},
   scene:{en:"One of the most common purpose phrases in TOEIC. Sounds like 'inorderta' in fast speech.",ja:"「イノーダトゥ」と聞こえる。目的を表す最頻出表現。TOEICのビジネス文書・会話で必ず出る。"},category:"短縮形"},
  {id:384,text:"in addition to",katakana:"イナディッショントゥ",meaning:"〜に加えて",
   linkingParts:[{segment:"in_addition",rule:"母音+母音リンキング",detail:"「n」+「add」→「ナディッション」"},{segment:"addition_to",rule:"子音+母音リンキング",detail:"「n」+「to」→「ントゥ」"}],
   synonyms:[{text:"on top of that",katakana:"オントッポヴザッ",meaning:"それに加えて"},{text:"furthermore",katakana:"ファーザモア",meaning:"さらに"}],
   swapExample:{original:"In addition to the report, please send the data.",swapped:"In addition to salary, benefits are included.",swappedMeaning:"給与に加えて福利厚生も含まれます"},
   scene:{en:"Very common in TOEIC Part 7 documents. Links into 'inadishunto'.",ja:"「イナディッショントゥ」と聞こえる。TOEICのPart7文書・ビジネスメールで頻出。"},category:"短縮形"},
  {id:385,text:"as a result of",katakana:"アザリザルトオヴ",meaning:"〜の結果として",
   linkingParts:[{segment:"as_a",rule:"子音+母音リンキング",detail:"「z」+「a」→「ザ」"},{segment:"a_result",rule:"母音+子音リンキング",detail:"「a」+「result」→「アリザルト」"},{segment:"result_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「トオヴ」"}],
   synonyms:[{text:"because of",katakana:"ビコーゾヴ",meaning:"〜のために"},{text:"due to",katakana:"デュートゥ",meaning:"〜のために"}],
   swapExample:{original:"As a result of the merger, jobs were cut.",swapped:"As a result of our efforts, sales increased.",swappedMeaning:"私たちの努力の結果、売上が増加しました"},
   scene:{en:"'As a result of' links into one phrase. Very common in TOEIC business announcements.",ja:"「アザリザルトオヴ」と聞こえる。TOEICのビジネスアナウンス・報告書で頻出の因果表現。"},category:"短縮形"},
  {id:386,text:"in spite of",katakana:"インスパイロヴ",meaning:"〜にもかかわらず",
   linkingParts:[{segment:"in_spite",rule:"母音+子音リンキング",detail:"「n」+「spite」→「ンスパイト」"},{segment:"spite_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"}],
   synonyms:[{text:"despite",katakana:"ディスパイト",meaning:"〜にもかかわらず"},{text:"regardless of",katakana:"リガードレスオヴ",meaning:"〜に関係なく"}],
   swapExample:{original:"In spite of the delay, we delivered on time.",swapped:"In spite of budget cuts, quality improved.",swappedMeaning:"予算削減にもかかわらず品質が向上しました"},
   scene:{en:"'In spite of' sounds like 'inspitov'. Common in TOEIC problem-solution narratives.",ja:"「インスパイロヴ」と聞こえる。逆接の文脈でTOEICの問題解決ナラティブに頻出。"},category:"短縮形"},
  {id:387,text:"with regard to",katakana:"ウィズリガードトゥ",meaning:"〜に関して",
   linkingParts:[{segment:"with_regard",rule:"子音+母音リンキング",detail:"「th」+「regard」→「ズリガード」"},{segment:"regard_to",rule:"子音+母音リンキング",detail:"「d」+「to」→「ドトゥ」"}],
   synonyms:[{text:"regarding",katakana:"リガーディング",meaning:"〜に関して"},{text:"concerning",katakana:"コンサーニング",meaning:"〜について"}],
   swapExample:{original:"With regard to your inquiry, please see below.",swapped:"With regard to the budget, changes are needed.",swappedMeaning:"予算に関して変更が必要です"},
   scene:{en:"Formal phrase used in business correspondence. Very common in TOEIC Part 7 emails.",ja:"「ウィズリガードトゥ」。ビジネス文書の書き出しとして頻出。TOEICのPart7メール問題で必ず出る。"},category:"短縮形"},
  {id:388,text:"on behalf of",katakana:"オンビハーフォヴ",meaning:"〜を代表して・〜のために",
   linkingParts:[{segment:"on_behalf",rule:"子音+母音リンキング",detail:"「n」+「behalf」→「ンビハーフ」"},{segment:"behalf_of",rule:"子音+母音リンキング",detail:"「f」+「of」→「フォヴ」"}],
   synonyms:[{text:"representing",katakana:"レプリゼンティング",meaning:"〜を代表して"},{text:"in the name of",katakana:"インザネイモヴ",meaning:"〜の名において"}],
   swapExample:{original:"On behalf of the company, thank you.",swapped:"I'm writing on behalf of our CEO.",swappedMeaning:"CEOの代わりにご連絡しています"},
   scene:{en:"Used in formal communications when acting as a representative. Very common in TOEIC letters.",ja:"「オンビハーフォヴ」。代理・代表として行動する場面。TOEICのビジネスレター・メールで頻出。"},category:"短縮形"},

  // ── オフィス日常 完全版 ──────────────────────────────────
  {id:389,text:"run out of it",katakana:"ラナウロヴィッ",meaning:"〜を使い果たす・切れる",
   linkingParts:[{segment:"run_out",rule:"子音+母音リンキング",detail:"「n」+「out」→「ナウッ」"},{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"use it all up",katakana:"ユーズィロールアップ",meaning:"全部使い切る"},{text:"deplete it",katakana:"ディプリーリッ",meaning:"枯渇させる"}],
   swapExample:{original:"We've run out of it.",swapped:"We're running out of time.",swappedMeaning:"時間が切れそうです"},
   scene:{en:"'Run out of it' links into 'runauvit'. Used for supplies, time, or resources being depleted.",ja:"「ラナウロヴィッ」と聞こえる。在庫・時間・リソースが枯渇する場面でよく使われる。"},category:"汎用"},
  {id:390,text:"keep up with it",katakana:"キーパップウィジッ",meaning:"〜についていく・遅れずにいる",
   linkingParts:[{segment:"keep_up",rule:"子音+母音リンキング",detail:"「p」+「up」→「パップ」"},{segment:"up_with",rule:"子音+子音",detail:"「p」+「w」→「ップウィズ」"},{segment:"with_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"}],
   synonyms:[{text:"stay current with it",katakana:"ステイカーレントウィジッ",meaning:"最新についていく"},{text:"maintain pace with it",katakana:"メインテインペイスウィジッ",meaning:"ペースを維持する"}],
   swapExample:{original:"It's hard to keep up with it.",swapped:"It's hard to keep up with all the changes.",swappedMeaning:"全ての変化についていくのは大変です"},
   scene:{en:"Used when struggling to stay current with rapid changes or workload.",ja:"急速な変化や業務量についていくのが大変な場面。業務過多・技術変化の文脈でよく使われる。"},category:"汎用"},
  {id:391,text:"catch up on it",katakana:"キャッチャポニッ",meaning:"遅れを取り戻す・追いつく",
   linkingParts:[{segment:"catch_up",rule:"子音+母音リンキング",detail:"「ch」+「up」→「チャップ」"},{segment:"up_on",rule:"子音+母音リンキング",detail:"「p」+「on」→「ポン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"get up to speed on it",katakana:"ゲラップトゥスピードノニッ",meaning:"追いつく"},{text:"make up for lost time",katakana:"メイカップフォーロストタイム",meaning:"遅れを取り戻す"}],
   swapExample:{original:"I need to catch up on it.",swapped:"I'll catch up on it over the weekend.",swappedMeaning:"週末に遅れを取り戻します"},
   scene:{en:"Used when behind on work, emails, or news and needing to get current.",ja:"仕事・メール・ニュースに遅れているときに追いつく場面。休暇明けや繁忙期後によく使われる。"},category:"汎用"},
  {id:392,text:"sign up for it",katakana:"サイナップフォーイッ",meaning:"申し込む・登録する",
   linkingParts:[{segment:"sign_up",rule:"子音+母音リンキング",detail:"「n」+「up」→「ナップ」"},{segment:"up_for",rule:"子音+母音リンキング",detail:"「p」+「for」→「プフォ」"},{segment:"for_it",rule:"子音+母音リンキング",detail:"「r」+「it」→「リッ」"}],
   synonyms:[{text:"register for it",katakana:"レジスタフォーイッ",meaning:"登録する"},{text:"enroll in it",katakana:"インロウリニッ",meaning:"入会・登録する"}],
   swapExample:{original:"Would you like to sign up for it?",swapped:"You can sign up for it online.",swappedMeaning:"オンラインで申し込めます"},
   scene:{en:"Used when registering for events, courses, or services. Very common in TOEIC notices.",ja:"イベント・コース・サービスへの申し込み場面。TOEICのお知らせ・案内文で頻出。"},category:"汎用"},
  {id:393,text:"deal with it",katakana:"ディールウィジッ",meaning:"対処する・処理する",
   linkingParts:[{segment:"deal_with",rule:"子音+子音",detail:"「l」+「w」→「ルウィズ」"},{segment:"with_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"}],
   synonyms:[{text:"handle it",katakana:"ハンドリッ",meaning:"対応する"},{text:"take care of it",katakana:"テイケアロヴィッ",meaning:"処理する"}],
   swapExample:{original:"I'll deal with it right away.",swapped:"Let me deal with it before it gets worse.",swappedMeaning:"悪化する前に対処させてください"},
   scene:{en:"Used when taking responsibility for solving a problem. Common in customer service.",ja:"問題を自分が対処すると宣言する場面。カスタマーサービス・トラブル対応でよく使われる。"},category:"汎用"},
  {id:394,text:"look forward to it",katakana:"ルックフォーワードトゥイッ",meaning:"楽しみにしている",
   linkingParts:[{segment:"look_forward",rule:"子音+母音リンキング",detail:"「k」+「for」→「クフォ」"},{segment:"forward_to",rule:"子音+母音リンキング",detail:"「d」+「to」→「ドトゥ」"},{segment:"to_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「トゥイッ」"}],
   synonyms:[{text:"can't wait for it",katakana:"キャントウェイトフォーイッ",meaning:"待ちきれない"},{text:"be excited about it",katakana:"ビーイクサイティダバウリッ",meaning:"楽しみにしている"}],
   swapExample:{original:"I look forward to it.",swapped:"We look forward to working with you.",swappedMeaning:"お仕事できることを楽しみにしています"},
   scene:{en:"Essential closing phrase in business emails and meetings. One of the most common TOEIC phrases.",ja:"ビジネスメール・会議の締めで最も使われる表現の一つ。TOEICでほぼ毎回登場する必須フレーズ。"},category:"ビジネス定型"},

  // ── 交渉 完全版 ──────────────────────────────────────────
  {id:395,text:"meet in the middle",katakana:"ミーリンザミドル",meaning:"中間点で妥協する",
   linkingParts:[{segment:"meet_in",rule:"子音+母音リンキング",detail:"「t」+「in」→「リン」（flap）"},{segment:"in_the",rule:"母音+子音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_middle",rule:"子音+母音リンキング",detail:"「e」+「middle」→「ザミドル」"}],
   synonyms:[{text:"compromise",katakana:"コンプロマイズ",meaning:"妥協する"},{text:"find common ground",katakana:"ファインドコモングラウンド",meaning:"共通点を見つける"}],
   swapExample:{original:"Can we meet in the middle?",swapped:"Let's meet in the middle at 15%.",swappedMeaning:"15%で中間点を取りましょう"},
   scene:{en:"Used in negotiations when both sides compromise to reach an agreement.",ja:"両者が歩み寄って合意に達する交渉場面。価格・条件交渉でよく使われる。"},category:"汎用"},
  {id:396,text:"split the difference",katakana:"スプリッザディファランス",meaning:"差額を折半する・中間を取る",
   linkingParts:[{segment:"split_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"the_difference",rule:"子音+母音リンキング",detail:"「e」+「diff」→「ザディファ」"}],
   synonyms:[{text:"go halves",katakana:"ゴウハーヴズ",meaning:"折半する"},{text:"meet halfway",katakana:"ミートハーフウェイ",meaning:"中間で会う"}],
   swapExample:{original:"Why don't we split the difference?",swapped:"Let's split the difference and settle at 200.",swappedMeaning:"差額を折半して200で合意しましょう"},
   scene:{en:"Used in price negotiations when both parties agree to divide the gap between their positions.",ja:"価格交渉で両者の差額を半分ずつ負担する提案。「間を取ろう」という交渉の常套句。"},category:"汎用"},
  {id:397,text:"stand by it",katakana:"スタンバイイッ",meaning:"〜を支持する・譲らない",
   linkingParts:[{segment:"stand_by",rule:"子音+母音リンキング",detail:"「d」+「by」→「ドバイ」"},{segment:"by_it",rule:"子音+母音リンキング",detail:"「y」+「it」→「イイッ」"}],
   synonyms:[{text:"stick to it",katakana:"スティックトゥイッ",meaning:"〜を守る"},{text:"maintain it",katakana:"メインテイニッ",meaning:"維持する"}],
   swapExample:{original:"I stand by it.",swapped:"I stand by my decision no matter what.",swappedMeaning:"何があっても自分の決断を支持します"},
   scene:{en:"Used when firmly supporting a position or decision despite pressure to change.",ja:"圧力があっても自分の立場・決断を支持する場面。交渉・議論での強い意志表明。"},category:"汎用"},
  {id:398,text:"stick to it",katakana:"スティックトゥイッ",meaning:"〜を守る・やり続ける",
   linkingParts:[{segment:"stick_to",rule:"子音+母音リンキング",detail:"「k」+「to」→「クトゥ」"},{segment:"to_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「トゥイッ」"}],
   synonyms:[{text:"adhere to it",katakana:"アドヒアトゥイッ",meaning:"〜を遵守する"},{text:"hold to it",katakana:"ホールドトゥイッ",meaning:"〜を維持する"}],
   swapExample:{original:"Stick to it and don't give up.",swapped:"If we stick to the plan, we'll succeed.",swappedMeaning:"計画を守れば成功します"},
   scene:{en:"Used to encourage perseverance or commitment to a plan or position.",ja:"計画・立場・習慣を守り続けることを促す場面。コーチング・交渉・プロジェクト管理でよく出る。"},category:"汎用"},
  {id:399,text:"give it some thought",katakana:"ギヴィッサムソート",meaning:"少し考えてみる",
   linkingParts:[{segment:"give_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_some",rule:"flap T + 母音",detail:"「t」+「some」→「サム」"},{segment:"some_thought",rule:"子音+子音",detail:"「m」+「th」→「ムソート」"}],
   synonyms:[{text:"think about it",katakana:"シンカバウリッ",meaning:"考える"},{text:"consider it",katakana:"コンシダリッ",meaning:"検討する"}],
   swapExample:{original:"Give it some thought.",swapped:"Give it some thought and get back to me.",swappedMeaning:"少し考えてから連絡してください"},
   scene:{en:"A polite way to ask someone to consider a proposal without pressure.",ja:"プレッシャーなく提案を検討してもらうよう丁寧にお願いする場面。交渉・営業でよく使われる。"},category:"汎用"},
  {id:400,text:"come to an agreement",katakana:"カムトゥアナグリーメン",meaning:"合意に達する",
   linkingParts:[{segment:"come_to",rule:"子音+母音リンキング",detail:"「m」+「to」→「ムトゥ」"},{segment:"to_an",rule:"子音+母音リンキング",detail:"「o」+「an」→「トゥアン」"},{segment:"an_agreement",rule:"母音+母音リンキング",detail:"「n」+「agree」→「ナグリー」"}],
   synonyms:[{text:"reach an agreement",katakana:"リーチャナグリーメン",meaning:"合意に達する"},{text:"settle it",katakana:"セリリッ",meaning:"決着をつける"}],
   swapExample:{original:"I think we've come to an agreement.",swapped:"We need to come to an agreement by Friday.",swappedMeaning:"金曜日までに合意に達する必要があります"},
   scene:{en:"Used at the end of successful negotiations. Very common in TOEIC business dialogues.",ja:"交渉の成功を宣言する場面。TOEICのビジネス交渉シーンで頻出の決め台詞。"},category:"汎用"},

  // ── 短縮形・現在完了 ─────────────────────────────────────
  {id:401,text:"I've been",katakana:"アイヴビン",meaning:"私はずっと〜している",
   linkingParts:[{segment:"I've_been",rule:"弱形・縮約",detail:"「I've」+「been」→「アイヴビン」（vとbが連結）"}],
   synonyms:[{text:"I have been",katakana:"アイハヴビン",meaning:"私はずっと〜している（強調）"},{text:"lately I've",katakana:"レイトリアイヴ",meaning:"最近は"}],
   swapExample:{original:"I've been working on it.",swapped:"I've been meaning to call you.",swappedMeaning:"ずっとご連絡しようと思っていました"},
   scene:{en:"'I've been' is contracted and linked. Essential for understanding continuous actions in TOEIC.",ja:"「アイヴビン」と聞こえる。継続的な行動を表す現在完了進行形の表現。TOEICでよく出る。"},category:"短縮形"},
  {id:402,text:"there've been",katakana:"ゼアヴビン",meaning:"〜があった（複数）",
   linkingParts:[{segment:"there've_been",rule:"弱形・縮約",detail:"「there've」+「been」→「ゼアヴビン」"}],
   synonyms:[{text:"there have been",katakana:"ゼアハヴビン",meaning:"〜があった"},{text:"we've had",katakana:"ウィヴハッド",meaning:"〜があった"}],
   swapExample:{original:"There've been some changes.",swapped:"There've been several complaints this week.",swappedMeaning:"今週いくつかのクレームがありました"},
   scene:{en:"'There've been' contracts to 'thereve been'. Used to report past events or changes.",ja:"「ゼアヴビン」と聞こえる。過去の出来事・変化を報告する場面でよく使われる。"},category:"短縮形"},
  {id:403,text:"what's been",katakana:"ワッツビン",meaning:"何が〜していたか",
   linkingParts:[{segment:"what's_been",rule:"弱形・縮約",detail:"「what's」+「been」→「ワッツビン」"}],
   synonyms:[{text:"what has been",katakana:"ワッハズビン",meaning:"何が〜してきたか"},{text:"how has it been",katakana:"ハウハジッビン",meaning:"どうだったか"}],
   swapExample:{original:"What's been the issue?",swapped:"What's been happening with the project?",swappedMeaning:"プロジェクトはどうなっていますか？"},
   scene:{en:"'What's been' links smoothly. Used to inquire about ongoing situations.",ja:"「ワッツビン」と聞こえる。継続している状況を尋ねる場面でよく使われる。"},category:"短縮形"},
  {id:404,text:"how's it going",katakana:"ハウジッゴウイング",meaning:"調子はどう？・どう進んでいる？",
   linkingParts:[{segment:"how's_it",rule:"子音+母音リンキング",detail:"「z」+「it」→「ジッ」"},{segment:"it_going",rule:"flap T + 母音",detail:"「t」+「going」→「ゴウイング」"}],
   synonyms:[{text:"how are things",katakana:"ハワーシングズ",meaning:"調子はどう？"},{text:"how's everything",katakana:"ハウジエヴリシング",meaning:"全部どう？"}],
   swapExample:{original:"How's it going?",swapped:"How's it going with the new client?",swappedMeaning:"新しいクライアントとの進捗はどうですか？"},
   scene:{en:"'How's it going' is one of the most common greetings and status checks in TOEIC.",ja:"「ハウジッゴウイング」と聞こえる。挨拶と状況確認を兼ねたTOEICで最頻出のフレーズの一つ。"},category:"短縮形"},
  {id:405,text:"we've already",katakana:"ウィヴオールレディ",meaning:"私たちはすでに〜した",
   linkingParts:[{segment:"we've_already",rule:"母音+母音リンキング",detail:"「v」+「already」→「ヴォールレディ」"}],
   synonyms:[{text:"it's been done",katakana:"イッツビンダン",meaning:"すでに完了した"},{text:"we did it before",katakana:"ウィディディットビフォー",meaning:"以前やった"}],
   swapExample:{original:"We've already sent it.",swapped:"We've already discussed this in the last meeting.",swappedMeaning:"前回の会議でもうこれについて議論しました"},
   scene:{en:"'We've already' contracts smoothly. Used to indicate completed actions.",ja:"「ウィヴオールレディ」と聞こえる。完了した行動を示す場面。会議・報告でよく出る。"},category:"短縮形"},

  // ── Part 4 頻出アナウンス ────────────────────────────────
  {id:406,text:"due to unforeseen circumstances",katakana:"デュートゥアンフォースィーンサーカムスタンシス",meaning:"予期せぬ事情により",
   linkingParts:[{segment:"due_to",rule:"子音+母音リンキング",detail:"「e」+「to」→「ュートゥ」"},{segment:"to_unforeseen",rule:"子音+母音リンキング",detail:"「o」+「un」→「トゥアン」"}],
   synonyms:[{text:"due to unexpected events",katakana:"デュートゥアニクスペクティッイヴェンツ",meaning:"予期せぬ出来事により"},{text:"owing to circumstances beyond our control",katakana:"オウイングトゥサーカムスタンシズビヨンドアワコントロール",meaning:"制御できない事情により"}],
   swapExample:{original:"Due to unforeseen circumstances, the event is cancelled.",swapped:"Due to unforeseen circumstances, the flight is delayed.",swappedMeaning:"予期せぬ事情によりフライトが遅延しています"},
   scene:{en:"Classic TOEIC Part 4 announcement phrase for cancellations or delays.",ja:"キャンセル・遅延のアナウンスでほぼ毎回登場するTOEIC Part4の定番フレーズ。"},category:"汎用"},
  {id:407,text:"for your convenience",katakana:"フォーユアコンヴィーニャンス",meaning:"お客様のご便宜のために",
   linkingParts:[{segment:"for_your",rule:"子音+母音リンキング",detail:"「r」+「your」→「リュア」"},{segment:"your_convenience",rule:"子音+母音リンキング",detail:"「r」+「conv」→「ユアコン」"}],
   synonyms:[{text:"to make things easier for you",katakana:"トゥメイクシングズイーザフォーユー",meaning:"便宜を図るために"},{text:"for your benefit",katakana:"フォーユアベネフィット",meaning:"あなたのために"}],
   swapExample:{original:"For your convenience, we're open on Sundays.",swapped:"For your convenience, payment can be made online.",swappedMeaning:"ご便宜のために、お支払いはオンラインで可能です"},
   scene:{en:"Standard service announcement phrase. Very common in TOEIC Part 4 store and facility announcements.",ja:"サービス・施設のアナウンスでよく使われる定型表現。TOEIC Part4の店舗・施設問題で頻出。"},category:"汎用"},
  {id:408,text:"at no additional charge",katakana:"アッノウアディッショナルチャージ",meaning:"追加料金なしで",
   linkingParts:[{segment:"at_no",rule:"子音+母音リンキング",detail:"「t」+「no」→「ットノウ」"},{segment:"no_additional",rule:"母音+母音リンキング",detail:"「o」+「add」→「ノウアディッ」"}],
   synonyms:[{text:"free of charge",katakana:"フリーオヴチャージ",meaning:"無料で"},{text:"at no extra cost",katakana:"アッノウエクストラコスト",meaning:"追加費用なしで"}],
   swapExample:{original:"This service is provided at no additional charge.",swapped:"Upgrades are available at no additional charge.",swappedMeaning:"アップグレードは追加料金なしでご利用いただけます"},
   scene:{en:"Used in TOEIC Part 4 advertisements and announcements for promotions.",ja:"プロモーション・特典を告知するアナウンスでよく使われる。TOEIC Part4の広告問題で頻出。"},category:"汎用"},
  {id:409,text:"please be advised that",katakana:"プリーズビーアドヴァイズドザッ",meaning:"〜をお知らせします",
   linkingParts:[{segment:"please_be",rule:"子音+母音リンキング",detail:"「z」+「be」→「ズビー」"},{segment:"be_advised",rule:"母音+母音リンキング",detail:"「e」+「adv」→「ビーアドヴ」"}],
   synonyms:[{text:"please note that",katakana:"プリーズノウトザッ",meaning:"〜にご注意ください"},{text:"we would like to inform you",katakana:"ウィウドライクトゥインフォームユー",meaning:"〜をお知らせしたく"}],
   swapExample:{original:"Please be advised that the office will be closed.",swapped:"Please be advised that prices will increase next month.",swappedMeaning:"来月から価格が上がることをお知らせします"},
   scene:{en:"Formal announcement opener. Very common in TOEIC Part 6 and 7 notices and memos.",ja:"公式アナウンス・通知の書き出し表現。TOEIC Part6・7のお知らせ・メモ問題で頻出。"},category:"汎用"},
  {id:410,text:"effective immediately",katakana:"イフェクティヴイミーディアトリ",meaning:"即時有効・ただちに",
   linkingParts:[{segment:"effective_immediately",rule:"母音+母音リンキング",detail:"「e」+「imm」→「ヴイミー」"}],
   synonyms:[{text:"as of now",katakana:"アゾヴナウ",meaning:"今すぐ"},{text:"starting today",katakana:"スターティングトゥデイ",meaning:"本日より"}],
   swapExample:{original:"This policy is effective immediately.",swapped:"Effective immediately, all meetings require prior approval.",swappedMeaning:"ただちに、全ての会議は事前承認が必要になります"},
   scene:{en:"Used in official announcements when a change takes effect right away. Very common in TOEIC memos.",ja:"変更が即時発効することを告知する場面。TOEICの社内メモ・ポリシー変更通知で頻出。"},category:"汎用"},
  {id:411,text:"subject to change",katakana:"サブジェクットゥチェインジ",meaning:"変更になる場合があります",
   linkingParts:[{segment:"subject_to",rule:"子音+母音リンキング",detail:"「t」+「to」→「ットトゥ」"},{segment:"to_change",rule:"子音+母音リンキング",detail:"「o」+「change」→「トゥチェインジ」"}],
   synonyms:[{text:"may change",katakana:"メイチェインジ",meaning:"変更になる可能性がある"},{text:"not guaranteed",katakana:"ノットギャランティード",meaning:"保証されない"}],
   swapExample:{original:"Prices are subject to change.",swapped:"The schedule is subject to change without notice.",swappedMeaning:"スケジュールは予告なく変更になる場合があります"},
   scene:{en:"Standard disclaimer phrase in TOEIC advertisements, schedules, and contracts.",ja:"TOEICの広告・スケジュール・契約書で必ず出る免責事項の定番フレーズ。"},category:"汎用"},
  {id:412,text:"first come first served",katakana:"ファーストカムファーストサーヴド",meaning:"先着順",
   linkingParts:[{segment:"first_come",rule:"子音+母音リンキング",detail:"「t」+「come」→「ットカム」"},{segment:"come_first",rule:"子音+母音リンキング",detail:"「m」+「first」→「ムファースト」"}],
   synonyms:[{text:"on a first-come basis",katakana:"オナファーストカムベイシス",meaning:"先着順で"},{text:"while supplies last",katakana:"ワイルサプライズラスト",meaning:"在庫がある限り"}],
   swapExample:{original:"Seats are available on a first come first served basis.",swapped:"Registration is first come first served — sign up now.",swappedMeaning:"登録は先着順です。今すぐお申し込みください"},
   scene:{en:"Very common in TOEIC event and registration announcements.",ja:"イベント・登録のアナウンスでよく出る表現。TOEICのPart4・7で頻繁に登場する。"},category:"汎用"},
  {id:413,text:"limited time offer",katakana:"リミティッドタイムオファ",meaning:"期間限定オファー",
   linkingParts:[{segment:"limited_time",rule:"子音+母音リンキング",detail:"「d」+「time」→「ドタイム」"},{segment:"time_offer",rule:"子音+母音リンキング",detail:"「m」+「offer」→「ムオファ」"}],
   synonyms:[{text:"for a limited time",katakana:"フォーラリミティッドタイム",meaning:"期間限定で"},{text:"special promotion",katakana:"スペシャルプロモーション",meaning:"特別プロモーション"}],
   swapExample:{original:"This is a limited time offer.",swapped:"Take advantage of this limited time offer today.",swappedMeaning:"本日この期間限定オファーをお見逃しなく"},
   scene:{en:"Standard advertising phrase in TOEIC Part 4 radio commercials and Part 7 ads.",ja:"TOEIC Part4のラジオCM・Part7の広告で必ず出る期間限定オファーの定番表現。"},category:"汎用"},
  {id:414,text:"quantities are limited",katakana:"クウォンティティーズアーリミティッド",meaning:"数量限定・在庫に限りがあります",
   linkingParts:[{segment:"quantities_are",rule:"子音+母音リンキング",detail:"「z」+「are」→「ズアー」"},{segment:"are_limited",rule:"母音+母音リンキング",detail:"「r」+「lim」→「アーリミ」"}],
   synonyms:[{text:"while supplies last",katakana:"ワイルサプライズラスト",meaning:"在庫がある限り"},{text:"stock is limited",katakana:"ストックイズリミティッド",meaning:"在庫が限られています"}],
   swapExample:{original:"Quantities are limited — order now.",swapped:"Quantities are limited, so act fast.",swappedMeaning:"数量限定ですのでお早めに"},
   scene:{en:"Common urgency phrase in TOEIC advertisements and promotional announcements.",ja:"TOEIC広告・プロモーションアナウンスでよく使われる在庫限定の表現。"},category:"汎用"},
  {id:415,text:"we apologize for the inconvenience",katakana:"ウィアポロジャイズフォージインコンヴィーニャンス",meaning:"ご不便をおかけして申し訳ありません",
   linkingParts:[{segment:"apologize_for",rule:"子音+母音リンキング",detail:"「z」+「for」→「ズフォー」"},{segment:"for_the",rule:"子音+母音リンキング",detail:"「r」+「the」→「ルジ」"}],
   synonyms:[{text:"we're sorry for the trouble",katakana:"ウィアーソーリフォーザトラブル",meaning:"ご迷惑をおかけして申し訳ありません"},{text:"please accept our apologies",katakana:"プリーズアクセプトアワアポロジズ",meaning:"お詫び申し上げます"}],
   swapExample:{original:"We apologize for the inconvenience.",swapped:"We apologize for the inconvenience this may cause.",swappedMeaning:"ご不便をおかけすることをお詫び申し上げます"},
   scene:{en:"Standard apology phrase in TOEIC announcements for delays, cancellations, or disruptions.",ja:"遅延・キャンセル・障害のアナウンスで必ず出るお詫びの定番表現。TOEICで最頻出フレーズの一つ。"},category:"汎用"},
  {id:416,text:"for more information",katakana:"フォーモアインフォメイション",meaning:"詳細については",
   linkingParts:[{segment:"for_more",rule:"子音+母音リンキング",detail:"「r」+「more」→「ルモア」"},{segment:"more_information",rule:"子音+母音リンキング",detail:"「r」+「info」→「リンフォ」"}],
   synonyms:[{text:"for further details",katakana:"フォーファーザディテイルズ",meaning:"詳細については"},{text:"to learn more",katakana:"トゥラーンモア",meaning:"詳しくは"}],
   swapExample:{original:"For more information, visit our website.",swapped:"For more information, please contact us directly.",swappedMeaning:"詳細については直接お問い合わせください"},
   scene:{en:"One of the most common closing phrases in TOEIC Part 4 announcements and Part 7 documents.",ja:"TOEICのアナウンス・文書の締めくくりでほぼ毎回登場する最頻出表現の一つ。"},category:"汎用"},
  {id:417,text:"take advantage of it",katakana:"テイカドヴァンテジオヴィッ",meaning:"〜を活用する・利用する",
   linkingParts:[{segment:"take_advantage",rule:"子音+母音リンキング",detail:"「k」+「adv」→「カドヴ」"},{segment:"advantage_of",rule:"子音+母音リンキング",detail:"「e」+「of」→「ジオヴ」"},{segment:"of_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"}],
   synonyms:[{text:"make use of it",katakana:"メイクユーズオヴィッ",meaning:"活用する"},{text:"capitalize on it",katakana:"キャピタライズノニッ",meaning:"〜を利用する"}],
   swapExample:{original:"Take advantage of this opportunity.",swapped:"Take advantage of our special offer today.",swappedMeaning:"本日の特別オファーをご活用ください"},
   scene:{en:"Used in advertisements and announcements to encourage customers to use an offer or service.",ja:"特典・サービスの利用を促す場面。TOEICの広告・プロモーションアナウンスで頻出。"},category:"汎用"},
  {id:418,text:"prior to",katakana:"プライオトゥ",meaning:"〜の前に",
   linkingParts:[{segment:"prior_to",rule:"子音+母音リンキング",detail:"「r」+「to」→「ロトゥ」"}],
   synonyms:[{text:"before",katakana:"ビフォア",meaning:"〜の前に"},{text:"in advance of",katakana:"イナドヴァンスオヴ",meaning:"〜に先立って"}],
   swapExample:{original:"Please confirm prior to arrival.",swapped:"Prior to the meeting, review the materials.",swappedMeaning:"会議前に資料を確認してください"},
   scene:{en:"Formal version of 'before'. Very common in TOEIC business documents and instructions.",ja:"「before」のフォーマル版。TOEICのビジネス文書・指示書で頻出の前置詞表現。"},category:"短縮形"},
  {id:419,text:"subsequent to",katakana:"サブシクウェントトゥ",meaning:"〜の後に・〜に続いて",
   linkingParts:[{segment:"subsequent_to",rule:"子音+母音リンキング",detail:"「t」+「to」→「ットトゥ」"}],
   synonyms:[{text:"following",katakana:"ファロウイング",meaning:"〜の後"},{text:"after",katakana:"アフタ",meaning:"〜の後"}],
   swapExample:{original:"Subsequent to the merger, restructuring began.",swapped:"Subsequent to the review, changes were made.",swappedMeaning:"審査の後、変更が加えられました"},
   scene:{en:"Formal 'after'. Appears in TOEIC Part 7 business reports and legal documents.",ja:"「after」のフォーマル版。TOEICのPart7ビジネスレポート・法的文書で出てくる高度な表現。"},category:"短縮形"},
  {id:420,text:"in the meantime",katakana:"インザミーンタイム",meaning:"その間に・それまでの間",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_meantime",rule:"子音+母音リンキング",detail:"「e」+「mean」→「ザミーン」"}],
   synonyms:[{text:"in the interim",katakana:"インジインタリム",meaning:"その間に"},{text:"meanwhile",katakana:"ミーンワイル",meaning:"一方"}],
   swapExample:{original:"In the meantime, please wait here.",swapped:"In the meantime, feel free to contact us.",swappedMeaning:"それまでの間、お気軽にご連絡ください"},
   scene:{en:"Used to describe what should happen while waiting for something else. Common in TOEIC service contexts.",ja:"何かを待っている間の行動を示す場面。TOEICのサービス・カスタマーサポートシーンで頻出。"},category:"短縮形"},
,

  // ══ 最終完全版 421-520 ══════════════════════════════════

  // ── 会議 追加 ─────────────────────────────────────────────
  {id:421,text:"get the ball rolling",katakana:"ゲッザボールロウリング",meaning:"話を始める・スタートを切る",
   linkingParts:[{segment:"get_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"ball_rolling",rule:"子音+母音リンキング",detail:"「l」+「rolling」→「ルロウリング」"}],
   synonyms:[{text:"kick it off",katakana:"キキロッフ",meaning:"始める"},{text:"start things off",katakana:"スタートシングズオッフ",meaning:"開始する"}],
   swapExample:{original:"Let's get the ball rolling.",swapped:"Who wants to get the ball rolling?",swappedMeaning:"誰か最初に口火を切ってもらえますか？"},
   scene:{en:"Used to start a meeting, project, or discussion. Very common as an opening phrase in TOEIC.",ja:"会議やプロジェクトを開始するときの慣用句。TOEICの会議冒頭シーンで頻出。"},category:"会議"},
  {id:422,text:"touch on it",katakana:"タッチョニッ",meaning:"軽く触れる",
   linkingParts:[{segment:"touch_on",rule:"子音+母音リンキング",detail:"「ch」+「on」→「チョン」"},{segment:"on_it",rule:"子音+母音リンキング",detail:"「n」+「it」→「ニッ」"}],
   synonyms:[{text:"mention it briefly",katakana:"メンショニッブリーフリ",meaning:"簡単に言及する"},{text:"cover it lightly",katakana:"カヴァリッライトリ",meaning:"軽くカバーする"}],
   swapExample:{original:"I'll touch on it briefly.",swapped:"We'll touch on it in the next section.",swappedMeaning:"次のセクションで軽く触れます"},
   scene:{en:"Used in presentations when covering a topic briefly without going into depth.",ja:"プレゼンで詳しくは説明せず軽く触れる場面。「ちなみに」程度の言及でよく使う。"},category:"会議"},
  {id:423,text:"take it up with",katakana:"テイキラップウィズ",meaning:"〜に直接話を持っていく",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"bring it to",katakana:"ブリンギットゥ",meaning:"〜に持っていく"},{text:"raise it with",katakana:"レイジッウィズ",meaning:"〜に提起する"}],
   swapExample:{original:"You should take it up with HR.",swapped:"Take it up with the manager directly.",swappedMeaning:"マネージャーに直接話を持っていくべきです"},
   scene:{en:"Used when directing someone to address a concern with the right person or department.",ja:"問題を適切な担当者・部署に持ち込むよう促す場面。「それは〇〇に言って」の英語版。"},category:"会議"},
  {id:424,text:"any questions",katakana:"エニクウェスチョンズ",meaning:"質問はありますか？",
   linkingParts:[{segment:"any_questions",rule:"母音+子音リンキング",detail:"「y」+「questions」→「ニクウェスチョンズ」"}],
   synonyms:[{text:"any concerns",katakana:"エニコンサーンズ",meaning:"懸念はありますか？"},{text:"floor is open",katakana:"フロアリズオウプン",meaning:"フロアを開きます"}],
   swapExample:{original:"Any questions before we move on?",swapped:"Any questions about what we've covered?",swappedMeaning:"ここまでの内容で質問はありますか？"},
   scene:{en:"One of the most common phrases in TOEIC meeting and presentation dialogues.",ja:"会議・プレゼンで質問を募るときの定番。TOEICでほぼ毎回登場する最頻出フレーズ。"},category:"会議"},
  {id:425,text:"let's get started",katakana:"レッツゲッスターリッ",meaning:"始めましょう",
   linkingParts:[{segment:"let's_get",rule:"子音+母音リンキング",detail:"「z」+「get」→「ズゲッ」"},{segment:"get_started",rule:"子音+子音",detail:"「t」+「st」→「ッスターリッ」"}],
   synonyms:[{text:"shall we begin",katakana:"シャルウィビギン",meaning:"始めましょうか"},{text:"let's begin",katakana:"レッツビギン",meaning:"始めましょう"}],
   swapExample:{original:"Let's get started.",swapped:"Let's get started — we're running short on time.",swappedMeaning:"時間が少ないので始めましょう"},
   scene:{en:"Standard meeting opener. One of the most heard phrases in TOEIC Part 3 conversations.",ja:"会議の開始の合図。TOEICのPart3会話で最も頻繁に登場するオープナーの一つ。"},category:"会議"},

  // ── 電話 追加 ─────────────────────────────────────────────
  {id:426,text:"is this a good time",katakana:"イジスアグッドタイム",meaning:"今よろしいですか？",
   linkingParts:[{segment:"is_this",rule:"子音+母音リンキング",detail:"「z」+「this」→「ジス」"},{segment:"this_a",rule:"子音+母音リンキング",detail:"「s」+「a」→「サ」"},{segment:"a_good",rule:"母音+子音リンキング",detail:"「a」+「good」→「アグッド」"}],
   synonyms:[{text:"do you have a moment",katakana:"ドゥユーハヴァモーメン",meaning:"少し時間がありますか？"},{text:"am I catching you at a bad time",katakana:"アマイキャッチングユーアタバッドタイム",meaning:"忙しいですか？"}],
   swapExample:{original:"Is this a good time to talk?",swapped:"Is this a good time, or should I call back?",swappedMeaning:"今よろしいですか？それとも折り返しましょうか？"},
   scene:{en:"Standard phone opener to check if the other person is available. Very common in TOEIC calls.",ja:"電話で相手の都合を確認するときの定番表現。TOEICの電話シーンで必ず出てくる。"},category:"電話"},
  {id:427,text:"I'm calling about",katakana:"アイムコーリングアバウッ",meaning:"〜の件でお電話しています",
   linkingParts:[{segment:"calling_about",rule:"子音+母音リンキング",detail:"「ng」+「about」→「ングアバウッ」"}],
   synonyms:[{text:"I'm calling regarding",katakana:"アイムコーリングリガーディング",meaning:"〜に関してお電話しています"},{text:"I'm reaching out about",katakana:"アイムリーチングアウタバウッ",meaning:"〜についてご連絡しています"}],
   swapExample:{original:"I'm calling about the order.",swapped:"I'm calling about the meeting scheduled for tomorrow.",swappedMeaning:"明日予定の会議の件でお電話しています"},
   scene:{en:"Standard phrase to open a business call and state the purpose immediately.",ja:"電話の目的をすぐに伝えるビジネス通話の定番オープナー。TOEICで必ず出る。"},category:"電話"},
  {id:428,text:"could you transfer me",katakana:"クジュトランスファーミー",meaning:"転送してもらえますか？",
   linkingParts:[{segment:"could_you",rule:"弱形・縮約",detail:"「d」+「you」→「ジュ」（yod coalescence）"},{segment:"you_transfer",rule:"母音+子音リンキング",detail:"「u」+「trans」→「ユトランス」"}],
   synonyms:[{text:"can you put me through",katakana:"キャニュープッミースルー",meaning:"繋いでもらえますか？"},{text:"could you connect me to",katakana:"クジュコネクッミートゥ",meaning:"〜に繋いでもらえますか？"}],
   swapExample:{original:"Could you transfer me to sales?",swapped:"Could you transfer me to the person in charge?",swappedMeaning:"担当者に転送していただけますか？"},
   scene:{en:"Used when asking a receptionist to redirect your call to the right department.",ja:"受付に別部署への転送を依頼するときの表現。TOEICの電話転送シーンで頻出。"},category:"電話"},

  // ── 人事 追加 ─────────────────────────────────────────────
  {id:429,text:"take it on board",katakana:"テイキロンボード",meaning:"受け入れる・考慮する",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_on",rule:"flap T + 母音",detail:"「t」+「on」→「ロン」"},{segment:"on_board",rule:"子音+子音",detail:"「n」+「b」→「ンボード」"}],
   synonyms:[{text:"take it into consideration",katakana:"テイキリンツーコンシダレイション",meaning:"考慮する"},{text:"accept it",katakana:"アクセプリッ",meaning:"受け入れる"}],
   swapExample:{original:"I'll take your feedback on board.",swapped:"Please take these concerns on board.",swappedMeaning:"これらの懸念を考慮してください"},
   scene:{en:"British English phrase for accepting and considering feedback or suggestions.",ja:"フィードバックや提案を受け入れて考慮する場面。英国英語でよく使われ、TOEICでも頻出。"},category:"人事"},
  {id:430,text:"give it your best shot",katakana:"ギヴィッユアベストショッ",meaning:"全力を尽くす",
   linkingParts:[{segment:"give_it",rule:"子音+母音リンキング",detail:"「v」+「it」→「ヴィッ」"},{segment:"it_your",rule:"flap T + 母音",detail:"「t」+「your」→「ユア」"},{segment:"best_shot",rule:"子音+子音",detail:"「t」+「sh」→「ッショッ」"}],
   synonyms:[{text:"do your best",katakana:"ドゥユアベスト",meaning:"ベストを尽くす"},{text:"give it everything",katakana:"ギヴィリエヴリシング",meaning:"全てを注ぎ込む"}],
   swapExample:{original:"Just give it your best shot.",swapped:"Give it your best shot and see what happens.",swappedMeaning:"全力を尽くして結果を見てみましょう"},
   scene:{en:"Encouragement to try as hard as possible, especially before an important task or challenge.",ja:"重要なタスクや挑戦の前に全力を尽くすよう励ます表現。評価・試験・プレゼン前によく使われる。"},category:"人事"},
  {id:431,text:"in the pipeline",katakana:"インザパイプライン",meaning:"計画中・準備中",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"the_pipeline",rule:"子音+母音リンキング",detail:"「e」+「pipe」→「ザパイプ」"}],
   synonyms:[{text:"in progress",katakana:"インプログレス",meaning:"進行中"},{text:"being planned",katakana:"ビーイングプランド",meaning:"計画中"}],
   swapExample:{original:"We have several projects in the pipeline.",swapped:"There are new features in the pipeline for Q2.",swappedMeaning:"Q2に向けて新機能が準備中です"},
   scene:{en:"Used to describe projects or products that are planned or under development.",ja:"計画中・開発中のプロジェクトや製品を表す場面。製品ロードマップ・事業計画でよく出る。"},category:"ビジネス定型"},
  {id:432,text:"up in the air",katakana:"アップインジエア",meaning:"未定・宙ぶらりん",
   linkingParts:[{segment:"up_in",rule:"子音+母音リンキング",detail:"「p」+「in」→「ピン」"},{segment:"in_the",rule:"母音+子音リンキング",detail:"「n」+「the」→「ンジ」"},{segment:"the_air",rule:"子音+母音リンキング",detail:"「e」+「air」→「ジエア」"}],
   synonyms:[{text:"undecided",katakana:"アンディサイディッド",meaning:"未決定の"},{text:"uncertain",katakana:"アンサートゥン",meaning:"不確か"}],
   swapExample:{original:"The date is still up in the air.",swapped:"The budget is still up in the air — we'll know next week.",swappedMeaning:"予算はまだ未定です。来週にはわかります"},
   scene:{en:"Used when plans or decisions are not yet finalized. Common in project management discussions.",ja:"計画や決定がまだ確定していない場面。プロジェクト管理・スケジュール議論でよく出る。"},category:"ビジネス定型"},

  // ── IT 追加 ───────────────────────────────────────────────
  {id:433,text:"log it",katakana:"ロギッ",meaning:"記録する・ログに残す",
   linkingParts:[{segment:"log_it",rule:"子音+母音リンキング",detail:"「g」+「it」→「ギッ」"}],
   synonyms:[{text:"record it",katakana:"レコーリッ",meaning:"記録する"},{text:"document it",katakana:"ドキュメンリッ",meaning:"文書化する"}],
   swapExample:{original:"Log it in the system.",swapped:"Log it and assign it to the right team.",swappedMeaning:"システムに記録して適切なチームに割り当ててください"},
   scene:{en:"Used in IT and customer service when recording issues or events in a system.",ja:"IT・カスタマーサービスでシステムに問題・イベントを記録する場面。ヘルプデスクで頻出。"},category:"IT"},
  {id:434,text:"go live",katakana:"ゴウライヴ",meaning:"本番稼働する・公開する",
   linkingParts:[{segment:"go_live",rule:"母音+子音リンキング",detail:"「o」+「live」→「ゴウライヴ」"}],
   synonyms:[{text:"launch it",katakana:"ローンチィッ",meaning:"ローンチする"},{text:"go into production",katakana:"ゴウイントゥプロダクション",meaning:"本番に移行する"}],
   swapExample:{original:"The new system goes live tomorrow.",swapped:"We're ready to go live — everything is tested.",swappedMeaning:"全てテスト済みで本番稼働の準備ができています"},
   scene:{en:"Used in IT/product when a system or website becomes publicly available.",ja:"システムやウェブサイトが本番稼働・公開される場面。ITプロジェクトで必ず使われる表現。"},category:"IT"},
  {id:435,text:"sync it up",katakana:"シンキラップ",meaning:"同期する・揃える",
   linkingParts:[{segment:"sync_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_up",rule:"flap T + 母音",detail:"「t」+「up」→「ラップ」"}],
   synonyms:[{text:"synchronize it",katakana:"シンクロナイジッ",meaning:"同期する"},{text:"align it",katakana:"アラインイッ",meaning:"揃える"}],
   swapExample:{original:"Sync it up with the main branch.",swapped:"Let's sync it up before the meeting.",swappedMeaning:"会議前に同期しておきましょう"},
   scene:{en:"Used in tech and project management when aligning data, versions, or schedules.",ja:"データ・バージョン・スケジュールを揃える場面。IT・プロジェクト管理で日常的に使われる。"},category:"IT"},

  // ── 財務 追加 ─────────────────────────────────────────────
  {id:436,text:"break it down by",katakana:"ブレイキッダウンバイ",meaning:"〜別に分析する",
   linkingParts:[{segment:"break_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_down",rule:"子音+母音リンキング",detail:"「t」+「down」→「ッダウン」"},{segment:"down_by",rule:"子音+母音リンキング",detail:"「n」+「by」→「ンバイ」"}],
   synonyms:[{text:"categorize it by",katakana:"カテゴライジッバイ",meaning:"〜別に分類する"},{text:"segment it by",katakana:"セグメンリッバイ",meaning:"〜別にセグメントする"}],
   swapExample:{original:"Break it down by region.",swapped:"Break it down by quarter and product line.",swappedMeaning:"四半期・製品ライン別に分析してください"},
   scene:{en:"Used in data analysis when segmenting figures by category. Essential for analysts.",ja:"データを指定カテゴリで分解する場面。データアナリスト・財務レポートで毎日使う表現。"},category:"財務"},
  {id:437,text:"come in under budget",katakana:"カミンアンダバジット",meaning:"予算内に収まる",
   linkingParts:[{segment:"come_in",rule:"子音+母音リンキング",detail:"「m」+「in」→「ミン」"},{segment:"in_under",rule:"母音+母音リンキング",detail:"「n」+「under」→「ニアンダ」"}],
   synonyms:[{text:"stay within budget",katakana:"ステイウィジンバジット",meaning:"予算内に収まる"},{text:"save money",katakana:"セイヴマニー",meaning:"節約する"}],
   swapExample:{original:"We came in under budget this quarter.",swapped:"The project came in under budget by 10%.",swappedMeaning:"プロジェクトは予算を10%下回りました"},
   scene:{en:"Used when reporting that costs were less than the allocated budget. Common in finance reviews.",ja:"実際のコストが予算を下回ったときの財務報告。四半期・年度末のレビューでよく出る。"},category:"財務"},
  {id:438,text:"go over budget",katakana:"ゴウオウヴァバジット",meaning:"予算を超過する",
   linkingParts:[{segment:"go_over",rule:"母音+母音リンキング",detail:"「o」+「over」→「オウオウヴァ」"},{segment:"over_budget",rule:"子音+子音",detail:"「r」+「b」→「ヴァバジット」"}],
   synonyms:[{text:"exceed the budget",katakana:"イクスシードザバジット",meaning:"予算を超える"},{text:"overspend",katakana:"オウヴァスペンド",meaning:"使いすぎる"}],
   swapExample:{original:"We can't go over budget.",swapped:"We went over budget by 15% last quarter.",swappedMeaning:"前四半期は15%予算を超過しました"},
   scene:{en:"Used when costs exceed the planned budget. Very common in TOEIC financial discussions.",ja:"コストが予算を超えた場面。TOEICの財務・プロジェクト管理問題で頻出。"},category:"財務"},
  {id:439,text:"return on investment",katakana:"リターンオンインヴェストメン",meaning:"投資利益率（ROI）",
   linkingParts:[{segment:"return_on",rule:"子音+母音リンキング",detail:"「n」+「on」→「ノン」"},{segment:"on_investment",rule:"子音+母音リンキング",detail:"「n」+「inv」→「ニンヴ」"}],
   synonyms:[{text:"ROI",katakana:"アールオウアイ",meaning:"投資収益率"},{text:"yield on investment",katakana:"イールドオンインヴェストメン",meaning:"投資利回り"}],
   swapExample:{original:"What's the return on investment?",swapped:"The return on investment exceeded expectations.",swappedMeaning:"投資収益率が期待を上回りました"},
   scene:{en:"Key financial metric used in business decisions and investment analyses.",ja:"ビジネス判断・投資分析で必ず使われる財務指標。TOEICの財務・経営シーンで頻出。"},category:"財務"},

  // ── 顧客対応 追加 ─────────────────────────────────────────
  {id:440,text:"bear with me",katakana:"ベアウィズミー",meaning:"少々お待ちください",
   linkingParts:[{segment:"bear_with",rule:"子音+子音",detail:"「r」+「w」→「ルウィズ」"},{segment:"with_me",rule:"子音+母音リンキング",detail:"「th」+「me」→「ズミー」"}],
   synonyms:[{text:"bear with us",katakana:"ベアウィズアス",meaning:"少々お待ちください（複数）"},{text:"hold on please",katakana:"ホールドンプリーズ",meaning:"少々お待ちください"}],
   swapExample:{original:"Bear with me for a moment.",swapped:"Bear with me while I pull up your account.",swappedMeaning:"アカウントを確認する間少々お待ちください"},
   scene:{en:"Used in customer service when you need a moment to look something up or process a request.",ja:"調べ物や処理のために少し時間が必要なときの丁寧な表現。カスタマーサービスで頻出。"},category:"顧客対応"},
  {id:441,text:"rest assured",katakana:"レストアシュアード",meaning:"ご安心ください",
   linkingParts:[{segment:"rest_assured",rule:"子音+母音リンキング",detail:"「t」+「assured」→「タシュアード」"}],
   synonyms:[{text:"don't worry",katakana:"ドンウォーリ",meaning:"心配しないで"},{text:"be confident that",katakana:"ビーコンフィデントザッ",meaning:"〜を確信してください"}],
   swapExample:{original:"Rest assured, we will handle it.",swapped:"Rest assured that your data is secure.",swappedMeaning:"データは安全であることをご確認ください"},
   scene:{en:"Formal reassurance phrase used in customer service and business communications.",ja:"顧客対応・ビジネスコミュニケーションで安心感を与えるフォーマルな表現。"},category:"顧客対応"},
  {id:442,text:"on your behalf",katakana:"オンユアビハーフ",meaning:"あなたの代わりに",
   linkingParts:[{segment:"on_your",rule:"子音+母音リンキング",detail:"「n」+「your」→「ニュア」"},{segment:"your_behalf",rule:"子音+子音",detail:"「r」+「b」→「ユアビ」"}],
   synonyms:[{text:"for you",katakana:"フォーユー",meaning:"あなたのために"},{text:"as your representative",katakana:"アズユアレプリゼンタティヴ",meaning:"代理として"}],
   swapExample:{original:"I'll handle it on your behalf.",swapped:"We'll contact them on your behalf.",swappedMeaning:"代わりに先方にご連絡します"},
   scene:{en:"Used in customer service when staff act on behalf of the customer.",ja:"スタッフが顧客の代わりに手続きする場面。カスタマーサービス・代理業務でよく出る。"},category:"顧客対応"},

  // ── プレゼン 追加 ─────────────────────────────────────────
  {id:443,text:"to recap",katakana:"トゥリキャップ",meaning:"まとめると・おさらいすると",
   linkingParts:[{segment:"to_recap",rule:"子音+母音リンキング",detail:"「o」+「recap」→「トゥリキャップ」"}],
   synonyms:[{text:"to summarize",katakana:"トゥサマライズ",meaning:"まとめると"},{text:"in summary",katakana:"インサマリ",meaning:"要約すると"}],
   swapExample:{original:"To recap, we covered three main points.",swapped:"To recap what we discussed, the deadline is Friday.",swappedMeaning:"おさらいすると、締め切りは金曜日です"},
   scene:{en:"Used at the end of a presentation or meeting section to summarize key points.",ja:"プレゼン・会議の区切りでポイントをおさらいする場面。リスナーへの配慮として頻繁に使われる。"},category:"プレゼン"},
  {id:444,text:"as you can see",katakana:"アジュキャンスィー",meaning:"ご覧の通り",
   linkingParts:[{segment:"as_you",rule:"子音+母音リンキング",detail:"「z」+「you」→「ジュ」"},{segment:"you_can",rule:"母音+子音リンキング",detail:"「u」+「can」→「ユキャン」"}],
   synonyms:[{text:"as shown here",katakana:"アズショウンヒア",meaning:"ここに示すように"},{text:"notice that",katakana:"ノウティスザッ",meaning:"〜に注目してください"}],
   swapExample:{original:"As you can see, sales are up.",swapped:"As you can see from the chart, costs have dropped.",swappedMeaning:"グラフからわかるように、コストが下がっています"},
   scene:{en:"Used when directing attention to a visual or data point during a presentation.",ja:"プレゼン中にスライドやデータに注目させるときの定番表現。TOEICの発表シーンで頻出。"},category:"プレゼン"},
  {id:445,text:"moving on",katakana:"ムーヴィングオン",meaning:"次に移ります",
   linkingParts:[{segment:"moving_on",rule:"子音+母音リンキング",detail:"「ng」+「on」→「ングオン」"}],
   synonyms:[{text:"next up",katakana:"ネクストアップ",meaning:"次は"},{text:"turning to",katakana:"ターニングトゥ",meaning:"〜に移ります"}],
   swapExample:{original:"Moving on to the next slide.",swapped:"Moving on, let's discuss the budget.",swappedMeaning:"次に予算について議論しましょう"},
   scene:{en:"Transition phrase used in presentations to shift from one topic to the next.",ja:"プレゼンで話題を切り替えるときの定番トランジションフレーズ。"},category:"プレゼン"},

  // ── 採用 追加 ─────────────────────────────────────────────
  {id:446,text:"submit your resume",katakana:"サブミッチュアレジュメ",meaning:"履歴書を提出する",
   linkingParts:[{segment:"submit_your",rule:"子音+母音リンキング",detail:"「t」+「your」→「チュア」（yod）"},{segment:"your_resume",rule:"子音+母音リンキング",detail:"「r」+「res」→「ユアレジュメ」"}],
   synonyms:[{text:"send in your CV",katakana:"センディンユアスィーヴィー",meaning:"CVを送る"},{text:"apply with your resume",katakana:"アプライウィジュアレジュメ",meaning:"履歴書で応募する"}],
   swapExample:{original:"Please submit your resume online.",swapped:"Submit your resume along with a cover letter.",swappedMeaning:"カバーレターとともに履歴書を提出してください"},
   scene:{en:"Standard recruitment phrase when asking candidates to apply for a position.",ja:"採用で応募者に履歴書の提出を求める場面。TOEICの採用プロセス問題で必ず出る。"},category:"採用"},
  {id:447,text:"the position has been filled",katakana:"ザポジションハズビンフィルド",meaning:"ポジションは埋まりました",
   linkingParts:[{segment:"position_has",rule:"子音+母音リンキング",detail:"「n」+「has」→「ンハズ」"},{segment:"has_been",rule:"子音+子音",detail:"「z」+「b」→「ズビン」"}],
   synonyms:[{text:"we've hired someone",katakana:"ウィヴハイアードサムワン",meaning:"採用が決まりました"},{text:"the vacancy is closed",katakana:"ザヴェイカンシーイズクロウズド",meaning:"空きはなくなりました"}],
   swapExample:{original:"Unfortunately, the position has been filled.",swapped:"The position has been filled internally.",swappedMeaning:"ポジションは社内で充当されました"},
   scene:{en:"Used to notify applicants that a job is no longer available. Common in TOEIC HR dialogues.",ja:"求人ポジションが埋まったことを応募者に伝える場面。TOEICの採用シーンで頻出。"},category:"採用"},

  // ── 研修 追加 ─────────────────────────────────────────────
  {id:448,text:"hands-on training",katakana:"ハンズオントレイニング",meaning:"実践的なトレーニング",
   linkingParts:[{segment:"hands_on",rule:"子音+母音リンキング",detail:"「z」+「on」→「ゾン」"},{segment:"on_training",rule:"子音+母音リンキング",detail:"「n」+「train」→「ントレイニング」"}],
   synonyms:[{text:"on-the-job training",katakana:"オンザジョブトレイニング",meaning:"OJT"},{text:"practical training",katakana:"プラクティカルトレイニング",meaning:"実践訓練"}],
   swapExample:{original:"We provide hands-on training.",swapped:"The program includes two weeks of hands-on training.",swappedMeaning:"プログラムには2週間の実践トレーニングが含まれます"},
   scene:{en:"Used in job descriptions and training programs to emphasize practical experience.",ja:"実践的な経験を強調する研修・求人の場面。TOEICの採用・研修シーンで頻出の複合語。"},category:"研修"},
  {id:449,text:"conduct a training session",katakana:"コンダクトアトレイニングセッション",meaning:"研修を実施する",
   linkingParts:[{segment:"conduct_a",rule:"子音+母音リンキング",detail:"「t」+「a」→「タ」"},{segment:"a_training",rule:"母音+子音リンキング",detail:"「a」+「train」→「アトレイン」"}],
   synonyms:[{text:"hold a workshop",katakana:"ホウルダワークショップ",meaning:"ワークショップを開催する"},{text:"run a seminar",katakana:"ラナセミナー",meaning:"セミナーを実施する"}],
   swapExample:{original:"We'll conduct a training session next week.",swapped:"HR will conduct a training session for all new hires.",swappedMeaning:"HRが全新入社員向けに研修を実施します"},
   scene:{en:"Used when organizing formal training for employees. Common in TOEIC HR announcements.",ja:"従業員向けの正式な研修を企画・実施する場面。TOEICの人事アナウンスでよく出る。"},category:"研修"},

  // ── 製造 追加 ─────────────────────────────────────────────
  {id:450,text:"up to standard",katakana:"アップトゥスタンダード",meaning:"基準を満たしている",
   linkingParts:[{segment:"up_to",rule:"子音+母音リンキング",detail:"「p」+「to」→「プトゥ」"},{segment:"to_standard",rule:"子音+子音",detail:"「o」+「st」→「トゥスタンダード」"}],
   synonyms:[{text:"meets specifications",katakana:"ミーツスペシフィケイションズ",meaning:"仕様を満たす"},{text:"up to par",katakana:"アップトゥパー",meaning:"基準通り"}],
   swapExample:{original:"Is it up to standard?",swapped:"The product isn't up to standard — rework needed.",swappedMeaning:"製品が基準を満たしていないため、やり直しが必要です"},
   scene:{en:"Used in quality control when checking if products meet required specifications.",ja:"品質管理で製品が基準を満たしているか確認する場面。製造・品質管理で必須の表現。"},category:"製造"},
  {id:451,text:"ahead of schedule",katakana:"アヘドオヴスケジュール",meaning:"予定より早い・前倒し",
   linkingParts:[{segment:"ahead_of",rule:"母音+母音リンキング",detail:"「d」+「of」→「ドオヴ」"},{segment:"of_schedule",rule:"子音+母音リンキング",detail:"「v」+「sch」→「ヴスケジュール」"}],
   synonyms:[{text:"early",katakana:"アーリー",meaning:"早い"},{text:"on track",katakana:"オントラック",meaning:"予定通り"}],
   swapExample:{original:"We're ahead of schedule.",swapped:"The project is three days ahead of schedule.",swappedMeaning:"プロジェクトは3日前倒しで進んでいます"},
   scene:{en:"Used in project management when work is progressing faster than planned.",ja:"プロジェクトが計画より早く進んでいることを報告する場面。進捗報告で頻出。"},category:"汎用"},
  {id:452,text:"behind schedule",katakana:"ビハインドスケジュール",meaning:"予定より遅れている",
   linkingParts:[{segment:"behind_schedule",rule:"子音+子音",detail:"「d」+「sch」→「ドスケジュール」"}],
   synonyms:[{text:"running late",katakana:"ランニングレイト",meaning:"遅れている"},{text:"delayed",katakana:"ディレイド",meaning:"遅延している"}],
   swapExample:{original:"We're behind schedule.",swapped:"The construction is two weeks behind schedule.",swappedMeaning:"工事が2週間遅れています"},
   scene:{en:"Used in project management when work is progressing slower than planned.",ja:"プロジェクトが計画より遅れていることを報告する場面。進捗報告・クライアント報告で頻出。"},category:"汎用"},
  {id:453,text:"on track",katakana:"オントラック",meaning:"予定通り・順調",
   linkingParts:[{segment:"on_track",rule:"子音+母音リンキング",detail:"「n」+「track」→「ントラック」"}],
   synonyms:[{text:"on schedule",katakana:"オンスケジュール",meaning:"予定通り"},{text:"going well",katakana:"ゴウイングウェル",meaning:"うまくいっている"}],
   swapExample:{original:"Everything is on track.",swapped:"The project is on track to finish by Friday.",swappedMeaning:"プロジェクトは金曜日完了に向けて順調です"},
   scene:{en:"Used in progress reports to indicate a project is progressing as planned.",ja:"プロジェクトが計画通り進んでいることを示す進捗報告の定番表現。"},category:"汎用"},
  {id:454,text:"up and running",katakana:"アップアンドランニング",meaning:"稼働中・正常に動いている",
   linkingParts:[{segment:"up_and",rule:"子音+母音リンキング",detail:"「p」+「and」→「パンド」"},{segment:"and_running",rule:"子音+母音リンキング",detail:"「d」+「run」→「ドランニング」"}],
   synonyms:[{text:"operational",katakana:"オペレイショナル",meaning:"稼働中"},{text:"fully functional",katakana:"フリーファンクショナル",meaning:"完全に機能している"}],
   swapExample:{original:"The system is up and running.",swapped:"We'll have it up and running by Monday.",swappedMeaning:"月曜日までに稼働させます"},
   scene:{en:"Used in IT and operations when a system or process is working correctly.",ja:"システムや設備が正常に稼働していることを伝える場面。IT・設備管理でよく使われる。"},category:"IT"},
  {id:455,text:"out of order",katakana:"アウロヴォーダ",meaning:"故障中・使用不可",
   linkingParts:[{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_order",rule:"子音+母音リンキング",detail:"「v」+「order」→「ヴォーダ」"}],
   synonyms:[{text:"not working",katakana:"ノットワーキング",meaning:"動いていない"},{text:"broken",katakana:"ブロウクン",meaning:"壊れている"}],
   swapExample:{original:"The elevator is out of order.",swapped:"The printer is out of order — use the one on the second floor.",swappedMeaning:"プリンターが故障中です。2階のものをお使いください"},
   scene:{en:"Used in facility and equipment announcements when something is not working.",ja:"施設・設備が故障・使用不可のアナウンス場面。TOEICの施設管理・お知らせ問題で頻出。"},category:"施設"},
  {id:456,text:"under construction",katakana:"アンダコンストラクション",meaning:"工事中",
   linkingParts:[{segment:"under_construction",rule:"子音+母音リンキング",detail:"「r」+「con」→「ルコン」"}],
   synonyms:[{text:"being renovated",katakana:"ビーイングレノヴェイティッド",meaning:"改修中"},{text:"work in progress",katakana:"ワークインプログレス",meaning:"作業中"}],
   swapExample:{original:"The website is under construction.",swapped:"The north entrance is under construction until March.",swappedMeaning:"北側入口は3月まで工事中です"},
   scene:{en:"Used in facility and web announcements when something is being built or repaired.",ja:"施設やウェブサイトが工事・作業中であることを示す。TOEICのお知らせ問題で頻出。"},category:"施設"},
  {id:457,text:"place an order",katakana:"プレイサノーダ",meaning:"注文する",
   linkingParts:[{segment:"place_an",rule:"子音+母音リンキング",detail:"「s」+「an」→「サン」"},{segment:"an_order",rule:"母音+母音リンキング",detail:"「n」+「order」→「ナノーダ」"}],
   synonyms:[{text:"make an order",katakana:"メイカノーダ",meaning:"注文する"},{text:"submit an order",katakana:"サブミッタノーダ",meaning:"注文を出す"}],
   swapExample:{original:"I'd like to place an order.",swapped:"You can place an order online or by phone.",swappedMeaning:"オンラインまたはお電話でご注文いただけます"},
   scene:{en:"Used in retail, logistics, and customer service when making a purchase order.",ja:"小売・物流・カスタマーサービスで注文する場面。TOEICの購買・物流シーンで頻出。"},category:"顧客対応"},
  {id:458,text:"in stock",katakana:"インストック",meaning:"在庫あり",
   linkingParts:[{segment:"in_stock",rule:"子音+子音",detail:"「n」+「st」→「ンストック」"}],
   synonyms:[{text:"available",katakana:"アヴェイラブル",meaning:"入手可能"},{text:"on hand",katakana:"オンハンド",meaning:"手元にある"}],
   swapExample:{original:"Is it in stock?",swapped:"We have it in stock and can ship today.",swappedMeaning:"在庫があり、今日出荷できます"},
   scene:{en:"Used in retail and logistics when checking product availability.",ja:"在庫確認の場面。小売・物流・カスタマーサービスでよく使われる基本表現。"},category:"物流"},
  {id:459,text:"out of stock",katakana:"アウロヴストック",meaning:"在庫切れ",
   linkingParts:[{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_stock",rule:"子音+子音",detail:"「v」+「st」→「ヴストック」"}],
   synonyms:[{text:"sold out",katakana:"ソウルダウッ",meaning:"売り切れ"},{text:"unavailable",katakana:"アナヴェイラブル",meaning:"入手不可"}],
   swapExample:{original:"I'm afraid it's out of stock.",swapped:"It's out of stock but we expect more next week.",swappedMeaning:"在庫切れですが来週入荷予定です"},
   scene:{en:"Used when a product is not available. Very common in TOEIC retail and logistics dialogues.",ja:"製品が在庫切れの場面。TOEICの小売・物流ダイアログで必ず出てくる表現。"},category:"物流"},
  {id:460,text:"back in stock",katakana:"バキンストック",meaning:"再入荷・在庫が戻る",
   linkingParts:[{segment:"back_in",rule:"子音+母音リンキング",detail:"「k」+「in」→「キン」"},{segment:"in_stock",rule:"子音+子音",detail:"「n」+「st」→「ンストック」"}],
   synonyms:[{text:"restocked",katakana:"リーストックト",meaning:"再入荷した"},{text:"available again",katakana:"アヴェイラブルアゲン",meaning:"再び入手可能"}],
   swapExample:{original:"It will be back in stock next week.",swapped:"I'll notify you when it's back in stock.",swappedMeaning:"再入荷したらお知らせします"},
   scene:{en:"Used when notifying customers that a previously unavailable item is now available again.",ja:"在庫切れだった商品が再入荷したことを伝える場面。小売・ECサービスでよく使われる。"},category:"物流"},
  {id:461,text:"free of charge",katakana:"フリーオヴチャージ",meaning:"無料で",
   linkingParts:[{segment:"free_of",rule:"子音+母音リンキング",detail:"「e」+「of」→「イオヴ」"},{segment:"of_charge",rule:"子音+母音リンキング",detail:"「v」+「charge」→「ヴチャージ」"}],
   synonyms:[{text:"at no cost",katakana:"アットノウコスト",meaning:"費用なし"},{text:"complimentary",katakana:"コンプリメンタリ",meaning:"無料の"}],
   swapExample:{original:"This service is free of charge.",swapped:"Delivery is free of charge for orders over 50 dollars.",swappedMeaning:"50ドル以上のご注文は配送無料です"},
   scene:{en:"Used in customer service and advertisements when something costs nothing.",ja:"サービスや商品が無料であることを伝える場面。TOEICの広告・カスタマーサービスで頻出。"},category:"顧客対応"},
  {id:462,text:"at your earliest convenience",katakana:"アッチュアーリエストコンヴィーニャンス",meaning:"ご都合のよいときに・なるべく早く",
   linkingParts:[{segment:"at_your",rule:"子音+母音リンキング",detail:"「t」+「your」→「チュア」（yod）"},{segment:"your_earliest",rule:"子音+母音リンキング",detail:"「r」+「ear」→「ユアーリ」"}],
   synonyms:[{text:"as soon as possible",katakana:"アズスーナズポッシブル",meaning:"できるだけ早く"},{text:"when you get a chance",katakana:"ウェニュゲラチャンス",meaning:"都合がつき次第"}],
   swapExample:{original:"Please respond at your earliest convenience.",swapped:"Please call us back at your earliest convenience.",swappedMeaning:"ご都合のよいときに折り返しご連絡ください"},
   scene:{en:"Polite business phrase asking for a prompt response without being too demanding.",ja:"相手に急かさず早めの返事を求めるビジネスメールの丁寧な定番表現。TOEICのメール問題で頻出。"},category:"ビジネス定型"},
  {id:463,text:"please do not hesitate to",katakana:"プリーズドゥノットヘジテイトトゥ",meaning:"遠慮なく〜してください",
   linkingParts:[{segment:"do_not",rule:"子音+母音リンキング",detail:"「t」+「not」→「ットノット」"},{segment:"not_hesitate",rule:"子音+母音リンキング",detail:"「t」+「hes」→「ットヘジ」"}],
   synonyms:[{text:"feel free to",katakana:"フィールフリートゥ",meaning:"遠慮なく〜してください"},{text:"don't hesitate to",katakana:"ドンヘジテイトトゥ",meaning:"遠慮なく〜してください"}],
   swapExample:{original:"Please do not hesitate to contact us.",swapped:"Please do not hesitate to ask if you have questions.",swappedMeaning:"ご質問があれば遠慮なくお聞きください"},
   scene:{en:"Standard business email closing phrase. One of the most common in TOEIC Part 7 correspondence.",ja:"ビジネスメールの締めくくりで最もよく使われる表現の一つ。TOEICのPart7メールで必ず出る。"},category:"ビジネス定型"},
  {id:464,text:"we appreciate your",katakana:"ウィアプリーシエイチュア",meaning:"〜に感謝申し上げます",
   linkingParts:[{segment:"appreciate_your",rule:"子音+母音リンキング",detail:"「t」+「your」→「チュア」（yod）"}],
   synonyms:[{text:"thank you for your",katakana:"サンキューフォーユア",meaning:"〜に感謝します"},{text:"we are grateful for your",katakana:"ウィアーグレイトフルフォーユア",meaning:"〜に感謝しています"}],
   swapExample:{original:"We appreciate your patience.",swapped:"We appreciate your continued support.",swappedMeaning:"引き続きのご支援に感謝申し上げます"},
   scene:{en:"Formal appreciation phrase used in business letters and customer service communications.",ja:"ビジネスレター・カスタマーサービスでの感謝表現の定番。TOEICのPart7文書で頻出。"},category:"ビジネス定型"},
  {id:465,text:"enclosed please find",katakana:"インクロウズドプリーズファインド",meaning:"同封をご確認ください",
   linkingParts:[{segment:"enclosed_please",rule:"子音+子音",detail:"「d」+「pl」→「ドプリーズ」"},{segment:"please_find",rule:"子音+母音リンキング",detail:"「z」+「find」→「ズファインド」"}],
   synonyms:[{text:"attached please find",katakana:"アタッチドプリーズファインド",meaning:"添付をご確認ください"},{text:"I have enclosed",katakana:"アイハヴインクロウズド",meaning:"〜を同封しました"}],
   swapExample:{original:"Enclosed please find the invoice.",swapped:"Enclosed please find the signed contract.",swappedMeaning:"署名済み契約書を同封します"},
   scene:{en:"Formal business letter phrase for directing attention to enclosed documents.",ja:"同封書類に注意を向けるビジネスレターの定型表現。TOEICのPart7レター問題で頻出。"},category:"ビジネス定型"},
  {id:466,text:"to whom it may concern",katakana:"トゥフーミットメイコンサーン",meaning:"ご担当者様へ",
   linkingParts:[{segment:"to_whom",rule:"子音+母音リンキング",detail:"「o」+「whom」→「トゥフーム」"},{segment:"whom_it",rule:"子音+母音リンキング",detail:"「m」+「it」→「ミッ」"}],
   synonyms:[{text:"dear sir or madam",katakana:"ディアサーオアマダム",meaning:"拝啓"},{text:"dear hiring manager",katakana:"ディアハイアリングマネジャ",meaning:"採用担当者様"}],
   swapExample:{original:"To whom it may concern,",swapped:"To whom it may concern: I am writing to inquire about...",swappedMeaning:"ご担当者様：〜についてお問い合わせしたく存じます"},
   scene:{en:"Formal letter opener when the recipient is unknown. Common in TOEIC Part 7 formal letters.",ja:"宛先不明の公式レターの書き出し。TOEICのPart7正式レター問題で必ず出る定型表現。"},category:"ビジネス定型"},
  {id:467,text:"I am writing to",katakana:"アイアムライティングトゥ",meaning:"〜の件でご連絡しています",
   linkingParts:[{segment:"I_am",rule:"母音+母音リンキング",detail:"「I」+「am」→「アイアム」"},{segment:"am_writing",rule:"母音+子音リンキング",detail:"「m」+「writ」→「ムライティング」"}],
   synonyms:[{text:"I'm contacting you to",katakana:"アイムコンタクティングユートゥ",meaning:"〜のためにご連絡しています"},{text:"this email is to",katakana:"ジスイメイルイズトゥ",meaning:"このメールは〜のためです"}],
   swapExample:{original:"I am writing to inquire about the position.",swapped:"I am writing to follow up on my previous email.",swappedMeaning:"先日のメールのフォローアップでご連絡しています"},
   scene:{en:"Standard business email opener. One of the most frequent phrases in TOEIC Part 7.",ja:"ビジネスメールの書き出しの定番。TOEICのPart7メール問題で最も頻繁に登場する表現の一つ。"},category:"ビジネス定型"},
  {id:468,text:"as per your request",katakana:"アズパーユアリクウェスト",meaning:"ご要望通り",
   linkingParts:[{segment:"as_per",rule:"子音+母音リンキング",detail:"「z」+「per」→「ズパー」"},{segment:"per_your",rule:"子音+母音リンキング",detail:"「r」+「your」→「ルユア」"}],
   synonyms:[{text:"as requested",katakana:"アズリクウェスティッド",meaning:"ご依頼通り"},{text:"in accordance with your request",katakana:"イナコーダンスウィジュアリクウェスト",meaning:"ご要望に従い"}],
   swapExample:{original:"As per your request, I've attached the report.",swapped:"As per your request, the meeting has been rescheduled.",swappedMeaning:"ご要望通り、会議を再調整しました"},
   scene:{en:"Formal acknowledgment that you are responding to a specific request. Common in TOEIC Part 7.",ja:"依頼に応答していることを示す正式表現。TOEICのPart7ビジネスメール問題で頻出。"},category:"ビジネス定型"},
  {id:469,text:"feel free to",katakana:"フィールフリートゥ",meaning:"遠慮なく〜してください",
   linkingParts:[{segment:"feel_free",rule:"子音+母音リンキング",detail:"「l」+「free」→「ルフリー」"},{segment:"free_to",rule:"子音+母音リンキング",detail:"「e」+「to」→「ートゥ」"}],
   synonyms:[{text:"don't hesitate to",katakana:"ドンヘジテイトトゥ",meaning:"遠慮なく〜してください"},{text:"you're welcome to",katakana:"ユアウェルカムトゥ",meaning:"ご自由に〜してください"}],
   swapExample:{original:"Feel free to contact me anytime.",swapped:"Feel free to ask any questions you may have.",swappedMeaning:"何かご質問があれば遠慮なくお聞きください"},
   scene:{en:"Welcoming phrase used in emails and customer service to invite further communication.",ja:"メール・カスタマーサービスで追加のコミュニケーションを歓迎する場面。TOEICで頻出。"},category:"ビジネス定型"},
  {id:470,text:"get in touch",katakana:"ゲリンタッチ",meaning:"連絡を取る",
   linkingParts:[{segment:"get_in",rule:"子音+母音リンキング",detail:"「t」+「in」→「リン」（flap）"},{segment:"in_touch",rule:"母音+子音リンキング",detail:"「n」+「touch」→「ンタッチ」"}],
   synonyms:[{text:"reach out",katakana:"リーチャウッ",meaning:"連絡する"},{text:"contact us",katakana:"コンタクタス",meaning:"ご連絡ください"}],
   swapExample:{original:"Please get in touch if you need anything.",swapped:"Get in touch with our support team for assistance.",swappedMeaning:"サポートチームにご連絡ください"},
   scene:{en:"Used to invite someone to make contact. Very common in TOEIC customer service contexts.",ja:"連絡を取るよう促す場面。TOEICのカスタマーサービス・ビジネスメールで非常によく使われる。"},category:"電話"},
  {id:471,text:"looking into it",katakana:"ルキンインツーイッ",meaning:"調査中です",
   linkingParts:[{segment:"looking_into",rule:"子音+母音リンキング",detail:"「ng」+「into」→「ンギントゥ」"},{segment:"into_it",rule:"子音+母音リンキング",detail:"「o」+「it」→「ツーイッ」"}],
   synonyms:[{text:"investigating it",katakana:"インヴェスティゲイティングイッ",meaning:"調査しています"},{text:"checking on it",katakana:"チェキングオニッ",meaning:"確認中"}],
   swapExample:{original:"We're looking into it.",swapped:"Our team is looking into it and will update you shortly.",swappedMeaning:"チームが調査中で、まもなくご連絡します"},
   scene:{en:"Used in customer service when an issue is being investigated. Common follow-up phrase.",ja:"問題を調査中であることをお知らせするカスタマーサービスの定番表現。"},category:"顧客対応"},
  {id:472,text:"address the issue",katakana:"アドレスジイッシュー",meaning:"問題に対処する",
   linkingParts:[{segment:"address_the",rule:"子音+母音リンキング",detail:"「s」+「the」→「スジ」"},{segment:"the_issue",rule:"子音+母音リンキング",detail:"「e」+「issue」→「ジイッシュー」"}],
   synonyms:[{text:"resolve the problem",katakana:"リザルヴザプロブレム",meaning:"問題を解決する"},{text:"tackle it",katakana:"タクリッ",meaning:"取り組む"}],
   swapExample:{original:"We need to address the issue.",swapped:"Let's address the issue before it escalates.",swappedMeaning:"問題が大きくなる前に対処しましょう"},
   scene:{en:"Used in meetings and customer service when acknowledging and committing to solve a problem.",ja:"問題を認識して解決に取り組むことを表明する場面。会議・カスタマーサービスで頻出。"},category:"汎用"},
  {id:473,text:"get back on track",katakana:"ゲッバックオントラック",meaning:"軌道に戻す",
   linkingParts:[{segment:"get_back",rule:"子音+子音 停止",detail:"「t」停止+「b」→「ゲッバック」"},{segment:"back_on",rule:"子音+母音リンキング",detail:"「k」+「on」→「コン」"},{segment:"on_track",rule:"子音+母音リンキング",detail:"「n」+「track」→「ントラック」"}],
   synonyms:[{text:"get back to normal",katakana:"ゲッバックトゥノーマル",meaning:"正常に戻す"},{text:"recover",katakana:"リカヴァ",meaning:"回復する"}],
   swapExample:{original:"We need to get back on track.",swapped:"Let's focus and get back on track.",swappedMeaning:"集中して軌道に戻しましょう"},
   scene:{en:"Used when a project or situation has gone off course and needs to be redirected.",ja:"プロジェクトや状況が軌道から外れたときに正常化する場面。リカバリー・危機対応でよく出る。"},category:"汎用"},
  {id:474,text:"state of the art",katakana:"ステイトオヴジアート",meaning:"最先端の",
   linkingParts:[{segment:"state_of",rule:"flap T + 母音",detail:"「t」+「of」→「ロヴ」（flap）"},{segment:"of_the",rule:"子音+母音リンキング",detail:"「v」+「the」→「ヴジ」"},{segment:"the_art",rule:"子音+母音リンキング",detail:"「e」+「art」→「ジアート」"}],
   synonyms:[{text:"cutting edge",katakana:"カッティングエッジ",meaning:"最先端"},{text:"latest technology",katakana:"レイテストテクノロジー",meaning:"最新技術"}],
   swapExample:{original:"It's a state of the art facility.",swapped:"We use state of the art equipment.",swappedMeaning:"最先端の設備を使用しています"},
   scene:{en:"Used in TOEIC advertisements and company descriptions to highlight advanced technology.",ja:"TOEICの広告・企業紹介で最先端技術・設備を強調する場面で頻出の表現。"},category:"マーケティング"},
  {id:475,text:"second to none",katakana:"セカンドトゥナン",meaning:"他の追随を許さない・最高の",
   linkingParts:[{segment:"second_to",rule:"子音+母音リンキング",detail:"「d」+「to」→「ドトゥ」"},{segment:"to_none",rule:"子音+母音リンキング",detail:"「o」+「none」→「トゥナン」"}],
   synonyms:[{text:"unmatched",katakana:"アンマッチト",meaning:"比類のない"},{text:"the best",katakana:"ザベスト",meaning:"最高"}],
   swapExample:{original:"Our customer service is second to none.",swapped:"The quality of our products is second to none.",swappedMeaning:"弊社製品の品質は他の追随を許しません"},
   scene:{en:"Superlative phrase used in TOEIC advertisements and company promotional materials.",ja:"TOEICの広告・プロモーション素材で製品・サービスの優位性を示す表現として頻出。"},category:"マーケティング"},
  {id:476,text:"inquire about it",katakana:"インクワイアラバウリッ",meaning:"〜について問い合わせる",
   linkingParts:[{segment:"inquire_about",rule:"子音+母音リンキング",detail:"「r」+「about」→「ラバウッ」"},{segment:"about_it",rule:"flap T + 母音",detail:"「t」+「it」→「リッ」（flap）"}],
   synonyms:[{text:"ask about it",katakana:"アスカバウリッ",meaning:"〜について尋ねる"},{text:"find out about it",katakana:"ファインダウッアバウリッ",meaning:"〜について調べる"}],
   swapExample:{original:"Please inquire about it at the front desk.",swapped:"I'd like to inquire about the availability.",swappedMeaning:"空き状況についてお問い合わせしたいです"},
   scene:{en:"Used when asking for information about a product, service, or position.",ja:"製品・サービス・求人について情報を求める場面。TOEICのカスタマーサービス・採用問題で頻出。"},category:"顧客対応"},
  {id:477,text:"get the most out of it",katakana:"ゲッザモウストアウロヴィッ",meaning:"最大限に活用する",
   linkingParts:[{segment:"get_the",rule:"子音+母音リンキング",detail:"「t」+「the」→「ッザ」"},{segment:"most_out",rule:"flap T + 母音",detail:"「t」+「out」→「ロヴィッ」（flap）"},{segment:"out_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「ラウロヴ」"}],
   synonyms:[{text:"maximize it",katakana:"マクシマイジッ",meaning:"最大化する"},{text:"make the most of it",katakana:"メイクザモウストオヴィッ",meaning:"最大限に活用する"}],
   swapExample:{original:"Get the most out of it.",swapped:"Here's how to get the most out of your membership.",swappedMeaning:"会員資格を最大限に活用する方法です"},
   scene:{en:"Used in advertisements and training to encourage full use of a product or service.",ja:"製品・サービス・機会の最大活用を促す場面。TOEICの広告・研修問題でよく出る。"},category:"汎用"},
  {id:478,text:"smooth it over",katakana:"スムーリロウヴァ",meaning:"丸く収める・なだめる",
   linkingParts:[{segment:"smooth_it",rule:"子音+母音リンキング",detail:"「th」+「it」→「ジッ」"},{segment:"it_over",rule:"flap T + 母音",detail:"「t」+「over」→「ロウヴァ」"}],
   synonyms:[{text:"patch it up",katakana:"パッチィラップ",meaning:"修復する"},{text:"calm it down",katakana:"カームィッダウン",meaning:"鎮める"}],
   swapExample:{original:"I'll try to smooth it over.",swapped:"Can you smooth it over with the client?",swappedMeaning:"クライアントとの関係を修復できますか？"},
   scene:{en:"Used when trying to calm a tense situation or fix a damaged relationship.",ja:"緊張した状況や損傷した関係を修復する場面。クライアント対応・対立解消でよく出る。"},category:"汎用"},
  {id:479,text:"in the long run",katakana:"インザロングラン",meaning:"長期的には",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"long_run",rule:"子音+母音リンキング",detail:"「ng」+「run」→「ングラン」"}],
   synonyms:[{text:"in the end",katakana:"インジエンド",meaning:"最終的に"},{text:"over time",katakana:"オウヴァタイム",meaning:"時間が経つと"}],
   swapExample:{original:"In the long run, it will save money.",swapped:"In the long run, this investment will pay off.",swappedMeaning:"長期的には、この投資は実を結ぶでしょう"},
   scene:{en:"Used when discussing long-term benefits or outcomes of a decision.",ja:"決定の長期的な利益や結果を議論する場面。戦略・投資・政策議論でよく使われる。"},category:"汎用"},
  {id:480,text:"in the short term",katakana:"インザショートターム",meaning:"短期的には",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンザ」"},{segment:"short_term",rule:"子音+子音",detail:"「t」+「t」→「ットターム」"}],
   synonyms:[{text:"right now",katakana:"ライトナウ",meaning:"今すぐ"},{text:"temporarily",katakana:"テンポラリリ",meaning:"一時的に"}],
   swapExample:{original:"In the short term, costs will increase.",swapped:"In the short term, we need to cut expenses.",swappedMeaning:"短期的にはコストを削減する必要があります"},
   scene:{en:"Used when discussing immediate or near-future implications of a decision.",ja:"決定の短期的・近未来的な影響を議論する場面。財務・戦略議論でよく使われる。"},category:"汎用"},
  {id:481,text:"take it easy",katakana:"テイキリージー",meaning:"無理しないで・気楽にいこう",
   linkingParts:[{segment:"take_it",rule:"子音+母音リンキング",detail:"「k」+「it」→「キッ」"},{segment:"it_easy",rule:"flap T + 母音",detail:"「t」+「easy」→「リージー」"}],
   synonyms:[{text:"don't overdo it",katakana:"ドンオウヴァドゥーイッ",meaning:"無理しすぎないで"},{text:"relax",katakana:"リラックス",meaning:"リラックスして"}],
   swapExample:{original:"Take it easy — you've been working too hard.",swapped:"Take it easy for the rest of the week.",swappedMeaning:"今週の残りはゆっくりしてください"},
   scene:{en:"Used to encourage someone to relax or not work too hard. Also a casual farewell.",ja:"病気明けや過労ぎみの人への「無理しないで」。別れの挨拶としても使われる。"},category:"人事"},
  {id:482,text:"go the extra mile",katakana:"ゴウジエクストラマイル",meaning:"一歩以上頑張る・特別な努力をする",
   linkingParts:[{segment:"go_the",rule:"母音+子音リンキング",detail:"「o」+「the」→「ゴウジ」"},{segment:"extra_mile",rule:"子音+母音リンキング",detail:"「a」+「mile」→「アマイル」"}],
   synonyms:[{text:"go above and beyond",katakana:"ゴウアバヴアンドビヨンド",meaning:"期待以上のことをする"},{text:"put in extra effort",katakana:"プリニクストラエフォート",meaning:"特別な努力をする"}],
   swapExample:{original:"We always go the extra mile for customers.",swapped:"She really went the extra mile on this project.",swappedMeaning:"彼女はこのプロジェクトで本当に特別な頑張りを見せました"},
   scene:{en:"Used to describe going beyond what is expected. Common in performance reviews and customer service.",ja:"期待以上の努力をする場面。業績評価・カスタマーサービスの優秀な取り組みを称えるときに使われる。"},category:"汎用"},
  {id:483,text:"keep in mind",katakana:"キーピンマインド",meaning:"心に留めておく・注意する",
   linkingParts:[{segment:"keep_in",rule:"子音+母音リンキング",detail:"「p」+「in」→「ピン」"},{segment:"in_mind",rule:"母音+子音リンキング",detail:"「n」+「mind」→「ンマインド」"}],
   synonyms:[{text:"bear in mind",katakana:"ベアリンマインド",meaning:"心に留める"},{text:"don't forget that",katakana:"ドンフォーゲッザッ",meaning:"〜を忘れないで"}],
   swapExample:{original:"Keep in mind that the deadline is Friday.",swapped:"Keep in mind that prices are subject to change.",swappedMeaning:"価格は変更になる場合があることをご注意ください"},
   scene:{en:"Used to remind someone of an important consideration or constraint.",ja:"重要な考慮事項や制約を念押しする場面。会議・メール・アナウンスでよく使われる。"},category:"汎用"},
  {id:484,text:"bear in mind",katakana:"ベアリンマインド",meaning:"心に留めておく",
   linkingParts:[{segment:"bear_in",rule:"子音+母音リンキング",detail:"「r」+「in」→「リン」"},{segment:"in_mind",rule:"母音+子音リンキング",detail:"「n」+「mind」→「ンマインド」"}],
   synonyms:[{text:"keep in mind",katakana:"キーピンマインド",meaning:"心に留める"},{text:"remember that",katakana:"リメンバーザッ",meaning:"〜を覚えておく"}],
   swapExample:{original:"Bear in mind that costs may vary.",swapped:"Please bear in mind the security requirements.",swappedMeaning:"セキュリティ要件を念頭に置いてください"},
   scene:{en:"Slightly more formal than 'keep in mind'. Common in TOEIC business documents and memos.",ja:"「keep in mind」のやや正式版。TOEICのビジネス文書・メモでよく出る注意喚起表現。"},category:"ビジネス定型"},
  {id:485,text:"with that said",katakana:"ウィズザッセッド",meaning:"そうは言っても・それを踏まえて",
   linkingParts:[{segment:"with_that",rule:"子音+子音",detail:"「th」+「th」→「ズザッ」"},{segment:"that_said",rule:"子音+子音",detail:"「t」+「s」→「ッセッド」"}],
   synonyms:[{text:"that being said",katakana:"ザッビーイングセッド",meaning:"そうは言っても"},{text:"nevertheless",katakana:"ネヴァザレス",meaning:"それにもかかわらず"}],
   swapExample:{original:"With that said, let's move on.",swapped:"With that said, I think we're ready to proceed.",swappedMeaning:"それを踏まえて、進める準備ができていると思います"},
   scene:{en:"Transition phrase used to acknowledge a point and move forward. Common in meetings.",ja:"ポイントを認めながら話を進めるトランジションフレーズ。会議・プレゼンでよく使われる。"},category:"汎用"},
  {id:486,text:"all things considered",katakana:"オールシングズコンシダード",meaning:"全てを考慮すると",
   linkingParts:[{segment:"all_things",rule:"子音+子音",detail:"「l」+「th」→「ルシングズ」"},{segment:"things_considered",rule:"子音+母音リンキング",detail:"「z」+「con」→「ズコンシダード」"}],
   synonyms:[{text:"taking everything into account",katakana:"テイキングエヴリシングイントゥアカウント",meaning:"全てを考慮すると"},{text:"overall",katakana:"オウヴァロール",meaning:"全体的に"}],
   swapExample:{original:"All things considered, it went well.",swapped:"All things considered, this is the best option.",swappedMeaning:"全てを考慮すると、これが最善の選択肢です"},
   scene:{en:"Used to give a balanced assessment after weighing multiple factors.",ja:"複数の要因を検討した上でバランスの取れた評価をする場面。経営判断・評価会議でよく出る。"},category:"汎用"},
  {id:487,text:"for the time being",katakana:"フォーザタイムビーイング",meaning:"当面の間・とりあえず",
   linkingParts:[{segment:"for_the",rule:"子音+母音リンキング",detail:"「r」+「the」→「ルザ」"},{segment:"time_being",rule:"子音+母音リンキング",detail:"「m」+「being」→「ムビーイング」"}],
   synonyms:[{text:"for now",katakana:"フォーナウ",meaning:"今のところ"},{text:"temporarily",katakana:"テンポラリリ",meaning:"一時的に"}],
   swapExample:{original:"For the time being, use this workaround.",swapped:"For the time being, the old system will remain.",swappedMeaning:"当面の間、旧システムを維持します"},
   scene:{en:"Used to describe a temporary measure or situation. Common in TOEIC business announcements.",ja:"一時的な措置や状況を表す場面。TOEICのビジネスアナウンス・社内メモで頻出。"},category:"汎用"},
  {id:488,text:"in the event of",katakana:"インジイヴェントオヴ",meaning:"〜の場合には",
   linkingParts:[{segment:"in_the",rule:"子音+母音リンキング",detail:"「n」+「the」→「ンジ」"},{segment:"the_event",rule:"子音+母音リンキング",detail:"「e」+「event」→「ジイヴェント」"},{segment:"event_of",rule:"子音+母音リンキング",detail:"「t」+「of」→「トオヴ」"}],
   synonyms:[{text:"in case of",katakana:"インケイスオヴ",meaning:"〜の場合"},{text:"should there be",katakana:"シュドゼアビー",meaning:"〜があれば"}],
   swapExample:{original:"In the event of an emergency, call 911.",swapped:"In the event of cancellation, a full refund will be issued.",swappedMeaning:"キャンセルの場合は全額返金されます"},
   scene:{en:"Formal version of 'in case of'. Very common in TOEIC contracts, policies, and safety notices.",ja:"「in case of」のフォーマル版。TOEICの契約・方針・安全通知で頻出の条件表現。"},category:"短縮形"},
  {id:489,text:"regardless of",katakana:"リガードレスオヴ",meaning:"〜に関わらず",
   linkingParts:[{segment:"regardless_of",rule:"子音+母音リンキング",detail:"「s」+「of」→「スオヴ」"}],
   synonyms:[{text:"no matter what",katakana:"ノウマラワッ",meaning:"何があっても"},{text:"irrespective of",katakana:"イリスペクティヴオヴ",meaning:"〜に関係なく"}],
   swapExample:{original:"Regardless of the outcome, we tried our best.",swapped:"Regardless of your experience level, you can apply.",swappedMeaning:"経験レベルに関わらずご応募いただけます"},
   scene:{en:"Used to indicate that something applies without exception. Common in TOEIC policies and ads.",ja:"例外なく適用されることを示す場面。TOEICの方針・広告・採用条件でよく出る。"},category:"短縮形"},
  {id:490,text:"in accordance with",katakana:"イナコーダンスウィズ",meaning:"〜に従って・〜に準じて",
   linkingParts:[{segment:"in_accordance",rule:"母音+母音リンキング",detail:"「n」+「acc」→「ナコーダンス」"},{segment:"accordance_with",rule:"子音+子音",detail:"「s」+「w」→「スウィズ」"}],
   synonyms:[{text:"in line with",katakana:"インラインウィズ",meaning:"〜に沿って"},{text:"as per",katakana:"アズパー",meaning:"〜に従って"}],
   swapExample:{original:"In accordance with company policy, all staff must comply.",swapped:"In accordance with your request, we've updated the file.",swappedMeaning:"ご要望に従ってファイルを更新しました"},
   scene:{en:"Formal compliance phrase used in TOEIC contracts, policies, and official correspondence.",ja:"「〜に従って」の最もフォーマルな表現。TOEICの契約・方針・公式文書で必ず出る。"},category:"短縮形"},

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
