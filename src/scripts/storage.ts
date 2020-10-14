import Dexie from 'dexie';
import '../types/app.d.ts'

const db = new Dexie('MOECOST_localDB');
class moecostDbClass extends Dexie {
    useDictionary : Dexie.Table<iUseDictionary,1>;
    dictionary : Dexie.Table<iDictionary,string>;
    display : Dexie.Table<iDisplay,1>;

    constructor () {
        super("dbClass");

        this.version(1).stores({
            useDictionary : "id",
            dictionary : "辞書名",
            display : "id"
        });
        this.useDictionary = this.table("useDictionary");
        this.dictionary = this.table("dictionary");
        this.display = this.table("display");
    }
}

export const moecostDb = new moecostDbClass;

interface iUseDictionary {
    id?: 1,
    使用中辞書 : string
}

interface iDictionary {
    辞書名 : string,
    内容 : アイテム情報[]
}

type アイテム情報 = {
    アイテム : string,
    調達方法 : "NPC"
} | {
    アイテム : string,
    調達方法 : "自力調達",
    調達価格 : number
} | {
    アイテム : string,
    調達方法 : "生産",
    レシピ名 : string
}

interface iDisplay {
    id : 1
    簡易表示 : boolean,
    ダークモード : boolean,
    初期非表示設定 :{
        概要 : boolean,
        生成アイテム一覧 : boolean,
        素材_余剰生産品_副産物一覧 : boolean,
        生産ツリー : boolean
    }
}


export const initialize : () => Promise<{display:iDisplay,dictionary:iDictionary}>= async () => {
    const defDisplay : iDisplay = {
        id:1,
        簡易表示:false,
        ダークモード:false,
        初期非表示設定 : {
            概要:false,
            生成アイテム一覧:false,
            素材_余剰生産品_副産物一覧 : false,
            生産ツリー : false
        }
    }
    const display:iDisplay = await moecostDb.display.get(1).
        then((result : iDisplay | undefined) => {
            if(result) return result
            return defDisplay
        }).
        catch(()=> {
            moecostDb.display.put(defDisplay);
            return defDisplay;
        });
    
    const defUseDictionary : iUseDictionary = {
        id : 1,
        使用中辞書 : "default Dictionary"
    }
    const defDictionary : iDictionary = {
        辞書名 : "Default Dictionary",
        内容 : []
    }
    const useDictionary = await moecostDb.useDictionary.get(1)
        .then(async (result) => {
            if(result) return result;
            const firstDictionary = await moecostDb.dictionary.get(defUseDictionary.使用中辞書)
                .then(async (result) => {
                    if(result) {
                        const returnObj : iUseDictionary = {
                            id : 1,
                            使用中辞書 : result.辞書名
                        };
                        await moecostDb.useDictionary.put(returnObj,1);
                        return returnObj;
                    };
                    await moecostDb.useDictionary.put(defUseDictionary,1)
                    return defUseDictionary;
                }).catch(() => {
                    return defUseDictionary})
            return firstDictionary;
        }).catch(async () => {
            await moecostDb.useDictionary.put(defUseDictionary,1);
            await moecostDb.dictionary.put(defDictionary);
            return defUseDictionary;
        });
    
    const dictionary = await moecostDb.dictionary.get(useDictionary.使用中辞書).then(
        (dictionary) => {
            if(dictionary) return dictionary;
            return defDictionary;
        }).catch(() => {
            return defDictionary
        });
    return {
        display:display,
        dictionary:dictionary
    }
}
