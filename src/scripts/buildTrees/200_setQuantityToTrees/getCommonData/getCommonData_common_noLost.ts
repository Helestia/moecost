import { tTreeNodeD_common_nonDurable } from "../../commonTypes";
import { tCommonData_noLost } from "../types";

type tGetCommonData_common_noLost = (node:Readonly<tTreeNodeD_common_nonDurable>) => tCommonData_noLost
export const getCommonData_common_noLost:tGetCommonData_common_noLost = (node) => {
    if(node.特殊消費 === "消失") throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
    return {
        アイテム名: node.アイテム名,
        タイプ: "noLost"
    }
}
