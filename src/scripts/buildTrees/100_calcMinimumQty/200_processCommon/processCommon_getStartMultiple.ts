import { tTreeNodeD_creation } from "../../commonTypes";
import { lcmArray } from "../001_mathLogic/lcmArray";
import { gcd } from "../001_mathLogic/gcd";
import { tCommonUsage } from "../types";

type tProcessCommon_getStartMultiple = (
    node: Readonly<tTreeNodeD_creation>,
    usages: readonly tCommonUsage[]
) => {
    creation: number,
    amount: number
}
export const processCommon_getStartMultiple:tProcessCommon_getStartMultiple = (node,usages) => {
    const usageObj = usages.find(usage => usage.アイテム名 === node.アイテム名);
    if(usageObj === undefined) return {creation:1,amount:1} // 基本的にこのロジックは実行されないはず

    // 初期値取得処理
    // 　要求値の最小公倍数
    const lcmAmount = lcmArray(usageObj.使用状況.map(multiple => multiple.要求数));
    // 　作成数 * 要求公倍数 / 要求数
    const CmATdA = usageObj.使用状況.map(o => o.作成数 * lcmAmount / o.要求数);
    // 　上配列の最小公倍数
    const CmATdA_lcm = lcmArray(CmATdA);
    // 　最小作成コンバイン数
    const minCombineArray = CmATdA.map(o => CmATdA_lcm / o);
    // 　最小コンバイン数合算
    const minCombine = minCombineArray.reduce((prev,minComb) => prev + minComb, 0);

    // 　計算結果
//    const resultCreation = node.個数.セット作成個数 * CmATdA_lcm;
    const resultCreation = CmATdA_lcm;
    const resultAmount = lcmAmount * minCombine;
    const resultLcm = gcd(resultCreation, resultAmount);

    return {
        creation: resultCreation / resultLcm,
        amount: resultAmount / resultLcm
    }
}