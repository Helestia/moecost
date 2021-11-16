import { tTreeNodeD } from "../../commonTypes";
import { tCommonUsage } from '../types';
import {getCommonUsage_creation} from './getCommonUsage_creation';
import {getCommonUsage_common}   from './getCommonUsage_common';

type tGetCommonUsage = (
    node: Readonly<tTreeNodeD>,
    usage: readonly tCommonUsage[],
    multipleCreation: number,
    multipleAmount: number,
) => tCommonUsage[];
export const getCommonUsage :tGetCommonUsage = (node, usage, multipleCreation, multipleAmount) => {
    if(node.調達方法 === "作成") return getCommonUsage_creation(node,usage,multipleCreation,multipleAmount);
    if(node.調達方法 === "共通素材") return getCommonUsage_common(node,usage,multipleCreation,multipleAmount);
    return [...usage];
}
