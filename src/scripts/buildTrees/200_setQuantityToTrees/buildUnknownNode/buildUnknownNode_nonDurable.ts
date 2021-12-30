import {tTreeNodeD_unknown_nonDurable, tTreeNode_unknown_nonDurable} from "../../commonTypes";
import {isLostNode} from "../isLostNode"

type tBuildUnknownNode_nonDurable = (node:tTreeNodeD_unknown_nonDurable,quantity:number) => tTreeNode_unknown_nonDurable;
export const buildUnknownNode_nonDurable:tBuildUnknownNode_nonDurable = (node,quantity) => {
    const isUnLost = isLostNode(node);
    const useItem = (isUnLost) 
        ? 1 
        : quantity * node.個数.上位レシピ要求個数;
    return {
        アイテム名:node.アイテム名,
        調達方法: node.調達方法,
        特殊消費: node.特殊消費,
        個数: {
            消費個数: useItem
        }
    }
}
