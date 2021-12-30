import {
    tTreeNodeD_creation,
    tTreeNodeD_common,
    tTreeNodeD_common_durable
} from "../../commonTypes";

type tBuildCommonNode = (node:tTreeNodeD_creation) => tTreeNodeD_common;
export const buildCommonNode : tBuildCommonNode = (node) => {
    if(node.特殊消費 === "消費") return {
        アイテム名: node.アイテム名,
        個数: node.個数,
        調達方法: "共通素材",
        特殊消費: node.特殊消費
    } as tTreeNodeD_common_durable
    return {
        アイテム名: node.アイテム名,
        個数: node.個数,
        調達方法: "共通素材",
        特殊消費: node.特殊消費
    }
}
