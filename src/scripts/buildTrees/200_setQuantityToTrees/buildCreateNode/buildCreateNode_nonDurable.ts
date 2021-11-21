import {tTreeNodeD_creation_nonDurable, tTreeNode_creation_nonDurable} from "../../commonTypes";
import {calcCreationQuantity_nonDurable} from "../calcCreationQuantity/calcCreationQuantity_nonDurable";

type tBuildCreateNode_nonDurable = (
    node: tTreeNodeD_creation_nonDurable,
    quantity:number
) => tTreeNode_creation_nonDurable;
export const buildCreateNode_nonDurable:tBuildCreateNode_nonDurable = (node,quantity) => {

    const calcQuantity = calcCreationQuantity_nonDurable(node, quantity);
    return {
        アイテム名: node.アイテム名,
        調達方法: "作成",
        特殊消費: node.特殊消費,
        材料: [],
        個数: {
            セット作成個数: node.個数.セット作成個数,
            作成個数: calcQuantity.作成個数,
            余剰作成個数: (calcQuantity.作成個数 - calcQuantity.消費個数)
        },
        スキル: node.スキル,
        テクニック: node.テクニック,
        ギャンブル: node.ギャンブル,
        ペナルティ: node.ペナルティ,
        要レシピ:node.要レシピ
    }
}
