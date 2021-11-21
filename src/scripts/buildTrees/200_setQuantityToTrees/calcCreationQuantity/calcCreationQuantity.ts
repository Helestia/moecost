import { tTreeNodeD_creation } from "../../commonTypes";
import { calcCreationQuantity_durable } from "./calcCreationQuantity_durable";
import { calcCreationQuantity_nonDurable } from "./calcCreationQuantity_nonDurable";
import { tCalcCreationQuantityResultDurable, tCalcCreationQuantityResultNondurable } from "./type";

type tCalcCreationQuantity = (
    node: tTreeNodeD_creation,
    quantity: number
) => tCalcCreationQuantityResultDurable | tCalcCreationQuantityResultNondurable
export const calcCreationQuantity: tCalcCreationQuantity = (node,quantity) => {
    if(node.特殊消費 === "消費") return calcCreationQuantity_durable(node,quantity);
    else return calcCreationQuantity_nonDurable(node,quantity);
}
