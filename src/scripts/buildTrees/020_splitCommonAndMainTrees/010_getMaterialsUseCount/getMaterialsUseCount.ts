import {tTreeNodeD} from '../../commonTypes';
import {tCreateMaterialUseCount} from '../splitCommonAndMainTrees';

type tGetMaterialUseCount = (
    node:Readonly<tTreeNodeD>,
    createMaterialsUseCount:tCreateMaterialUseCount[]
) => void;
export const getMaterialsUseCount:tGetMaterialUseCount = (node,createMaterialsUseCount) => {
    if(node.調達方法 !== "作成") return;
    const searched = createMaterialsUseCount.find(m => m.アイテム === node.アイテム名);

    if(searched){
        searched.使用回数++;
        return;
    }
    createMaterialsUseCount.push({
        アイテム: node.アイテム名,
        使用回数: 1
    });
    node.材料.forEach(material => {
        getMaterialsUseCount(material,createMaterialsUseCount);
    });
}
