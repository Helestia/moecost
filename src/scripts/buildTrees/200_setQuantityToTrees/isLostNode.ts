import { tTreeNodeD } from "../commonTypes";
export const isLostNode = (node:tTreeNodeD) => {
    if(node.特殊消費 === "未消費" || node.特殊消費 === "失敗時消失") return true;
    return false;
}
