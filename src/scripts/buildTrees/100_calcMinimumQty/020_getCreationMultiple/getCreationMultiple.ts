import { tTreeNodeD } from "../../commonTypes";
import {tCreationMultiple} from '../types';
import {getCreationMultiple_creation} from './getCreationMultiple_creation';

type tGetCreationMultiple = (
    node: Readonly<tTreeNodeD>,
    multipleCreation: number,
    multipleAmount: number,
) => tCreationMultiple[];
export const getCreationMultiple: tGetCreationMultiple = (node, multipleCreation, multipleAmount) => {
    if(node.調達方法 === "作成") return getCreationMultiple_creation(node,multipleCreation,multipleAmount);
    return [];
}
