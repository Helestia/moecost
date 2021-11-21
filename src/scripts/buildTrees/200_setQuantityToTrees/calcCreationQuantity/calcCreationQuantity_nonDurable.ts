import { tTreeNodeD_creation_nonDurable } from "../../commonTypes";
import {isLostNode} from "../isLostNode";
import { tCalcCreationQuantityResultNondurable } from "./type";

type tCalcCreationQuantity_nonDurable = (
    node: tTreeNodeD_creation_nonDurable,
    quantity: number
) => tCalcCreationQuantityResultNondurable
export const calcCreationQuantity_nonDurable:tCalcCreationQuantity_nonDurable = (node,quantity) => {
    const isUnLost = isLostNode(node);
    const useQuantity = (isUnLost) 
        ? 1 
        : quantity * node.個数.上位レシピ要求個数;
    const creationQuantity = Math.ceil(useQuantity / node.個数.セット作成個数) * node.個数.セット作成個数;
    return {
        作成個数: creationQuantity,
        消費個数: useQuantity
    }
}
