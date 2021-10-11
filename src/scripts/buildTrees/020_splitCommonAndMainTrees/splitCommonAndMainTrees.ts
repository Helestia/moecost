import {
    tTreeNodeD,
    tTreeNodeD_common,
    tTreeNodeD_creation,
    tTreeNodeD_creation_nonDurable,
    tTreeNodeD_common_nonDurable,
    tTreeNodeD_common_durable
} from '../commonTypes';

/**
 * 生産ツリー　共通作成素材の分割
 */
 type tSplitCommonAndMainRtn = {
    main:tTreeNodeD_creation[],
    common:tTreeNodeD_creation[]
}
type tSplitCommonAndMain = (main:tTreeNodeD_creation[]) => tSplitCommonAndMainRtn;
export const splitCommonAndMainTrees: tSplitCommonAndMain = (main) => {
    // === 作成アイテムの使用回数カウント ===
    type tGetMaterialUseCount = (tree:tTreeNodeD) => void;
    const getMaterialUseCount:tGetMaterialUseCount = (node) => {
        if(node.調達方法 !== "作成") return;
        const mc = materialCount.find(m => m.アイテム === node.アイテム名);

        if(mc){
            mc.使用回数++;
            return;
        }
        materialCount.push({
            アイテム: node.アイテム名,
            使用回数: 1
        });
        node.材料.forEach(material => {
            getMaterialUseCount(material);
        });
    }
    type tMaterialCount = {
        アイテム:string,
        使用回数:number
    };
    const materialCount: tMaterialCount[] = [];
    main.forEach(node => getMaterialUseCount(node));
    const materialCountResult = materialCount.filter(m => m.使用回数 > 1).map(m => m.アイテム);

    // 共通素材の分割処理1. 共通素材のツリーを別に複製
    type tSplitCommonBuildObj = (node:tTreeNodeD,separated:tTreeNodeD_creation[]) => tTreeNodeD_creation[]
    const splitCommonBuildObj:tSplitCommonBuildObj = (node,separated) => {
        const splitCommonBuildNode: (node:tTreeNodeD_creation) => tTreeNodeD_creation = (node) => {
            const resultObj: tTreeNodeD_creation_nonDurable = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    特殊消費: "消失",
                    個数: {
                        セット作成個数: node.個数.セット作成個数,
                        上位レシピ要求個数: 1,
                    },
                    テクニック: node.テクニック,
                    スキル: node.スキル,
                    材料: node.材料,
                    ギャンブル: node.ギャンブル,
                    ペナルティ: node.ペナルティ,
                    要レシピ: node.要レシピ
                }
            if(node.副産物) resultObj.副産物 = node.副産物;
            if(node.備考)   resultObj.備考   = node.備考;
            return resultObj;
        }        

        if(node.調達方法 !== "作成") return [];
        if( materialCountResult.includes(node.アイテム名) &&
            separated.every(n => n.アイテム名 !== node.アイテム名)) separated.push(splitCommonBuildNode(node));

        node.材料.forEach(n => splitCommonBuildObj(n,separated))
        return separated;
    }
    // ===== 分割対象ノードを新配列(common[])に登録
    const extractCommonTree: tTreeNodeD_creation[] = main.reduce<tTreeNodeD_creation[]>((a,c) => {
        return splitCommonBuildObj(c,a);
    },[] as tTreeNodeD_creation[])

    type tSplitCommonReplace_create = (node:tTreeNodeD_creation) => tTreeNodeD_creation;
    const splitCommonReplace_create:tSplitCommonReplace_create = (node) => {
        node.材料 = node.材料.map(m => splitCommonReplace(m));
        return node;
    }
    type tSplitCommonReplace = (node:tTreeNodeD) => tTreeNodeD;
    const splitCommonReplace:tSplitCommonReplace = (node) => {
        if(node.調達方法 !== "作成") return node;
        if(materialCountResult.includes(node.アイテム名)) return splitCommonReplace_common(node);
        return splitCommonReplace_create(node);
    }
    type tSplitCommonReplace_common = (node:tTreeNodeD_creation) => tTreeNodeD_common
    const splitCommonReplace_common:tSplitCommonReplace_common = (node) => {
        if(node.特殊消費 === "消費") return {
            アイテム名: node.アイテム名,
            個数: {
                上位レシピ要求個数: 0,
                耐久値:{
                    上位要求: node.個数.耐久値.上位要求,
                    最大耐久値: node.個数.耐久値.最大耐久値
                }
            },
            特殊消費: "消費",
            調達方法: "共通素材"
        } as tTreeNodeD_common_durable
        return {
            アイテム名: node.アイテム名,
            個数: {
                上位レシピ要求個数: node.個数.上位レシピ要求個数
            },
            特殊消費: node.特殊消費,
            調達方法: "共通素材"
        } as tTreeNodeD_common_nonDurable
    }
    // 分割対象のノードをcommonノードに置換
    const resultMian = main.map(m => splitCommonReplace_create(m));
    const commonTreeBeforeSort = extractCommonTree.map(c => splitCommonReplace_create(c));

    type tCanSortCommon = (comon:tTreeNodeD) => boolean;
    const canSortCommon:tCanSortCommon = (common) => {
        if(common.調達方法 === "作成") return common.材料.every(m => canSortCommon(m) === true);
        if(common.調達方法 !== "共通素材") return true;
        return commonTreeSorted.some(cs => cs.アイテム名 === common.アイテム名);
    }
    
    const commonTreeSorted:tTreeNodeD_creation[] = [];
    do{
        commonTreeBeforeSort.forEach(cb => {
            if((commonTreeSorted.length !== 0) && commonTreeSorted.some(ca => cb.アイテム名 === ca.アイテム名)) return;
            if(! canSortCommon(cb)) return;
            commonTreeSorted.push(cb);
        });
    } while(commonTreeBeforeSort.length !== commonTreeSorted.length);

    return {
        main:resultMian,
        common: commonTreeSorted
    }
}