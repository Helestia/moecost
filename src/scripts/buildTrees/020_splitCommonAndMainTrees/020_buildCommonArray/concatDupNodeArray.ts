import { tTreeNodeD_creation_nonDurable } from "../../commonTypes";

type tConcatDupNodeArray = (
    prev: readonly tTreeNodeD_creation_nonDurable[],
    pushTarget: readonly tTreeNodeD_creation_nonDurable[]
) => tTreeNodeD_creation_nonDurable[];
export const concatDupNodeArray:tConcatDupNodeArray = (prev, pushTarget) => {
    const prevItemNames = prev.map(node => node.アイテム名);
    const filterd = pushTarget.filter(node => (! prevItemNames.includes(node.アイテム名)));
    return prev.concat(filterd);
}
