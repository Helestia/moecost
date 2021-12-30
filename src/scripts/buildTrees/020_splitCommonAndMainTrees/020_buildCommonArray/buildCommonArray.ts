import { tTreeNodeD_creation, tTreeNodeD_creation_nonDurable } from "../../commonTypes";
import {splitCommonNode} from './splitCommonNode';
import {concatDupNodeArray} from './concatDupNodeArray';

type tBuildCommonArray = (
    main: readonly tTreeNodeD_creation[],
    splitTargets: readonly string[]
) => tTreeNodeD_creation[]
export const buildCommonArray: tBuildCommonArray = (main, splitTargets) => {
    return main.reduce<tTreeNodeD_creation_nonDurable[]>((preResult, mainNode) => {
        const splited = splitCommonNode(mainNode,splitTargets);
        return concatDupNodeArray(preResult, splited);
    },[]);
}
