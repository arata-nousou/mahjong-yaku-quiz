# 雀力（じゃんりょく）

麻雀初心者が雀魂（じゃんたま）の段位を上げるために役を覚える、自分専用の学習アプリ。完全に個人利用・非商用・日本語のみ。

## スタック / コマンド

- Next.js 14（App Router）+ TypeScript + Tailwind CSS、テストは Vitest。
- `npm run dev` 開発サーバ / `npm run build` 本番ビルド（型チェック込み）/ `npm run test` 単体テスト / `npm run lint`。

## 構成

- `app/` … 画面。`/`(ホーム) `/flashcards`(暗記カード) `/quiz`(4択クイズ) `/recognition`(手牌認識クイズ)。`app/icon.svg` がfavicon。
- `components/` … `Tile`(牌1枚) `Hand`(手牌・折り返し表示) `YakuCard`(暗記カード) `TierSelector`(初級/中級/上級) `Logo`(ロゴ/ブランドマーク)。
- `lib/` … `yaku.ts`(役データ=単一の真実) `tiles.ts`(牌の表記・画像・ユーティリティ) `handGenerator.ts`(出題手牌の生成・問題作成) `handGenerator.test.ts`。
- `docs/requirements.md` … 確定版の要件定義書。
- 牌画像は `public/tiles/`（FluffyStuff/riichi-mahjong-tiles、CC0）。

## データ駆動の原則

- 役は `lib/yaku.ts` の `YAKU`（主要25役、Tier1=初級10 / Tier2=中級9 / Tier3=上級6）が唯一の定義。役の追加・修正はこのデータ編集で完結させる。
- 各役の `id`（`riichi`, `tanyao`, `chinitsu` …）は安定キー。**フェーズ2の進捗保存キーにこの `id` を流用する設計**。
- `recognizable=false` の7役（立直・門前清自摸和・一発・海底/河底・自風牌・場風牌・対々和）は手牌認識クイズに出さない（形だけでは判定不能なため）。
- `handGenerator.ts` を変更したら必ず `npm run test`（生成手牌が想定役を満たす／色固定役を誤変換しない、を担保）。

## UI 規約（リブランド済み）

- サービス名「雀力」、タグライン「役から始める、麻雀上達。」。ブランドマークは「牌＋上り階段＝段位アップ」（`app/icon.svg` と `components/Logo.tsx` が同一デザイン、白地＋インディゴの輪郭・図柄）。
- トンマナはインディゴ×スレート。アクセント=`indigo`、ニュートラル=`slate`（`emerald`/`stone` は使わない）。body は bg `#f8fafc` / text `#1e293b`。
- 正誤表示は ○(正解=`emerald`塗り) / ✕(不正解=`rose`塗り) ＋ アイコン ＋ 太字。緑は「成功」の意味色としてのみ使う（ブランドはインディゴ）。
- 影はデフォルト無し。クリック可能カードのホバーは「輪郭インディゴ + 微リフト(`hover:-translate-y-0.5 hover:border-indigo-500`)」。塗りボタンは色が濃くなるホバー。
- アイコンは `@tabler/icons-react`。アイコンのみの操作には `aria-label` を付ける。
- レスポンシブ: スマホ最小375pxで崩れない（手牌は折り返さず一列のまま横スクロール＝麻雀牌が二列になるのは不自然なため）。PCは `lg:max-w-2xl` ＋ `layout.tsx` の縦中央寄せ。タップ領域は44px目安。
- 各モード画面のヘッダーは戻る用シェブロン（`<`）＋中央タイトル、ページネーションは画面下部中央。

## デプロイ

- `main` に push すると Vercel（Hobby）が本番に自動デプロイ。公開URL: https://mahjong-yaku-quiz.vercel.app
- リポジトリ `arata-nousou/mahjong-yaku-quiz`（Private）。push は gh CLI を **arata-nousou** で認証（HTTPS）して行う（SSH鍵は別アカウント `aratanousou` 用なので注意）。
- push 前に `npm run build` でビルドが通ることを確認する。

## フェーズ計画

- F1（実装済み）: 暗記カード / 4択クイズ / 手牌認識クイズ の3モード。保存なし。
- **F2（要件詰め中）**: 進捗保存（覚えた役・成績）＋苦手復習モード。スマホ/PC同期のため localStorage 不可 → Prisma + DB + 単一ユーザー簡易認証（DBは Vercel Postgres / Oracle無料枠 が候補、認証方式は未確定）。
- F3: 段位別ロードマップ（静的＋個人化）。
- F4（未定）: 手牌認識の完全ランダム化（npm `riichi` 等で役判定）。
