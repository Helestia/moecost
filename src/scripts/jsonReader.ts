
export type tJSON_canStackItem = string;

export type tJSON_durabilitie = {
    アイテム : string,
    使用可能回数 : number
}

export type tJSON_history = {
    version : number,
    history : tJSON_history_historys[]
}

export type tJSON_history_historys = {
    更新日 : string,
    version : number,
    更新内容 : string[]
}


export type tJSON_multiRecipesDefault = {
    アイテム名 : string,
    標準レシピ名 : string
}

export type tJSON_npcSaleItem = {
    アイテム : string,
    最低販売価格 : number,
    販売情報 : tJSON_npcSaleItem_saleInfomation[]
};

export type tJSON_npcSaleItem_saleInfomation = {
    エリア: string,
    時代: string,
    販売員: string,
    価格: number,
    備考?: string
};


export type tJSON_recipe = {
    レシピ名: string,
    材料: tJSON_recipe_material[],
    生成物: tJSON_recipe_productOrByproduct,
    副産物?: tJSON_recipe_productOrByproduct[],
    スキル: tJSON_recipe_skill[],
    テクニック: string[],
    要レシピ: boolean,
    ギャンブル: boolean,
    ペナルティ: boolean,
    備考? : string
};

type tJSON_recipe_material = {
    アイテム:string,
    個数?:number,
    特殊消費?:"消失"|"消費"|"未消費"|"失敗時消失"
};

type tJSON_recipe_productOrByproduct = {
    アイテム : string,
    個数?:number
};

type tJSON_recipe_skill = {
    スキル名: string,
    スキル値: number
};


export type tJSON_seriesCreationItem = {
    シリーズ名: string,
    アイテム一覧: tJSON_seriesCreationItem_item[]
};

export type tJSON_seriesCreationItem_item = {
    接頭: string,
    アイテム: string
};

export const CanStackItems:tJSON_canStackItem[] = require('../reference/canStackItems.json');

export const Durabilities:tJSON_durabilitie[] = require('../reference/durabilities.json');

export const History:tJSON_history = require('../reference/history.json');

export const MultiRecipesDefault:tJSON_multiRecipesDefault[] = require('../reference/multiRecipesDefault.json');

export const NpcSaleItems:tJSON_npcSaleItem[] = require('../reference/npcSaleItems.json');

export const Recipes:tJSON_recipe[] = require('../reference/recipes.json');

export const SeriesCreationItems:tJSON_seriesCreationItem[] = require('../reference/seriesCreationItems.json');

