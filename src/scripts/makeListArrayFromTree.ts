import {
    tTreeNode,
    tTreeNode_creation,
    tTreeNode_npc,
    tTreeNode_common,
    tTreeNode_unknown,
    tTreeNode_user
} from './buildTree';

type tMaterialList = tMaterialList_user  | tMaterialList_npc | tMaterialList_unknown;
type tMaterialList_user = {
    アイテム名: string,
    調達方法: "自力調達"
    必要個数: number,
    設定単価: number,
    合計金額: number
}

type tMaterialList_npc = {
    アイテム名: string,
    調達方法: "NPC"
    必要個数: number,
    設定単価: number,
    合計金額: number
}

type tMaterialList_unknown = {
    アイテム名: string,
    調達方法: "未設定"
    必要個数: number
}

type tSurplusList  = {
    アイテム名: string,
    作成個数: number,
    余り個数: number,
    単価: number,
    余り合計金額: number,
    未設定含: boolean
}

type tByproductList = tByproductList_nonSetCost | tByproductList_setCost;
type tByproductList_nonSetCost = {
    アイテム名: string,
    作成個数: number,
    価格設定有: false
}

type tByproductList_setCost = {
    アイテム名: string,
    作成個数: number,
    価格設定有: true,
    設定単価: number,
    合計金額: number
}

type tCreationList = {
    アイテム名: string,
    作成個数: number,
    合計材料費: number,
    単価 : number,
    未設定含: boolean
}

type tDurability = tDurability_user | tDurability_npc | tDurability_creation | tDurability_unknown
type tDurability_user = {
    アイテム名: string,
    調達方法: "自力調達",
    消費個数: number,
    最大耐久値: number,
    消費耐久値: number,
    単価 : number,
    合計価格: number,
    耐久割単価: number,
    耐久割金額: number
}

type tDurability_npc = {
    アイテム名: string,
    調達方法: "NPC",
    消費個数: number,
    最大耐久値: number,
    消費耐久値: number,
    単価 : number,
    合計価格: number,
    耐久割単価: number,
    耐久割金額: number
}

type tDurability_creation = {
    アイテム名: string,
    調達方法: "作成",
    消費個数: number,
    最大耐久値: number,
    消費耐久値: number,
    単価 : number,
    合計価格: number,
    耐久割単価: number,
    耐久割金額: number,
    未設定含: boolean
}

type tDurability_unknown = {
    アイテム名: string,
    調達方法: "未設定",
    消費個数: number,
    最大耐久値: number,
    消費耐久値: number
}

type tMakeListArrayResult = {
    材料: tMaterialList[],
    副産物: tByproductList[],
    余剰作成: tSurplusList[],
    最終作成物: tCreationList[],
    耐久消費: tDurability[]
}

type tCommons = {
    アイテム名: string,
    単価: number,
    未設定含: boolean
}

type tReCallResult = {
    価格: number,
    未設定含: boolean
}

type tMakeListArrayFromTree = (
    main: tTreeNode_creation[],
    common: tTreeNode_creation[]
) => tMakeListArrayResult

const reCallResultDefault:tReCallResult = {
    価格: 0,
    未設定含: false
}


