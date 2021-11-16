import { tTreeNodeD_creation } from "../../commonTypes";
import { tCommonUsage, tCreationMultiple } from "../types";

import { getCommonUsage } from "../010_getCommonUsage/getCommonUsage";
import { getCreationMultiple } from "../020_getCreationMultiple/getCreationMultiple"; 

import { processCommon_getStartMultiple} from "./processCommon_getStartMultiple";

type tProcessCommon = (
    nodes: readonly tTreeNodeD_creation[],
    befCommonUsage: readonly tCommonUsage[],
    befCreationMultiple: readonly tCreationMultiple[]
) => tCreationMultiple[]
export const processCommon:tProcessCommon = (nodes,befCommonUsage,befCreationMultiple) => {
    type tReduceResult = {
        commonUsage: tCommonUsage[],
        creationMultiple: tCreationMultiple[]
    };
    const reduceResultBase:tReduceResult = {
        commonUsage: [...befCommonUsage],
        creationMultiple: [...befCreationMultiple]
    }

    const reduceResult = nodes.reduceRight<tReduceResult>((prev,node)=> {
        const startMultiple = processCommon_getStartMultiple(node, prev.commonUsage);
        const newCommonUsage = getCommonUsage(node, prev.commonUsage, startMultiple.creation, startMultiple.amount);
        const newCreationMultiple = getCreationMultiple(node, startMultiple.creation, startMultiple.amount);
        return {
            commonUsage: newCommonUsage,
            creationMultiple: prev.creationMultiple.concat(newCreationMultiple)
        }
    },reduceResultBase);
    return reduceResult.creationMultiple;
}
