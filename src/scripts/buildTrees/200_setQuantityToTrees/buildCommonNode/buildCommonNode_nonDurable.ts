import {tTreeNode_common_nonDurable, tTreeNodeD_common_nonDurable} from "../../commonTypes";
import {isLostNode} from "../isLostNode";

type tBuildCommonNode_nonDurable = (
    node:tTreeNodeD_common_nonDurable,
    quantity:number
) => tTreeNode_common_nonDurable;
export const buildCommonNode_nonDurable:tBuildCommonNode_nonDurable = (node,quantity) => {
    const isUnLost = isLostNode(node);
    const useItem = isUnLost ? 1 : quantity * node.個数.上位レシピ要求個数;
    
    return {
        アイテム名: node.アイテム名,
        調達方法: "共通素材",
        特殊消費: node.特殊消費,
        個数: {
            消費個数: useItem
        }
    };
}
