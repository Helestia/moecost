import { tTreeNodeD_common } from "../../commonTypes";
import { tCommonUsage } from "../types";
import { buildMultipleData } from "../000_common/buildMultipleData";

type tGetCommonUsage_common = (
    node: Readonly<tTreeNodeD_common>,
    updateUsage: readonly tCommonUsage[],
    multipleCreation: number,
    multipleAmount: number
) => tCommonUsage[]
export const getCommonUsage_common: tGetCommonUsage_common =(node,usage,multipleCreation,multipleAmount) => {
    const usageObj = searchCommonUsage(node,usage);
    const cloneUsageObj = Object.assign({},usageObj);
    cloneUsageObj.使用状況.push(buildMultipleData(node, multipleCreation, multipleAmount))
    const result: tCommonUsage[] = usage.map(obj => {
        if(obj.アイテム名 === node.アイテム名) return cloneUsageObj;
        return Object.assign({},obj);
    });
    if(result.findIndex(obj => obj.アイテム名 === node.アイテム名) === -1) result.push(cloneUsageObj);
    return result;
}

type tSearchCommonUsage = (
    node: Readonly<tTreeNodeD_common>,
    usage: readonly tCommonUsage[]
) => tCommonUsage;
const searchCommonUsage: tSearchCommonUsage = (node,usage) => {
    const searched = usage.find(obj => obj.アイテム名 === node.アイテム名);
    if(searched) return searched;
    const resultObj:tCommonUsage = {
        アイテム名: node.アイテム名,
        使用状況: []
    };
    return resultObj;
}
