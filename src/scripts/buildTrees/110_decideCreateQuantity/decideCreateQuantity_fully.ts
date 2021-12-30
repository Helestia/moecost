import {tDecideCreateQuantityResult} from "./decideCreateQuantity";

type tDecideCreateQuantity_fully = (
    qty:number,
    minimumQty:number
) => tDecideCreateQuantityResult;
export const decideCreateQuantity_fully:tDecideCreateQuantity_fully = (qty,minimumQty)  => {
    if(qty === 0) return {
        qty: minimumQty,
        qtyRole: "fully"
    };
    if(qty % minimumQty === 0) return {
        qty: qty,
        qtyRole: "fully"
    };
    return {
        qty: minimumQty,
        qtyRole: "fully"
    };
}
