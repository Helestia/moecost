import {
    tTreeNodeD,
    tTreeNodeD_creation_nonDurable
} from '../../commonTypes';
import { concatDupNodeArray } from './concatDupNodeArray';
import {buildCommonTree} from './buildCommonTree';

type tSplitCommonNode = (
    node: Readonly<tTreeNodeD>,
    splitTargets: readonly string[]
) => tTreeNodeD_creation_nonDurable[];
export const splitCommonNode:tSplitCommonNode = (node,splitTargets) => {
    const result:tTreeNodeD_creation_nonDurable[] = []
    if(node.調達方法 !== "作成") return result;
    if(splitTargets.includes(node.アイテム名)){
        result.push(buildCommonTree(node));
    }
    const materialResult = node.材料.reduce<tTreeNodeD_creation_nonDurable[]>((splited , material) => {
        const result = splitCommonNode(material,splitTargets);
        return concatDupNodeArray(splited, result)
    },[]);
    return concatDupNodeArray(result, materialResult);
}
