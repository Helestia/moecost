import { tTreeNodeD_creation } from "../commonTypes";
import { Durabilities } from "../../jsonReader";
import { tCommonData } from "./types";

type tGetCommonStartQuantity = (
    node: Readonly<tTreeNodeD_creation>,
    commonData: readonly tCommonData[]
) => number
export const getCommonStartQuantity:tGetCommonStartQuantity = (node, prevCommonData) => {
    const thisItemsData = prevCommonData.filter(commonData => node.アイテム名 === commonData.アイテム名);
    if(thisItemsData.length === 0) throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
    
    const noLosts = thisItemsData.flatMap(commonData => commonData.タイプ === "noLost" ? [commonData] : [])
    const durables = thisItemsData.flatMap(commonData => commonData.タイプ === "durable" ? [commonData] : []);
    const nonDurables = thisItemsData.flatMap(commonData => commonData.タイプ === "nonDurable" ? [commonData] : []);

    const nonDurablesSum = nonDurables.reduce((prev,nd) => prev + nd.要求個数,0);
    const durablesSum = durables.reduce((prev,dur) => prev + dur.要求耐久値, 0);
    const durablesDevs = (() => {
        if(durablesSum === 0) return 0;
        const thisMaxDurabilities = Durabilities.find(d => d.アイテム === node.アイテム名);
        if(thisMaxDurabilities === undefined) throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
        return Math.ceil(durablesSum / thisMaxDurabilities.使用可能回数);
    })();
    return (() => {
        const strqty = nonDurablesSum + durablesDevs;
        if(strqty >= 1) return strqty;
        if(noLosts.length >= 1) return 1;
        throw new Error("意図しないロジックに突入しました。\n不具合報告をお願いいたします。")
    })();
}
