import {
    tTreeNodeD_creation,
    tTreeNodeD_creation_durable,
    tTreeNodeD_creation_nonDurable
} from "../../commonTypes";
import {processMaterials} from './processMaterials';

type tReplaceCommonNode_creation = (
    node:tTreeNodeD_creation,
    splitTargets: readonly string[]
) => tTreeNodeD_creation;
export const replaceCommonNode_creation: tReplaceCommonNode_creation = (node, splitTargets) => {
    if(node.特殊消費 === "消費") return replaceCommonNode_creation_dulable(node,splitTargets);
    return replaceCommonNode_creation_nonDurable(node,splitTargets);
}

type tReplaceCommonNode_creation_part<T extends tTreeNodeD_creation> = (
    node:Readonly<T>,
    splitTargets: readonly string[]
) => T;
const replaceCommonNode_creation_nonDurable:tReplaceCommonNode_creation_part<tTreeNodeD_creation_nonDurable> = (node, splitTargets) => {
    const result:tTreeNodeD_creation_nonDurable = {
        アイテム名: node.アイテム名,
        ギャンブル: node.ギャンブル,
        スキル: node.スキル,
        テクニック: node.テクニック,
        ペナルティ: node.ペナルティ,
        個数: node.個数,
        材料: processMaterials(node.材料, splitTargets),
        特殊消費: node.特殊消費,
        要レシピ: node.要レシピ,
        調達方法: node.調達方法
    }
    if(node.備考)    result.備考 = node.備考;
    if(node.副産物)  result.副産物 = node.副産物;
    return result;
}

const replaceCommonNode_creation_dulable:tReplaceCommonNode_creation_part<tTreeNodeD_creation_durable> = (node, splitTargets) => {
    const result:tTreeNodeD_creation_durable = {
        アイテム名: node.アイテム名,
        ギャンブル: node.ギャンブル,
        スキル: node.スキル,
        テクニック: node.テクニック,
        ペナルティ: node.ペナルティ,
        個数: node.個数,
        材料: processMaterials(node.材料, splitTargets),
        特殊消費: node.特殊消費,
        要レシピ: node.要レシピ,
        調達方法: node.調達方法
    }
    if(node.備考)    result.備考 = node.備考;
    if(node.副産物)  result.副産物 = node.副産物;
    return result;
}
