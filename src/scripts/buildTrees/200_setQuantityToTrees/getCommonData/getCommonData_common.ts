import {tTreeNodeD_common} from "../../commonTypes"
import {tCommonData} from "../types"
import {getCommonData_common_nonDurable} from "./getCommonData_common_nonDurable";
import {getCommonData_common_noLost} from "./getCommonData_common_noLost";
import {getCommonData_common_durable} from "./getCommonData_common_durable";


type tGetCommonData_common = (
    node: Readonly<tTreeNodeD_common>,
    prevCommonData: readonly tCommonData[],
    quantity: number
) => tCommonData[];
export const getCommonData_common:tGetCommonData_common = (node,prevCommonData,quantity) => {
    const pushObj:tCommonData = (() => {
        if(node.特殊消費 === "失敗時消失" || node.特殊消費 === "未消費") return getCommonData_common_noLost(node)
        if(node.特殊消費 === "消費") return getCommonData_common_durable(node,quantity);
        return getCommonData_common_nonDurable(node,quantity);
    })();
    return prevCommonData.concat(pushObj);
}
