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

## 共同編集の流れ

1. 最新の `main` を取得する。
2. 自分の作業用ブランチを作る。
3. 編集・プレビュー・ビルド確認を行う。
4. GitHubへプッシュし、Pull Requestで確認を依頼する。

詳細なルールは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
