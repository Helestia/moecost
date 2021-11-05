import { tTreeNodeD } from "../../commonTypes";
import { replaceCommonNode_other} from "./replaceCommonNode_other";
import { replaceCommonNode_creationOrCommon} from "./replaceCommonNode_creationOrCommon";

type tReplaceCommonNode_Node = (
    node: Readonly<tTreeNodeD>,
    splitTargets: readonly string[]
) => tTreeNodeD;
export const replaceCommonNode_node: tReplaceCommonNode_Node = (node, splitTargets) => {
    if(node.調達方法 !== "作成") return replaceCommonNode_other(node);
    return replaceCommonNode_creationOrCommon(node, splitTargets);
}
