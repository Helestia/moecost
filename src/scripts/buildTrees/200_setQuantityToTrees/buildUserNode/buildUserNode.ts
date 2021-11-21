import {tTreeNodeD_user, tTreeNode_user} from "../../commonTypes";
import {buildUserNode_durable} from "./buildUserNode_durable";
import {buildUserNode_nonDurable} from "./buildUserNode_nonDurable";

type tBuildUserNode = (node:tTreeNodeD_user,quantity:number) => tTreeNode_user;
export const buildUserNode:tBuildUserNode = (node,quantity) => {
    if(node.特殊消費 === "消費") return buildUserNode_durable(node,quantity);
    return buildUserNode_nonDurable(node,quantity);
}
