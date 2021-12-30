import {
    t特殊消費,
    tTreeNodeD_creation,
    tTreeNodeD_creation_nonDurable,
    tTreeNodeD_creation_durable
} from '../commonTypes';
import { tJSON_npcSaleItem, tJSON_recipe } from '../../jsonReader';
import moecostDb from '../../storage';

import {searchMaxDurabilities} from './searchMaxDurabilities';
import { buildPreNode } from './buildPreNode';


type tBuildPreNode_creation = (
    targetName:string,
    qty:number,
    sc:t特殊消費,
    created:readonly string[],
    recipe:Readonly<tJSON_recipe>,
    npcUseObj:readonly tJSON_npcSaleItem[]
) => tTreeNodeD_creation;
export const buildPreNode_creation: tBuildPreNode_creation = (targetName, qty, sc, created, recipe, npcUseObj) => {

    const numberOfCreation = recipe.生成物.個数 ? recipe.生成物.個数 : 1;
    const rtnFCreation:tTreeNodeD_creation = (()=>{
        if(sc === "消費"){
            const maxDurable = searchMaxDurabilities(targetName);
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

    const childCreated = created.concat(targetName);
    recipe.材料.forEach(m => {
        const nextQty = (() => {
            if(m.特殊消費 === "未消費") return 1;
            if(m.個数) return m.個数;
            return 1;
        })();
        rtnFCreation.材料.push(
            buildPreNode(
                m.アイテム,
                nextQty,
                m.特殊消費 ? m.特殊消費 : "消失",
                childCreated,
                npcUseObj
            )
        );
    })
    return rtnFCreation;
}