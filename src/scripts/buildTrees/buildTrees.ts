import {
    tQtyRole,
    tBuildTreeResult} from './commonTypes' 
import {handleError} from './000_commonScripts/handleError'
import {buildNpcUseObj} from './001_setupBuildEnv/buildNpcUseObj'
import {buildMainTrees} from './010_buildMainTrees/buildMainTrees'
import {splitCommonAndMainTrees} from './020_splitCommonAndMainTrees/splitCommonAndMainTrees'
import {calcMinimumQty} from './100_calcMinimumQty/calcMinimumQty';
import {decideCreateQuantity} from './110_decideCreateQuantity/decideCreateQuantity';
import {setQuantitiesToTrees} from './200_setQuantityToTrees/setQuantitiesToTrees';




type tBuildTrees = (
    recipe: string,
    items: string[],
    qtyRole: tQtyRole,
    qty: number
) => tBuildTreeResult;
export const buildTrees : tBuildTrees = (recipe, items, qtyRole, qty) => {
    // エラー有無確認処理
    const ErrorObj = handleError(recipe, items, qty);
    if(ErrorObj) return {
        main: [],
        common: [],
        message: [ErrorObj],
        qtyRoleResult: "surplus",
        totalQuantity: 0,
        fullyMinimumQuantity: 0
    } as tBuildTreeResult

    // npc販売情報取得(アプリ設定によってwarのみのアイテム除外)
    const NpcUseObj = buildNpcUseObj();

    // メインツリー構築
    const mainTreeD = buildMainTrees(recipe, items, NpcUseObj);
    // 共通中間素材を別ツリーに切りだし
    const mainTreeAndCommonTreeD = splitCommonAndMainTrees(mainTreeD);
    // 余剰作成数なしでの最小作成個数算出
    const minimumCreation = calcMinimumQty(mainTreeAndCommonTreeD.main,mainTreeAndCommonTreeD.common);
    // 作成個数の設定
    const createQuantity = decideCreateQuantity(items, qtyRole,qty,minimumCreation);
    // ツリーに個数設定
    const mainTreeAndCommonTree = setQuantitiesToTrees(
        mainTreeAndCommonTreeD.main,
        mainTreeAndCommonTreeD.common,
        createQuantity.qty
    );

    return {
        main: mainTreeAndCommonTree.main,
        common: mainTreeAndCommonTree.common,
        message: [],
        qtyRoleResult: createQuantity.qtyRole,
        totalQuantity: createQuantity.qty,
        fullyMinimumQuantity: minimumCreation
    }
}