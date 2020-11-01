
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
type tNoStackCalcRoute = "fully" | "Surplus" | undefined;

// 返答オブジェクト
type tCalcResult = {
    原価 : tPrice,
    生産個数 : {
        個数 : number,
        余剰なし最小生産個数 : number
    }
    生産アイテム一覧 : tCreationAndSurplusAndByproductList[],
    材料一覧 : tMaterialList[],
    余剰生産一覧 : tCreationAndSurplusAndByproductList[],
    副産物一覧 : tCreationAndSurplusAndByproductList[],
    共通材料ツリー : tCreationTreeNode[],
    生産ツリー : tCreationTreeNode[],
    エラーメッセージ : tError[]
}
/**
 * 仮！コンパイル通過用
 */
type tCreationTreeNode = string;


// 価格
type tPrice = {
    総原価 : number,
    余剰生産品原価 : number,
    副産物原価 : number,
    耐久消費アイテム残額 : number
}

// 材料一覧
type tMaterialList = {
    アイテム名 : string,
    個数 : number,
    単価 : number,
    最大耐久? : number,
    消費耐久? : number
}
// 生産品・余剰生産・副産物一覧
type tCreationAndSurplusAndByproductList = {
    アイテム名 : string,
    個数 : number,
    単価 : number
}

// 生産ツリー1.
// ツリー構築時・共通素材抽出時ツリー
type tCreationTreeNode1 = 
    tCreationTreeNode1_userAndNpc | 
    tCreationTreeNode1_userAndNpc_durability |
    tCreationTreeNode1_creation |
    tCreationTreeNode1_creation_durability |
    tCreationTreeNode1_unknown |
    tCreationTreeNode1_unknown_durability |
    tCreationTreeNode1_common |
    tCreationTreeNode1_common_durability

type tCreationTreeNode1_userAndNpc ={
    アイテム名 : string,
    調達方法 : "自力調達" | "NPC",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tCreationTreeNode1_userAndNpc_durability = {
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
        合計金額 : number,
        耐久割単価 : number,
        耐久割金額 : number
    },
    特殊消費: "消費"
}

