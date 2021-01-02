import Dexie from 'dexie';

class moecostDbClass extends Dexie {
    private useDictionary : Dexie.Table<iUseDictionary,1>;
    private dictionary : Dexie.Table<iDictionary,string>;
    private applicationConfig : Dexie.Table<iApplicationConfig,1>;
    private vendor: Dexie.Table<iVendor,string>

    辞書 : iDictionary;
    使用辞書 : iUseDictionary;
    アプリ設定 : iApplicationConfig;

    constructor () {
        super("MOECOST_localDB");

        this.version(1).stores({
            applicationConfig : "",
            useDictionary : "",
            dictionary : "辞書名",
            vendor: "ベンダー名"
        });
        // 初期化
        this.useDictionary = this.table("useDictionary");
        this.dictionary = this.table("dictionary");
        this.applicationConfig = this.table("applicationConfig");
        this.vendor = this.table("vendor");
        this.辞書 = defaultStrage.辞書;
        this.使用辞書 = defaultStrage.使用辞書;
        this.アプリ設定 = defaultStrage.アプリ設定;
    }
    /**
     * moecostDbクラス内のデータ情報の更新
     * 
     * @param callBack 完了後に呼び出すコールバック関数
     */
    async refleshProperties (callBack?: () => void) {
        this.アプリ設定 = await this.retrieveAppPreference();
        this.使用辞書 = await this.retrieveUseDictionary();
        this.辞書 = await this.retrieveDictionary(this.使用辞書.使用中辞書);

        if(callBack) callBack();
    }
    /**
     * 辞書情報の読み取り
     * 
     * @param dictionaryName 読み取る辞書名
     */
    async retrieveDictionary (dictionaryName : string) {
        const RD = await this.dictionary.get(dictionaryName).catch(() => defaultStrage.辞書);
        if(RD === undefined) return defaultStrage.辞書;
        return RD;
    }

    private async retrieveAppPreference () {
        const RAppConfig = await this.applicationConfig
            .get(1)
            .catch(() => defaultStrage.アプリ設定)
        if(RAppConfig === undefined) return defaultStrage.アプリ設定;
        return RAppConfig;
    }

    private async retrieveUseDictionary () {
        const RUseDictionary = await this.useDictionary
            .get(1)
            .catch(() => defaultStrage.使用辞書);
        if(RUseDictionary === undefined) return defaultStrage.使用辞書;
        return RUseDictionary;
    }
    /**
     * アプリ設定の更新
     * @param prop 更新内容
     */
    registerAppPreference (prop : iApplicationConfig) {
        this.アプリ設定 = prop;
        return this.applicationConfig.put(prop,1);
    }
    /**
     * 辞書情報の更新
     * @param prop 更新辞書情報
     */
    registerDictionary(prop : iDictionary) {
        this.辞書 = prop;
        return this.dictionary.put(prop,prop.辞書名);
    }
    /**
     * 辞書情報の削除
     * @param prop 
     */
    deleteDictionary(prop: string) {
        return this.dictionary.delete(prop)
    }

    /**
     * 使用中の辞書名の変更
     * 
     * @param prop 使用する辞書名
     */
    registerUseDictionary (prop: iUseDictionary) {
        this.使用辞書 = prop;
        return this.useDictionary.put(prop,1);
    }
    /**
     * アプリ内の全データの初期化処理
     */
    clearAll () {
        const jobs = [
            this.vendor.clear(),
            this.dictionary.clear(),
            this.useDictionary.clear(),
            this.applicationConfig.clear()
        ];

        return Promise.all(jobs)
            .then(() => {
                this.アプリ設定 = defaultStrage.アプリ設定;
                this.使用辞書 = defaultStrage.使用辞書;
                this.辞書 = defaultStrage.辞書;
            });
    }

    /**
     * アプリ内の全データの削除処理
     */
    deleteDatabase () {
        return this.delete()
    }
    
    // 全ての辞書の取得
    async retrieveAllDictionary () {
        return await this.dictionary.toArray()
            .then(dictionaries => dictionaries)
            .catch(() => [] as iDictionary[])
    }

