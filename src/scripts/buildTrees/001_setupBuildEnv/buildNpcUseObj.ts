import {tJSON_npcSaleItem,NpcSaleItems} from '../../jsonReader';
import moecostDb from '../../storage';

export const buildNpcUseObj:() => tJSON_npcSaleItem[] = () => {
    const isUseWar = moecostDb.アプリ設定.計算設定.War販売物使用;
    if(isUseWar) return NpcSaleItems;
    return NpcSaleItems.filter(items => items.販売情報.some(npc => npc.時代 !== "War Age"));
}
