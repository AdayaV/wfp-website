# Waseda Formula Project Website

Waseda Formula Projectのウェブサイト用リポジトリです。現在は、部員間でページ構成を相談するための日本語中心・白黒のワイヤーフレームです。

## 現在のページ

- ホーム：`src/pages/index.astro`
- ニュース：`src/pages/news.astro`
- チーム：`src/pages/team.astro`
- マシン：`src/pages/machine.astro`
- スポンサー：`src/pages/sponsors.astro`

共通ナビゲーションは `src/layouts/WireframeLayout.astro`、最低限の見た目は `src/styles/global.css` にあります。

## PCでプレビューする

必要なもの：Node.js 22.12以降、pnpm 11

```sh
pnpm install
pnpm dev
```

表示されたローカルURLをブラウザで開きます。作業後は次の確認も行います。

```sh
pnpm build
```

## ページを編集する

1. 編集したいページに対応する `src/pages/*.astro` を開く。
2. ページ名やリンクを変更する。
3. `pnpm dev` で表示を確認する。
4. `pnpm build` が成功することを確認する。

新しいページを増やす場合は `src/pages/` に `.astro` ファイルを追加し、`WireframeLayout.astro` のナビゲーションにもリンクを追加します。たとえば `src/pages/contact.astro` は `/contact/` になります。

## ニュース記事を投稿する

1. `src/content/news/_template.md` を複製し、英数字とハイフンのファイル名に変更する（例：`2026-competition-report.md`）。
2. 記事上部の項目と本文を編集する。
3. 写真を `public/images/news/` に追加し、`image` に `/images/news/ファイル名.jpg` を指定する。
4. 公開前は `draft: true`、公開するときは `draft: false` にする。
5. 変更を `main` に反映する。GitHub Pagesの更新後、記事詳細・NEWS一覧・HOMEへ自動反映される。

入力項目：

- `title`：記事タイトル
- `publishedAt`：公開日（`YYYY-MM-DD`）
- `category`：`EVENT`、`DEVELOPMENT`、`TEAM`、`SPONSOR`のいずれか
- `summary`：HOMEとNEWS一覧で使う短い説明
- `image`：メイン写真のパス。写真なしの場合は行ごと削除可能
- `imageAlt`：写真の内容を説明する短い文
- `draft`：`true`は非公開、`false`は公開

公開記事は `publishedAt` の新しい順に並び、最新4件がHOMEのトップニュースに表示されます。

## 共同編集の流れ

1. 最新の `main` を取得する。
2. 自分の作業用ブランチを作る。
3. 編集・プレビュー・ビルド確認を行う。
4. GitHubへプッシュし、Pull Requestで確認を依頼する。

詳細なルールは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
# Waseda Formula Project Website

Waseda Formula Projectのウェブサイト用リポジトリです。現在は、部員間でページ構成を相談するための日本語中心・白黒のワイヤーフレームです。

## 現在のページ

- ホーム：`src/pages/index.astro`
- ニュース：`src/pages/news.astro`
- チーム：`src/pages/team.astro`
- マシン：`src/pages/machine.astro`
- スポンサー：`src/pages/sponsors.astro`

共通ナビゲーションは `src/layouts/WireframeLayout.astro`、最低限の見た目は `src/styles/global.css` にあります。

## PCでプレビューする

必要なもの：Node.js 22.12以降、pnpm 11

```sh
pnpm install
pnpm dev
```

表示されたローカルURLをブラウザで開きます。作業後は次の確認も行います。

```sh
pnpm build
```

## ページを編集する

1. 編集したいページに対応する `src/pages/*.astro` を開く。
2. ページ名やリンクを変更する。
3. `pnpm dev` で表示を確認する。
4. `pnpm build` が成功することを確認する。

新しいページを増やす場合は `src/pages/` に `.astro` ファイルを追加し、`WireframeLayout.astro` のナビゲーションにもリンクを追加します。たとえば `src/pages/contact.astro` は `/contact/` になります。

## ニュース記事を投稿する

ニュースはmicroCMSで作成・公開します。公開後、WebhookがGitHub Actionsを起動し、記事詳細・NEWS一覧・HOMEを自動更新します。

### microCMSのAPI設定

リスト形式APIを作成し、エンドポイントを `news` にします。

| 表示名 | フィールドID | 種類 | 必須 |
| --- | --- | --- | --- |
| タイトル | `title` | テキストフィールド | はい |
| カテゴリ | `category` | セレクトフィールド | はい |
| 概要 | `summary` | テキストエリア | はい |
| メイン写真 | `image` | 画像 | いいえ |
| 画像の説明 | `imageAlt` | テキストフィールド | いいえ |
| 本文 | `body` | リッチエディタ | はい |

カテゴリの選択肢は `EVENT`、`DEVELOPMENT`、`TEAM`、`SPONSOR` の4つです。

### GitHubの設定

Repository secretsに以下を登録します。

- `MICROCMS_SERVICE_DOMAIN`：microCMSのサービスドメイン
- `MICROCMS_API_KEY`：GET権限だけを付けたAPIキー

microCMSの `API設定 → Webhook` で `GitHub Actions` を追加し、リポジトリ `AdayaV/wfp-website`、ワークフロー `Deploy Astro site to Pages`、ブランチ `main` を指定します。記事の公開・更新・公開終了時に通知するよう設定します。

### 投稿手順

1. microCMSで記事を新規作成する。
2. タイトル、カテゴリ、概要、写真、本文を入力する。
3. 下書き保存または公開日時を設定する。
4. 公開するとWebhook経由でサイトが再生成される。

公開記事はmicroCMSの公開日時が新しい順に並び、最新4件がHOMEのトップニュースに表示されます。

## 共同編集の流れ

1. 最新の `main` を取得する。
2. 自分の作業用ブランチを作る。
3. 編集・プレビュー・ビルド確認を行う。
4. GitHubへプッシュし、Pull Requestで確認を依頼する。

詳細なルールは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
