import Dexie from 'dexie';

class moecostDbClass extends Dexie {
    private useDictionary : Dexie.Table<iUseDictionary,1>;
    private dictionary : Dexie.Table<iDictionary,string>;
    private display : Dexie.Table<iDisplay,1>;

    辞書 : iDictionary;
    使用辞書 : iUseDictionary;
    表示設定 : iDisplay;

    constructor () {
        super("MOECOST_localDB");

        this.version(1).stores({
            display : "",
            useDictionary : "",
            dictionary : "辞書名"
        });
        // 初期化
        this.useDictionary = this.table("useDictionary");
        this.dictionary = this.table("dictionary");
        this.display = this.table("display");
        this.辞書 = defaultStrage.辞書;
        this.使用辞書 = defaultStrage.使用辞書;
        this.表示設定 = defaultStrage.表示設定;
    }

    async refleshProperties (callBack?: () => void) {
        this.表示設定 = await this.retrieveDisplay();
        this.使用辞書 = await this.retrieveUseDictionary();
        this.辞書 = await this.retrieveDictionary(this.使用辞書.使用中辞書);
        if(callBack) {
            callBack();
        }
    }

    private async retrieveDictionary (dictionaryName : string) {
        let RD = await this.dictionary.get(dictionaryName).catch(() => {
            return defaultStrage.辞書;
        });
        if(RD === undefined){
            RD = defaultStrage.辞書;
        }
        return RD;
    }

    private async retrieveDisplay () {
        let RD = await this.display.get(1).catch(() => {
            return defaultStrage.表示設定;
        })
        if(RD === undefined){
            RD = defaultStrage.表示設定;
        }
        return RD;
    }

    private async retrieveUseDictionary () {
        let RUD = await this.useDictionary.get(1).catch(() => {
            return defaultStrage.使用辞書;
        });
        if(RUD === undefined){
            RUD = defaultStrage.使用辞書;
        }
        return RUD;
    }

    registerDisplay (prop : iDisplay) {
        this.display.put(prop,1);
        this.表示設定 = prop;
    }

    registerDictionary(prop : iDictionary) {
        this.dictionary.put(prop,prop.辞書名);
        this.辞書 = prop;
    }

    registerUseDictionary (prop: iUseDictionary) {
        this.useDictionary.put(prop,1);
        this.使用辞書 = prop;
    }
    // 全ての設定の削除・初期化
    async clearAll () {
        let dictionarys = await this.dictionary.toArray();
        dictionarys.forEach(dict => {
            this.dictionary.delete(dict.辞書名);
        });
        this.display.delete(1);
        this.useDictionary.delete(1);

        this.表示設定 = defaultStrage.表示設定;
        this.使用辞書 = defaultStrage.使用辞書;
        this.辞書 = defaultStrage.辞書;
    }

    // 全ての辞書名の取得
    async retrieveAllDictionaryNames () {
        let dictionarys = await this.dictionary.toArray();
        if(dictionarys.length === 0){
            return [defaultStrage.辞書.辞書名];
        } else {
            return dictionarys.map(dict => dict.辞書名);
        }
    }
    // 辞書の削除
}

const defaultStrage: {"辞書":iDictionary,"使用辞書":iUseDictionary,"表示設定":iDisplay} = {
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

const moecostDb = new moecostDbClass();

export interface iUseDictionary {
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

export default moecostDb


