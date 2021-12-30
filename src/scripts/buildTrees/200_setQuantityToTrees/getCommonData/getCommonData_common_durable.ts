import { tTreeNodeD_common_durable } from "../../commonTypes";
import { tCommonData_durable } from "../types";

type tGetCommonData_common_durable = (
    node:Readonly<tTreeNodeD_common_durable>,
    quantity: number
) => tCommonData_durable
export const getCommonData_common_durable:tGetCommonData_common_durable = (node,quantity) => {
    if(node.特殊消費 !== "消費") throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
    return {
        アイテム名: node.アイテム名,
        タイプ: "durable",
        要求耐久値: quantity * node.個数.耐久値.上位要求
    }
}
