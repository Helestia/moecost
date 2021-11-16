import {
    tQtyRole,
    tQtyRoleResult
} from '../commonTypes';
import {CanStackItems} from '../../jsonReader';
import {decideCreateQuantity_fully} from "./decideCreateQuantity_fully";
import {decideCreateQuantity_surplus} from "./decideCreateQuantity_surplus";

export type tDecideCreateQuantityResult = {
    qty:number,
    qtyRole: tQtyRoleResult
}
type tDecideCreateQuantity = (
    items: readonly string[],
    qtyRole: Readonly<tQtyRole>,
    qty: number,
    mini:number) => tDecideCreateQuantityResult;
export const decideCreateQuantity:tDecideCreateQuantity = (items, qtyRole, qty, minimumQty) => {
    if(qtyRole === "surplus")   return decideCreateQuantity_surplus(qty);
    if(qtyRole === "fully")     return decideCreateQuantity_fully(qty, minimumQty);
    if(items.length > 1)        return decideCreateQuantity_surplus(qty);
    if(CanStackItems.includes(items[0])) return decideCreateQuantity_fully(qty, minimumQty);
    return decideCreateQuantity_surplus(qty);
}
