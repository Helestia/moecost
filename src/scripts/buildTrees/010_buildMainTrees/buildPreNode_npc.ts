import {
    t特殊消費,
    tTreeNodeD_npc
} from '../commonTypes';
import {searchMaxDurabilities} from './searchMaxDurabilities';

type tBuildPreNode_npc = (
    targetName:string,
    qty:number,
    sc:t特殊消費,
    price: number
) => tTreeNodeD_npc
export const buildPreNode_npc: tBuildPreNode_npc = (targetName,qty,sc,price) => {
    if(sc === "消費") {
        const maxDurable = searchMaxDurabilities(targetName);
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
