Chotto GPT Web — 実装計画書
Next.js 14+ (App Router) を用いた、複数のAIプロバイダー対応のチャットアプリケーション構築計画です。初心者向けのVPSデプロイ手順書も同梱します。

提案する変更内容
プロジェクト構成
[NEW] プロジェクト作成: C:\Users\ak\.gemini\antigravity\scratch\chotto-gpt-web
npx -y create-next-app@latest ./ にて初期化（TypeScript, Tailwind CSS, App Router, ESLint 利用）。 追加インストール:

lucide-react — アイコン
framer-motion — アニメーション
react-markdown + remark-gfm — AIメッセージのレンダリング
デザインシステムとレイアウト
[MODIFY] 
globals.css
Material Design 3 にインスパイアされたデザイントークン：カラーパレット、タイポグラフィ（Google Fonts: Inter）、スペーシング、角丸、シャドウ。ダークモード対応。

[MODIFY] 
layout.tsx
ルートレイアウト。Interフォントの読み込み、メタデータ（Chotto GPT Web）、グローバルプロバイダーの設定。

型定義とAPIスケルトン
[NEW] 
types.ts
共通のTypeScript型定義：
ModelId
, 
Provider
, 
ChatMessage
, 
Attachment
, 
ChatRequest
, 
ChatResponse
。

[NEW] 
api.ts
sendChatRequest(req: ChatRequest): Promise
 — 選択されたモデルに基づいてプロバイダーごとのハンドラにリクエストを振り分ける関数。
プロバイダースタブ関数：
callOpenAI
, 
callGemini
, 
callAnthropic
, 
callDallE
, 
callNanoBanana
。
デモ用のモックレスポンス。
[NEW] 
storage.ts
getApiKey(provider)
 / 
setApiKey(provider, key)
 — localStorage ヘルパー関数。

コンポーネント
[NEW] 
SettingsModal.tsx
設定モーダル。3つのAPIキー入力欄（OpenAI, Gemini, Anthropic）。サーバーには送らず、ブラウザの localStorage にのみ保存する仕様。Framer Motion による開閉アニメーション。

[NEW] 
ModelSelector.tsx
モデル選択ドロップダウン。テキストモデル群（gpt-4o, gemini-1.5-pro, claude-3-5-sonnet）と画像生成モデル群（dall-e-3, nano-banana）をグループ化して表示。

[NEW] 
ChatMessage.tsx
ユーザー側の吹き出し: 右揃え、青色。
AI側の吹き出し: 左揃え、白色、react-markdown による Markdown レンダリング。
画像生成レスポンス: <img> タグとして表示。
[NEW] 
ChatInput.tsx
テキストエリア ＋ クリップアイコン（ファイル添付: JPG/PNG/PDF）。サムネイルプレビュー機能。送信ボタン。

[NEW] 
Header.tsx
アプリタイトル ＋ 設定用ギアアイコン。

ページ構成
[MODIFY] 
page.tsx
メインチャットページ。全コンポーネントを統合し、メッセージ状態、選択中モデル、添付ファイル、設定モーダルの表示非表示を管理。

ドキュメント
[NEW] 
VPS_MANUAL.md
初心者向けの日本語ガイド。SSH接続、Node.js/nvm セットアップ、Git、PM2、デプロイ、ファイアウォール設定、トラブルシューティングを網羅。

検証計画
自動テスト
bash
cd C:\Users\ak\.gemini\antigravity\scratch\chotto-gpt-web
npm run build
next build が成功することで、TypeScript のコンパイルエラーやインポートエラーがないことを確認します。

ブラウザ検証
http://localhost:3000 をブラウザで開く
検証項目: ヘッダー表示、設定モーダルの開閉、モデルセレクターの動作、メッセージ送信（モックレスポンス）、ファイル添付とサムネイル表示、Markdownレンダリング、画像URLの表示
