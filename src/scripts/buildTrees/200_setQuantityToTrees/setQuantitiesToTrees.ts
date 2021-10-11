import {
    tTreeNode,
    tTreeNodeD,
    tTreeNode_common,
    tTreeNode_common_nonDurable,
    tTreeNode_common_durable,
    tTreeNodeD_common,
    tTreeNodeD_common_durable,
    tTreeNodeD_common_nonDurable,
    tTreeNode_creation,
    tTreeNode_creation_durable,
    tTreeNode_creation_nonDurable,
    tTreeNodeD_creation,
    tTreeNodeD_creation_durable,
    tTreeNodeD_creation_nonDurable,
    tTreeNode_npc,
    tTreeNode_npc_durable,
    tTreeNode_npc_nonDurable,
    tTreeNodeD_npc,
    tTreeNodeD_npc_durable,
    tTreeNodeD_npc_nonDurable,
    tTreeNode_user,
    tTreeNode_user_durable,
    tTreeNode_user_nonDurable,
    tTreeNodeD_user,
    tTreeNodeD_user_durable,
    tTreeNodeD_user_nonDurable,
    tTreeNode_unknown,
    tTreeNode_unknown_durable,
    tTreeNode_unknown_nonDurable,
    tTreeNodeD_unknown,
    tTreeNodeD_unknown_durable,
    tTreeNodeD_unknown_nonDurable
} from '../commonTypes'



type tSetQuantityToTreeResult = {
    main:tTreeNode_creation[],
    common:tTreeNode_creation[]
}
type tSetQuantitiesToTrees = (
    main_noNumber:tTreeNodeD_creation[],
    commons_noNumber:tTreeNodeD_creation[],
    number:number
) => tSetQuantityToTreeResult

