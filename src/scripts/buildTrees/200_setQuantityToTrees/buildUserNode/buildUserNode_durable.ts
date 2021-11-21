import {tTreeNodeD_user_durable, tTreeNode_user_durable} from "../../commonTypes";

type tBuildUserNode_durable = (node:tTreeNodeD_user_durable,quantity:number) => tTreeNode_user_durable;
export const buildUserNode_durable:tBuildUserNode_durable = (node,quantity) => {
    const useDurable = node.個数.耐久値.上位要求 * quantity;
    const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
    return {
        アイテム名:node.アイテム名,
        調達方法: node.調達方法,
        特殊消費: "消費",
        個数: {
            調達個数: procurment,
            耐久値: {
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費耐久合計: useDurable
            }
        },
        価格: {
            合計金額: node.価格.調達単価 * procurment,
            調達単価: node.価格.調達単価,
            耐久割単価: node.価格.耐久割単価,
            耐久割合計金額: node.価格.耐久割単価 * useDurable
        }
    }
}
