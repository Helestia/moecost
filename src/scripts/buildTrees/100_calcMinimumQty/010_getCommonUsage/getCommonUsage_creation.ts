import { tTreeNodeD_creation } from "../../commonTypes";
import { tCommonUsage } from "../types";
import { calcMultipleAmount } from "../000_common/calcMultipleAmount";
import { calcMultipleCreation } from "../000_common/calcMultipleCreation";
import { getCommonUsage } from "./getCommonUsage";

type tGetCommonUsage_creation = (
    node: Readonly<tTreeNodeD_creation>,
    usage: readonly tCommonUsage[],
    multipleCreation: number,
    multipleAmount: number,
) => tCommonUsage[];
export const getCommonUsage_creation:tGetCommonUsage_creation = (node,usage,multipleCreation,multipleAmount) => {
    const nextMultipleCreation = calcMultipleCreation(node,multipleCreation);
    const nextMultipleAmount = calcMultipleAmount(node, multipleAmount);
    const nextUsage = [...usage];
    const results = node.材料.reduce<tCommonUsage[]>((prev, materialNode) => {
        return getCommonUsage(materialNode,prev,nextMultipleCreation,nextMultipleAmount);
    },nextUsage);
    return results;
}
