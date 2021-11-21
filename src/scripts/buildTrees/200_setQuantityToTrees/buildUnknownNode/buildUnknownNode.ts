import {tTreeNodeD_unknown, tTreeNode_unknown} from "../../commonTypes";
import {buildUnknownNode_durable} from "./buildUnknownNode_durable";
import {buildUnknownNode_nonDurable} from "./buildUnknownNode_nonDurable";

type tBuildUnknownNode = (node:tTreeNodeD_unknown,quantity:number) => tTreeNode_unknown;
export const buildUnknownNode:tBuildUnknownNode = (node,quantity) => {
    if(node.特殊消費 === "消費") return buildUnknownNode_durable(node,quantity);
    return buildUnknownNode_nonDurable(node,quantity);
}
