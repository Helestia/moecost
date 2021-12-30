import { tTreeNodeD_creation,tTreeNodeD_common } from '../../commonTypes';
import { gcd } from '../001_mathLogic/gcd';
import { calcMultipleCreation } from './calcMultipleCreation';
import { calcMultipleAmount } from './calcMultipleAmount';
import { tCreationMultiple } from '../types';

type tBuildMultipleData = (
    node:Readonly<tTreeNodeD_creation> | Readonly<tTreeNodeD_common>,
    multipleCreation: number,
    multipleAmount: number
) => tCreationMultiple
export const buildMultipleData:tBuildMultipleData = (node, multipleCreation, multipleAmount) => {
    const resultMultipleCreation = calcMultipleCreation(node,multipleCreation);
    const resultMultipleAmount = calcMultipleAmount(node,multipleAmount);
    
    const resultGcd = gcd(resultMultipleCreation, resultMultipleAmount);
    return {
        アイテム: node.アイテム名,
        作成数: resultMultipleCreation / resultGcd,
        要求数: resultMultipleAmount / resultGcd
    };
}
