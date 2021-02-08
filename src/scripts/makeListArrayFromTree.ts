import {
    tTreeNode,
    tTreeNode_creation,
    tTreeNode_npc,
    tTreeNode_common,
    tTreeNode_unknown,
    tTreeNode_user,
} from './buildTree';
import {cloneObj_JSON} from './common';
import moecostDb from './storage';

type tTrashState = {
    アイテム: string,
    廃棄:boolean
}

export type tMaterial = tMaterial_user  | tMaterial_npc | tMaterial_unknown;
type tMaterial_user = {
    アイテム名: string,
    調達方法: "自力調達"
    必要個数: number,
    設定単価: number,
    合計金額: number
}

type tMaterial_npc = {
    アイテム名: string,
    調達方法: "NPC"
    必要個数: number,
    設定単価: number,
    合計金額: number
}

type tMaterial_unknown = {
    アイテム名: string,
    調達方法: "未設定"
    必要個数: number
}

export type tSurplus  = {
    アイテム名: string,
    作成個数: number,
    余り個数: number,
    単価: number,
    余り合計金額: number,
    未設定含: boolean,
    廃棄対象: boolean
}

export type tByproduct = tByproduct_nonSetCost | tByproduct_setCost;
type tByproduct_nonSetCost = {
    アイテム名: string,
    作成個数: number,
    価格設定有: false,
    廃棄対象: boolean
}

type tByproduct_setCost = {
    アイテム名: string,
    作成個数: number,
    価格設定有: true,
    設定単価: number,
    合計金額: number,
    廃棄対象: boolean
}

export type tCreation = {
    アイテム名: string,
    作成個数: number,
    合計材料費: number,
    単価 : number,
    未設定含: boolean
}

export type tDurability = tDurability_user | tDurability_npc | tDurability_creation | tDurability_unknown
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

export type tSkill = {
    スキル名: string,
    スキル値: number
}

export type tNoLostItem = tNoLostItem_creation | tNoLostItem_user | tNoLostItem_npc | tNoLostItem_unknown

type tNoLostItem_creation = {
    アイテム名: string,
    調達方法: "作成",
    個数: number,
    単価: number,
    合計金額: number,
    未設定含: boolean,
    廃棄対象: boolean
}

type tNoLostItem_user = {
    アイテム名: string,
    調達方法: "自力調達",
    個数: number,
    単価: number,
    合計金額: number,
    廃棄対象: boolean
}
type tNoLostItem_npc = {
    アイテム名: string,
    調達方法: "NPC",
    個数: number,
    単価: number,
    合計金額: number,
    廃棄対象: boolean
}
type tNoLostItem_unknown = {
    アイテム名: string,
    調達方法: "未設定",
    個数: number,
    廃棄対象: boolean
}

