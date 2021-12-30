import {tTreeNodeD_unknown_durable, tTreeNode_unknown_durable} from "../../commonTypes";

type tBuildUnknownNode_durable = (node:tTreeNodeD_unknown_durable,quantity:number) => tTreeNode_unknown_durable;
export const buildUnknownNode_durable:tBuildUnknownNode_durable = (node,quantity) => {
    const useDurable = node.個数.耐久値.上位要求 * quantity;
    const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
    return {
        アイテム名:node.アイテム名,
        調達方法: node.調達方法,
        特殊消費: "消費",
        個数: {
            消費個数: procurment,
            耐久値: {
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費耐久合計: useDurable
            }
        }
    }
}
