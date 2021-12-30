import {tTreeNodeD} from '../../commonTypes';

type tCanSort = (
    node: Readonly<tTreeNodeD>,
    sorted: readonly string[]
) => boolean;
export const canSort:tCanSort = (node,sorted) => {
    if(node.調達方法 === "作成") return node.材料.every(materialNode => canSort(materialNode, sorted));
    if(node.調達方法 === "共通素材") return sorted.includes(node.アイテム名);
    return true;
}
