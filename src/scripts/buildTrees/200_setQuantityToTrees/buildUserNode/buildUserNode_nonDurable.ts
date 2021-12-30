import {tTreeNodeD_user_nonDurable, tTreeNode_user_nonDurable} from "../../commonTypes";
import {isLostNode} from "../isLostNode";

type tBuildUserNode_nonDurable = (node:tTreeNodeD_user_nonDurable,quantity:number) => tTreeNode_user_nonDurable;
export const buildUserNode_nonDurable:tBuildUserNode_nonDurable = (node,quantity) => {
    const isUnLost = isLostNode(node);
    const useItem = (isUnLost) 
        ? 1 
        : quantity * node.個数.上位レシピ要求個数;
    return {
        アイテム名:node.アイテム名,
        調達方法: node.調達方法,
        特殊消費: node.特殊消費,
        個数: {
            調達個数: useItem
        },
        価格: {
            合計金額: node.価格.調達単価 * useItem,
            調達単価: node.価格.調達単価
        }
    }
}
