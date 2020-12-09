# もえこすと　試作版

これはオンラインゲーム [Master of Epic](https://moepic.com/) の生産者支援用Webツールです。

主に生産品の原価計算や素材数計算を主目的としていますが、それ以外の機能拡張も予定しています。

# 実行場所

下記urlにアクセスすることで利用できます。

http://moecost.starfree.jp

# 特徴

- (おそらく)全レシピ網羅
  - [moecoop-data](https://github.com/coop-mojo/moecoop-data)様のデータを加工し、独自にレシピを追加しています。
    - データ加工については、別リポジトリ [moecost-jsonconv](https://github.com/Helestia/moecost-jsonconv)で行っています。
- 生産品を作るための生産品(中間生産品)対応済
- ツリー表示による視覚的な生産経路の表示
- 各素材に独自単価を登録可能
  - indexedDbによりブラウザに保存するようにしており、一度登録した内容は削除するまで保存されます。

# 使用ライブラリ等

- React v16.13.1
- Material-ui v4.11
  - Material-ui/lab v4.11.0-arpha
  - Material-ui/icons v4.9
- Dexie v3.0.2
- TypeScript v3.7.5

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

- indexedDbのバックアップ・別ブラウザへの移植処理の作成
- ベンダー管理機能の実装

# ライセンス

MITライセンスとします。


