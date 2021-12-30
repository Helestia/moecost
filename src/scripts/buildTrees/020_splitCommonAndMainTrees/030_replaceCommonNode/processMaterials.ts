import { tTreeNodeD } from "../../commonTypes";
import {replaceCommonNode_node} from "./replaceCommonNode_node";

type tProcessMaterials = (
    nodes: readonly tTreeNodeD[],
    splitTargets: readonly string[]
) => tTreeNodeD[];
export const processMaterials:tProcessMaterials = (nodes,splitTargets) => {
    return nodes.map(node => replaceCommonNode_node(node,splitTargets))
}
