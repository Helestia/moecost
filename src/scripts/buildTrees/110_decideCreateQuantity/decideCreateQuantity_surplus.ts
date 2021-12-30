import {tDecideCreateQuantityResult} from "./decideCreateQuantity";

type tDecideCreateQuantity_surplus = (qty:number) => tDecideCreateQuantityResult;
export const decideCreateQuantity_surplus:tDecideCreateQuantity_surplus = (qty:number) => {
    if(qty === 0)return {
        qty: 1,
        qtyRole: "surplus"
    }
    return {
        qty: qty,
        qtyRole: "surplus"
    }
}
