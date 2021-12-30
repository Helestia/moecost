import {Durabilities} from '../../jsonReader'

type tSearchMaxDurabilities = (targetName:string) => number;
export const searchMaxDurabilities:tSearchMaxDurabilities = (targetName) => {
    const durableObj = Durabilities.find(d => d.アイテム === targetName);
    if(durableObj) return durableObj.使用可能回数;
    return 1;
}
