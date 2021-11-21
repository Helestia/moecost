import { tTreeNodeD_creation_durable } from "../../commonTypes";
import { tCalcCreationQuantityResultDurable } from "./type"

type tCalcCreationQuantity_durable = (
    node: tTreeNodeD_creation_durable,
    quantity: number
) => tCalcCreationQuantityResultDurable;
export const calcCreationQuantity_durable: tCalcCreationQuantity_durable = (node,quantity) => {
    const useDurability = quantity * node.個数.耐久値.上位要求;
    const useItem       = Math.ceil(useDurability / node.個数.耐久値.最大耐久値);
    const createItem    = Math.ceil(useItem / node.個数.セット作成個数);
    return {
        作成個数: createItem,
        消費個数: useItem,
        消費耐久値: useDurability
    }
}
