import { tTreeNodeD_creation,tTreeNodeD_creation_nonDurable } from "../../commonTypes";

type tBuildCommonTree = (node:tTreeNodeD_creation) => tTreeNodeD_creation_nonDurable
export const buildCommonTree:tBuildCommonTree = (node) => {
    const resultObj: tTreeNodeD_creation_nonDurable = {
        アイテム名: node.アイテム名,
        調達方法: node.調達方法,
        特殊消費: "消失",
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
    }
    if(node.副産物) resultObj.副産物 = node.副産物;
    if(node.備考)   resultObj.備考   = node.備考;
    return resultObj;
}