const makeListArrayFromTree: tMakeListArrayFromTree = (main,common) => {
    const materials    :tMaterialList[]  = [];
    const byproducts   :tByproductList[] = [];
    const surpluses    :tSurplusList[]   = [];
    const lastCreations:tCreationList[]  = [];
    const durabilities :tDurability[]    = [];

    const commons      :tCommons[] = [];

    const reCall:(node:tTreeNode) => tReCallResult = (node) => {
        if(node.調達方法 === "作成") return fCreation(node);
        if(node.調達方法 === "共通素材") return fCommon(node);
        if(node.調達方法 === "自力調達") return fUser(node);
        if(node.調達方法 === "NPC") return fNpc(node);
        return fUnknown(node);
    }

    const fCreation : (node:tTreeNode_creation) => tReCallResult = (node) => {
        // 材料費集計
        const materialCost = node.材料.reduce((acc,cur) => {
            const result = reCall(cur);
            acc.価格 += result.価格;
            if(result.未設定含) acc.未設定含 = true;
            return acc;
        },reCallResultDefault);
        // 副産物確認
        const byProductCost = (() => {
            if(! node.副産物) return reCallResultDefault;
            // 副産物配列への登録
            node.副産物.forEach(b => {
                if(b.原価) byproducts.push({
                    アイテム名: b.アイテム名,
                    作成個数: b.作成個数,
                    価格設定有: true,
                    設定単価: b.原価.設定原価,
                    合計金額: b.原価.合計価格
                });
                else byproducts.push({
                    アイテム名: b.アイテム名,
                    作成個数: b.作成個数,
                    価格設定有: false
                });
            });

            return node.副産物.reduce((acc,cur) => {
                if(cur.原価) acc.価格 += cur.原価.設定原価;
                else acc.未設定含 = true;
                return acc;
            },reCallResultDefault);
        })();

        // 余剰生産物確認
        const surplusCost:tReCallResult = (() => {
            if(node.個数.余剰作成個数 === 0) return reCallResultDefault;
            const totalCost = materialCost.価格 - byProductCost.価格;
            const unitCost = totalCost / node.個数.作成個数;
            const surplusCost = unitCost * node.個数.余剰作成個数;
            const isIncludeUnknown = materialCost.未設定含 || byProductCost.未設定含;
            surpluses.push({
                アイテム名: node.アイテム名,
                作成個数: node.個数.作成個数,
                余り個数: node.個数.余剰作成個数,
                単価: unitCost,
                余り合計金額: surplusCost,
                未設定含: isIncludeUnknown
            });
            return <tReCallResult>{
                価格: surplusCost,
                未設定含: isIncludeUnknown
            }
        })();
        // 耐久割確認
        const durabilityCost = (() => {
            if(node.特殊消費 !== "消費") return reCallResultDefault;
            const totalCost = materialCost.価格 - byProductCost.価格 - surplusCost.価格;
            const durabilityUnitCost = totalCost / (node.個数.耐久値.最大耐久値 * node.個数.作成個数);
            const durabilityCost = durabilityUnitCost * node.個数.耐久値.消費耐久合計;
            const isIncludeUnknown = materialCost.未設定含 || byProductCost.未設定含 || surplusCost.未設定含;
            // 耐久割リストへの登録
            durabilities.push(<tDurability_creation>{
                アイテム名: node.アイテム名,
                調達方法: "作成",
                合計価格: totalCost,
                最大耐久値: node.個数.耐久値.最大耐久値,
                未設定含: isIncludeUnknown,
                消費個数: node.個数.作成個数 - node.個数.余剰作成個数,
                消費耐久値: node.個数.耐久値.消費耐久合計,
                耐久割単価: durabilityUnitCost,
                耐久割金額: durabilityCost
            });
            return <tReCallResult>{
                価格: durabilityCost,
                未設定含: isIncludeUnknown
            }
        })();
        return {
            価格: materialCost.価格 - byProductCost.価格 - surplusCost.価格 - durabilityCost.価格,
            未設定含: materialCost.未設定含 || byProductCost.未設定含 || surplusCost.未設定含 || durabilityCost.未設定含
        }
    }

    const fCommon:(node:tTreeNode_common) => tReCallResult = (node) => {
        const commonObj = commons.find(c => node.アイテム名 === c.アイテム名);
        if(! commonObj) return reCallResultDefault // 処理順序的に発生しないはず。
        if(node.特殊消費 === "消費"){
            return {
                価格: commonObj.単価 / node.個数.耐久値.最大耐久値 * node.個数.耐久値.消費耐久合計,
                未設定含: commonObj.未設定含
            }
        }
        return {
            価格: commonObj.単価 * node.個数.消費個数,
            未設定含: commonObj.未設定含
        }
    }

    const fUser:(node:tTreeNode_user) => tReCallResult = (node) => {
        materials.push(<tMaterialList_user>{
            アイテム名: node.アイテム名,
            調達方法: "自力調達",
            必要個数: node.個数.調達個数,
            設定単価: node.価格.調達単価,
            合計金額: node.価格.合計金額
        });
        if(node.特殊消費 === "消費"){
            durabilities.push(<tDurability_user>{
                アイテム名 :node.アイテム名,
                単価: node.価格.調達単価,
                合計価格: node.価格.合計金額,
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費個数: node.個数.調達個数,
                消費耐久値: node.個数.耐久値.消費耐久合計,
                耐久割単価: node.価格.耐久割単価,
                耐久割金額: node.価格.耐久割合計金額,
                調達方法: "自力調達"
            });
            return {
                価格: node.価格.耐久割合計金額,
                未設定含: false
            }
        }
        return {
            価格: node.価格.合計金額,
            未設定含: false
        }
    }

    const fNpc:(node:tTreeNode_npc) => tReCallResult = (node) => {
        materials.push(<tMaterialList_npc>{
            アイテム名: node.アイテム名,
            調達方法: "NPC",
            必要個数: node.個数.調達個数,
            設定単価: node.価格.調達単価,
            合計金額: node.価格.合計金額
        });
        if(node.特殊消費 === "消費"){
            durabilities.push(<tDurability_npc>{
                アイテム名 :node.アイテム名,
                単価: node.価格.調達単価,
                合計価格: node.価格.合計金額,
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費個数: node.個数.調達個数,
                消費耐久値: node.個数.耐久値.消費耐久合計,
                耐久割単価: node.価格.耐久割単価,
                耐久割金額: node.価格.耐久割合計金額,
                調達方法: "NPC"
            });
            return {
                価格: node.価格.耐久割合計金額,
                未設定含: false
            }
        }
        return {
            価格: node.価格.合計金額,
            未設定含: false
        }
    }

    const fUnknown:(node:tTreeNode_unknown) => tReCallResult = (node) => {
        materials.push(<tMaterialList_unknown>{
            アイテム名: node.アイテム名,
            調達方法: "未設定",
            必要個数: node.個数.消費個数
        });
        if(node.特殊消費 === "消費") durabilities.push(<tDurability_unknown>{
            アイテム名 :node.アイテム名,
            最大耐久値: node.個数.耐久値.最大耐久値,
            消費個数: node.個数.消費個数,
            消費耐久値: node.個数.耐久値.消費耐久合計,
            調達方法: "未設定"
        });
        return {
            価格: 0,
            未設定含: true
        }
    }

    common.forEach(c => {
        const result = fCreation(c);
        if(c.特殊消費 === "消費") commons.push({
            アイテム名: c.アイテム名,
            単価: result.価格 / c.個数.耐久値.消費耐久合計 * c.個数.耐久値.最大耐久値,
            未設定含: result.未設定含
        });
        else commons.push({
            アイテム名: c.アイテム名,
            単価: result.価格 / (c.個数.作成個数 - c.個数.余剰作成個数),
            未設定含: result.未設定含
        });
    });
    main.forEach(m => {
        const result = fCreation(m);
        lastCreations.push({
            アイテム名: m.アイテム名,
            作成個数: m.個数.作成個数,
            単価: result.価格 / (m.個数.作成個数 - m.個数.余剰作成個数),
            合計材料費: result.価格 / (m.個数.作成個数 - m.個数.余剰作成個数) * m.個数.作成個数,
            未設定含: result.未設定含
        });
    });
    return {
        余剰作成: surpluses,
        副産物: byproducts,
        最終作成物: lastCreations,
        材料: materials,
        耐久消費: durabilities
    }
}

export default makeListArrayFromTree;
