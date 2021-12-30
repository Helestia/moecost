import {tMessage} from '../commonTypes';
import {Recipes} from '../../jsonReader';

type tHandleError = (recipe:string, items:string[], qty:number) => null | tMessage;
export const handleError:tHandleError = (recipe, items, qty) => {
    if(recipe === "") return {
        重大度: "error",
        タイトル: "レシピが指定されていません",
        メッセージ : ["レシピが指定されていません。","本来このメッセージは表示されないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
    }
    if(items.length === 1){
        if(Recipes.every(r => r.レシピ名 !== recipe)) return {
            重大度:"error",
            タイトル: "レシピが見つかりませんでした",
            メッセージ:["作成予定のレシピが見つかりませんでした。",`作成予定のアイテム${recipe}`,"本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
        }
    } else {
        const noRecipe: string[] = items.filter(item => Recipes.every(r => r.生成物.アイテム !== item))
        if(noRecipe.length !== 0) return {
            重大度:"error",
            タイトル: "一部のレシピが見つかりませんでした",
            メッセージ:["作成予定のアイテムのレシピが一部見つかりませんでした。","見つからなかったアイテムは下記のとおりです。",noRecipe.join(" / "),"本来このメッセージは発生しないはずです。","よろしければこのメッセージが表示された経緯等を報告いただけると助かります。"]
        }
    }

    if(qty < 0) return {
        重大度:"error",
        タイトル: "作成個数の指定がマイナス値です",
        メッセージ:["目標とする作成個数にマイナスが指定されています。","再度計算しなおすように指示してください。"]
    }
    if(! Number.isInteger(qty)) return {
        重大度:"error",
        タイトル: "作成個数の指定が整数でありません",
        メッセージ:["目標とする作成個数に整数以外の数値が指定されています。","再度計算しなおすように指示してください。"]
    }
    return null;
}
