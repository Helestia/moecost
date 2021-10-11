import {
    tQtyRole,
    tQtyRoleResult
} from '../commonTypes';
import {CanStackItems} from '../../jsonReader';

type tDecideCreateQuantityResult = {
    qty:number,
    qtyRole: tQtyRoleResult
}
type tDecideCreateQuantity = (
    items: string[],
    qtyRole: tQtyRole,
    qty: number,
    mini:number) => tDecideCreateQuantityResult;
export const decideCreateQuantity:tDecideCreateQuantity = (items, qtyRole, qty, mini) => {
    const fSurplus: () => tDecideCreateQuantityResult = () => {
        if(qty === 0)return {
            qty: 1,
            qtyRole: "surplus"
        }
        return {
            qty: qty,
            qtyRole: "surplus"
        }
    }
    const fFully : () => tDecideCreateQuantityResult = () => {
        if(qty === 0) return {
            qty: mini,
            qtyRole: "fully"
        };
        if(qty % mini === 0) return {
            qty: qty,
            qtyRole: "fully"
        };
        return {
            qty: mini,
            qtyRole: "fully"
        };
    }
    if(qtyRole === "surplus")   return fSurplus();
    if(qtyRole === "fully")     return fFully();
    if(items.length > 1)        return fSurplus();
    if(CanStackItems.includes(items[0])) return fFully();
    return fSurplus();
}