type tCreationTreeNode1_creation = {
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
    材料 : tCreationTreeNode1[],
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tCreationTreeNode1_creation_durability = {
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
    材料 : tCreationTreeNode1[],
    特殊消費: "消費"
}

type tCreationTreeNode1_unknown ={
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tCreationTreeNode1_unknown_durability = {
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

type tCreationTreeNode1_common = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tCreationTreeNode1_common_durability = {
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
    重大度 : "Error" | "Warning" | "Info" | "Success",
    メッセージ : string
}

type tCalc = (
    targets:tSearchSectionRtnFuncProps,
    userDictionary:iDictionary,
    noStackCalcRoute:tNoStackCalcRoute,
    createCount:number
) => tCalcResult;

const defResult:tCalcResult = {
    原価 : {
        総原価 : 0,
        余剰生産品原価 : 0,
        副産物原価 : 0,
        耐久消費アイテム残額 : 0
    },
    生産個数 : {
        個数 : 0,
        余剰なし最小生産個数 : 0
    },
    生産アイテム一覧 : [],
    材料一覧 : [],
    余剰生産一覧 : [],
    副産物一覧 : [],
    共通材料ツリー : [],
    生産ツリー : [],
    エラーメッセージ : []
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
    const result = Object.assign({},defResult);
    result.エラーメッセージ.push(prop);
    return result;
}
/**
 * 生産ツリーの構築
 */
const buildTrees : (targets:tSearchSectionRtnFuncProps,dictionary:iDictionary) => tCreationTreeNode1[] = (targets,dictionary) => {
    // ノード生成処理
    type tNodeBuild = (targetName:string, numberOfOrder:number, depth:number, sc:tSpecialConsumption) => tCreationTreeNode1
    const nodeBuild : tNodeBuild = (targetName, numberOfOrder, depth, sc) => {
        // ノード生成処理　生産以外
        type tNodeBuild_userOrNpc = (procurement:"自力調達"|"NPC" ,price:number) => tCreationTreeNode1_userAndNpc | tCreationTreeNode1_userAndNpc_durability
        const nodeBuild_userOrNpc : tNodeBuild_userOrNpc = (procurement,price) => {
            if(sc === "消費"){
                // 最大耐久値
                const maxDurability = (()=>{
                    const work = Durabilities.find(D => D.アイテム === targetName);
                    return (work === undefined) ? 1 : work.使用可能回数;
                })();
                // return type tCreationTree_userAndNpc_durability
                const result:tCreationTreeNode1_userAndNpc_durability = {
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
                        合計金額: 0,
                        耐久割単価: (price / maxDurability),
                        耐久割金額: 0
                    }
                }
                return result;
            } else {
                const result:tCreationTreeNode1_userAndNpc = {
                    アイテム名 : targetName,
                    特殊消費: (sc === undefined? "消失" : sc),
                    調達方法: procurement,
                    個数: {
                        上位レシピ要求個数: (sc === "未消費" ? 1 : numberOfOrder)
                    },
                    価格: {
                        調達単価: price,
                        合計金額: 0
                    }
                }
                return result;
            }
        }
        // ノード生成処理　生産
        type tNodeBuild_creation = (t:tJSON_recipe) => tCreationTreeNode1_creation | tCreationTreeNode1_creation_durability
        const nodeBuild_creation : tNodeBuild_creation = (t) => {
            const numberOfCreation = t.生成物.個数 ? t.生成物.個数 : 1;
            const result:tCreationTreeNode1_creation | tCreationTreeNode1_creation_durability = (() => {
                if(sc === "消費"){
                    // 最大耐久値の取得処理
                    const maxDurability = (()=> {
                        const work = Durabilities.find(D => D.アイテム === targetName);
                        return (work === undefined) ? 1 : work.使用可能回数
                    })();
                    const r:tCreationTreeNode1_creation_durability = {
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
                    const r:tCreationTreeNode1_creation = {
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
        type tNodeBuild_unknown = () => tCreationTreeNode1_unknown | tCreationTreeNode1_unknown_durability
        const nodeBuild_unknown : tNodeBuild_unknown = () => {
            if(sc === "消費"){
                // 最大耐久値
                const maxDurability = (()=>{
                    const work = Durabilities.find(D => D.アイテム === targetName);
                    return (work === undefined) ? 1 : work.使用可能回数;
                })();
                const result:tCreationTreeNode1_unknown_durability = {
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
                const result:tCreationTreeNode1_unknown = {
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
            const multiDefault = MultiRecipesDefault.find(MR => {MR.アイテム名 === targetName});
            if(multiDefault){
                const defRecipe = Recipes.find(r => {r.レシピ名 === multiDefault.標準レシピ名});
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

    const result:tCreationTreeNode1[] = [];
    if(targets === undefined) return result;
    targets.生成アイテム.forEach(target => {
        result.push(nodeBuild(target,1,0,"消費"))
    });
    return result;
}


/**
 * 生産ツリーの分割
 */

type tSplitCommonAndMainRtn = {
    main:tCreationTreeNode1[],
    commons:tCreationTreeNode1[]
}
type tSplitCommonAndMain = (main:tCreationTreeNode1[]) => tSplitCommonAndMainRtn;
const splitCommonAndMain: tSplitCommonAndMain = (main) => {
    type tMaterialCount = {
        アイテム:string,
        使用回数:number
    };

    const materialCount:tMaterialCount[] = [];

    // === 使用回数カウント処理 ===
    type tGetMaterialCount = (tree:tCreationTreeNode1) => void;
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
        main:tCreationTreeNode1,
        commons:tCreationTreeNode1[]
    }
    type tSplitCommon = (node:tCreationTreeNode1,commons:tCreationTreeNode1[],depth:number) => tSplitCommonRtn;
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
                const returnNode:tCreationTreeNode1_common_durability = {
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
                const returnNode: tCreationTreeNode1_common = {
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
    type tSortCommon = (common:tCreationTreeNode1,sorted:string[]) => boolean
    const canSortCommon:tSortCommon = (common,sorted) => {
        if(common.調達方法 === "作成"){
            return common.材料.every(m => {canSortCommon(m,sorted) === true});
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
    let workCommon:tCreationTreeNode1[] = [];
    const resultMain:tCreationTreeNode1[] = [];
    main.forEach(tree => {
        const obj = splitCommon(tree,workCommon,0);
        resultMain.push(obj.main);
        workCommon = obj.commons;
    });

    // 共通内での分割処理
    let workCommon2:tCreationTreeNode1[] = cloneObj_JSON(workCommon);
    workCommon.forEach((tree,index) => {
        const obj = splitCommon(tree,workCommon2,0);
        workCommon2 = obj.commons;
        workCommon2[index] = obj.main;
    });

    // ソート処理
    const sorted:string[] = [];
    const resultCommons:tCreationTreeNode1[] = [];
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

const Calc:tCalc = (targets, userDictionary, noStackCalcRoute, createCount) => {
    // レシピ指定確認
    if(targets === undefined){
        return errorExit({
            重大度:"Error",
            メッセージ : "レシピが指定されていません。" 
        });
    }
    // レシピの存在有無確認
    if(targets.生成アイテム.length === 1){
        const targetIndex = Recipes.findIndex(recipe => recipe.レシピ名 === targets.レシピ名);
        if(targetIndex === -1){
            return errorExit({
                重大度:"Error",
                メッセージ:"レシピが見つかりませんでした。"
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
                重大度:"Error",
                メッセージ:("次のアイテムのレシピが見つかりませんでした。"　+ noRecipe.join(", "))
            })
        }
    }

    // 生産ツリーの構築
    const MainTree:tCreationTreeNode1[] = buildTrees(targets,userDictionary);
    
    // 共通素材のツリー分岐処理
    const MainTreeAndCommonTre:tSplitCommonAndMainRtn = splitCommonAndMain(MainTree);
    console.log(MainTreeAndCommonTre);
    return errorExit({
        重大度: "Error",
        メッセージ:("ロジック中断")
    });

}




















export default Calc;