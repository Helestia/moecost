import { tTreeNodeD_creation } from "../../commonTypes";

type tIsNoLost = (node:Readonly<tTreeNodeD_creation>) => boolean;
export const isNoLost: tIsNoLost = (node) => {
    if(node.特殊消費 === "失敗時消失") return true;
    if(node.特殊消費 === "未消費") return true;
    return false;
}
