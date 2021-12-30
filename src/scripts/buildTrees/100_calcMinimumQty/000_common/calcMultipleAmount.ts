import { tTreeNodeD_common, tTreeNodeD_creation } from "../../commonTypes";

type tCalcMultipleAmount = (
    node: Readonly<tTreeNodeD_creation> | Readonly<tTreeNodeD_common>,
    multipleAmount: number
) => number;
export const calcMultipleAmount: tCalcMultipleAmount=(node,multipleAmount) => {
    if(node.特殊消費 === "消失") return multipleAmount * node.個数.上位レシピ要求個数;
    return 1;
}
