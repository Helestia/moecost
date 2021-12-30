import {
    t特殊消費,
    tTreeNodeD_unknown
} from '../commonTypes'
import {searchMaxDurabilities} from './searchMaxDurabilities';

type tBuildPreNode_unknown = (
    targetName:string,
    qty:number,
    sc:t特殊消費
) => tTreeNodeD_unknown
export const buildPreNode_unknown:tBuildPreNode_unknown = (targetName,qty,sc) => {
    if(sc === "消費") return {
        アイテム名: targetName,
        調達方法: "未設定",
        特殊消費: "消費",
        個数: {
            上位レシピ要求個数: 0,
            耐久値: {
                最大耐久値: searchMaxDurabilities(targetName),
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
