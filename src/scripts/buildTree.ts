import {tSearchSectionRtnFuncProps} from '../components/searchSection';
import {iDictionary} from './storage';
import {
    CanStackItems,
    Durabilities,
    MultiRecipesDefault,
    NpcSaleItems,
    Recipes,
    tJSON_recipe} from './jsonReader';

export type tMessage = {
    重大度: "error" | "warning" | "info" | "success"
    タイトル: string,
    メッセージ: string[]
}

export type tTreeNode = tTreeNode_creation | tTreeNode_npc | tTreeNode_user | tTreeNode_common | tTreeNode_unknown;

export type tTreeNode_creation = tTreeNode_creation_nonDurable | tTreeNode_creation_durable;
export type tTreeNode_npc      = tTreeNode_npc_nonDurable      | tTreeNode_npc_durable;
export type tTreeNode_user     = tTreeNode_user_nonDurable     | tTreeNode_user_durable;
export type tTreeNode_common   = tTreeNode_common_nonDurable   | tTreeNode_common_durable;
export type tTreeNode_unknown  = tTreeNode_unknown_nonDurable  | tTreeNode_unknown_durable;

export type tTreeNode_creation_nonDurable = {
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

export type tTreeNode_npc_nonDurable = {
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

export type tTreeNode_user_nonDurable = {
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

export type tTreeNode_common_nonDurable = {
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

export type tTreeNode_unknown_nonDurable = {
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

type tQtyRole = "surplus" | "fully" | undefined
type tQtyRoleResult = "surplus" | "fully";

type tBuildTreeResult = {
    main:tTreeNode_creation[],
    common:tTreeNode_creation[],
    qtyRoluResult: tQtyRoleResult,
    totalQuantity: number,
    message:tMessage[]
}
type tBuildTree = (
    targets:tSearchSectionRtnFuncProps,
    dictionary:iDictionary | undefined,
    qtyRole: tQtyRole,
    qty: number
) => tBuildTreeResult;
const buildTree : tBuildTree = (targets, dictionary, qtyRole, qty) => {
    // エラー有無確認処理
    const ErrorObj = handleError(targets,qty);
    if(ErrorObj) return {
        main: [],
        common: [],
        message: [ErrorObj],
        qtyRoluResult: "surplus",
        totalQuantity: 0
    }

    // メインツリー構築
    const mainTreeD = buildMainTree(targets,dictionary);

    // 共通中間素材を別ツリーに切りだし
    const mainTreeAndCommonTreeD = splitCommonAndMain(mainTreeD);

    // 余剰作成数なしでの最小作成個数算出
    const minimumCreation = calcMinimumQty(mainTreeAndCommonTreeD.main,mainTreeAndCommonTreeD.common);

    // 作成個数の設定
    const createQuantity = decideCreateQuantity(targets,qtyRole,qty,minimumCreation);

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
        qtyRoluResult: createQuantity.qtyRole,
        totalQuantity: createQuantity.qty
    }

}

type tHandleError = (targets:tSearchSectionRtnFuncProps, qty:number) => null | tMessage;
const handleError:tHandleError = (targets, qty) => {
    if(targets === undefined) return {
        重大度: "error",
        タイトル: "レシピが指定されていません",
        メッセージ : ["レシピが指定されていません。","本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
    }
    if(targets.生成アイテム.length === 1){
        if(Recipes.every(r => r.レシピ名 !== targets.生成アイテム[0])) return {
            重大度:"error",
            タイトル: "レシピが見つかりませんでした",
            メッセージ:["作成予定のレシピが見つかりませんでした。",`作成予定のアイテム${targets.生成アイテム[0]}`,"本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
        }
    } else {
        const noRecipe: string[] = [];
        targets.生成アイテム.forEach(t => {
            const recipe = Recipes.find(r => t === r.レシピ名);
            if(! recipe) noRecipe.push(t);
        });
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


type tBuildMainTree = (targets:tSearchSectionRtnFuncProps,dictionary:iDictionary | undefined) => tTreeNodeD_creation[]
const buildMainTree:tBuildMainTree = (targets,dictionary) => {
    // 再起呼び出し部（レシピ登録時に材料をキーに呼び出す）
    type tReCall = (targetName:string,qty:number,sc:t特殊消費,created:string[]) => tTreeNodeD;
    const reCall:tReCall = (targetName, qty, sc, created) => {
        // ユーザー指定確認
        if(dictionary){
            const userMethod = dictionary.内容.find(d => d.アイテム === targetName);
            if(userMethod){
                if(userMethod.調達方法 === "NPC"){
                    const npcSaleInfo = NpcSaleItems.find(i => i.アイテム === targetName);
                    if(npcSaleInfo){
                        return fNpc(targetName, qty, sc, npcSaleInfo.最低販売価格);
                    }
                } else if(userMethod.調達方法 === "生産"){
                    const recipe = Recipes.find(r => r.レシピ名 === userMethod.レシピ名);
                    if(recipe){
                        return fCreate(targetName, qty, sc, created,recipe);
                    }
                } else if(userMethod.調達方法 === "自力調達"){
                    return fUser(targetName, qty, sc, userMethod.調達価格)
                }
            }
        }

        // NPC存在有無確認
        const npcSaleInfo = NpcSaleItems.find(i => i.アイテム === targetName);
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
                    return fCreate(targetName, qty, sc, created, defRecipe);
                }
            }
            // マルチレシピのメンテミスや、標準レシピが存在しない場合の退避手段
            // 1件目のレシピを使用してツリー作成
            return fCreate(targetName, qty, sc, created, matchRecipes[0]);
        }
        if(matchRecipes.length === 1){
            return fCreate(targetName, qty, sc, created, matchRecipes[0]);
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

    type tFCreation = (targetName:string, qty:number, sc:t特殊消費,created:string[], recipe:tJSON_recipe) => tTreeNodeD_creation
    const fCreate:tFCreation = (targetName, qty, sc, created, recipe) => {
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
                    if(! dictionary) return null;
                    const obj = dictionary.内容.find(i => i.アイテム === b.アイテム);
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
        const isMaterialCreated = recipe.材料.every(m => (! nextCreated.includes(m.アイテム)));
        if(isMaterialCreated) return rtnFCreation;

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
                上位レシピ要求個数: 0
            }
        }
    }

    // 処理部
    if(targets === undefined) return []; // これは処理されないはず
    if(targets.生成アイテム.length === 1){
        const recipe = Recipes.find(r => r.レシピ名 === targets.レシピ名);
        if(recipe) return [fCreate(targets.生成アイテム[0], 1, "消費", [], recipe)];
        return [];
    }
    return targets.生成アイテム.map(ts => {
        const recipe = Recipes.find(r => r.生成物.アイテム === ts);
        if(recipe){return fCreate(ts,1,"消費",[],recipe)};
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
    // 各種初期化処理
    type tMaterialCount = {
        アイテム:string,
        使用回数:number
    };

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
    // 作成アイテムの使用回数カウント
    const materialCount:tMaterialCount[] = [];
    main.forEach(node => getMaterialUseCount(node));

    // 共通素材の分割処理 
    type tSplitCommon = (node:tTreeNodeD) => tTreeNodeD;
    const splitCommon:tSplitCommon = (node) => {
        if(node.調達方法 !== "作成") return node;

        const countedObj = materialCount.find(c => c.アイテム === node.アイテム名);
        if(countedObj && countedObj.使用回数 > 1){
            isSplited = true;
            if(commonTreeBeforeSort.every(c => c.アイテム名 !== node.アイテム名)) commonTreeBeforeSort.push(node);

            if(node.特殊消費 === "消費") return {
                アイテム名: node.アイテム名,
                調達方法: "共通素材",
                特殊消費: "消費",
                個数: {
                    上位レシピ要求個数: node.個数.上位レシピ要求個数,
                    耐久値: {
                        上位要求: node.個数.耐久値.上位要求,
                        最大耐久値: node.個数.耐久値.最大耐久値
                    }
                }
            }
            return {
                アイテム名: node.アイテム名,
                調達方法: "共通素材",
                特殊消費: node.特殊消費,
                個数: {
                    上位レシピ要求個数: node.個数.上位レシピ要求個数
                }
            }
        }
        return splitCommonCreation(node);
    }
    type tSplitCommon_creation = (node:tTreeNodeD_creation) => tTreeNodeD_creation
    const splitCommonCreation:tSplitCommon_creation = (node) => {
        node.材料 = node.材料.map(material => splitCommon(material));
        return node;
    }
    /**
     * 分割処理実行有
     */
    const commonTreeBeforeSort: tTreeNodeD_creation[] = [];
    let isSplited = false;
    // メインツリーの分割処理
    const splitedMainTree = main.map(m => splitCommonCreation(m));
    // 共通素材ツリーの分割処理
    do{
        isSplited = false;
        const cloneMaterials = cloneObj_JSON(commonTreeBeforeSort);
        cloneMaterials.forEach(m => splitCommonCreation(m));
    } while(isSplited === false);

    type tCanSortCommon = (comon:tTreeNodeD) => boolean;
    const canSortCommon:tCanSortCommon = (common) => {
        if(common.調達方法 === "作成") return common.材料.every(m => canSortCommon(m) === true);
        if(common.調達方法 !== "共通素材") return true;
        return commonTreeSorted.some(cs => cs.アイテム名 === common.アイテム名);
    }

    const commonTreeSorted:tTreeNodeD_creation[] = [];
    do{
        commonTreeBeforeSort.forEach(cb => {
            if(commonTreeSorted.every(ca => cb.アイテム名 === ca.アイテム名)) return;
            if(! canSortCommon(cb)) return;
            commonTreeSorted.push(cb);
        });
    } while(commonTreeBeforeSort.length === commonTreeSorted.length);

    return {
        main:splitedMainTree,
        common: commonTreeSorted
    }
}

type iGetMinimumCreationNumber = (main:tTreeNodeD_creation[],commons:tTreeNodeD_creation[]) => number;
const calcMinimumQty:iGetMinimumCreationNumber = (main, commons) => {
    // 素材情報
    type tMaterialData = {
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
        multipleAmountNumber:number,
        md: tMaterialData[]) => tMaterialData[];

    const getMaterialData:tGetMaterialData = (node,multipleCreationSet,multipleAmountNumber,md) => {
        if(node.調達方法 === "NPC" || node.調達方法 === "未設定" || node.調達方法 === "自力調達"){
            return md;
        }
        const orderQuantity = multipleAmountNumber * node.個数.上位レシピ要求個数;
        if(node.調達方法 === "共通素材"){
            // 共通素材処理…共通素材側のツリーに登録
            const resultMaterialData:tMaterialData = {
                作成数: multipleCreationSet,
                要求数: orderQuantity
            }
            const commonIndex = (() => {
                const index = commonUsage.findIndex(c => node.アイテム名 === c.アイテム名);
                if(index === -1) return index;
                commonUsage.push({
                    アイテム名: node.アイテム名,
                    使用状況: []
                });
                return commonUsage.length - 1;
            })();
            commonUsage[commonIndex].使用状況.push(resultMaterialData);
            return md;
        }
        if(node.調達方法 === "作成"){
            const resultMaterialData:tMaterialData = {
                作成数: multipleCreationSet * node.個数.セット作成個数,
                要求数: orderQuantity
            }
            let resultObj:tMaterialData[] = cloneObj_JSON(md);
            resultObj.push(resultMaterialData);
            node.材料.forEach(m => {
                resultObj = getMaterialData(
                    m,
                    resultMaterialData.作成数,
                    resultMaterialData.要求数,
                    resultObj);
            });
            return resultObj;
        }
        // ここまでは到達しない…はず
        return md;
    }
    type tGetMaterialDataParent_main = (tree:tTreeNodeD_creation) => tTreeData
    const getMaterialDataParent_main:tGetMaterialDataParent_main = (tree) => {
        // ツリー内の乗数算出
        return {
            アイテム名 : tree.アイテム名,
            素材情報 : (getMaterialData(tree,1,1,[]))
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
        //  要求値の乗算加算値
        const ProductAmount = usageObj.使用状況.reduce<number>((acc,cur) => {return acc * cur.要求数},1);
        //  作成数 * 要求乗算数 / 要求数
        const CmATdA = usageObj.使用状況.map(o => o.作成数 * ProductAmount / o.要求数);
        // 上記配列の最小公倍数算出
        const CmATdA_lcm = lcmArray(CmATdA);
        // 最小作成コンバイン数算出
        const miniCombArray = CmATdA.map(i => CmATdA_lcm / i);
        // 最小作成コンバイン数合算
        const miniComb = miniCombArray.reduce<number>((acc,cur) => {return acc + cur},0);
        // 計算結果
        const treeTopResult:tMaterialData = {
            作成数 : tree.個数.セット作成個数 * CmATdA_lcm / gcd(tree.個数.セット作成個数, miniComb),
            要求数 : ProductAmount
        }

        // 下位素材の調査
        let md:tMaterialData[] = [treeTopResult];
        tree.材料.forEach(node => {
            md = getMaterialData(node,treeTopResult.作成数,treeTopResult.要求数,md);
        });
        
        return {
            アイテム名 : tree.アイテム名,
            素材情報: md
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
        args.shift();
        return lcm(args0,lcmArray(args));
    }

    const commonUsage: tCommonUsage[] = [];
    // 各種ツリーのツリー内の作成数等の情報収集
    const mainTreeData:tTreeData[] = main.map(tree => {return getMaterialDataParent_main(tree)});
    const commonTreeData:tTreeData[] = commons.reverse().map(tree => {return getMaterialDataParent_common(tree)})
    // 素材調査結果の統合
    const materialData_Main = mainTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const materialData_Common = commonTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const concatMandC = materialData_Main.concat(materialData_Common);

    // 全要求数の乗算
    const AllAmountProduct = concatMandC.reduce<number>((a,c) => a * c.要求数,1);

    // 各素材において、作成数 * 全要求数乗算結果 / 要求数
    const AllCmATdA:number[] = concatMandC.map(d => {return d.作成数 * AllAmountProduct / d.要求数});

    // 最小作成数
    return lcmArray(AllCmATdA) / AllAmountProduct;
}

type tDecideCreateQuantityResult = {
    qty:number,
    qtyRole: tQtyRoleResult
}
type tDecideCreateQuantity = (
    targets:tSearchSectionRtnFuncProps,
    qtyRole: tQtyRole,
    qty: number,
    mini:number) => tDecideCreateQuantityResult;
const decideCreateQuantity:tDecideCreateQuantity = (targets, qtyRole, qty, mini) => {
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
    if(targets === undefined)           return fSurplus(); // この処理はありえない…
    if(qtyRole === "surplus")           return fSurplus();
    if(qtyRole === "fully")             return fFully();
    if(targets.生成アイテム.length > 1) return fSurplus();
    if(CanStackItems.includes(targets.生成アイテム[0])) return fFully();
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
        const useQuantity = quantity * node.個数.上位レシピ要求個数;
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
        const useItem = quantity * node.個数.上位レシピ要求個数;
        commonObj.要求個数 += useItem;
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
        const useItem = node.個数.上位レシピ要求個数 * quantity;
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
        const useItem = node.個数.上位レシピ要求個数 * quantity;
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
        const useItem = node.個数.上位レシピ要求個数 * quantity;
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
    const resultCommon = common.reverse().map(tree => {
        const commonObj = commonData.find(c => c.アイテム名 === tree.アイテム名);
        const orderQuantity = (() => {
            if(! commonObj) return 1;
            if(commonObj.最大耐久値) return commonObj.要求個数 + Math.ceil(commonObj.要求耐久値 / commonObj.最大耐久値);
            return commonObj.要求個数;
        })();
        return setQuantityToNode_create(tree,orderQuantity);
    }).reverse();
    return {
        main:resultMain,
        common:resultCommon
    };
}

const cloneObj_JSON: <T>(obj:T) => T = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

export default buildTree;