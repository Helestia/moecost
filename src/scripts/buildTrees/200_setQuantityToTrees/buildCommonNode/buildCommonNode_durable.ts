import {tTreeNodeD_common_durable, tTreeNode_common_durable} from "../../commonTypes";

type tBuildCommonNode_durable = (node:tTreeNodeD_common_durable, quantity:number) => tTreeNode_common_durable;
export const buildCommonNode_durable:tBuildCommonNode_durable = (node,quantity) => {
    const useDurable = quantity * node.個数.耐久値.上位要求;
    const useItem = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
    return {
        アイテム名: node.アイテム名,
        調達方法: "共通素材",
        特殊消費: "消費",
        個数: {
            消費個数: useItem,
            耐久値: {
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費耐久合計: useDurable
            }
        }
    };
}
