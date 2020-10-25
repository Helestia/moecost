export declare namespace moecost {
    type アイテムと個数 = {
        アイテム:string,
        個数?:number
    }
    type スキルとスキル値 = {
        スキル名:string,
        スキル値:number
    }
    type 販売員情報 = {
        エリア:string,
        時代:string,
        販売員:string,
        価格:number,
        備考?:string
    }

    type シリーズアイテム = {
        接頭 : string,
        アイテム:string
    }

    type ストレージ_アイテム情報 = {
        アイテム : string,
        調達方法 : "NPC購入"
    } | {
        アイテム : string,
        調達方法 : "自力調達",
        調達価格 : number
    } | {
        アイテム : string,
        調達方法 : "生産",
        レシピ名 : string
    }

    namespace Strage {
        type 辞書情報 = {
            id : number,
            辞書名 : string,
            辞書内容 : ストレージ_アイテム情報[] 
        };

        type 利用中の辞書 = {
            id : 1,
            辞書id : number
        }

        type 表示設定 = {
            id : 1
            簡易表示 : boolean,
            ダークモード : boolean,
            初期非表示設定 :{
                概要 : boolean,
                生成アイテム一覧 : boolean,
                素材_余剰生産品_副産物一覧 : boolean,
                生産ツリー : boolean
            }
        }
    }
    
    namespace JSON {
        interface recipe{
            レシピ名 : string,
            材料 : アイテムと個数[],
            副産物?: アイテムと個数[],
            生成物:アイテムと個数,
            テクニック:string[],
            スキル:スキルとスキル値[],
            要レシピ:boolean,
            ギャンブル:boolean,
            ペナルティ:boolean,
            備考:string
        }
        interface durabilitys {
            アイテム:string,
            使用可能回数:number
        }
        interface npcSaleItems {
            アイテム:string,
            最低販売価格:number,
            販売情報:販売員情報[]
        }
        interface seriesCreationItems {
            シリーズ名:string,
            アイテム一覧: シリーズアイテム[]
        }
        interface history {
            version:number,
            history:{
                更新日:string,
                version:number,
                更新内容:string[]
            }[]
        }
    }
}

declare module '../reference/canStackItems.json' {
    const value : string[];
    export = value;
}

declare module '../reference/durabilitys.json' {
    interface durabilitys extends moecost.JSON.durabilitys{};
    const value : durabilitys[];

    export = value;
}

declare module '../reference/npcSaleItems.json' {
    interface npcSaleItem extends moecost.JSON.npcSaleItems{};
    const value : npcSaleItem[];

    export = value;
}

declare module '../reference/recipes.json' {
    interface recipe extends moecost.JSON.recipe{};
    const value : recipe[];

    export = value;
}

declare module '../reference/seriesCreationItems.json' {
    interface seriesCreationItems extends moecost.JSON.seriesCreationItems{};
    const value : seriesCreationItems[];

    export = value;
}
declare module '../reference/history.json' {
    interface history extends moecost.JSON.history{};
    const value : history;

    export = value;
}

declare module '*.css' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}
