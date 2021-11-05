import { tTreeNodeD_creation } from "../../commonTypes";
import { canSort} from './canSort';

type tSortCommonNodes = (nodes:readonly tTreeNodeD_creation[]) => tTreeNodeD_creation[]
export const sortCommonNodes: tSortCommonNodes = (nodes) => {
    const result:tTreeNodeD_creation[] = [];
    const sorted:string[] = [];
    do{
        for(let i=0; i<nodes.length; i++){
            if(sorted.includes(nodes[i].アイテム名)) continue;
            if(canSort(nodes[i],sorted)){
                sorted.push(nodes[i].アイテム名);
                result.push(nodes[i]);
            }
        }
    }while(nodes.length !== result.length);
    return result;
}
