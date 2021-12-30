import { tTreeNodeD_common, tTreeNodeD_creation } from "../../commonTypes";

type tCalcMultipleCreation = (
    node: Readonly<tTreeNodeD_creation> | Readonly<tTreeNodeD_common>,
    multipleCreation: number
) => number;
export const calcMultipleCreation: tCalcMultipleCreation=(node,multipleCreation) => {
    if(node.調達方法 === "共通素材"){
        if(node.特殊消費 === "消失") return multipleCreation;
        return 1;
    }
    if(node.特殊消費 === "消失") return multipleCreation * node.個数.セット作成個数;
    return 1;
}
