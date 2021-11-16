import {
    tTreeNodeD,
    tTreeNodeD_creation,
} from '../commonTypes';

import {lcmArray} from './001_mathLogic/lcmArray'
import {gcd} from './001_mathLogic/gcd';

type iCalcMinimumQty = (main:tTreeNodeD_creation[],commons:tTreeNodeD_creation[]) => number;
export const calcMinimumQty:iCalcMinimumQty = (main, commons) => {
    // 素材情報
    type tMaterialData = {
        アイテム: string,
        作成数:number,
        要求数: number
    }

    type tTreeData = {
        アイテム名: string,
        素材情報: tMaterialData[]
    };

    type tCommonUsage = {
        アイテム名: string,
        使用状況: tMaterialData[]
    }
    
    type tGetMaterialData = (
        tree:tTreeNodeD,
        multipleCreationSet:number,
        multipleAmountNumber:number) => tMaterialData[];
    const getMaterialData:tGetMaterialData = (node,multipleCreationSet,multipleAmountNumber) => {
        // 特殊消費対応
        const isNoLost = (() => {
            if(node.特殊消費 === "未消費" || node.特殊消費 === "失敗時消失") return true;
            return false;
        })();
        if(node.調達方法 === "共通素材"){
            const orderQuantity = (isNoLost) ? 0 : multipleAmountNumber * node.個数.上位レシピ要求個数;
            const commonObj = (() => {
                const obj = commonUsage.find(c => node.アイテム名 === c.アイテム名);
                if(obj) return obj;
                const pushobj:tCommonUsage = {
                    アイテム名: node.アイテム名,
                    使用状況: []
                };
                commonUsage.push(pushobj);
                return pushobj;
            })();
            const pushMaterialData:tMaterialData = (() => {
                if(isNoLost || node.特殊消費 === "消費") return {
                    アイテム: node.アイテム名,
                    作成数: 1,
                    要求数: 1
                }
                return gcdCreateAndAmount(multipleCreationSet, orderQuantity,node.アイテム名);
            })();
            commonObj.使用状況.push(pushMaterialData);
            return [];
        }
        if(node.調達方法 === "作成"){
            if(isNoLost) return [{
                アイテム: node.アイテム名,
                作成数: 1,
                要求数: 1
            }];
            const orderQuantity = node.特殊消費 === "消費" ? multipleAmountNumber : multipleAmountNumber * node.個数.上位レシピ要求個数;
            const newCreationNumber = multipleCreationSet * node.個数.セット作成個数;
            const thisResult = gcdCreateAndAmount(newCreationNumber, orderQuantity, node.アイテム名);
            const materialResult = node.材料.map(m => getMaterialData(m, thisResult.作成数, thisResult.要求数)).flat();
            return [thisResult].concat(materialResult);
        }
        // その他の調達方法ではそのままreturn
        return [];
    }

    const gcdCreateAndAmount:(create:number,amount:number,item:string)=>tMaterialData = (create:number,amount:number,item:string) => {
        const gcdResult = gcd(create, amount);
        return {
            アイテム: item,
            作成数: create / gcdResult,
            要求数: amount / gcdResult
        }
    }

    type tGetMaterialDataParent_main = (tree:tTreeNodeD_creation) => tTreeData
    const getMaterialDataParent_main:tGetMaterialDataParent_main = (tree) => {
        // ツリー内の乗数算出
        return {
            アイテム名 : tree.アイテム名,
            素材情報 : (getMaterialData(tree,1,1))
        }
    }

    type tGetMaterialDataParent_common = (tree:tTreeNodeD_creation) => tTreeData
    const getMaterialDataParent_common:tGetMaterialDataParent_common = (tree) => {
        const usageObj = commonUsage.find(c => tree.アイテム名 === c.アイテム名);
        if(usageObj === undefined || 
            tree.調達方法 !== "作成"){
            return {
                アイテム名: tree.アイテム名,
                素材情報: []
            };
        }
        // 初期値取得処理
        //  要求値の最小公倍数
        const lcmAmount = lcmArray(usageObj.使用状況.map(d => d.要求数));
        //  作成数 * 要求公倍数 / 要求数
        const CmATdA = usageObj.使用状況.map(o => o.作成数 * lcmAmount / o.要求数);
        // 上記配列の最小公倍数
        const CmATdA_lcm = lcmArray(CmATdA);
        // 最小作成コンバイン数算出
        const miniCombArray = CmATdA.map(i => CmATdA_lcm / i);
        // 最小作成コンバイン数合算
        const miniComb = miniCombArray.reduce((acc,cur) => acc + cur,0);
        // 計算結果
        const newCreationNumber = CmATdA_lcm;
        const newAmountNumber = lcmAmount * miniComb;
        const treeTopResult = gcdCreateAndAmount(newCreationNumber,newAmountNumber,tree.アイテム名);

        // 下位素材の調査
        const treeMaterialsData = tree.材料.map(node => getMaterialData(node,treeTopResult.作成数,treeTopResult.要求数)).flat();
        
        return {
            アイテム名 : tree.アイテム名,
            素材情報: [treeTopResult].concat(treeMaterialsData)
        }
    }


    const commonUsage: tCommonUsage[] = [];
    // 各種ツリーのツリー内の作成数等の情報収集
    const mainTreeData:tTreeData[] = main.map(tree => getMaterialDataParent_main(tree));
    const commonTreeData:tTreeData[] = commons.concat().reverse().map(tree => getMaterialDataParent_common(tree));
    // 素材調査結果の統合
    const materialData_Main = mainTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const materialData_Common = commonTreeData.reduce<tMaterialData[]>((a,c) => a.concat(c.素材情報), []);
    const concatMandC = materialData_Main.concat(materialData_Common);
    // 全要求数の乗算
    const AllAmountLcm = lcmArray(concatMandC.map(d => d.要求数));

    // 各素材において、作成数 * 全要求数乗算結果 / 要求数
    const AllCmATdA:number[] = concatMandC.map(d => d.作成数 * AllAmountLcm / d.要求数);
    // 最小作成数
    return lcmArray(AllCmATdA) / AllAmountLcm;
}
