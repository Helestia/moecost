# もえこすと - 開発終了(2024/06/30)

## 当プロジェクトは開発が終了しています。

このプロジェクトは2024/06/30をもって開発を終了しました。

このリポジトリは、第2のもえこすとが開発されることを期待し、しばらく残します。

開発終了前にローカル実行版を用意しており、このリポジトリからダウンロードが可能です。
詳細は[こちらのファイル](https://github.com/Helestia/moecost/blob/master/public/endService/moecost_local_0128.zip)をダウンロードしていただき、解凍ファイル内の`Readme.txt`をご確認ください。

ダウンロードの手順については、[こちらの画像リンクをご参照ください。](./readme_image/readmeImage01.png)(※24/07/01地点の画像です。)

以降は過去のreadmeの内容です。

----

# もえこすと

これはオンラインゲーム [Master of Epic](https://moepic.com/) の生産者支援用Webツールです。

主に生産品の原価計算や素材数計算を主目的としていますが、それ以外の機能拡張も予定しています。

# サービスの提供を引き継いでくださる方を募集します。

現在このプロジェクトは私の個人プロジェクトの様相ですが、私自身がゲーム内でほぼ生産をしなくなってしまいました。

そのため、このプロジェクトを運営維持していくことが苦痛となってしまい、管理不全となるまえに終了させてしまおうと考えています。

よって、2024/06/30に下記実行場所と記載のサイトを終了させる予定です。

もしプロジェクトを引き継ぎを希望される方がいらっしゃれば、当プロジェクト内でIssueを立てて下さい。ノウハウなどを提供できるかもしれません。

# 実行場所

下記urlにアクセスすることで利用できます。

http://moecost.starfree.jp

# 特徴

- (おそらく)全レシピ網羅
  - [moecoop-data](https://github.com/coop-mojo/moecoop-data)様のデータを加工し、独自にレシピを追加しています。
    - データ加工・追加については、別リポジトリ [moecost-jsonconv](https://github.com/Helestia/moecost-jsonconv)で行っています。
- 生産品を作るための生産品(中間生産品)対応済
- ツリー表示による視覚的な生産経路の表示
- 各素材に独自単価を登録可能
  - indexedDbによりブラウザに保存するようにしており、一度登録した内容は削除するまで保存されます。

# 使用ライブラリ等

- React
- Material-ui
  - Material-ui/lab
  - Material-ui/icons
- Dexie
- ajv
- TypeScript

# 使用データ

- [moecoop-data](https://github.com/coop-mojo/moecoop-data)
  - [moecost-jsonConv](https://github.com/Helestia/moecost-jsonconv)による加工データを利用。

# 開発環境の構築

```
$ git clone https://github.com/Helestia/moecost.git
$ cd moecost
$ npm start
```

# 以降の開発予定

- ベンダー管理機能の実装

# ライセンス

MITライセンスとします。
詳細はLICENSREを確認してください。

## データのライセンスについて

`./src/reference/`フォルダ内の下記ファイルについては、[moecoop-data](https://github.com/coop-mojo/moecoop-data)をご確認ください。
- `canStackItems.json`
- `recipes.json`
- `durabilities.json`
- `npcSaleItems.json`
- `recipes.json`

これらのファイルは、[moecoop-data](https://github.com/coop-mojo/moecoop-data)での成果物を、[moecost-jsonconv](https://github.com/Helestia/moecost-jsonconv)で加工して使用しています。
