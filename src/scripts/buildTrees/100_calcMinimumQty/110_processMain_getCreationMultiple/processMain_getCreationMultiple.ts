import { tTreeNodeD_creation } from "../../commonTypes";
import { getCreationMultiple } from "../020_getCreationMultiple/getCreationMultiple";
import { tCreationMultiple } from "../types";

type tProcessMain_getCreationMultiple = (nodes:readonly tTreeNodeD_creation[]) => tCreationMultiple[];
export const processMain_getCreationMultiple: tProcessMain_getCreationMultiple = (nodes) => {
    return nodes.reduce<tCreationMultiple[]>((prevResult,node) => {
        return prevResult.concat(
            getCreationMultiple(node, 1, 1)
        )
    },[]);
}
