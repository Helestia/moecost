import moecostDb from './storage';
import {
    CanStackItems,
    Durabilities,
    MultiRecipesDefault,
    NpcSaleItems,
    Recipes,
    tJSON_recipe,
    tJSON_npcSaleItem} from './jsonReader';

export type tMessage = {
    重大度: "error" | "warning" | "info" | "success"
    タイトル: string,
    メッセージ: string[]
}

export type tProcurement = "作成" | "共通素材" | "NPC" | "自力調達" | "未設定";

export type tTreeNode = tTreeNode_creation | tTreeNode_npc | tTreeNode_user | tTreeNode_common | tTreeNode_unknown;

export type tTreeNode_creation = tTreeNode_creation_nonDurable | tTreeNode_creation_durable;
export type tTreeNode_npc      = tTreeNode_npc_nonDurable      | tTreeNode_npc_durable;
export type tTreeNode_user     = tTreeNode_user_nonDurable     | tTreeNode_user_durable;
export type tTreeNode_common   = tTreeNode_common_nonDurable   | tTreeNode_common_durable;
export type tTreeNode_unknown  = tTreeNode_unknown_nonDurable  | tTreeNode_unknown_durable;

type tTreeNode_creation_nonDurable = {
    アイテム名: string,
    調達方法: "作成",
    特殊消費: "消失" | "失敗時消失" | "未消費"
    個数: {
        セット作成個数: number,
        作成個数: number,
        余剰作成個数: number
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number,
        作成個数: number,
        原価?: {
            設定原価: number,
            合計価格: number
        }
    }[],
    材料 : tTreeNode[],
}

export type tTreeNode_creation_durable = {
    アイテム名 : string,
    調達方法 : "作成",
    特殊消費: "消費"
    個数 : {
        セット作成個数 : number,
        作成個数: number,
        余剰作成個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number
        作成個数: number
        原価?: {
            設定原価: number,
            合計価格: number
        }
    }[]
    材料 : tTreeNode[]
}

type tTreeNode_npc_nonDurable = {
    アイテム名 : string,
    調達方法 : "NPC",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        調達個数: number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    }
}

export type tTreeNode_npc_durable = {
    アイテム名 : string,
    調達方法 : "NPC",
    特殊消費: "消費",
    個数 : {
        調達個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number,
        合計金額: number,
        耐久割合計金額: number
    }
}

type tTreeNode_user_nonDurable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        調達個数: number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    }
}

export type tTreeNode_user_durable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    特殊消費: "消費",
    個数 : {
        調達個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number,
        合計金額: number,
        耐久割合計金額: number
    }
}

type tTreeNode_common_nonDurable = {
    アイテム名 : string,
    調達方法 : "共通素材",
    特殊消費: "消失" | "失敗時消失" | "未消費"
    個数 : {
        消費個数: number
    }
}

export type tTreeNode_common_durable = {
    アイテム名 : string,
    調達方法 : "共通素材",
    特殊消費: "消費"
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    }
}

type tTreeNode_unknown_nonDurable = {
    アイテム名 : string,
    調達方法 : "未設定",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        消費個数: number
    }
}

export type tTreeNode_unknown_durable = {
    アイテム名 : string,
    調達方法 : "未設定",
    特殊消費: "消費",
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    }
}

// 以下　プログラム内でのみ使用する型情報
type tTreeNodeD = tTreeNodeD_creation | tTreeNodeD_npc | tTreeNodeD_user | tTreeNodeD_common | tTreeNodeD_unknown;

type tTreeNodeD_creation = tTreeNodeD_creation_nonDurable | tTreeNodeD_creation_durable;
type tTreeNodeD_npc      = tTreeNodeD_npc_nonDurable      | tTreeNodeD_npc_durable;
type tTreeNodeD_user     = tTreeNodeD_user_nonDurable     | tTreeNodeD_user_durable;
type tTreeNodeD_common   = tTreeNodeD_common_nonDurable   | tTreeNodeD_common_durable;
type tTreeNodeD_unknown  = tTreeNodeD_unknown_nonDurable  | tTreeNodeD_unknown_durable;

type tTreeNodeD_creation_nonDurable = {
    アイテム名 : string,
    調達方法 : "作成"
    個数 : {
        上位レシピ要求個数 : number,
        セット作成個数 : number
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number,
        価格? :{
            設定原価:number
        }
    }[]
    材料 : tTreeNodeD[],
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_creation_durable = {
    アイテム名 : string,
    調達方法 : "作成"
    個数 : {
        上位レシピ要求個数 : number,
        セット作成個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number
        価格? :{
            設定原価:number
        }
    }[]
    材料 : tTreeNodeD[],
    特殊消費: "消費"
}

type tTreeNodeD_npc_nonDurable = {
    アイテム名 : string,
    調達方法 : "NPC",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_npc_durable = {
    アイテム名 : string,
    調達方法 : "NPC",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number
    },
    特殊消費: "消費"
}

type tTreeNodeD_user_nonDurable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_user_durable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number
    },
    特殊消費: "消費"
}

type tTreeNodeD_common_nonDurable = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_common_durable = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    特殊消費: "消費"
}

