import Dexie from 'dexie';
import '../types/app.d.ts'

class moecostDbClass extends Dexie {
    useDictionary : Dexie.Table<iUseDictionary,1>;
    dictionary : Dexie.Table<iDictionary,string>;
    display : Dexie.Table<iDisplay,1>;

    constructor () {
        super("MOECOST_localDB");

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
    使用中辞書 : string
}

export interface iDictionary {
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

export interface iDisplay {
    簡易表示 : boolean,
    ダークモード : boolean,
    初期非表示設定 :{
        概要 : boolean,
        生成アイテム一覧 : boolean,
        素材_余剰生産品_副産物一覧 : boolean,
        生産ツリー : boolean
    }
}

export const defaultStrage: {"辞書":iDictionary,"使用辞書":iUseDictionary,"表示設定":iDisplay} = {
    "辞書" : {
        "辞書名" : "Default Dictionary",
        "内容" : []
    },
    "使用辞書" : {
        "使用中辞書" : "Default Dictionary"
    },
    "表示設定" : {
        "ダークモード" : false,
        "簡易表示" : false,
        "初期非表示設定" : {
            "概要" : false,
            "生成アイテム一覧" : false,
            "素材_余剰生産品_副産物一覧" : false,
            "生産ツリー" : false
        }
    }
}

export const retrieveDisplay : () => Promise<iDisplay> = (async () => {
    let display = await moecostDb.display.get(1);
    if(! display){
        display = defaultStrage.表示設定;
        moecostDb.display.put(display,1)
    }
    return display
});

export const registerDisplay : (prop:iDisplay) => void = (prop) => {
    moecostDb.display.put(prop);
}

export const retrieveDictionary : () => Promise<iDictionary> = (async () => {
    let useDictionary = await moecostDb.useDictionary.get(1);
    if(! useDictionary){
        useDictionary = defaultStrage.使用辞書;
    }
    let dictionary = await moecostDb.dictionary.get(useDictionary.使用中辞書);
    if(! dictionary){
        dictionary = defaultStrage.辞書;
        dictionary.辞書名 = useDictionary.使用中辞書
    }
    return dictionary;
});

export const registerDictionary : (prop:iDictionary) => void = (prop) => {
    moecostDb.dictionary.put(prop);
}













export const initialize : () => Promise<{display:iDisplay,dictionary:iDictionary}>= (async () => {

    let display = await moecostDb.display.get(1);
    if(! display){
        display = defaultStrage.表示設定;
        moecostDb.display.put(display,1)
    }

    let useDictionary = await moecostDb.useDictionary.get(1)
    if(! useDictionary){
        useDictionary = defaultStrage.使用辞書
    }
    
    let dictionary = await moecostDb.dictionary.get(useDictionary.使用中辞書);
    if(! dictionary){
        dictionary = defaultStrage.辞書;
    }

    return {
        display:display,
        dictionary:dictionary
    }
});



