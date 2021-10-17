import {
    tMessage,
    tTreeNode,
    tTreeNode_creation,
    tTreeNode_npc,
    tTreeNode_common,
    tTreeNode_user
} from './buildTrees/commonTypes';

type tFindMessages = (main:tTreeNode_creation[], common:tTreeNode_creation[], createNumber:number) => tMessage[]
const findMessages:tFindMessages = (main,common,createNumber) => {

    // 素材にunknownがあるか確認
    const message1 = retrieveUnknownMaterials(main,common);

    // 副産物に単価未設定があるか確認
    const message2 = retrieveNoSetByproductCost(main,common);
    
    // 材料費合計より高い副産物があるか確認
    const message3 = retreiveHighCostByproduct(main,common);

    // 指定個数が作成できているか確認
    const message4 = confirmEqualOrdernumberAndTree(main,createNumber);

    return message1.concat(message2).concat(message3).concat(message4);
}

type tRetrieveUnknownMaterials = (main:tTreeNode_creation[], common:tTreeNode_creation[]) => tMessage[];
const retrieveUnknownMaterials:tRetrieveUnknownMaterials = (main,common) => {
    const resultArray:tMessage[] = [];
    type tReCall = (node:tTreeNode) => void;
    const reCall:tReCall = (node) => {
        if(node.調達方法 === "未設定" && (! unknownMaterials.includes(node.アイテム名))){unknownMaterials.push(node.アイテム名)};
        if(node.調達方法 === "作成") node.材料.forEach(m => reCall(m));
    }
    const unknownMaterials:string[] = [];
    main.forEach(tree => reCall(tree));
    common.forEach(tree => reCall(tree));

    if(unknownMaterials.length) resultArray.push({
        重大度: "warning",
        タイトル: "入手手段不明のアイテムが作成過程に含まれています",
        メッセージ: (["下記アイテムが入手経路不明の為、金額が正しく計算されていません。", unknownMaterials.join(" / ")])
    });
    return resultArray
}

type tRetrieveNoSetByproductCost = (main:tTreeNode_creation[], common:tTreeNode_creation[]) => tMessage[];
const retrieveNoSetByproductCost:tRetrieveNoSetByproductCost = (main,common) => {
    const resultArray:tMessage[] = [];
    type tReCall = (node:tTreeNode) => void;
    const reCall:tReCall = (node) => {
        if(node.調達方法 !== "作成") return;
        if(node.副産物) node.副産物.forEach(b => {
            if(! b.原価) unknownByproduct.push(b.アイテム名);
        })
        node.材料.forEach(node => reCall(node));
    }
    const unknownByproduct:string[] = [];
    main.forEach(tree => reCall(tree));
    common.forEach(tree => reCall(tree));
    if(unknownByproduct.length) resultArray.push({
        重大度: "info",
        タイトル: "価格設定されていない副産物が存在します",
        メッセージ: (["生産過程で下記アイテムが副産物として生成されます。","調達単価を設定することで、そのアイテムの価値を減らした金額を表示できます。", unknownByproduct.join(" / ")])
    });
    return resultArray;
}

type tRetreiveHighCostByproduct = (main:tTreeNode_creation[], common:tTreeNode_creation[]) => tMessage[];
const retreiveHighCostByproduct:tRetreiveHighCostByproduct = (main,common) => {
    const resultArray:tMessage[] = [];
    type tReCall = (node:tTreeNode) => number;
    const reCall:tReCall = (node) => {
        if(node.調達方法 === "NPC") return fNpc(node);
        if(node.調達方法 === "自力調達") return fUser(node);
        if(node.調達方法 === "共通素材") return fCommon(node);
        if(node.調達方法 === "未設定") return 0;
        return fCreate(node);
    }
    const fNpc = (node:tTreeNode_npc) => {
        if(node.特殊消費 === "消費") return node.価格.耐久割合計金額;
        return node.価格.合計金額;
    }
    const fUser = (node:tTreeNode_user) => {
        if(node.特殊消費 === "消費") return node.価格.耐久割合計金額;
        return node.価格.合計金額;
    }
    const fCommon = (node:tTreeNode_common) => {
        const commonObj = commonItems.find(c => node.アイテム名 === c.アイテム名);
        if(! commonObj) return 0;
        if(node.特殊消費 === "消費") return commonObj.単価 / node.個数.耐久値.最大耐久値 * node.個数.耐久値.消費耐久合計;
        return commonObj.単価 * node.個数.消費個数;
    }
    const fCreate = (node:tTreeNode_creation) => {
        const materialCost = node.材料.reduce((acc,cur) => acc + reCall(cur), 0);
        const byproductCost = (() => {
            if(! node.副産物) return 0;
            return node.副産物.reduce((acc,cur) => {
                if(cur.原価) return acc + cur.原価.合計価格
                return acc;
            },0);
        })();
        if(materialCost < byproductCost && node.副産物) {
            retrieveByproduct.push({
                生産アイテム名: node.アイテム名,
                副産物一覧: node.副産物.map(b => b.アイテム名).join(" / "),
                材料費合計: materialCost,
                副産物の価格: byproductCost
            })
        }
        const surplusCost = (materialCost - byproductCost) / node.個数.作成個数 * node.個数.余剰作成個数;
        const durabilityCost = (() => {
            if(node.特殊消費 !== "消費") return 0;
            return (materialCost - byproductCost - surplusCost) / (node.個数.耐久値.最大耐久値 * node.個数.作成個数) * node.個数.耐久値.消費耐久合計;
        })();
        return materialCost - byproductCost - surplusCost - durabilityCost;
    }

    type tCommonItems = {
        アイテム名: string,
        単価: number
    }
    const commonItems:tCommonItems[] = [];

    type tRetrieveByproduct = {
        生産アイテム名: string,
        副産物一覧: string,
        副産物の価格: number,
        材料費合計: number
    }
    const retrieveByproduct:tRetrieveByproduct[] = [];

    common.forEach(c => {
        const commonCost = fCreate(c);
        commonItems.push({
            アイテム名: c.アイテム名,
            単価: commonCost / c.個数.作成個数
        });
    });
    main.forEach(m => {
        fCreate(m);
    });

    retrieveByproduct.forEach(r => {
        resultArray.push({
            重大度: "info",
            タイトル: "材料費の合計より高い価格の副産物が存在します",
            メッセージ: ["価格設定を何か誤っていませんか？","",`生成アイテム:${r.生産アイテム名}`,`副産物一覧:${r.副産物一覧}`,`材料合計価格:${r.材料費合計}`,`副産物合計価格:${r.副産物の価格}`]
        })
    });
    return resultArray;
}

type tConfirmEqualOrdernumberAndTree = (main:tTreeNode_creation[], createNumber:number) => tMessage[];
const confirmEqualOrdernumberAndTree:tConfirmEqualOrdernumberAndTree = (main, createNumber) => {
    const resultArray :tMessage[] = [];
    const treeValue = main[0].個数.作成個数 - main[0].個数.余剰作成個数;
    if(treeValue !== createNumber && createNumber !== 0){
        resultArray.push({
            重大度: "info",
            タイトル: "指定された個数設定と異なった作成数のツリーが表示されています。",
            メッセージ: ["アイテムの生成ルートが変更された等の理由で、作成個数の指定が無効となっています。","現在は作成可能な最小個数で指定されています。","必要に応じて個数指定を再設定してください。"]
        })
    }
    return resultArray;
}

export default findMessages;
