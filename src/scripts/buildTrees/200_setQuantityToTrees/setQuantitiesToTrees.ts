import {tTreeNodeD_creation, tTreeNode_creation} from "../commonTypes";
import {getCommonData_creation} from "./getCommonData/getCommonData_creation";
import {buildCreateNode} from "./buildCreateNode/buildCreateNode";
import {getCommonStartQuantity} from "./getCommonStartQuantity";
import {tCommonData} from "./types";

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
    const commonDataMainNode = main.reduce<tCommonData[]>((cd,node) => getCommonData_creation(node,cd,quantity),[]);
    const mainTrees = main.map<tTreeNode_creation>((node) => buildCreateNode(node, quantity))

    type tReduceObj = {
        nodes: tTreeNode_creation[],
        data: tCommonData[]
    }

    console.log(commonDataMainNode);

    const resultCommonObj = common.reverse().reduce<tReduceObj>(
        (prev,node) => {
            const startQuantity = getCommonStartQuantity(node, prev.data);
            const newCommonData = getCommonData_creation(node, prev.data, startQuantity);
            const newNodes = buildCreateNode(node, startQuantity);
            return {
                nodes: prev.nodes.concat(newNodes),
                data: newCommonData
            }
        },{
            nodes: [],
            data: commonDataMainNode
        }
    );

    return {
        main:mainTrees,
        common:resultCommonObj.nodes.reverse()
    };
}

