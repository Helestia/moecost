import {tTreeNodeD_creation} from '../commonTypes'
import {
    tJSON_npcSaleItem,
    Recipes
} from '../../jsonReader'
import {buildPreNode_creation} from './buildPreNode_creation';


type tBuildMainTrees = (
    recipe:string,
    items:readonly string[],
    npcUseObj:readonly tJSON_npcSaleItem[]
) => tTreeNodeD_creation[]
export const buildMainTrees:tBuildMainTrees = (recipe, items, npcUseObj) => {
    if(items.length === 1){
        const recipeObj = Recipes.find(r => r.レシピ名 === recipe);
        if(recipeObj) return [buildPreNode_creation(items[0], 1, "消失", [], recipeObj, npcUseObj)];
        return [];
    }
    return items.map(item => {
        const recipeObj = Recipes.find(r => r.生成物.アイテム === item);
        if(recipeObj){return buildPreNode_creation(item , 1, "消失", [], recipeObj, npcUseObj)};
        return null;
    }).filter(<T>(x:T | null) : x is T => x !== null);
}
