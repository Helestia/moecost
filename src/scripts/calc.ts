
import {tSearchSectionRtnFuncProps} from '../components/searchSection';
import {iDictionary} from './storage';
import {
    CanStackItems,
    Durabilities,
    MultiRecipesDefault,
    NpcSaleItems,
    Recipes,
    tJSON_recipe} from '../scripts/jsonReader'




// 生産アイテムの余剰許容区分
// fully    : 余剰不可
// surplus  : 余剰可　生産数重視
// undefined: スタック可能アイテムは余剰不可　スタック不能アイテムは余剰許容
export type tNoStackCalcRoute = "fully" | "Surplus" | undefined;

// 返答オブジェクト
type tCalcResult = {
    生産個数 : {
        個数 : number,
        余剰なし最小生産個数 : number
    }
    共通材料ツリー : tTreeNode[],
    生産ツリー : tTreeNode[],
    メッセージ : tError[]
}

// 生産ツリー
type tTreeNode = 
    tTreeNode_userAndNpc | 
    tTreeNode_userAndNpc_durability |
    tTreeNode_creation |
    tTreeNode_creation_durability |
    tTreeNode_unknown |
    tTreeNode_unknown_durability |
    tTreeNode_common |
    tTreeNode_common_durability

type tTreeNode_userAndNpc ={
    アイテム名 : string,
    調達方法 : "自力調達" | "NPC",
    個数 : {
        調達個数: number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_userAndNpc_durability = {
    アイテム名 : string,
    調達方法 : "自力調達" | "NPC",
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
    },
    特殊消費: "消費"
}

type tTreeNode_creation = {
    アイテム名 : string,
    調達方法 : "作成"
    個数 : {
        セット作成個数 : number,
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
        作成個数: number
    }
    材料 : tTreeNode[],
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_creation_durability = {
    アイテム名 : string,
    調達方法 : "作成"
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
    }
    材料 : tTreeNode[],
    特殊消費: "消費"
}

type tTreeNode_unknown ={
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        消費個数: number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_unknown_durability = {
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    特殊消費: "消費"
}

type tTreeNode_common = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        消費個数: number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_common_durability = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    特殊消費: "消費"
}




// 生産ツリー1.
// ツリー構築時・共通素材抽出時ツリー
// 最終個数　合計金額のフィールドが除外された情報
type tTreeNode_noNumber = 
    tTreeNode_noNumber_userAndNpc | 
    tTreeNode_noNumber_userAndNpc_durability |
    tTreeNode_noNumber_creation |
    tTreeNode_noNumber_creation_durability |
    tTreeNode_noNumber_unknown |
    tTreeNode_noNumber_unknown_durability |
    tTreeNode_noNumber_common |
    tTreeNode_noNumber_common_durability

type tTreeNode_noNumber_userAndNpc ={
    アイテム名 : string,
    調達方法 : "自力調達" | "NPC",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_noNumber_userAndNpc_durability = {
    アイテム名 : string,
    調達方法 : "自力調達" | "NPC",
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

type tTreeNode_noNumber_creation = {
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
        セット作成個数: number
    }
    材料 : tTreeNode_noNumber[],
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_noNumber_creation_durability = {
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
    }
    材料 : tTreeNode_noNumber[],
    特殊消費: "消費"
}

type tTreeNode_noNumber_unknown ={
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_noNumber_unknown_durability = {
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

type tTreeNode_noNumber_common = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNode_noNumber_common_durability = {
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


// エラー型
type tError = {
    重大度 : "Critical" |"Error" | "Warning" | "Info" | "Success",
    メッセージ : string[]
}

type tCalc = (
    targets:tSearchSectionRtnFuncProps,
    userDictionary:iDictionary | undefined,
    noStackCalcRoute:tNoStackCalcRoute,
    createCount:number
) => tCalcResult;

const defResult:tCalcResult = {
    生産個数 : {
        個数 : 0,
        余剰なし最小生産個数 : 0
    },
    共通材料ツリー : [],
    生産ツリー : [],
    メッセージ : []
}

const cloneObj_JSON: <T>(obj:T) => T = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}



// 特殊消費区分
type tSpecialConsumption = "消失" | "消費" | "失敗時消失" | "未消費";

/**
 * エラーによる強制終了
 */
const errorExit : (prop : tError) => tCalcResult = (prop) => {
    const result = cloneObj_JSON(defResult);
    result.メッセージ.push(prop);
    return result;
}
/**
 * 生産ツリーの構築
 */
const buildTrees : (targets:tSearchSectionRtnFuncProps,dictionary:iDictionary | undefined) => tTreeNode_noNumber[] = (targets,dictionary) => {
    // ノード生成処理
    type tNodeBuild = (targetName:string, numberOfOrder:number, depth:number, sc:tSpecialConsumption) => tTreeNode_noNumber
    const nodeBuild : tNodeBuild = (targetName, numberOfOrder, depth, sc) => {
        // ノード生成処理　生産以外
        type tNodeBuild_userOrNpc = (procurement:"自力調達"|"NPC" ,price:number) => tTreeNode_noNumber_userAndNpc | tTreeNode_noNumber_userAndNpc_durability
        const nodeBuild_userOrNpc : tNodeBuild_userOrNpc = (procurement,price) => {
            if(sc === "消費"){
                // 最大耐久値
                const maxDurability = (()=>{
                    const work = Durabilities.find(D => D.アイテム === targetName);
                    return (work === undefined) ? 1 : work.使用可能回数;
                })();
                // return type tCreationTree_userAndNpc_durability
                const result:tTreeNode_noNumber_userAndNpc_durability = {
                    アイテム名 : targetName,
                    特殊消費: sc,
                    調達方法: procurement,
                    個数: {
                        上位レシピ要求個数: 1,
                        耐久値: {
                            最大耐久値: maxDurability,
                            上位要求 : numberOfOrder
                        }
                    },
                    価格: {
                        調達単価: price,
                        耐久割単価: (price / maxDurability)
                    }
                }
                return result;
            } else {
                const result:tTreeNode_noNumber_userAndNpc = {
                    アイテム名 : targetName,
                    特殊消費: (sc === undefined? "消失" : sc),
                    調達方法: procurement,
                    個数: {
                        上位レシピ要求個数: (sc === "未消費" ? 1 : numberOfOrder)
                    },
                    価格: {
                        調達単価: price
                    }
                }
                return result;
            }
        }
        // ノード生成処理　生産
        type tNodeBuild_creation = (t:tJSON_recipe) => tTreeNode_noNumber_creation | tTreeNode_noNumber_creation_durability
        const nodeBuild_creation : tNodeBuild_creation = (t) => {
            const numberOfCreation = t.生成物.個数 ? t.生成物.個数 : 1;
            const result:tTreeNode_noNumber_creation | tTreeNode_noNumber_creation_durability = (() => {
                if(sc === "消費"){
                    // 最大耐久値の取得処理
                    const maxDurability = (()=> {
                        const work = Durabilities.find(D => D.アイテム === targetName);
                        return (work === undefined) ? 1 : work.使用可能回数
                    })();
                    const r:tTreeNode_noNumber_creation_durability = {
                        アイテム名: targetName,
                        調達方法: "作成",
                        特殊消費: sc,
                        個数:{
                            上位レシピ要求個数: 1,
                            セット作成個数: numberOfCreation,
                            耐久値 : {
                                最大耐久値: maxDurability,
                                上位要求 : numberOfOrder
                            }
                        },
                        テクニック: t.テクニック[0],
                        スキル: t.スキル,
                        ギャンブル: t.ギャンブル,
                        ペナルティ: t.ペナルティ,
                        要レシピ: t.要レシピ,
                        備考: (t.備考 !== undefined ? t.備考 : undefined),
                        材料: []
                    }
                    return r;
                } else {
                    const r:tTreeNode_noNumber_creation = {
                        アイテム名: t.生成物.アイテム,
                        調達方法: "作成",
                        特殊消費: sc,
                        個数: {
                            上位レシピ要求個数: numberOfOrder,
                            セット作成個数: numberOfCreation
                        },
                        テクニック: t.テクニック[0],
                        スキル: t.スキル,
                        ギャンブル: t.ギャンブル,
                        ペナルティ: t.ペナルティ,
                        要レシピ: t.要レシピ,
                        備考: (t.備考 !== undefined ? t.備考 : undefined),
                        材料: []
                    }
                    return r;
                }
            })();
            t.材料.forEach(z => {
                const nextCreationCount = (()=>{
                    if(z.特殊消費 === "未消費"){
                        return 1;
                    } else {
                        return z.個数 ? z.個数 : 1;
                    }
                })();
                // 再起呼び出しにより、材料の材料を抽出
                result.材料.push(
                    nodeBuild(
                        z.アイテム,
                        nextCreationCount,
                        depth + 1,
                        (z.特殊消費 ? z.特殊消費 : "消失")));
            });
            return result;
        }
        // ノード生成処理　生産
        type tNodeBuild_unknown = () => tTreeNode_noNumber_unknown | tTreeNode_noNumber_unknown_durability
        const nodeBuild_unknown : tNodeBuild_unknown = () => {
            if(sc === "消費"){
                // 最大耐久値
                const maxDurability = (()=>{
                    const work = Durabilities.find(D => D.アイテム === targetName);
                    return (work === undefined) ? 1 : work.使用可能回数;
                })();
                const result:tTreeNode_noNumber_unknown_durability = {
                    アイテム名: targetName,
                    調達方法 : "未設定",
                    個数: {
                        上位レシピ要求個数: 1,
                        耐久値: {
                            最大耐久値: maxDurability,
                            上位要求: numberOfOrder
                        }
                    },
                    特殊消費 : "消費"
                }
                return result;
            } else {
                const result:tTreeNode_noNumber_unknown = {
                    アイテム名 : targetName,
                    特殊消費: (sc === undefined? "消失" : sc),
                    調達方法: "未設定",
                    個数: {
                        上位レシピ要求個数: (sc === "未消費" ? 1 : numberOfOrder),
                    }
                }
                return result
            }
        }
        // === Nodeの種類判定 ===
        // 条件０．深さ0(レシピ指定のレシピ時)の場合、指定レシピをそのまま使用
        if(depth === 0){
            const r = Recipes.find(R => R.レシピ名 === targetName);
            if(r){
                return nodeBuild_creation(r);
            } else {
                // 例外部
                return nodeBuild_unknown();
            }
        }

        // 条件１．ユーザー指定有…ユーザー指定通り
        if(dictionary){
            const userConfigProcurementMethod = dictionary.内容.find(D => D.アイテム === targetName);
            if(userConfigProcurementMethod){
                if(userConfigProcurementMethod.調達方法 === "NPC"){
                    const npcSailInfo = NpcSaleItems.find(item => item.アイテム === targetName);
                    if(npcSailInfo){
                        return nodeBuild_userOrNpc("NPC", npcSailInfo.最低販売価格);
                    }
                } else if(userConfigProcurementMethod.調達方法 === "自力調達"){
                    return nodeBuild_userOrNpc("自力調達", userConfigProcurementMethod.調達価格);
                } else if(userConfigProcurementMethod.調達方法 === "生産"){
                    const recipe = Recipes.find(R => R.レシピ名 === userConfigProcurementMethod.レシピ名);
                    if(recipe !== undefined){
                        return nodeBuild_creation(recipe);
                    }
                }
            }
        }
        // 条件２．NPC販売が存在する場合はNPC
        const npcSale = NpcSaleItems.find(item => targetName === item.アイテム);
        if(npcSale){
            return nodeBuild_userOrNpc("NPC",npcSale.最低販売価格);
        }
        // 条件３．生産レシピの存在確認・及び複数レシピがあるか確認。
        const matchRecipes:tJSON_recipe[] = [];
        Recipes.forEach(R => {
            if(R.生成物.アイテム === targetName) matchRecipes.push(R);
        });
        if(matchRecipes.length > 1){
            const multiDefault = MultiRecipesDefault.find(MR => MR.アイテム名 === targetName);
            if(multiDefault){
                const defRecipe = Recipes.find(r => r.レシピ名 === multiDefault.標準レシピ名);
                if(defRecipe){
                    return nodeBuild_creation(defRecipe);
                }
            }
            // 標準レシピが見つからない　あるいは標準レシピで指定されたレシピが見つからないなどの
            // 何らかのJSON処理エラーの場合、見つかったレシピの最初を指定する。
            return nodeBuild_creation(matchRecipes[0])
        }
        if(matchRecipes.length === 1){
            return nodeBuild_creation(matchRecipes[0]);
        }
        // 入手手段不明
        return nodeBuild_unknown();
    }

    const result:tTreeNode_noNumber[] = [];
    if(targets === undefined) return result;
    targets.生成アイテム.forEach(target => {
        result.push(nodeBuild(target,1,0,"消費"))
    });
    return result;
}

/**
 * 生産ツリー　共通作成素材の分割
 */
type tSplitCommonAndMainRtn = {
    main:tTreeNode_noNumber[],
    commons:tTreeNode_noNumber[]
}
type tSplitCommonAndMain = (main:tTreeNode_noNumber[]) => tSplitCommonAndMainRtn;
const splitCommonAndMain: tSplitCommonAndMain = (main) => {
    type tMaterialCount = {
        アイテム:string,
        使用回数:number
    };

    const materialCount:tMaterialCount[] = [];

    // === 使用回数カウント処理 ===
    type tGetMaterialCount = (tree:tTreeNode_noNumber) => void;
    const getMaterialCount:tGetMaterialCount = (node) => {
        if(node.調達方法 !== "作成") return;
        const index = materialCount.findIndex(m => m.アイテム === node.アイテム名);

        if(index !== -1){
            materialCount[index].使用回数++;
            return;
        } else {
            materialCount.push({
                アイテム: node.アイテム名,
                使用回数: 1
            });
        }
        node.材料.forEach(material => {
            getMaterialCount(material);
        });
    }

    // === 共通素材の分割処理 ===
    type tSplitCommonRtn={
        main:tTreeNode_noNumber,
        commons:tTreeNode_noNumber[]
    }
    type tSplitCommon = (node:tTreeNode_noNumber,commons:tTreeNode_noNumber[],depth:number) => tSplitCommonRtn;
    const splitCommon:tSplitCommon = (node,commons,depth) => {
        if(node.調達方法 !== "作成"){
            return {
                main: node,
                commons: commons
            }
        }

        const countedObj = materialCount.find(c => c.アイテム === node.アイテム名);
        if(countedObj && countedObj.使用回数 > 1 && depth){
            const index = commons.findIndex(c => c.アイテム名 === node.アイテム名);
            if(index === -1){
                commons.push(node);
            }
            if(node.特殊消費 === "消費"){
                const returnNode:tTreeNode_noNumber_common_durability = {
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
                    main: returnNode,
                    commons: commons
                }
            } else {
                const returnNode: tTreeNode_noNumber_common = {
                    アイテム名: node.アイテム名,
                    調達方法: "共通素材",
                    特殊消費: node.特殊消費,
                    個数: {
                        上位レシピ要求個数: node.個数.上位レシピ要求個数
                    }
                }
                return {
                    main: returnNode,
                    commons: commons
                }
            }
        } else {
            let rtnNode = cloneObj_JSON(node);
            let rtnCommons = cloneObj_JSON(commons);
            node.材料.forEach((m,i) => {
                const work = splitCommon(m,rtnCommons,depth+1);
                rtnCommons = work.commons;
                rtnNode.材料[i] = work.main;
            });
            return {
                main:rtnNode,
                commons:rtnCommons
            }
        }
    }

    // === 共通素材ツリーの並べ替え処理 ===
    type tSortCommon = (common:tTreeNode_noNumber,sorted:string[]) => boolean
    const canSortCommon:tSortCommon = (common,sorted) => {
        if(common.調達方法 === "作成"){
            return common.材料.every(m => canSortCommon(m,sorted) === true);
        }
        if(common.調達方法 === "共通素材"){
            const index = sorted.indexOf(common.アイテム名);
            if(index !== -1){
                return true;
            } else {
                return false;
            }
        }
        // 作成関連以外の材料は調査不要
        return true;
    }

    // 使用回数カウント処理の実行
    main.forEach(tree => {
        getMaterialCount(tree);
    });

    // 分割処理
    let workCommon:tTreeNode_noNumber[] = [];
    const resultMain:tTreeNode_noNumber[] = [];
    main.forEach(tree => {
        const obj = splitCommon(tree,workCommon,0);
        resultMain.push(obj.main);
        workCommon = obj.commons;
    });

    // 共通内での分割処理
    let workCommon2:tTreeNode_noNumber[] = cloneObj_JSON(workCommon);
    workCommon.forEach((tree,index) => {
        const obj = splitCommon(tree,workCommon2,0);
        workCommon2 = obj.commons;
        workCommon2[index] = obj.main;
    });

    // ソート処理
    const sorted:string[] = [];
    const resultCommons:tTreeNode_noNumber[] = [];

    while(workCommon2.length){
        const workCommon3 = cloneObj_JSON(workCommon2);
        workCommon3.forEach(c => {
            if(canSortCommon(c,sorted)){
                sorted.push(c.アイテム名);
                resultCommons.push(c);

                const index = workCommon2.findIndex(wc => c.アイテム名 === wc.アイテム名);
                if(index !== -1){
                    workCommon2.splice(index,1);
                }
            }
        });
    }

    return {
        main: resultMain,
        commons:resultCommons
    }

}

/**
 * 最小作成個数算出処理 
 */
type iGetMinimumCreationNumber = (main:tTreeNode_noNumber[],commons:tTreeNode_noNumber[]) => number;
const getMinimumCreationNumber:iGetMinimumCreationNumber = (main,commons) => {
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
        tree:tTreeNode_noNumber,
        multipleCreationSet:number,
        multipleAmountNumber:number,
        md: tMaterialData[]) => tMaterialData[];
    

    const commonUsage: tCommonUsage[] = [];

    const getMaterialData:tGetMaterialData = (tree,multipleCreationSet,multipleAmountNumber,md) => {
        if(tree.調達方法 === "NPC" || tree.調達方法 === "未設定" || tree.調達方法 === "自力調達"){
            return md;
        }
        const resultMaterialData:tMaterialData = {
            作成数 : (tree.調達方法 === "作成") ? (multipleCreationSet * tree.個数.セット作成個数) : multipleCreationSet,
            要求数 : multipleAmountNumber * tree.個数.上位レシピ要求個数
        }
        if(tree.調達方法 === "共通素材"){
            // 共通素材処理…共通素材側のツリーに登録
            let commonIndex = commonUsage.findIndex(c => tree.アイテム名 === c.アイテム名);
            if(commonIndex === -1){
                commonUsage.push({
                    アイテム名: tree.アイテム名,
                    使用状況: []
                });
                commonIndex = commonUsage.length - 1;
            }
            commonUsage[commonIndex].使用状況.push(resultMaterialData);
            return md;
        }
        if(tree.調達方法 === "作成"){
            let resultObj:tMaterialData[] = cloneObj_JSON(md);
            resultObj.push(resultMaterialData);
            tree.材料.forEach(material => {
                resultObj = getMaterialData(
                    material,
                    resultMaterialData.作成数,
                    resultMaterialData.要求数,
                    resultObj);
            });        
            return md;
        }
        // ここまでは到達しない…はず
        return md;
    }

    type tGetMaterialDataParent_main = (tree:tTreeNode_noNumber) => tTreeData
    const getMaterialDataParent_main:tGetMaterialDataParent_main = (tree) => {
        // ツリー内の乗数算出
        return {
            アイテム名 : tree.アイテム名,
            素材情報 : (getMaterialData(tree,1,1,[]))
        }
    }

    type tGetMaterialDataParent_common = (tree:tTreeNode_noNumber) => tTreeData
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
        const miniCombArray = CmATdA.map(i => i / CmATdA_lcm);
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
    
    // メインツリーのデータ取得
    const mainTreeData:tTreeData[] = main.map(tree => {return getMaterialDataParent_main(tree)})
    // 共通素材ツリーのデータ取得
    const commonTreeData:tTreeData[] = commons.reverse().map(tree => {return getMaterialDataParent_common(tree)})
    // それらの結合
    const concatMandC = mainTreeData.concat(commonTreeData);

    // 全要求数の乗算
    const AllAmountProduct = concatMandC.reduce<number>((a,c) => {
        return a * c.素材情報.reduce<number>((a,c) => {
            return a * c.要求数
        },1)
    },1);

    // 各素材において、作成数 * 全要求数乗算結果 / 要求数
    const AllCmATdA:number[] = [];
    concatMandC.forEach(tree => {
        tree.素材情報.forEach(data => {
            AllCmATdA.push(data.作成数 * AllAmountProduct / data.要求数);
        });
    });

    // 最小作成数
    return lcmArray(AllCmATdA);
}
type tSetNumberToTreeResult = {
    main:tTreeNode[],
    commons:tTreeNode[]
}
type tSetNumberToTree = (
    main_noNumber:tTreeNode_noNumber[],
    commons_noNumber:tTreeNode_noNumber[],
    number:number
) => tSetNumberToTreeResult

const setNumberToTree:tSetNumberToTree = (main_noNumber,commons_noNumber,number) => {
    type tCommonData = {
        アイテム名: string,
        要求数計: number
    }
    const commonData:tCommonData[] = [];
    type tSetNumberToNode = (node:tTreeNode_noNumber, number:number) => tTreeNode
    const setNumberToNode:tSetNumberToNode = (node,number) => {
        // 調達方法不明時の処理
        type tSetNumberToNode_unknown = (node:tTreeNode_noNumber_unknown | tTreeNode_noNumber_unknown_durability) => tTreeNode_unknown | tTreeNode_unknown_durability;
        const setNumberToNode_unknown: tSetNumberToNode_unknown = (node) => {
            if(node.特殊消費 === "消費"){
                return {
                    アイテム名: node.アイテム名,
                    調達方法: "未設定",
                    特殊消費: "消費",
                    個数: {
                        消費個数: Math.ceil(node.個数.耐久値.上位要求 * number / node.個数.耐久値.最大耐久値),
                        耐久値: {
                            最大耐久値: node.個数.耐久値.最大耐久値,
                            消費耐久合計: node.個数.耐久値.上位要求 * number
                        }
                    }
                }
            } else {
                return {
                    アイテム名: node.アイテム名,
                    調達方法: "未設定",
                    特殊消費: node.特殊消費,
                    個数: {
                        消費個数: number * node.個数.上位レシピ要求個数
                    }
                }
            }
        }
        // 調達方法user or npc設定時の処理
        type tSetNumberToNode_userAndNpc = (node:tTreeNode_noNumber_userAndNpc | tTreeNode_noNumber_userAndNpc_durability) => tTreeNode_userAndNpc | tTreeNode_userAndNpc_durability
        const setNumberToNode_userAndNpc:tSetNumberToNode_userAndNpc = (node) => {
            if(node.特殊消費 === "消費"){
                // 調達数
                const procurment = Math.ceil(node.個数.耐久値.上位要求 * number / node.個数.耐久値.最大耐久値)
                const result:tTreeNode_userAndNpc_durability = {
                    アイテム名:node.アイテム名,
                    調達方法: node.調達方法,
                    特殊消費: "消費",
                    個数: {
                        調達個数: procurment,
                        耐久値: {
                            最大耐久値: node.個数.耐久値.最大耐久値,
                            消費耐久合計: node.個数.耐久値.上位要求 * number
                        }
                    },
                    価格: {
                        合計金額: node.価格.調達単価 * procurment,
                        調達単価: node.価格.調達単価,
                        耐久割単価: node.価格.耐久割単価,
                        耐久割合計金額: node.価格.耐久割単価 * number * node.個数.耐久値.上位要求
                    }
                }
                return result;
            } else {
                const result:tTreeNode_userAndNpc = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    特殊消費: node.特殊消費,
                    個数:{
                        調達個数: number * node.個数.上位レシピ要求個数
                    },
                    価格:{
                        調達単価: node.価格.調達単価,
                        合計金額: node.価格.調達単価 * number * node.個数.上位レシピ要求個数
                    }
                }
                return result;
            }
        }
        // 共通素材時の設定
        type tSetNumberToNode_common = (node:tTreeNode_noNumber_common | tTreeNode_noNumber_common_durability) => tTreeNode_common | tTreeNode_common_durability
        const setNumberToNode_common:tSetNumberToNode_common = (node) => {
            const commonObj = (() => {
                const findItem = commonData.find(item => item.アイテム名 === node.アイテム名);
                if(findItem) return findItem;
                const pushItem:tCommonData = {
                    アイテム名: node.アイテム名,
                    要求数計: 0
                }
                commonData.push(pushItem);
                return pushItem;
            })();
            if(node.特殊消費 === "消費"){
                commonObj.要求数計 += number * node.個数.耐久値.上位要求;
                const result:tTreeNode_common_durability = {
                    アイテム名: node.アイテム名,
                    調達方法: "共通素材",
                    特殊消費: "消費",
                    個数: {
                        消費個数: Math.ceil(number * node.個数.耐久値.上位要求/ node.個数.耐久値.最大耐久値),
                        耐久値: {
                            最大耐久値: node.個数.耐久値.最大耐久値,
                            消費耐久合計: number * node.個数.耐久値.上位要求
                        }
                    }
                }
                commonObj.要求数計 += result.個数.耐久値.消費耐久合計;
                return result;
            } else {
                commonObj.要求数計 += number * node.個数.上位レシピ要求個数;
                const result:tTreeNode_common = {
                    アイテム名: node.アイテム名,
                    調達方法: "共通素材",
                    特殊消費: node.特殊消費,
                    個数: {
                        消費個数: number * node.個数.上位レシピ要求個数
                    }
                }
                commonObj.要求数計 += result.個数.消費個数;
                return result;
            }
        }
        // 作成時の設定
        type tSetNumberToNode_creation = (node:tTreeNode_noNumber_creation | tTreeNode_noNumber_creation_durability) => tTreeNode_creation | tTreeNode_creation_durability
        const setNumberToNode_creation:tSetNumberToNode_creation = (node) => {
            const result:tTreeNode_creation | tTreeNode_creation_durability = (()=> {
                if(node.特殊消費 === "消費"){
                    // 使用する耐久
                    const useDurability = number * node.個数.耐久値.上位要求;
                    // 使用する耐久に割当たるアイテム個数
                    const useItem = Math.ceil(useDurability / node.個数.耐久値.最大耐久値);
                    // アイテム個数を生産するために必要なセット数
                    const createItem = Math.ceil(useItem / node.個数.セット作成個数);
                    const result:tTreeNode_creation_durability = {
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
                    return result;
                } else {
                    const useNumber = number * node.個数.上位レシピ要求個数;
                    const creationNumber = Math.ceil(useNumber / node.個数.セット作成個数);
                    const amountNumber = creationNumber - useNumber;
                    const result:tTreeNode_creation = {
                        アイテム名: node.アイテム名,
                        調達方法: "作成",
                        特殊消費: node.特殊消費,
                        材料: [],
                        個数: {
                            セット作成個数: node.個数.セット作成個数,
                            作成個数: creationNumber,
                            余剰作成個数: amountNumber
                        },
                        スキル: node.スキル,
                        テクニック: node.テクニック,
                        ギャンブル: node.ギャンブル,
                        ペナルティ: node.ペナルティ,
                        要レシピ:node.要レシピ
                    }
                    return result;
                }
            })();
            if(node.備考){
                result.備考 = node.備考;
            }
            if(node.副産物){
                const creationNumber = result.個数.作成個数 / result.個数.セット作成個数 * node.副産物.セット作成個数;
                result.副産物 = {
                    アイテム名: node.副産物.アイテム名,
                    セット作成個数: node.副産物.セット作成個数,
                    作成個数 : creationNumber
                }
            }

            // 材料処理の為再起呼び出し
            const nextNumber = result.個数.作成個数 / result.個数.セット作成個数;
            node.材料.forEach(child => {
                result.材料.push(setNumberToNode(child,nextNumber))
            });
            return result;
        }
        // 処理分岐
        if(node.調達方法 === "作成")     return setNumberToNode_creation(node);
        if(node.調達方法 === "未設定")   return setNumberToNode_unknown(node);
        if(node.調達方法 === "共通素材") return setNumberToNode_common(node);
        return setNumberToNode_userAndNpc(node);
    }
    // 個数設定処理　統括
    const main:tTreeNode[] = [];
    const commons:tTreeNode[] = [];
    main_noNumber.forEach(tree => {
        main.push(setNumberToNode(tree, number));
    });
    // 共通素材は逆順で処理
    commons_noNumber.reverse().forEach(tree => {
        // undefinedは想定していない。
        const commonNumberObj = commonData.find(c => c.アイテム名 === tree.アイテム名);
        if(commonNumberObj){
            commons.unshift(setNumberToNode(tree, commonNumberObj.要求数計));
        }
    });
    return {
        main: main,
        commons: commons
    }
}

type tGetUnknownItemSearch = (
    main:tTreeNode[],
    commons:tTreeNode[]
) => string[]
const unknownItemSearch:tGetUnknownItemSearch = (main,commons) => {
    const result:string[] = [];
    type tSearch = (node:tTreeNode) => void;
    const search:tSearch = (node) => {
        if(node.調達方法 === "未設定"){
            if(result.indexOf(node.アイテム名) !== -1){
                result.push(node.アイテム名);
            }
        }
        if(node.調達方法 !== "作成") return;
        node.材料.forEach(childNode => {
            search(childNode);
        });
    }
    main.forEach(tree => {
        search(tree);
    });
    commons.forEach(tree => {
        search(tree);
    })
    return result;
}



const Calc:tCalc = (targets, userDictionary, noStackCalcRoute, createNumber) => {
    const message:tError[] = [];

    // レシピ指定確認
    if(targets === undefined){
        return errorExit({
            重大度:"Critical",
            メッセージ : ["レシピが指定されていません。"]
        });
    }
    // レシピの存在有無確認
    if(targets.生成アイテム.length === 1){
        const targetIndex = Recipes.findIndex(recipe => recipe.レシピ名 === targets.レシピ名);
        if(targetIndex === -1){
            return errorExit({
                重大度:"Critical",
                メッセージ:["レシピが見つかりませんでした。"]
            });
        }
    } else {
        const noRecipe: string[] = [];
        targets.生成アイテム.forEach(item => {
            if(Recipes.findIndex(recipe => recipe.生成物.アイテム === item) === -1){
                noRecipe.push(item);
            }
        });
        if(noRecipe.length !== 0){
            return errorExit({
                重大度:"Critical",
                メッセージ:(["次のアイテムのレシピが見つかりませんでした。"　+ noRecipe.join(", ")])
            })
        }
    }

    // 生産ツリーの構築
    const MainTree:tTreeNode_noNumber[] = buildTrees(targets,userDictionary);
    
    // 共通素材のツリー分岐処理
    const MainTreeAndCommonTree:tSplitCommonAndMainRtn = splitCommonAndMain(MainTree);

    // 最小個数の算出
    const MinimumCreation = getMinimumCreationNumber(MainTreeAndCommonTree.main,MainTreeAndCommonTree.commons);

    // 個数設定
    const resultNumber = (() => {
        // 余剰許容ルート
        const procSurpplus = () => {
            if(createNumber === 0) return 1
            return createNumber;
        }
        // 余剰非許容
        const procFully = () => {
            if(createNumber === 0) return MinimumCreation;
            if(createNumber % MinimumCreation === 0) return createNumber;
            message.push({
                重大度: "Warning",
                メッセージ: ["指定した作成個数で余剰なしで作成ができませんでした。","最小作成可能個数で作成しています。"]});
            return MinimumCreation; 
        }
        if(noStackCalcRoute === "Surplus") return procSurpplus();
        if(noStackCalcRoute === "fully") return procFully();
        if(targets.生成アイテム.length > 1) return procSurpplus();
        if(CanStackItems.indexOf(targets.生成アイテム[0]) === -1) return procSurpplus();
        else return procFully();
    })();
    
    const MainTreeAndCommonTree_AddedNumber = setNumberToTree(
        MainTreeAndCommonTree.main,
        MainTreeAndCommonTree.commons,
        resultNumber);
    
    const unknownItem = unknownItemSearch(
        MainTreeAndCommonTree_AddedNumber.main,
        MainTreeAndCommonTree_AddedNumber.commons);
    
    if(unknownItem.length >= 1){
        message.push({
            重大度: "Warning",
            メッセージ: (["この材料のアイテム入手手段が不明です。入手手段を指定してください。"].concat(unknownItem))
        })
    }
    const result:tCalcResult = {
        生産個数: {
            余剰なし最小生産個数: MinimumCreation,
            個数: resultNumber
        },
        生産ツリー: MainTreeAndCommonTree_AddedNumber.main,
        共通材料ツリー: MainTreeAndCommonTree_AddedNumber.commons,
        メッセージ:message
    }
    return result;
}
/**
 * 最大公約数算出
 */
const gcd = (a:number, b:number) => {
    let t = 0
    while (b !== 0){
        t = b;
        b = a % b
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
    if(args.length === 0){
        return 1;
    }
    if(args.length === 1){
        return args[0];
    }
    if(args.length === 2){
        return lcm(args[0], args[1]);
    } else {
        const args0 = args[0];
        args.shift();
        return lcm(args0,lcmArray(args));
    }
}









export default Calc;