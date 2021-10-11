import moecostDb from '../../storage'
import {
    tTreeNodeD,
    tTreeNodeD_creation,
    tTreeNodeD_creation_durable,
    tTreeNodeD_creation_nonDurable,
    tTreeNodeD_unknown,
    tTreeNodeD_npc,
    tTreeNodeD_user,
    t特殊消費 } from '../commonTypes'
import {
    tJSON_npcSaleItem,
    Recipes,
    tJSON_recipe,
    Durabilities,
    MultiRecipesDefault,
} from '../../jsonReader'



type tBuildMainTrees = (recipe:string, items:string[], npcUseObj:tJSON_npcSaleItem[]) => tTreeNodeD_creation[]
export const buildMainTrees:tBuildMainTrees = (recipe, items, npcUseObj) => {
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