    // 全ての辞書名の取得
    async retrieveAllDictionaryNames () {
        const dictionaries = await this.retrieveAllDictionary();
        return dictionaries.map(d => d.辞書名);
    }

    // 全てのベンダー情報の取得
    async retrieveAllVendor () {
        return await this.vendor.toArray()
            .then(vendors => vendors)
            .catch(() => [] as iVendor[]);
    }

    // ベンダー情報の登録
    registerVendor (vendor:iVendor) {
        return this.vendor.put(vendor, vendor.ベンダー名)
    }

    // ベンダー情報の削除
    deleteVendor (vendorName:string) {
        return this.vendor.delete(vendorName);
    }


}


const defaultStrage: {辞書:iDictionary, 使用辞書:iUseDictionary, アプリ設定:iApplicationConfig} = {
    辞書 : {
        辞書名 : "Default Dictionary",
        内容 : []
    },
    使用辞書 : {
        使用中辞書 : "Default Dictionary"
    },
    アプリ設定 : {
        表示設定: {
            ダークモード : false,
            smallテーブル: false,
            検索候補表示数 : 30,
            初期表示設定 : {
                概要 : true,
                原価表 : true,
                生産ツリー : true
            },
            ツリー表示内容:{
                生産:{
                    スキル: true,
                    テクニック: true,
                    消費耐久: true,
                    特殊消費: true,
                    余剰個数: true,
                    副産物: true,
                    作成時備考: true,
                    要レシピ: true,
                    最大作成回数: true,
                    備考: true
                },
                自力調達:{
                    消費耐久: true,
                    特殊消費: true,
                    価格: true
                },
                NPC:{
                    消費耐久: true,
                    特殊消費: true,
                    価格: true
                },
                共通素材:{
                    消費耐久: true,
                    特殊消費: true,
                    メッセージ: true
                },
                未設定: {
                    消費耐久: true,
                    特殊消費: true,
                    メッセージ: true
                }
            }
        },
        その他設定: {
            War販売物使用 : false
        }
    }
}

const moecostDb = new moecostDbClass();

export interface iUseDictionary {
    使用中辞書 : string
}

export interface iDictionary {
    辞書名 : string,
    内容 : tDictionary_ItemInfo[]
}

export type tDictionary_ItemInfo = tDictionary_ItemInfo_user | tDictionary_ItemInfo_npc | tDictionary_ItemInfo_creation

export type tDictionary_ItemInfo_user = {
    アイテム : string,
    調達方法 : "自力調達",
    調達価格 : number
}
export type tDictionary_ItemInfo_npc = {
    アイテム : string,
    調達方法 : "NPC"
}
export type tDictionary_ItemInfo_creation = {
    アイテム : string,
    調達方法 : "生産",
    レシピ名 : string
}

export interface iVendor {
    ベンダー名: string,
    売物: tVendor_sale[]
}

export type tVendor_sale = {
    アイテム: string,
    設定時原価: number,
    廃棄副産物: string[],
    廃棄余剰生産: string[],
    生産個数: number,
    販売価格: number
}



export interface iApplicationConfig {
    表示設定 : {
        検索候補表示数 : number,
        smallテーブル: boolean,
        ダークモード : boolean,
        初期表示設定 :{
            概要 : boolean,
            原価表 : boolean,
            生産ツリー : boolean
        },
        ツリー表示内容: {
            生産:{
                スキル:boolean
                テクニック:boolean
                消費耐久:boolean
                特殊消費:boolean
                余剰個数:boolean
                副産物:boolean
                作成時備考:boolean
                要レシピ:boolean
                最大作成回数:boolean
                備考:boolean
            }
            自力調達:{
                消費耐久: boolean
                特殊消費: boolean
                価格:boolean
            }
            NPC:{
                消費耐久: boolean,
                特殊消費: boolean,
                価格:boolean
            }
            共通素材:{
                消費耐久: boolean,
                特殊消費: boolean,
                メッセージ: boolean,
            }
            未設定: {
                消費耐久: boolean,
                特殊消費: boolean,
                メッセージ: boolean
            }
        }
    },
    その他設定: {
        War販売物使用: boolean
    }
}

export default moecostDb
