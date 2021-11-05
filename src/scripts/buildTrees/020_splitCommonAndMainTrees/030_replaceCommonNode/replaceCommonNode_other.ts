import { tTreeNodeD } from "../../commonTypes";

type tReplaceCommonNode_other = (
    node: Readonly<tTreeNodeD>,
) => tTreeNodeD
/**
 * このルーチンが呼ばれるタイミングでは、commonは存在せず、creationはifで除外されている
 */
export const replaceCommonNode_other: tReplaceCommonNode_other = (node) => {
    return Object.assign({}, node);
}
