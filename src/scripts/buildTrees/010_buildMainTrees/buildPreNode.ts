import moecostDb from '../../storage'
import {
    tTreeNodeD,
    t特殊消費
} from '../commonTypes'
import {
    tJSON_npcSaleItem,
    Recipes,
    tJSON_recipe,
    MultiRecipesDefault,
} from '../../jsonReader'

import {buildPreNode_unknown} from './buildPreNode_unknown';
import {buildPreNode_creationOrUnknown} from './buildPreNode_creationOrUnknown';
import {buildPreNode_npc} from './buildPreNode_npc';
import {buildPreNode_user} from './buildPreNode_user';

type tBuildPreNode = (
    targetName:string,
    qty:number,
    sc:t特殊消費,
    created:readonly string[],
    npcUseObj: readonly tJSON_npcSaleItem[]
) => tTreeNodeD;
export const buildPreNode:tBuildPreNode = (targetName, qty, sc, created, npcUseObj) => {
    const userMethod = moecostDb.辞書.内容.find(d => d.アイテム === targetName);
    if(userMethod){
        if(userMethod.調達方法 === "NPC"){
            const npcSaleInfo = npcUseObj.find(i => i.アイテム === targetName);
            if(npcSaleInfo){
                return buildPreNode_npc(targetName, qty, sc, npcSaleInfo.最低販売価格);
            }
        } else if(userMethod.調達方法 === "生産"){
            const recipe = Recipes.find(r => r.レシピ名 === userMethod.レシピ名);
            if(recipe){
                return buildPreNode_creationOrUnknown(targetName, qty, sc, created, recipe, npcUseObj);
            }
        } else if(userMethod.調達方法 === "自力調達"){
            return buildPreNode_user(targetName, qty, sc, userMethod.調達価格)
        }
    }

    // NPC存在有無確認
    const npcSaleInfo = npcUseObj.find(i => i.アイテム === targetName);
    if(npcSaleInfo){
        return buildPreNode_npc(targetName, qty, sc, npcSaleInfo.最低販売価格);
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
                return buildPreNode_creationOrUnknown(targetName, qty, sc, created, defRecipe, npcUseObj);
            }
        }
        // マルチレシピのメンテミスや、標準レシピが存在しない場合の退避手段
        // 1件目のレシピを使用してツリー作成
        return buildPreNode_creationOrUnknown(targetName, qty, sc, created, matchRecipes[0], npcUseObj);
    }
    if(matchRecipes.length === 1){
        return buildPreNode_creationOrUnknown(targetName, qty, sc, created, matchRecipes[0], npcUseObj);
    }

    // 入手手段不明
    return buildPreNode_unknown(targetName, qty, sc);
}