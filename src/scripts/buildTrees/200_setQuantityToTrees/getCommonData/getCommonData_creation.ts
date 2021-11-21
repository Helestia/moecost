import { tTreeNodeD_creation } from "../../commonTypes";
import { tCommonData } from "../types";
import { calcCreationQuantity} from "../calcCreationQuantity/calcCreationQuantity";
import { getCommonData_common} from "./getCommonData_common";

type tGetCommonData_creation = (
    node: Readonly<tTreeNodeD_creation>,
    prevCommonData: readonly tCommonData[],
    quantity: number
) => tCommonData[];
export const getCommonData_creation:tGetCommonData_creation = (node, prevCommonData, quantity) => {
    const calcQuantity = calcCreationQuantity(node,quantity);
    const nextQuantity = calcQuantity.作成個数 / node.個数.セット作成個数;

    return node.材料.reduce<tCommonData[]>((CD,materialNode) => {
        if(materialNode.調達方法 === "作成") return getCommonData_creation(materialNode,CD,nextQuantity);
        if(materialNode.調達方法 === "共通素材") return getCommonData_common(materialNode,CD,nextQuantity);
        return CD;
    },prevCommonData.concat())
}