export const setQuantitiesToTrees:tSetQuantitiesToTrees = (main,common,quantity) => {
    type tSetNumberToNode = (node:tTreeNodeD, quantity:number) => tTreeNode
    const setQuantityToNode:tSetNumberToNode = (node,quantity) => {
        // 処理分岐
        if(node.調達方法 === "作成")     return setQuantityToNode_create(node,quantity);
        if(node.調達方法 === "共通素材") return setQuantityToNode_common(node,quantity);
        if(node.調達方法 === "NPC")      return setQuantityToNode_npc(node,quantity);
        if(node.調達方法 === "自力調達") return setQuantityToNode_user(node,quantity);
        return setQuantityToNode_unknown(node,quantity);
    }
    const isLostNode = (node:tTreeNodeD) => {
        if(node.特殊消費 === "未消費" || node.特殊消費 === "失敗時消失") return true;
        return false;
    }
    type tSetQuantityToNode_create = (node: tTreeNodeD_creation, quantity:number) => tTreeNode_creation;
    const setQuantityToNode_create:tSetQuantityToNode_create = (node,quantity) => {
        // 基礎部の作成
        const result = (() => {
            if(node.特殊消費 === "消費") return setQuantityToNode_create_durable(node,quantity);
            return setQuantityToNode_create_nonDurable(node,quantity);
        })();
        // 任意項目
        if(node.備考) result.備考 = node.備考;
        if(node.副産物){
            result.副産物 = node.副産物.map(b => {
                const creationQuantity = result.個数.作成個数 / result.個数.セット作成個数 * b.セット作成個数;
                if(b.価格) return {
                    アイテム名: b.アイテム名,
                    セット作成個数: b.セット作成個数,
                    作成個数: creationQuantity,
                    原価: {
                        設定原価: b.価格.設定原価,
                        合計価格: b.価格.設定原価 * creationQuantity
                    }
                };
                return {
                    アイテム名: b.アイテム名,
                    セット作成個数: b.セット作成個数,
                    作成個数: creationQuantity
                }
            });
        }

        // 材料の呼び出し
        const nextQuantity = result.個数.作成個数 / result.個数.セット作成個数;
        result.材料 = node.材料.map(m => setQuantityToNode(m,nextQuantity));
        return result;
    }
    type tSetQuantityToNode_create_durable = (node: tTreeNodeD_creation_durable, quantity:number) => tTreeNode_creation_durable;
    const setQuantityToNode_create_durable:tSetQuantityToNode_create_durable = (node,quantity) => {
        const useDurability = quantity * node.個数.耐久値.上位要求;
        const useItem       = Math.ceil(useDurability / node.個数.耐久値.最大耐久値);
        const createItem    = Math.ceil(useItem / node.個数.セット作成個数);
        return {
            アイテム名: node.アイテム名,
            調達方法: "作成",
            特殊消費: "消費",
            材料: [],
            個数: {
                セット作成個数: node.個数.セット作成個数,
                作成個数: createItem,
                余剰作成個数: (createItem - useItem),
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurability
                }
            },
            スキル: node.スキル,
            テクニック: node.テクニック,
            ギャンブル: node.ギャンブル,
            ペナルティ: node.ペナルティ,
            要レシピ:node.要レシピ
        }
    }
    type tSetQuantityToNode_create_nonDurable = (node: tTreeNodeD_creation_nonDurable, quantity:number) => tTreeNode_creation_nonDurable;
    const setQuantityToNode_create_nonDurable:tSetQuantityToNode_create_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useQuantity = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        const creationQuantity = Math.ceil(useQuantity / node.個数.セット作成個数) * node.個数.セット作成個数;
        return {
            アイテム名: node.アイテム名,
            調達方法: "作成",
            特殊消費: node.特殊消費,
            材料: [],
            個数: {
                セット作成個数: node.個数.セット作成個数,
                作成個数: creationQuantity,
                余剰作成個数: creationQuantity - useQuantity
            },
            スキル: node.スキル,
            テクニック: node.テクニック,
            ギャンブル: node.ギャンブル,
            ペナルティ: node.ペナルティ,
            要レシピ:node.要レシピ
        }
    }

    type tSetQuantityToNode_common = (node:tTreeNodeD_common,quantity:number) => tTreeNode_common;
    const setQuantityToNode_common:tSetQuantityToNode_common = (node,quantity) => {
        const commonObj = (() => {
            const result = commonData.find(c => c.アイテム名 === node.アイテム名);
            if(result) return result;
            const pushItem: tCommonData = {
                アイテム名: node.アイテム名,
                要求個数: 0,
                要求耐久値: 0,
                最大耐久値: 0
            }
            commonData.push(pushItem);
            return pushItem;
        })();
        if(node.特殊消費 === "消費") return setQuantityToNode_common_durable(node,quantity,commonObj);
        return setQuantityToNode_common_nonDurable(node,quantity,commonObj);
    }
    type tSetQuantityToNode_common_durable = (node:tTreeNodeD_common_durable,quantity:number,commonObj:tCommonData) => tTreeNode_common_durable;
    const setQuantityToNode_common_durable:tSetQuantityToNode_common_durable = (node,quantity,commonObj) => {
        const useDurable = quantity * node.個数.耐久値.上位要求;
        const useItem = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        commonObj.要求耐久値 += useDurable;
        if(commonObj.最大耐久値 === 0) commonObj.最大耐久値 = node.個数.耐久値.最大耐久値;

        return {
            アイテム名: node.アイテム名,
            調達方法: "共通素材",
            特殊消費: "消費",
            個数: {
                消費個数: useItem,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            }
        };
    }
    type tSetQuantityToNode_common_nonDurable = (node:tTreeNodeD_common_nonDurable,quantity:number,commonObj:tCommonData) => tTreeNode_common_nonDurable;
    const setQuantityToNode_common_nonDurable:tSetQuantityToNode_common_nonDurable = (node,quantity,commonObj) => {
        const isUnLost = isLostNode(node);
        const useItem = (() => {
            if(isUnLost) return 1;
            const result = quantity * node.個数.上位レシピ要求個数;
            commonObj.要求個数 += result;
            return result;
        })();
        
        return {
            アイテム名: node.アイテム名,
            調達方法: "共通素材",
            特殊消費: node.特殊消費,
            個数: {
                消費個数: useItem
            }
        };
    }

    type tSetQuantityToNode_npc = (node:tTreeNodeD_npc,quantity:number) => tTreeNode_npc;
    const setQuantityToNode_npc:tSetQuantityToNode_npc = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_npc_durable(node,quantity);
        return setQuantityToNode_npc_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_npc_durable = (node:tTreeNodeD_npc_durable,quantity:number) => tTreeNode_npc_durable;
    const setQuantityToNode_npc_durable:tSetQuantityToNode_npc_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                調達個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            },
            価格: {
                合計金額: node.価格.調達単価 * procurment,
                調達単価: node.価格.調達単価,
                耐久割単価: node.価格.耐久割単価,
                耐久割合計金額: node.価格.耐久割単価 * useDurable
            }
        }
    }
    type tSetQuantityToNode_npc_nonDurable = (node:tTreeNodeD_npc_nonDurable,quantity:number) => tTreeNode_npc_nonDurable;
    const setQuantityToNode_npc_nonDurable:tSetQuantityToNode_npc_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                調達個数: useItem
            },
            価格: {
                合計金額: node.価格.調達単価 * useItem,
                調達単価: node.価格.調達単価
            }
        }
    }

    type tSetQuantityToNode_user = (node:tTreeNodeD_user,quantity:number) => tTreeNode_user;
    const setQuantityToNode_user:tSetQuantityToNode_user = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_user_durable(node,quantity);
        return setQuantityToNode_user_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_user_durable = (node:tTreeNodeD_user_durable,quantity:number) => tTreeNode_user_durable;
    const setQuantityToNode_user_durable:tSetQuantityToNode_user_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                調達個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            },
            価格: {
                合計金額: node.価格.調達単価 * procurment,
                調達単価: node.価格.調達単価,
                耐久割単価: node.価格.耐久割単価,
                耐久割合計金額: node.価格.耐久割単価 * useDurable
            }
        }
    }
    type tSetQuantityToNode_user_nonDurable = (node:tTreeNodeD_user_nonDurable,quantity:number) => tTreeNode_user_nonDurable;
    const setQuantityToNode_user_nonDurable:tSetQuantityToNode_user_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                調達個数: useItem
            },
            価格: {
                合計金額: node.価格.調達単価 * useItem,
                調達単価: node.価格.調達単価
            }
        }
    }

    type tSetQuantityToNode_unknown = (node:tTreeNodeD_unknown,quantity:number) => tTreeNode_unknown;
    const setQuantityToNode_unknown:tSetQuantityToNode_unknown = (node,quantity) => {
        if(node.特殊消費 === "消費") return setQuantityToNode_unknown_durable(node,quantity);
        return setQuantityToNode_unknown_nonDurable(node,quantity);
    }
    type tSetQuantityToNode_unknown_durable = (node:tTreeNodeD_unknown_durable,quantity:number) => tTreeNode_unknown_durable;
    const setQuantityToNode_unknown_durable:tSetQuantityToNode_unknown_durable = (node,quantity) => {
        const useDurable = node.個数.耐久値.上位要求 * quantity;
        const procurment = Math.ceil(useDurable / node.個数.耐久値.最大耐久値);
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: "消費",
            個数: {
                消費個数: procurment,
                耐久値: {
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久合計: useDurable
                }
            }
        }
    }
    type tSetQuantityToNode_unknown_nonDurable = (node:tTreeNodeD_unknown_nonDurable,quantity:number) => tTreeNode_unknown_nonDurable;
    const setQuantityToNode_unknown_nonDurable:tSetQuantityToNode_unknown_nonDurable = (node,quantity) => {
        const isUnLost = isLostNode(node);
        const useItem = (isUnLost) 
            ? 1 
            : quantity * node.個数.上位レシピ要求個数;
        return {
            アイテム名:node.アイテム名,
            調達方法: node.調達方法,
            特殊消費: node.特殊消費,
            個数: {
                消費個数: useItem
            }
        }
    }

    type tCommonData = {
        アイテム名: string,
        要求個数: number,
        要求耐久値: number,
        最大耐久値: number
    }
    const commonData:tCommonData[] = [];

    const resultMain = main.map(tree => setQuantityToNode_create(tree,quantity));

    const resultCommon = common.concat().reverse().map(tree => {
        const commonObj = commonData.find(c => c.アイテム名 === tree.アイテム名);
        const orderQuantity = (() => {
            if(! commonObj) return 1;
            if(commonObj.最大耐久値) return commonObj.要求個数 + Math.ceil(commonObj.要求耐久値 / commonObj.最大耐久値);
            return commonObj.要求個数;
        })();
        return setQuantityToNode_create(tree, orderQuantity);
    }).reverse();
    return {
        main:resultMain,
        common:resultCommon
    };
}

