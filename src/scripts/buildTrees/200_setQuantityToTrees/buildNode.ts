import {tTreeNodeD, tTreeNode} from "../commonTypes";
import {buildCommonNode} from "./buildCommonNode/buildCommonNode";
import {buildCreateNode} from "./buildCreateNode/buildCreateNode";
import {buildNpcNode} from "./buildNpcNode/buildNpcNode";
import {buildUserNode} from "./buildUserNode/buildUserNode";
import {buildUnknownNode} from "./buildUnknownNode/buildUnknownNode";

type tBuildNode = (node:Readonly<tTreeNodeD>, quantity:number) => tTreeNode
export const buildNode:tBuildNode = (node,quantity) => {
    // 処理分岐
    if(node.調達方法 === "作成")     return buildCreateNode(node,quantity);
    if(node.調達方法 === "共通素材") return buildCommonNode(node,quantity);
    if(node.調達方法 === "NPC")      return buildNpcNode(node,quantity);
    if(node.調達方法 === "自力調達") return buildUserNode(node,quantity);
    return buildUnknownNode(node,quantity);
}