export type tMakeListArrayResult = {
    材料: tMaterial[],
    副産物: tByproduct[],
    余剰作成: tSurplus[],
    最終作成物: tCreation[],
    耐久消費: tDurability[],
    スキル: tSkill[],
    要レシピ: string[],
    未消費素材: tNoLostItem[]
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
const reCallResultDefault:tReCallResult = {
    価格: 0,
    未設定含: false
}

type tMakeListArrayFromTree = (
    main: tTreeNode_creation[],
    common: tTreeNode_creation[],
    trashStateItemsByproduct: tTrashState[],
    trashStateItemsSurplus: tTrashState[],
    trashStateItemsNoLost: tTrashState[]
) => tMakeListArrayResult
const makeListArrayFromTree: tMakeListArrayFromTree = (main, common, trashStateItemsByproduct,trashStateItemsSurplus,trashStateItemsNoLost) => {
    const materials:tMaterial[]          = [];
    const byproducts:tByproduct[]        = [];
    const surpluses:tSurplus[]           = [];
    const lastCreations:tCreation[]      = [];
    const durabilities :tDurability[]    = [];
    const skills: tSkill[]               = [];
    const needRecipes : string[]         = [];
    const noLostItems : tNoLostItem[]   = [];

    const commons:tCommons[]             = [];

    const reCall:(node:tTreeNode) => tReCallResult = (node) => {
        if(node.調達方法 === "作成") return fCreation(node);
        if(node.調達方法 === "共通素材") return fCommon(node);
        if(node.調達方法 === "自力調達") return fUser(node);
        if(node.調達方法 === "NPC") return fNpc(node);
        return fUnknown(node);
    }
    /**
     * tRecallResultの減算処理。
     *  価格 = args[0] - args[1] - ... 
     *  未設定含 = arg[0] || arg[1] || ...
     */
    const subRecallResult: (args:tReCallResult[]) => tReCallResult = (args) => {
        return args.reduce((acc,cur) => {
            const result = cloneObj_JSON(acc);
            result.価格 -= cur.価格;
            result.未設定含 = result.未設定含 || cur.未設定含;
            return result;
        })
    }
    /**
     * 必要スキル値の集計
     */
    const registerSkills = (node: tTreeNode_creation) => {
        node.スキル.forEach(s => {
            const skillObj = (() => {
                const obj = skills.find(so => so.スキル名 === s.スキル名);
                if(obj) return obj;
                const pushObj:tSkill = {
                    スキル名: s.スキル名,
                    スキル値: 0
                }
                skills.push(pushObj);
                return pushObj
            })();
            if(skillObj.スキル値 < s.スキル値){
                skillObj.スキル値 = s.スキル値;
            }
        });
    }
    /**
     * 要求レシピ一覧の登録
     */
    const registerNeedRecipe = (node:tTreeNode_creation) => {
        if(node.要レシピ) needRecipes.push(node.アイテム名);
    }
    /**
     * 材料の再起呼び出し
     */
    const reCallMaterials = (node:tTreeNode_creation) => {
        return node.材料.reduce((acc,cur) => {
            const result = reCall(cur);
            acc.価格 += result.価格;
            if(result.未設定含) acc.未設定含 = true;
            return acc;
        },cloneObj_JSON(reCallResultDefault))
    }
    /**
     * 副産物処理 
     */
    const processByproducts: (node:tTreeNode_creation) => tReCallResult = (node) => {
        if(node.副産物 === undefined) return cloneObj_JSON(reCallResultDefault);
        const isTrash = ((item:string) => {
            const trashObj = trashStateItemsByproduct.find(obj => obj.アイテム === item);
            if(trashObj !== undefined) return trashObj.廃棄;
            return moecostDb.アプリ設定.計算設定.廃棄設定.副産物;
        })

        node.副産物.forEach(b => {
            if(b.原価) byproducts.push({
                アイテム名: b.アイテム名,
                作成個数: b.作成個数,
                価格設定有: true,
                設定単価: b.原価.設定原価,
                合計金額: b.原価.合計価格,
                廃棄対象: isTrash(b.アイテム名)
            });
            else byproducts.push({
                アイテム名: b.アイテム名,
                作成個数: b.作成個数,
                価格設定有: false,
                廃棄対象: isTrash(b.アイテム名)
            });
        });

        return node.副産物.reduce((acc,cur) => {
            if(isTrash(cur.アイテム名)) return acc;

            if(cur.原価) acc.価格 += cur.原価.合計価格;
            else acc.未設定含 = true;
            return acc;
        },cloneObj_JSON(reCallResultDefault));
    }

    const processSurplus:(node:tTreeNode_creation,parentResult:tReCallResult) => tReCallResult = (node,parentResult) => {
        if(node.個数.余剰作成個数 === 0) return cloneObj_JSON(reCallResultDefault);
        const isThisNodeTrash = (() => {
            const trashObj = trashStateItemsSurplus.find(obj => obj.アイテム === node.アイテム名);
            if(trashObj !== undefined) return trashObj.廃棄;
            return moecostDb.アプリ設定.計算設定.廃棄設定.余剰生産物;
        })()

        const unitCost = parentResult.価格 / node.個数.作成個数;
        const surplusCost = unitCost * node.個数.余剰作成個数;

        surpluses.push({
            アイテム名: node.アイテム名,
            作成個数: node.個数.作成個数,
            余り個数: node.個数.余剰作成個数,
            単価: unitCost,
            余り合計金額: surplusCost,
            未設定含: parentResult.未設定含,
            廃棄対象: isThisNodeTrash
        });

        if(isThisNodeTrash) return cloneObj_JSON(reCallResultDefault);

        return {
            価格: surplusCost,
            未設定含: parentResult.未設定含
        }
    }

    const processDurability: (node:tTreeNode,parentResult:tReCallResult) => tReCallResult = (node,parentResult) => {
        if(node.特殊消費 !== "消費") return cloneObj_JSON(reCallResultDefault);
        const durabilityObj = (() => {
            const findObj = durabilities.find(d => d.アイテム名 === node.アイテム名 && (d.調達方法 === node.調達方法 || (d.調達方法 === "作成" && node.調達方法 === "共通素材")));
            if(findObj !== undefined) return findObj;
            if(node.調達方法 === "作成"){
                const usingQty = node.個数.作成個数 - node.個数.余剰作成個数;
                const unitCost = parentResult.価格 / usingQty;
                const unitDurabilityCost = parentResult.価格 / (node.個数.耐久値.最大耐久値 * usingQty);
                const result:tDurability_creation = {
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    合計価格: 0,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    単価: unitCost,
                    未設定含: parentResult.未設定含,
                    消費個数: 0,
                    消費耐久値: 0,
                    耐久割単価: unitDurabilityCost,
                    耐久割金額: 0
                }
                durabilities.push(result);
                return result;
            }
            if(node.調達方法 === "共通素材"){
                const unitCost = parentResult.価格 / node.個数.消費個数;
                const unitDurabilityCost = parentResult.価格 / (node.個数.耐久値.最大耐久値 * node.個数.消費個数);
                const result:tDurability_creation = {
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    合計価格: 0,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    単価: unitCost,
                    未設定含: parentResult.未設定含,
                    消費個数: 0,
                    消費耐久値: 0,
                    耐久割単価: unitDurabilityCost,
                    耐久割金額: 0
                }
                durabilities.push(result);
                return result;
            }
            if(node.調達方法 === "NPC"){
                const result:tDurability_npc = {
                    アイテム名: node.アイテム名,
                    調達方法: "NPC",
                    合計価格: 0,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    単価: node.価格.調達単価,
                    消費個数: 0,
                    消費耐久値: 0,
                    耐久割単価: node.価格.耐久割単価,
                    耐久割金額: 0
                }
                durabilities.push(result);
                return result;
            }
            if(node.調達方法 === "自力調達"){
                const result:tDurability_user = {
                    アイテム名: node.アイテム名,
                    調達方法: "自力調達",
                    合計価格: 0,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    単価: node.価格.調達単価,
                    消費個数: 0,
                    消費耐久値: 0,
                    耐久割単価: node.価格.耐久割単価,
                    耐久割金額: 0
                }
                durabilities.push(result);
                return result;
            }
            const result:tDurability_unknown = {
                アイテム名: node.アイテム名,
                調達方法: "未設定",
                最大耐久値: node.個数.耐久値.最大耐久値,
                消費個数: 0,
                消費耐久値: 0
            }
            durabilities.push(result);
            return result;
        })();
        const totalDurabilities = durabilityObj.消費耐久値 + node.個数.耐久値.消費耐久合計;
        const usingQty = Math.ceil(totalDurabilities / node.個数.耐久値.最大耐久値);
        durabilityObj.消費個数 = usingQty;
        durabilityObj.消費耐久値 = totalDurabilities;
        if(durabilityObj.調達方法 === "未設定"){
            return {
                価格: 0,
                未設定含: true
            }
        }
        durabilityObj.合計価格 = durabilityObj.単価 * durabilityObj.消費個数;
        durabilityObj.耐久割金額 = durabilityObj.消費耐久値 * durabilityObj.耐久割単価;
        return {
            価格: node.個数.耐久値.消費耐久合計 * durabilityObj.耐久割単価,
            未設定含: parentResult.未設定含
        }
    }

    const processNoLost = (node:tTreeNode, parentResult:tReCallResult) => {
        if(node.特殊消費 !== "未消費" && node.特殊消費 !== "失敗時消失") return cloneObj_JSON(reCallResultDefault);
        const isThisNodeTrash = (() => {
            const trashObj = trashStateItemsNoLost.find(obj => obj.アイテム === node.アイテム名);
            if(trashObj !== undefined) return trashObj.廃棄;
            return moecostDb.アプリ設定.計算設定.廃棄設定.未消費素材;
        })();
        const noLostItemObj = (() => {
            const findObj = noLostItems.find(noLostItem => noLostItem.アイテム名 === node.アイテム名 && (noLostItem.調達方法 === node.調達方法 || (noLostItem.調達方法 === "作成" && node.調達方法 === "共通素材")));
            if(findObj !== undefined) return findObj;
            
            if(node.調達方法 === "作成"){
                const usingQty = node.個数.作成個数 - node.個数.余剰作成個数;
                const unitCost = parentResult.価格 / usingQty;
                const result:tNoLostItem_creation = {
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    廃棄対象: isThisNodeTrash,
                    未設定含: parentResult.未設定含,
                    個数: 1,
                    単価: unitCost,
                    合計金額: parentResult.価格,
                };
                noLostItems.push(result);
                return result;
            }
            if(node.調達方法 === "共通素材"){
                const unitCost = parentResult.価格 / node.個数.消費個数
                const result:tNoLostItem_creation = {
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    廃棄対象: isThisNodeTrash,
                    未設定含: parentResult.未設定含,
                    個数: 1,
                    単価: unitCost,
                    合計金額: parentResult.価格,
                };
                noLostItems.push(result);
                return result;
            }
            if(node.調達方法 === "自力調達"){
                const result:tNoLostItem_user = {
                    アイテム名: node.アイテム名,
                    調達方法: "自力調達",
                    廃棄対象: isThisNodeTrash,
                    個数: 1,
                    単価: node.価格.調達単価,
                    合計金額: node.価格.合計金額
                }
                noLostItems.push(result);
                return result;
            }
            if(node.調達方法 === "NPC"){
                const result:tNoLostItem_npc = {
                    アイテム名: node.アイテム名,
                    調達方法: "NPC",
                    廃棄対象: isThisNodeTrash,
                    個数: 1,
                    単価: node.価格.調達単価,
                    合計金額: node.価格.合計金額
                }
                noLostItems.push(result);
                return result;
            }
            const result:tNoLostItem_unknown = {
                アイテム名: node.アイテム名,
                調達方法: "未設定",
                個数: 1,
                廃棄対象: isThisNodeTrash
            }
            noLostItems.push(result);
            return result;
        })();

        if(noLostItemObj.廃棄対象) return cloneObj_JSON(parentResult);
        else return cloneObj_JSON(reCallResultDefault);
    }

    const fCreation : (node:tTreeNode_creation) => tReCallResult = (node) => {
        registerSkills(node);
        registerNeedRecipe(node);
        const MaterialCosts = reCallMaterials(node);
        const byproductCost = processByproducts(node);
        const SurplusCost = processSurplus(node,subRecallResult([MaterialCosts,byproductCost]));
        const durabilityCost = processDurability(node,subRecallResult([MaterialCosts,byproductCost,SurplusCost]));
        const noLostCost = processNoLost(node,subRecallResult([MaterialCosts,byproductCost,SurplusCost,durabilityCost]));
        return subRecallResult([MaterialCosts,byproductCost,SurplusCost,durabilityCost,noLostCost]);
    }

    const retrieveCommons : (node:tTreeNode_common) => tReCallResult = (node) => {
        const findObj = commons.find(c => node.アイテム名 === c.アイテム名);
        if(! findObj) return cloneObj_JSON(reCallResultDefault); // 処理順番的に発生しないはずです。
        return {
            価格: findObj.単価 * node.個数.消費個数,
            未設定含: findObj.未設定含
        }
    }

    const fCommon:(node:tTreeNode_common) => tReCallResult = (node) => {
        const baseCost = retrieveCommons(node);
        const durabilityCost = processDurability(node,baseCost);
        const noLostCost = processNoLost(node,subRecallResult([baseCost,durabilityCost]));
        return subRecallResult([baseCost,durabilityCost,noLostCost]);
    }
    
    const registerMaterial: (node:tTreeNode_npc | tTreeNode_user | tTreeNode_unknown) => void = (node) => {
        const registerObj = (() => {
            const findObj = materials.find(m => m.アイテム名 === node.アイテム名 && m.調達方法 === node.調達方法);
            if(findObj !== undefined) return findObj;
            if(node.調達方法 === "NPC"){
                const result: tMaterial_npc = {
                    アイテム名: node.アイテム名,
                    調達方法: "NPC",
                    必要個数: 0,
                    設定単価: node.価格.調達単価,
                    合計金額: 0
                }
                materials.push(result);
                return result;
            }
            if(node.調達方法 === "自力調達"){
                const result: tMaterial_user = {
                    アイテム名: node.アイテム名,
                    調達方法: "自力調達",
                    必要個数: 0,
                    設定単価: node.価格.調達単価,
                    合計金額: 0
                }
                materials.push(result);
                return result;
            }
            const result: tMaterial_unknown = {
                アイテム名: node.アイテム名,
                調達方法: "未設定",
                必要個数: 0
            }
            materials.push(result);
            return result;
        })();
        if(node.調達方法 === "未設定") registerObj.必要個数 += node.個数.消費個数;
        else registerObj.必要個数 += node.個数.調達個数;
        
        if(registerObj.調達方法 !== "未設定") registerObj.合計金額 = registerObj.必要個数 * registerObj.設定単価;
    }

    const fUser:(node:tTreeNode_user) => tReCallResult = (node) => {
        registerMaterial(node);
        const resultBase:tReCallResult = {
            価格: node.価格.合計金額,
            未設定含: false
        };
        const durabilityCost = processDurability(node,resultBase);
        const noLostCost = processNoLost(node,subRecallResult([resultBase,durabilityCost]));
        return subRecallResult([resultBase,durabilityCost,noLostCost]);
    }

    const fNpc:(node:tTreeNode_npc) => tReCallResult = (node) => {
        registerMaterial(node);
        const resultBase:tReCallResult = {
            価格: node.価格.合計金額,
            未設定含: false
        };
        const durabilityCost = processDurability(node,resultBase);
        const noLostCost = processNoLost(node,subRecallResult([resultBase,durabilityCost]));
        return subRecallResult([resultBase,durabilityCost,noLostCost]);
    }

    const fUnknown:(node:tTreeNode_unknown) => tReCallResult = (node) => {
        registerMaterial(node);
        const resultBase:tReCallResult = {
            価格: 0,
            未設定含: true
        };
        const durabilityCost = processDurability(node,resultBase);
        const noLostCost = processNoLost(node,subRecallResult([resultBase,durabilityCost]));
        return subRecallResult([resultBase,durabilityCost,noLostCost]);
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
            作成個数: m.個数.作成個数 - m.個数.余剰作成個数,
            単価: result.価格 / (m.個数.作成個数 - m.個数.余剰作成個数),
            合計材料費: result.価格 / (m.個数.作成個数 - m.個数.余剰作成個数) * m.個数.作成個数,
            未設定含: result.未設定含
        });
    });
    return {
        余剰作成: surpluses,
        副産物: byproducts,
        未消費素材: noLostItems,
        最終作成物: lastCreations,
        材料: materials,
        耐久消費: durabilities,
        スキル: skills,
        要レシピ: needRecipes
    }
}

export default makeListArrayFromTree;
