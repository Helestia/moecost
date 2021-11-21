import {tTreeNodeD_creation_durable, tTreeNode_creation_durable} from "../../commonTypes";
import {calcCreationQuantity_durable} from "../calcCreationQuantity/calcCreationQuantity_durable";

type tBuildCreateNode_durable = (node: tTreeNodeD_creation_durable, quantity:number) => tTreeNode_creation_durable;
export const buildCreateNode_durable:tBuildCreateNode_durable = (node,quantity) => {
    const calcQuantity = calcCreationQuantity_durable(node, quantity);
    return {
        アイテム名: node.アイテム名,
        調達方法: "作成",
        特殊消費: "消費",
        材料: [],
        個数: {
            セット作成個数: node.個数.セット作成個数,
            作成個数: calcQuantity.作成個数,
            余剰作成個数: (calcQuantity.作成個数 - calcQuantity.消費個数),
            耐久値: {
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費耐久合計: calcQuantity.消費耐久値
            }
        },
        スキル: node.スキル,
        テクニック: node.テクニック,
        ギャンブル: node.ギャンブル,
        ペナルティ: node.ペナルティ,
        要レシピ:node.要レシピ
    }
}