type tTreeNodeD_unknown_nonDurable = {
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_unknown_durable = {
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    特殊消費: "消費"
}

type t特殊消費 = "消費" | "消失" | "失敗時消失" | "未消費"

export type tQtyRole = "surplus" | "fully" | undefined
export type tQtyRoleResult = "surplus" | "fully";

export type tBuildTreeResult = {
    main:tTreeNode_creation[],
    common:tTreeNode_creation[],
    qtyRoleResult: tQtyRoleResult,
    totalQuantity: number,
    fullyMinimumQuantity: number,
    message:tMessage[]
}
type tBuildTree = (
    recipe: string,
    items: string[],
    qtyRole: tQtyRole,
    qty: number
) => tBuildTreeResult;
const buildTree : tBuildTree = (recipe, items, qtyRole, qty) => {
    // エラー有無確認処理
    const ErrorObj = handleError(recipe, items, qty);
    if(ErrorObj) return {
        main: [],
        common: [],
        message: [ErrorObj],
        qtyRoleResult: "surplus",
        totalQuantity: 0,
        fullyMinimumQuantity: 0
    } as tBuildTreeResult

    // npc販売情報取得(アプリ設定によってwarのみのアイテム除外)
    const NpcUseObj = buildNpcUseObj();

    // メインツリー構築
    const mainTreeD = buildMainTree(recipe, items, NpcUseObj);
    // 共通中間素材を別ツリーに切りだし
    const mainTreeAndCommonTreeD = splitCommonAndMain(mainTreeD);
    // 余剰作成数なしでの最小作成個数算出
    const minimumCreation = calcMinimumQty(mainTreeAndCommonTreeD.main,mainTreeAndCommonTreeD.common);
    // 作成個数の設定
    const createQuantity = decideCreateQuantity(items, qtyRole,qty,minimumCreation);
    // ツリーに個数設定
    const mainTreeAndCommonTree = setQuantityToTree(
        mainTreeAndCommonTreeD.main,
        mainTreeAndCommonTreeD.common,
        createQuantity.qty
    );

    return {
        main: mainTreeAndCommonTree.main,
        common: mainTreeAndCommonTree.common,
        message: [],
        qtyRoleResult: createQuantity.qtyRole,
        totalQuantity: createQuantity.qty,
        fullyMinimumQuantity: minimumCreation
    }
}

const buildNpcUseObj:() => tJSON_npcSaleItem[] = () => {
    const isUseWar = moecostDb.アプリ設定.計算設定.War販売物使用;
    if(isUseWar) return NpcSaleItems;
    return NpcSaleItems.filter(items => items.販売情報.some(npc => npc.時代 !== "War Age"));
}

type tHandleError = (recipe:string, items:string[], qty:number) => null | tMessage;
const handleError:tHandleError = (recipe, items, qty) => {
    if(recipe === "") return {
        重大度: "error",
        タイトル: "レシピが指定されていません",
        メッセージ : ["レシピが指定されていません。","本来このメッセージは表示されないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
    }
    if(items.length === 1){
        if(Recipes.every(r => r.レシピ名 !== recipe)) return {
            重大度:"error",
            タイトル: "レシピが見つかりませんでした",
            メッセージ:["作成予定のレシピが見つかりませんでした。",`作成予定のアイテム${recipe}`,"本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
        }
    } else {
        const noRecipe: string[] = items.filter(item => Recipes.every(r => r.生成物.アイテム !== item))
        if(noRecipe.length !== 0) return {
            重大度:"error",
            タイトル: "一部のレシピが見つかりませんでした",
            メッセージ:["作成予定のアイテムのレシピが一部見つかりませんでした。","見つからなかったアイテムは下記のとおりです。",noRecipe.join(" / "),"本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
        }
    }

    if(qty < 0) return {
        重大度:"error",
        タイトル: "作成個数の指定がマイナス値です",
        メッセージ:["目標とする作成個数にマイナスが指定されています。","再度計算しなおすように指示してください。"]
    }
    if(! Number.isInteger(qty)) return {
        重大度:"error",
        タイトル: "作成個数の指定が整数でありません",
        メッセージ:["目標とする作成個数に整数以外の数値が指定されています。","再度計算しなおすように指示してください。"]
    }
    return null;
}


type tBuildMainTree = (recipe:string, items:string[], npcUseObj:tJSON_npcSaleItem[]) => tTreeNodeD_creation[]
const buildMainTree:tBuildMainTree = (recipe, items, npcUseObj) => {
    // 再起呼び出し部（レシピ登録時に材料をキーに呼び出す）
    type tReCall = (targetName:string,qty:number,sc:t特殊消費,created:string[]) => tTreeNodeD;
    const reCall:tReCall = (targetName, qty, sc, created) => {
        const userMethod = moecostDb.辞書.内容.find(d => d.アイテム === targetName);
        if(userMethod){
            if(userMethod.調達方法 === "NPC"){
                const npcSaleInfo = npcUseObj.find(i => i.アイテム === targetName);
                if(npcSaleInfo){
                    return fNpc(targetName, qty, sc, npcSaleInfo.最低販売価格);
                }
            } else if(userMethod.調達方法 === "生産"){
                const recipe = Recipes.find(r => r.レシピ名 === userMethod.レシピ名);
                if(recipe){
                    return fCreationOrUnknown(targetName, qty, sc, created, recipe);
                }
            } else if(userMethod.調達方法 === "自力調達"){
                return fUser(targetName, qty, sc, userMethod.調達価格)
            }
        }

        // NPC存在有無確認
        const npcSaleInfo = npcUseObj.find(i => i.アイテム === targetName);
        if(npcSaleInfo){
            return fNpc(targetName, qty, sc, npcSaleInfo.最低販売価格);
        }

        // 生産レシピの有無確認
        const matchRecipes:tJSON_recipe[] = [];
        Recipes.forEach(r => {
            if(r.生成物.アイテム === targetName) matchRecipes.push(r);
        });
        if(matchRecipes.length > 1){
            const multiDefault = MultiRecipesDefault.find(mr => mr.アイテム名 === targetName);
            if(multiDefault){
                const defRecipe = Recipes.find(r => r.レシピ名 === multiDefault.標準レシピ名);
                if(defRecipe){
                    return fCreationOrUnknown(targetName, qty, sc, created, defRecipe);
                }
            }
            // マルチレシピのメンテミスや、標準レシピが存在しない場合の退避手段
            // 1件目のレシピを使用してツリー作成
            return fCreationOrUnknown(targetName, qty, sc, created, matchRecipes[0]);
        }
        if(matchRecipes.length === 1){
            return fCreationOrUnknown(targetName, qty, sc, created, matchRecipes[0]);
        }

        // 入手手段不明
        return fUnknown(targetName, qty, sc);
    }

    type tFDurable = (targetName:string) => number;
    const fDurable:tFDurable = (targetName) => {
        const durableObj = Durabilities.find(d => d.アイテム === targetName);
        if(durableObj) return durableObj.使用可能回数;
        return 1;
    }

    type tFCreationOrUnknown = (targetName:string, qty:number, sc:t特殊消費,created:string[], recipe:tJSON_recipe) => tTreeNodeD_creation | tTreeNodeD_unknown;
    const fCreationOrUnknown:tFCreationOrUnknown = (targetName, qty, sc, created, recipe) => {
        // すでに作ってるアイテムの場合、強制的にunknown扱いで処理終了とする。
        if(created.includes(targetName)) return fUnknown(targetName,qty,sc);
        return fCreation(targetName, qty, sc, created, recipe);
    }

    type tFCreation = (targetName:string, qty:number, sc:t特殊消費,created:string[], recipe:tJSON_recipe) => tTreeNodeD_creation;
    const fCreation:tFCreation = (targetName, qty, sc, created, recipe) => {

        const numberOfCreation = recipe.生成物.個数 ? recipe.生成物.個数 : 1;
        const rtnFCreation:tTreeNodeD_creation = (()=>{
            if(sc === "消費"){
                const maxDurable = fDurable(targetName);
                const r:tTreeNodeD_creation_durable = {
                    アイテム名: targetName,
                    調達方法: "作成",
                    特殊消費: sc,
                    個数:{
                        上位レシピ要求個数: 0,
                        セット作成個数: numberOfCreation,
                        耐久値 : {
                            最大耐久値: maxDurable,
                            上位要求 : qty
                        }
                    },
                    テクニック: recipe.テクニック[0],
                    スキル: recipe.スキル,
                    ギャンブル: recipe.ギャンブル,
                    ペナルティ: recipe.ペナルティ,
                    要レシピ: recipe.要レシピ,
                    材料: []
                }
                return r;
            } else {
                const r:tTreeNodeD_creation_nonDurable = {
                    アイテム名: recipe.生成物.アイテム,
                    調達方法: "作成",
                    特殊消費: sc,
                    個数: {
                        上位レシピ要求個数: qty,
                        セット作成個数: numberOfCreation
                    },
                    テクニック: recipe.テクニック[0],
                    スキル: recipe.スキル,
                    ギャンブル: recipe.ギャンブル,
                    ペナルティ: recipe.ペナルティ,
                    要レシピ: recipe.要レシピ,
                    材料: []
                }
                return r;
            }
        })();
        if(recipe.備考) rtnFCreation.備考 = recipe.備考;
        if(recipe.副産物){
            rtnFCreation.副産物 = recipe.副産物.map(b => {
                // 単価設定判別
                const price = (() => {
                    const obj = moecostDb.辞書.内容.find(i => i.アイテム === b.アイテム);
                    if(! obj) return null;
                    if(obj.調達方法 !== "自力調達") return null;
                    return obj.調達価格;
                })();
                if(price === null) return {
                    アイテム名: b.アイテム,
                    セット作成個数: b.個数 ? b.個数 : 1
                }
                return {
                    アイテム名: b.アイテム,
                    セット作成個数: b.個数 ? b.個数 : 1,
                    価格:{
                        設定原価: price
                    }
                }
            });
        }

        const nextCreated = created.concat(targetName);
        recipe.材料.forEach(m => {
            const nextQty = (() => {
                if(m.特殊消費 === "未消費") return 1;
                if(m.個数) return m.個数;
                return 1;
            })();
            rtnFCreation.材料.push(
                reCall(
                    m.アイテム,
                    nextQty,
                    m.特殊消費 ? m.特殊消費 : "消失",
                    nextCreated
                )
            );
        })
        return rtnFCreation;
    }

    type tFUser = (targetName:string, qty:number, sc:t特殊消費,price: number) => tTreeNodeD_user
    const fUser: tFUser = (targetName,qty,sc,price) => {
        if(sc === "消費") {
            const maxDurable = fDurable(targetName);
            return {
                アイテム名: targetName,
                調達方法: "自力調達",
                特殊消費: "消費",
                個数: {
                    上位レシピ要求個数: 0,
                    耐久値: {
                        上位要求: qty,
                        最大耐久値: maxDurable
                    }
                },
                価格: {
                    調達単価: price,
                    耐久割単価: price / maxDurable
                }
            }
        } else return {
            アイテム名: targetName,
            調達方法: "自力調達",
            特殊消費: sc,
            個数: {
                上位レシピ要求個数: qty
            },
            価格: {
                調達単価: price
            }
        }
    }

    type tFNpc = (targetName:string, qty:number, sc:t特殊消費,price: number) => tTreeNodeD_npc
    const fNpc: tFNpc = (targetName,qty,sc,price) => {
        if(sc === "消費") {
            const maxDurable = fDurable(targetName);
            return {
                アイテム名: targetName,
                調達方法: "NPC",
                特殊消費: "消費",
                個数: {
                    上位レシピ要求個数: 0,
                    耐久値: {
                        上位要求: qty,
                        最大耐久値: maxDurable
                    }
                },
                価格: {
                    調達単価: price,
                    耐久割単価: price / maxDurable
                }
            }
        } else return {
            アイテム名: targetName,
            調達方法: "NPC",
            特殊消費: sc,
            個数: {
                上位レシピ要求個数: qty
            },
            価格: {
                調達単価: price
            }
        }
    }
    type tFUnknown = (targetName:string, qty:number, sc:t特殊消費) => tTreeNodeD_unknown
    const fUnknown:tFUnknown = (targetName,qty,sc) => {
        if(sc === "消費") return {
            アイテム名: targetName,
            調達方法: "未設定",
            特殊消費: "消費",
            個数: {
                上位レシピ要求個数: 0,
                耐久値: {
                    最大耐久値: fDurable(targetName),
                    上位要求: qty
                }
            }
        }
        return {
            アイテム名: targetName,
            調達方法: "未設定",
            特殊消費: sc,
            個数: {
                上位レシピ要求個数: qty
            }
        }
    }

    if(items.length === 1){
        const recipeObj = Recipes.find(r => r.レシピ名 === recipe);
        if(recipeObj) return [fCreation(items[0], 1, "消失", [], recipeObj)];
        return [];
    }
    return items.map(item => {
        const recipeObj = Recipes.find(r => r.生成物.アイテム === item);
        if(recipeObj){return fCreation(item , 1, "消失", [], recipeObj)};
        return null;
    }).filter(<T>(x:T | null) : x is T => x !== null);
}

/**
 * 生産ツリー　共通作成素材の分割
 */
type tSplitCommonAndMainRtn = {
    main:tTreeNodeD_creation[],
    common:tTreeNodeD_creation[]
}
type tSplitCommonAndMain = (main:tTreeNodeD_creation[]) => tSplitCommonAndMainRtn;
const splitCommonAndMain: tSplitCommonAndMain = (main) => {
    // === 作成アイテムの使用回数カウント ===
    type tGetMaterialUseCount = (tree:tTreeNodeD) => void;
    const getMaterialUseCount:tGetMaterialUseCount = (node) => {
        if(node.調達方法 !== "作成") return;
        const mc = materialCount.find(m => m.アイテム === node.アイテム名);

        if(mc){
            mc.使用回数++;
            return;
        }
        materialCount.push({
            アイテム: node.アイテム名,
            使用回数: 1
        });
        node.材料.forEach(material => {
            getMaterialUseCount(material);
        });
    }
    type tMaterialCount = {
        アイテム:string,
        使用回数:number
    };
    const materialCount: tMaterialCount[] = [];
    main.forEach(node => getMaterialUseCount(node));
    const materialCountResult = materialCount.filter(m => m.使用回数 > 1).map(m => m.アイテム);

    // 共通素材の分割処理1. 共通素材のツリーを別に複製
    type tSplitCommonBuildObj = (node:tTreeNodeD,separated:tTreeNodeD_creation[]) => tTreeNodeD_creation[]
    const splitCommonBuildObj:tSplitCommonBuildObj = (node,separated) => {
        const splitCommonBuildNode: (node:tTreeNodeD_creation) => tTreeNodeD_creation = (node) => {
            const resultObj = (node.特殊消費 === "消費") 
                ? {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    特殊消費: node.特殊消費,
                    個数: {
                        セット作成個数: node.個数.セット作成個数,
                        上位レシピ要求個数: 0,
                        耐久値: {
                            上位要求: 1,
                            最大耐久値: node.個数.耐久値.最大耐久値
                        }
                    },
                    テクニック: node.テクニック,
                    スキル: node.スキル,
                    材料: node.材料,
                    ギャンブル: node.ギャンブル,
                    ペナルティ: node.ペナルティ,
                    要レシピ: node.要レシピ
                } as tTreeNodeD_creation_durable
                : {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    特殊消費: node.特殊消費,
                    個数: {
                        セット作成個数: node.個数.セット作成個数,
                        上位レシピ要求個数: 1,
                    },
                    テクニック: node.テクニック,
                    スキル: node.スキル,
                    材料: node.材料,
                    ギャンブル: node.ギャンブル,
                    ペナルティ: node.ペナルティ,
                    要レシピ: node.要レシピ
                } as tTreeNodeD_creation_nonDurable
            if(node.副産物) resultObj.副産物 = node.副産物;
            if(node.備考)   resultObj.備考   = node.備考;
            return resultObj;
        }        

        if(node.調達方法 !== "作成") return [];
        if( materialCountResult.includes(node.アイテム名) &&
            separated.every(n => n.アイテム名 !== node.アイテム名)) separated.push(splitCommonBuildNode(node));

        node.材料.forEach(n => splitCommonBuildObj(n,separated))
        return separated;
    }
    // ===== 分割対象ノードを新配列(common[])に登録
    const extractCommonTree: tTreeNodeD_creation[] = main.reduce<tTreeNodeD_creation[]>((a,c) => {
        return splitCommonBuildObj(c,a);
    },[] as tTreeNodeD_creation[])

    type tSplitCommonReplace_create = (node:tTreeNodeD_creation) => tTreeNodeD_creation;
    const splitCommonReplace_create:tSplitCommonReplace_create = (node) => {
        node.材料 = node.材料.map(m => splitCommonReplace(m));
        return node;
    }
    type tSplitCommonReplace = (node:tTreeNodeD) => tTreeNodeD;
    const splitCommonReplace:tSplitCommonReplace = (node) => {
        if(node.調達方法 !== "作成") return node;
        if(materialCountResult.includes(node.アイテム名)) return splitCommonReplace_common(node);
        return splitCommonReplace_create(node);
    }
    type tSplitCommonReplace_common = (node:tTreeNodeD_creation) => tTreeNodeD_common
    const splitCommonReplace_common:tSplitCommonReplace_common = (node) => {
        if(node.特殊消費 === "消費") return {
            アイテム名: node.アイテム名,
            個数: {
                上位レシピ要求個数: 0,
                耐久値:{
                    上位要求: node.個数.耐久値.上位要求,
                    最大耐久値: node.個数.耐久値.最大耐久値
                }
            },
            特殊消費: "消費",
            調達方法: "共通素材"
        } as tTreeNodeD_common_durable
        return {
            アイテム名: node.アイテム名,
            個数: {
                上位レシピ要求個数: node.個数.上位レシピ要求個数
            },
            特殊消費: node.特殊消費,
            調達方法: "共通素材"
        } as tTreeNodeD_common_nonDurable
    }
    // 分割対象のノードをcommonノードに置換
    const resultMian = main.map(m => splitCommonReplace_create(m));
    const commonTreeBeforeSort = extractCommonTree.map(c => splitCommonReplace_create(c));

    type tCanSortCommon = (comon:tTreeNodeD) => boolean;
    const canSortCommon:tCanSortCommon = (common) => {
        if(common.調達方法 === "作成") return common.材料.every(m => canSortCommon(m) === true);
        if(common.調達方法 !== "共通素材") return true;
        return commonTreeSorted.some(cs => cs.アイテム名 === common.アイテム名);
    }
    
    const commonTreeSorted:tTreeNodeD_creation[] = [];
    do{
        commonTreeBeforeSort.forEach(cb => {
            if((commonTreeSorted.length !== 0) && commonTreeSorted.some(ca => cb.アイテム名 === ca.アイテム名)) return;
            if(! canSortCommon(cb)) return;
            commonTreeSorted.push(cb);
        });
    } while(commonTreeBeforeSort.length !== commonTreeSorted.length);

    return {
        main:resultMian,
        common: commonTreeSorted
    }
}

type iCalcMinimumCreationNumber = (main:tTreeNodeD_creation[],commons:tTreeNodeD_creation[]) => number;
const calcMinimumQty:iCalcMinimumCreationNumber = (main, commons) => {
    // 素材情報
    type tMaterialData = {
        アイテム: string,
        作成数:number,
        要求数: number
    }

    type tTreeData = {
        アイテム名: string,
        素材情報: tMaterialData[]
    };

    type tCommonUsage = {
        アイテム名: string,
        使用状況: tMaterialData[]
    }
    
    type tGetMaterialData = (
        tree:tTreeNodeD,
        multipleCreationSet:number,
        multipleAmountNumber:number) => tMaterialData[];
    const getMaterialData:tGetMaterialData = (node,multipleCreationSet,multipleAmountNumber) => {
        // 特殊消費対応
        const isNoLost = (() => {
            if(node.特殊消費 === "未消費" || node.特殊消費 === "失敗時消失") return true;
            return false;
        })();
        if(node.調達方法 === "共通素材"){
            const orderQuantity = (isNoLost) ? 0 : multipleAmountNumber * node.個数.上位レシピ要求個数;
            const commonObj = (() => {
                const obj = commonUsage.find(c => node.アイテム名 === c.アイテム名);
                if(obj) return obj;
                const pushobj:tCommonUsage = {
                    アイテム名: node.アイテム名,
                    使用状況: []
                };
                commonUsage.push(pushobj);
                return pushobj;
            })();
            const pushMaterialData:tMaterialData = (() => {
                if(isNoLost) return {
                    アイテム: node.アイテム名,
                    作成数: 1,
                    要求数: 1
                }
                return gcdCreateAndAmount(multipleCreationSet, orderQuantity,node.アイテム名);
            })();
            commonObj.使用状況.push(pushMaterialData);
            return [];
        }
        if(node.調達方法 === "作成"){
            if(isNoLost) return [{
                アイテム: node.アイテム名,
                作成数: 1,
                要求数: 1
            }];
            const orderQuantity = node.特殊消費 === "消費" ? multipleAmountNumber : multipleAmountNumber * node.個数.上位レシピ要求個数;
            const newCreationNumber = multipleCreationSet * node.個数.セット作成個数;
            const thisResult = gcdCreateAndAmount(newCreationNumber, orderQuantity, node.アイテム名);
            const materialResult = node.材料.map(m => getMaterialData(m, thisResult.作成数, thisResult.要求数)).flat();
            return [thisResult].concat(materialResult);
        }
        // その他の調達方法ではそのままreturn
        return [];
    }

    const gcdCreateAndAmount:(create:number,amount:number,item:string)=>tMaterialData = (create:number,amount:number,item:string) => {
        const gcdResult = gcd(create, amount);
        return {
            アイテム: item,
            作成数: create / gcdResult,
            要求数: amount / gcdResult
        }
    }

    type tGetMaterialDataParent_main = (tree:tTreeNodeD_creation) => tTreeData
    const getMaterialDataParent_main:tGetMaterialDataParent_main = (tree) => {
        // ツリー内の乗数算出
        return {
            アイテム名 : tree.アイテム名,
            素材情報 : (getMaterialData(tree,1,1))
        }
    }

    type tGetMaterialDataParent_common = (tree:tTreeNodeD_creation) => tTreeData
    const getMaterialDataParent_common:tGetMaterialDataParent_common = (tree) => {
        const usageObj = commonUsage.find(c => tree.アイテム名 === c.アイテム名);
        if(usageObj === undefined || 
            tree.調達方法 !== "作成"){
            return {
                アイテム名: tree.アイテム名,
                素材情報: []
            };
        }
        // 初期値取得処理
        //  要求値の最小公倍数
        const lcmAmount = lcmArray(usageObj.使用状況.map(d => d.要求数));
        //  作成数 * 要求公倍数 / 要求数
        const CmATdA = usageObj.使用状況.map(o => o.作成数 * lcmAmount / o.要求数);
        // 上記配列の最小公倍数
        const CmATdA_lcm = lcmArray(CmATdA);
        // 最小作成コンバイン数算出
        const miniCombArray = CmATdA.map(i => CmATdA_lcm / i);
        // 最小作成コンバイン数合算
        const miniComb = miniCombArray.reduce((acc,cur) => acc + cur,0);
        // 計算結果
        const newCreationNumber = tree.個数.セット作成個数 * CmATdA_lcm;
        const newAmountNumber = lcmAmount * miniComb;
        const treeTopResult = gcdCreateAndAmount(newCreationNumber,newAmountNumber,tree.アイテム名);

        // 下位素材の調査
        const treeMaterialsData = tree.材料.map(node => getMaterialData(node,treeTopResult.作成数,treeTopResult.要求数)).flat();
        
        return {
            アイテム名 : tree.アイテム名,
            素材情報: [treeTopResult].concat(treeMaterialsData)
        }
    }
    /**
     * 最大公約数算出
     */
    const gcd = (a:number, b:number) => {
        let t = 0
        while (b !== 0){
            t = b;
            b = a % b;
            a = t
        }
        return a
    }
    /**
     * 最小公倍数算出 
     */
    const lcm = (a:number, b:number) => {
        return (a * b / gcd(a,b))
    }
    /**
     * 配列要素の最小公倍数算出
     * lcmArray([a,b,c]) = lcm(a , lcm(b, c))
     */
    const lcmArray:(args:number[]) => number = (args) => {
        if(args.length === 0) return 1;
        if(args.length === 1) return args[0];
        if(args.length === 2) return lcm(args[0], args[1]);
        const args0 = args[0];
        const nextArgs = args.filter((a,i) => i !== 0);
        return lcm(args0,lcmArray(nextArgs));
    }

    const commonUsage: tCommonUsage[] = [];
    // 各種ツリーのツリー内の作成数等の情報収集
    const mainTreeData:tTreeData[] = main.map(tree => getMaterialDataParent_main(tree));
    const commonTreeData:tTreeData[] = commons.concat().reverse().map(tree => getMaterialDataParent_common(tree));
    // 素材調査結果の統合
    const materialData_Main = mainTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const materialData_Common = commonTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const concatMandC = materialData_Main.concat(materialData_Common);
    // 全要求数の乗算
    const AllAmountLcm = lcmArray(concatMandC.map(d => d.要求数));

    // 各素材において、作成数 * 全要求数乗算結果 / 要求数
    const AllCmATdA:number[] = concatMandC.map(d => d.作成数 * AllAmountLcm / d.要求数);
    // 最小作成数
    return lcmArray(AllCmATdA) / AllAmountLcm;
}

type tDecideCreateQuantityResult = {
    qty:number,
    qtyRole: tQtyRoleResult
}
type tDecideCreateQuantity = (
    items: string[],
    qtyRole: tQtyRole,
    qty: number,
    mini:number) => tDecideCreateQuantityResult;
const decideCreateQuantity:tDecideCreateQuantity = (items, qtyRole, qty, mini) => {
    const fSurplus: () => tDecideCreateQuantityResult = () => {
        if(qty === 0)return {
            qty: 1,
            qtyRole: "surplus"
        }
        return {
            qty: qty,
            qtyRole: "surplus"
        }
    }
    const fFully : () => tDecideCreateQuantityResult = () => {
        if(qty === 0) return {
            qty: mini,
            qtyRole: "fully"
        };
        if(qty % mini === 0) return {
            qty: qty,
            qtyRole: "fully"
        };
        return {
            qty: mini,
            qtyRole: "fully"
        };
    }
    if(qtyRole === "surplus")   return fSurplus();
    if(qtyRole === "fully")     return fFully();
    if(items.length > 1)        return fSurplus();
    if(CanStackItems.includes(items[0])) return fFully();
    return fSurplus();
}

type tSetQuantityToTreeResult = {
    main:tTreeNode_creation[],
    common:tTreeNode_creation[]
}
type tSetQuantityToTree = (
    main_noNumber:tTreeNodeD_creation[],
    commons_noNumber:tTreeNodeD_creation[],
    number:number
) => tSetQuantityToTreeResult

const setQuantityToTree:tSetQuantityToTree = (main,common,quantity) => {

    type tSetNumberToNode = (node:tTreeNodeD, quantity:number) => tTreeNode
    const setQuantityToNode:tSetNumberToNode = (node,quantity) => {
        // 処理分岐
        if(node.調達方法 === "作成")     return setQuantityToNode_create(node,quantity);
        if(node.調達方法 === "共通素材") return setQuantityToNode_common(node,quantity);
        if(node.調達方法 === "NPC")      return setQuantityToNode_npc(node,quantity);
        if(node.調達方法 === "自力調達") return setQuantityToNode_user(node,quantity);
        return setQuantityToNode_unknown(node,quantity);
    }
    const isLostNode = (node:tTreeNodeD) => {
        if(node.特殊消費 === "未消費" || node.特殊消費 === "失敗時消失") return true;
        return false;
    }
    type tSetQuantityToNode_create = (node: tTreeNodeD_creation, quantity:number) => tTreeNode_creation;
    const setQuantityToNode_create:tSetQuantityToNode_create = (node,quantity) => {
        // 基礎部の作成
        const result = (() => {
            if(node.特殊消費 === "消費") return setQuantityToNode_create_durable(node,quantity);
            return setQuantityToNode_create_nonDurable(node,quantity);
        })();
        // 任意項目
        if(node.備考) result.備考 = node.備考;
        if(node.副産物){
            result.副産物 = node.副産物.map(b => {
                const creationQuantity = result.個数.作成個数 / result.個数.セット作成個数 * b.セット作成個数;
                if(b.価格) return {
                    アイテム名: b.アイテム名,
                    セット作成個数: b.セット作成個数,
                    作成個数: creationQuantity,
                    価格: {
                        設定原価: b.価格.設定原価,
                        合計価格: b.価格.設定原価 * creationQuantity
                    }
                };
                return {
                    アイテム名: b.アイテム名,
                    セット作成個数: b.セット作成個数,
                    作成個数: creationQuantity
                }
            });
        }

        // 材料の呼び出し
        const nextQuantity = result.個数.作成個数 / result.個数.セット作成個数;
        result.材料 = node.材料.map(m => setQuantityToNode(m,nextQuantity));
        return result;
    }
    type tSetQuantityToNode_create_durable = (node: tTreeNodeD_creation_durable, quantity:number) => tTreeNode_creation_durable;
    const setQuantityToNode_create_durable:tSetQuantityToNode_create_durable = (node,quantity) => {
        const useDurability = quantity * node.個数.耐久値.上位要求;
        const useItem       = Math.ceil(useDurability / node.個数.耐久値.最大耐久値);
        const createItem    = Math.ceil(useItem / node.個数.セット作成個数);
        return {
            アイテム名: node.アイテム名,
            調達方法: "作成",
            特殊消費: "消費",
            材料: [],
            個数: {
                セット作成個数: node.個数.セット作成個数,
                作成個数: createItem,
                余剰作成個数: (createItem - useItem),
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurability
                }
            },
            スキル: node.スキル,
            テクニック: node.テクニック,
            ギャンブル: node.ギャンブル,
            ペナルティ: node.ペナルティ,
            要レシピ:node.要レシピ
        }
    }
    type tSetQuantityToNode_create_nonDurable = (node: tTreeNodeD_creation_nonDurable, quantity:number) => tTreeNode_creation_nonDurable;
    const setQuantityToNode_create_nonDurable:tSetQuantityToNode_create_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useQuantity = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        const creationQuantity = Math.ceil(useQuantity / node.個数.セット作成個数) * node.個数.セット作成個数;
        return {
            アイテム名: node.アイテム名,
            調達方法: "作成",
            特殊消費: node.特殊消費,
            材料: [],
            個数: {
                セット作成個数: node.個数.セット作成個数,
                作成個数: creationQuantity,
                余剰作成個数: creationQuantity - useQuantity
            },
            スキル: node.スキル,
            テクニック: node.テクニック,
            ギャンブル: node.ギャンブル,
            ペナルティ: node.ペナルティ,
            要レシピ:node.要レシピ
        }
    }

    type tSetQuantityToNode_common = (node:tTreeNodeD_common,quantity:number) => tTreeNode_common;
    const setQuantityToNode_common:tSetQuantityToNode_common = (node,quantity) => {
        const commonObj = (() => {
            const result = commonData.find(c => c.アイテム名 === node.アイテム名);
            if(result) return result;
            const pushItem: tCommonData = {
                アイテム名: node.アイテム名,
                要求個数: 0,
                要求耐久値: 0,
                最大耐久値: 0
            }
            commonData.push(pushItem);
            return pushItem;
        })();
        if(node.特殊消費 === "消費") return setQuantityToNode_common_durable(node,quantity,commonObj);
        return setQuantityToNode_common_nonDurable(node,quantity,commonObj);
    }
    type tSetQuantityToNode_common_durable = (node:tTreeNodeD_common_durable,quantity:number,commonObj:tCommonData) => tTreeNode_common_durable;
    const setQuantityToNode_common_durable:tSetQuantityToNode_common_durable = (node,quantity,commonObj) => {
        const useDurable = quantity * node.個数.耐久値.上位要求;
        const useItem = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        commonObj.要求耐久値 += useDurable;
        if(commonObj.最大耐久値 === 0) commonObj.最大耐久値 = node.個数.耐久値.最大耐久値;

        return {
            アイテム名: node.アイテム名,
            調達方法: "共通素材",
            特殊消費: "消費",
            個数: {
                消費個数: useItem,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            }
        };
    }
    type tSetQuantityToNode_common_nonDurable = (node:tTreeNodeD_common_nonDurable,quantity:number,commonObj:tCommonData) => tTreeNode_common_nonDurable;
    const setQuantityToNode_common_nonDurable:tSetQuantityToNode_common_nonDurable = (node,quantity,commonObj) => {
        const isUnLost = isLostNode(node);
        const useItem = (() => {
            if(isUnLost) return 1;
            const result = quantity * node.個数.上位レシピ要求個数;
            commonObj.要求個数 += result;
            return result;
        })();
        
        return {
            アイテム名: node.アイテム名,
            調達方法: "共通素材",
            特殊消費: node.特殊消費,
            個数: {
                消費個数: useItem
            }
        };
    }

    type tSetQuantityToNode_npc = (node:tTreeNodeD_npc,quantity:number) => tTreeNode_npc;
    const setQuantityToNode_npc:tSetQuantityToNode_npc = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_npc_durable(node,quantity);
        return setQuantityToNode_npc_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_npc_durable = (node:tTreeNodeD_npc_durable,quantity:number) => tTreeNode_npc_durable;
    const setQuantityToNode_npc_durable:tSetQuantityToNode_npc_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                調達個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            },
            価格: {
                合計金額: node.価格.調達単価 * procurment,
                調達単価: node.価格.調達単価,
                耐久割単価: node.価格.耐久割単価,
                耐久割合計金額: node.価格.耐久割単価 * useDurable
            }
        }
    }
    type tSetQuantityToNode_npc_nonDurable = (node:tTreeNodeD_npc_nonDurable,quantity:number) => tTreeNode_npc_nonDurable;
    const setQuantityToNode_npc_nonDurable:tSetQuantityToNode_npc_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                調達個数: useItem
            },
            価格: {
                合計金額: node.価格.調達単価 * useItem,
                調達単価: node.価格.調達単価
            }
        }
    }

    type tSetQuantityToNode_user = (node:tTreeNodeD_user,quantity:number) => tTreeNode_user;
    const setQuantityToNode_user:tSetQuantityToNode_user = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_user_durable(node,quantity);
        return setQuantityToNode_user_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_user_durable = (node:tTreeNodeD_user_durable,quantity:number) => tTreeNode_user_durable;
    const setQuantityToNode_user_durable:tSetQuantityToNode_user_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                調達個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            },
            価格: {
                合計金額: node.価格.調達単価 * procurment,
                調達単価: node.価格.調達単価,
                耐久割単価: node.価格.耐久割単価,
                耐久割合計金額: node.価格.耐久割単価 * useDurable
            }
        }
    }
    type tSetQuantityToNode_user_nonDurable = (node:tTreeNodeD_user_nonDurable,quantity:number) => tTreeNode_user_nonDurable;
    const setQuantityToNode_user_nonDurable:tSetQuantityToNode_user_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                調達個数: useItem
            },
            価格: {
                合計金額: node.価格.調達単価 * useItem,
                調達単価: node.価格.調達単価
            }
        }
    }

    type tSetQuantityToNode_unknown = (node:tTreeNodeD_unknown,quantity:number) => tTreeNode_unknown;
    const setQuantityToNode_unknown:tSetQuantityToNode_unknown = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_unknown_durable(node,quantity);
        return setQuantityToNode_unknown_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_unknown_durable = (node:tTreeNodeD_unknown_durable,quantity:number) => tTreeNode_unknown_durable;
    const setQuantityToNode_unknown_durable:tSetQuantityToNode_unknown_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                消費個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            }
        }
    }
    type tSetQuantityToNode_unknown_nonDurable = (node:tTreeNodeD_unknown_nonDurable,quantity:number) => tTreeNode_unknown_nonDurable;
    const setQuantityToNode_unknown_nonDurable:tSetQuantityToNode_unknown_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                消費個数: useItem
            }
        }
    }

    type tCommonData = {
        アイテム名: string,
        要求個数: number,
        要求耐久値: number,
        最大耐久値: number
    }
    const commonData:tCommonData[] = [];

    const resultMain = main.map(tree => setQuantityToNode_create(tree,quantity));

    const resultCommon = common.concat().reverse().map(tree => {
        const commonObj = commonData.find(c => c.アイテム名 === tree.アイテム名);
        const orderQuantity = (() => {
            if(! commonObj) return 1;
            if(commonObj.最大耐久値) return commonObj.要求個数 + Math.ceil(commonObj.要求耐久値 / commonObj.最大耐久値);
            return commonObj.要求個数;
        })();
        return setQuantityToNode_create(tree, orderQuantity);
    }).reverse();
    return {
        main:resultMain,
        common:resultCommon
    };
}

export default buildTree;
