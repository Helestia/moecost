import { tTreeNodeD_creation } from "../../commonTypes";
import {tCreationMultiple} from '../types';
import {isNoLost} from '../000_common/isNoLost';
import {getCreationMultiple} from './getCreationMultiple';
import {buildMultipleData} from '../000_common/buildMultipleData';

type tGetCreationMultiple_creation = (
    node:Readonly<tTreeNodeD_creation>,
    multipleCreation: number,
    multipleAmount: number
) => tCreationMultiple[]
export const getCreationMultiple_creation: tGetCreationMultiple_creation = (node, multipleCreation, multipleAmount) => {
    const thisResult = buildMultipleData(node, multipleCreation, multipleAmount);
    if(isNoLost(node)){
        return [thisResult];
    } else {
        const materialResult = node.材料.map(m => getCreationMultiple(m, thisResult.作成数, thisResult.要求数)).flat();
        return [thisResult].concat(materialResult);
    }
}
