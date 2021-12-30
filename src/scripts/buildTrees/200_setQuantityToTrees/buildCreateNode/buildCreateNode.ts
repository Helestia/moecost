import { tTreeNodeD_creation,tTreeNode_creation } from "../../commonTypes";
import { buildCreateNode_durable } from "./buildCreateNode_durable";
import { buildCreateNode_nonDurable} from "./buildCreateNode_nonDurable"
import { buildNode } from "../buildNode";

type tBuildCreateNode = (
    node: Readonly<tTreeNodeD_creation>,
    quantity:number
) => tTreeNode_creation;
export const buildCreateNode:tBuildCreateNode = (node,quantity) => {
    // 基礎部の作成
    const result = (node.特殊消費 === "消費")
        ? buildCreateNode_durable(node,quantity)
        : buildCreateNode_nonDurable(node,quantity);
    // 任意項目
    if(node.備考) result.備考 = node.備考;
    if(node.副産物){
        result.副産物 = node.副産物.map(b => {
            const creationQuantity = result.個数.作成個数 / result.個数.セット作成個数 * b.セット作成個数;
            if(b.価格) return {
                アイテム名: b.アイテム名,
                セット作成個数: b.セット作成個数,
                作成個数: creationQuantity,
                原価: {
                    設定原価: b.価格.設定原価,
                    合計価格: b.価格.設定原価 * creationQuantity
                }
            };
            return {
                アイテム名: b.アイテム名,
                セット作成個数: b.セット作成個数,
                作成個数: creationQuantity
            }
        });
    }

    // 材料の呼び出し
    const nextQuantity = result.個数.作成個数 / result.個数.セット作成個数;
    result.材料 = node.材料.map(m => buildNode(m, nextQuantity));
    return result;
}
