import { tTreeNodeD_creation } from "../../commonTypes";
import { tCommonUsage } from "../types";
import { getCommonUsage } from "../010_getCommonUsage/getCommonUsage";

type tProcessMain_getCommonUsage = (nodes: readonly tTreeNodeD_creation[]) => tCommonUsage[];
export const processMain_getCommonUsage: tProcessMain_getCommonUsage = (nodes) => {
    return nodes.reduce<tCommonUsage[]>((prevResult,node) => {
        return getCommonUsage(node, prevResult, 1, 1);
    },[])
}