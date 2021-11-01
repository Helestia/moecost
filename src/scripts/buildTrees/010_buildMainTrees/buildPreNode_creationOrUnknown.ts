import {
    tTreeNodeD_creation,
    tTreeNodeD_unknown,
    t特殊消費 } from '../commonTypes'
import {
    tJSON_recipe,
    tJSON_npcSaleItem
} from '../../jsonReader'

import {buildPreNode_creation} from './buildPreNode_creation'
import {buildPreNode_unknown} from  './buildPreNode_unknown'

type tBuildPreNode_creationOrUnknown = (
    targetName:string,
    qty:number,
    sc:t特殊消費,
    created: readonly string[],
    recipe:Readonly<tJSON_recipe>,
    npcUseObj: readonly tJSON_npcSaleItem[]
) => tTreeNodeD_creation | tTreeNodeD_unknown;

export const buildPreNode_creationOrUnknown:tBuildPreNode_creationOrUnknown = (targetName, qty, sc, created, recipe, npcUseObj) => {
    // すでに作ってるアイテムの場合、強制的にunknown扱いで処理終了とする。
    if(created.includes(targetName)) return buildPreNode_unknown(targetName,qty,sc);
    return buildPreNode_creation(targetName, qty, sc, created, recipe, npcUseObj);
}
