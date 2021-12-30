import {
    tTreeNodeD_creation,
} from '../commonTypes';

import {getMaterialsUseCount} from './010_getMaterialsUseCount/getMaterialsUseCount';
import {buildCommonArray} from './020_buildCommonArray/buildCommonArray';
import {replaceCommonNode} from './030_replaceCommonNode/replaceCommonNode';
import {sortCommonNodes} from './040_sortCommonNodes/sortCommonNodes';

export type tCreateMaterialUseCount = {
    アイテム:string,
    使用回数:number
};

/**
 * 生産ツリー　共通作成素材の分割
 */
 type tSplitCommonAndMainRtn = {
    main:tTreeNodeD_creation[],
    common:tTreeNodeD_creation[]
}
type tSplitCommonAndMain = (main:tTreeNodeD_creation[]) => tSplitCommonAndMainRtn;
export const splitCommonAndMainTrees: tSplitCommonAndMain = (main) => {

    const createMaterialsUseCount: tCreateMaterialUseCount[] = [];
    main.forEach(node => getMaterialsUseCount(node, createMaterialsUseCount));
    const dupMaterials = createMaterialsUseCount.filter(m => m.使用回数 > 1).map(m => m.アイテム);
    if(dupMaterials.length === 0) return {
        main: main,
        common: []
    };

    const common = buildCommonArray(main, dupMaterials);
    const main_replacedCommons = replaceCommonNode(main, dupMaterials);
    const common_replacedCommons = replaceCommonNode(common, dupMaterials);

    const sortedCommonArray = sortCommonNodes(common_replacedCommons);

    return {
        main: main_replacedCommons,
        common: sortedCommonArray
    }
}
