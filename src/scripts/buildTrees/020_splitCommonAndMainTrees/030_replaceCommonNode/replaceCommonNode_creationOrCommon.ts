import {
    tTreeNodeD_creation,
    tTreeNodeD_common
} from "../../commonTypes";
import { buildCommonNode } from "./buildCommonNode";
import { replaceCommonNode_creation } from "./replaceCommonNode_creation";

type tReplaceCommonNode_creationOrCommon = (
    node: Readonly<tTreeNodeD_creation>,
    splitTargets: readonly string[]
) => tTreeNodeD_creation | tTreeNodeD_common
export const replaceCommonNode_creationOrCommon:tReplaceCommonNode_creationOrCommon = (node, splitTargets) => {
    if(splitTargets.includes(node.アイテム名)) return buildCommonNode(node);
    return replaceCommonNode_creation(node, splitTargets);
}
