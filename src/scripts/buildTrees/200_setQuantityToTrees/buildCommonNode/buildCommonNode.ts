import {tTreeNode_common, tTreeNodeD_common} from "../../commonTypes";
import {buildCommonNode_durable} from "./buildCommonNode_durable";
import {buildCommonNode_nonDurable} from "./buildCommonNode_nonDurable"

type tBuildCommonNode = (
    node:Readonly<tTreeNodeD_common>,
    quantity:number
) => tTreeNode_common;
export const buildCommonNode:tBuildCommonNode = (node,quantity) => {
    if(node.特殊消費 === "消費") return buildCommonNode_durable(node,quantity);
    return buildCommonNode_nonDurable(node,quantity);
}
