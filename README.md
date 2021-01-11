# もえこすと　試作版

これはオンラインゲーム [Master of Epic](https://moepic.com/) の生産者支援用Webツールです。

主に生産品の原価計算や素材数計算を主目的としていますが、それ以外の機能拡張も予定しています。

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
