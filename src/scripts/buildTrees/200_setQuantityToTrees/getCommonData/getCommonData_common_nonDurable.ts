import { tTreeNodeD_common_nonDurable } from "../../commonTypes";
import { tCommonData_nonDurable } from "../types";

type tGetCommonData_common_nonDurable = (
    node:Readonly<tTreeNodeD_common_nonDurable>,
    quantity: number
) => tCommonData_nonDurable
export const getCommonData_common_nonDurable:tGetCommonData_common_nonDurable = (node,quantity) => {
    if(node.特殊消費 !== "消失") throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
    return {
        アイテム名: node.アイテム名,
        タイプ: "nonDurable",
        要求個数: quantity * node.個数.上位レシピ要求個数
    }
}
