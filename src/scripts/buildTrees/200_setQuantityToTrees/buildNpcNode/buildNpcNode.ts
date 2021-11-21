import {tTreeNodeD_npc,tTreeNode_npc} from "../../commonTypes";
import {buildNpcNode_durable} from "./buildNpcNode_durable";
import {buildNpcNode_nonDurable} from "./buildNpcNode_nonDurable";

type tBuildNpcNode = (node:tTreeNodeD_npc,quantity:number) => tTreeNode_npc;
export const buildNpcNode:tBuildNpcNode = (node,quantity) => {
    if(node.特殊消費 === "消費") return buildNpcNode_durable(node,quantity);
    return buildNpcNode_nonDurable(node,quantity);
}
