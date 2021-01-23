import ajv, {DefinedError} from 'ajv';
import {
    iApplicationConfig,
    iDictionary,
    iUseDictionary,
    iVendor,
    tDictionary_ItemInfo} from './storage';

const schema_alldata = {
    type : "object",
    required: ["Version", "アプリ設定", "使用辞書", "辞書", "ベンダー"],
    additionalProperties : false,
    properties:{
        Version: {
            type: "number",
            minimum:1,
            maximum:1
        },
        アプリ設定: {
            type: "object",
            required: ["表示設定", "計算設定"],
            additionalProperties: false,
            properties: {
                表示設定: {
                    type: "object",
                    required: ["ダークモード", "smallテーブル","常時最終作成物表示", "検索候補表示数", "初期表示設定", "ツリー表示内容"],
                    additionalProperties: false,
                    properties: {
                        ダークモード: {type: "boolean"},
                        smallテーブル: {type: "boolean"},
                        常時最終作成物表示: {type: "boolean"},
                        検索候補表示数: {
                            type: "number",
                            minimum:0
                        },
                        初期表示設定: {
                            type: "object",
                            required: ["概要", "原価表", "生産ツリー"],
                            additionalProperties: false,
                            properties: {
                                概要: {type:"boolean"},
                                原価表: {type:"boolean"},
                                生産ツリー: {type:"boolean"}
                            }
                        },
                        ツリー表示内容: {
                            type: "object",
                            required: ["生産", "自力調達", "NPC", "共通素材", "未設定"],
                            additionalProperties: false,
                            properties: {
                                生産: {
                                    type: "object",
                                    required: ["スキル", "テクニック", "消費耐久", "特殊消費", "余剰個数", "副産物", "作成時備考", "要レシピ", "最大作成回数", "備考"],
                                    additionalProperties: false,
                                    properties: {
                                        スキル: {type:"boolean"},
                                        テクニック: {type:"boolean"},
                                        消費耐久: {type:"boolean"},
                                        特殊消費: {type:"boolean"},
                                        余剰個数: {type:"boolean"},
                                        副産物: {type:"boolean"},
                                        作成時備考: {type:"boolean"},
                                        要レシピ: {type:"boolean"},
                                        最大作成回数: {type:"boolean"},
                                        備考: {type:"boolean"}
                                    }
                                },
                                自力調達: {
                                    type: "object",
                                    required: ["消費耐久","特殊消費","価格"],
                                    additionalProperties: false,
                                    properties: {
                                        消費耐久: {type:"boolean"},
                                        特殊消費: {type:"boolean"},
                                        価格: {type:"boolean"}
                                    }
                                },
                                NPC: {
                                    type: "object",
                                    required: ["消費耐久","特殊消費","価格"],
                                    additionalProperties: false,
                                    properties: {
                                        消費耐久: {type:"boolean"},
                                        特殊消費: {type:"boolean"},
                                        価格: {type:"boolean"}
                                    }
                                },
                                共通素材: {
                                    type: "object",
                                    required: ["消費耐久","特殊消費","メッセージ"],
                                    additionalProperties: false,
                                    properties: {
                                        消費耐久: {type:"boolean"},
                                        特殊消費: {type:"boolean"},
                                        メッセージ: {type:"boolean"}
                                    }
                                },
                                未設定: {
                                    type: "object",
                                    required: ["消費耐久","特殊消費","メッセージ"],
                                    additionalProperties: false,
                                    properties: {
                                        消費耐久: {type:"boolean"},
                                        特殊消費: {type:"boolean"},
                                        メッセージ: {type:"boolean"}
                                    }
                                }
                            }
                        }
                    }
                },
                計算設定: {
                    type: "object",
                    required: ["War販売物使用","廃棄設定"],
                    additionalProperties: false,
                    properties: {
                        War販売物使用: {type: "boolean"},
                        廃棄設定: {
                            type: "object",
                            required: ["副産物","余剰生産物","未消費素材"],
                            additionalProperties: false,
                            properties: {
                                副産物: {type: "boolean"},
                                余剰生産物: {type: "boolean"},
                                未消費素材: {type: "boolean"}
                            }
                        }
                    }
                }
            }
        },
        使用辞書: {
            type: "object",
            required: ["使用中辞書"],
            properties: {
                使用中辞書: {
                    type: "string",
                    minLength:1
                }
            }
        },
        辞書: {
            type: "array",
            items: {
                type: "object",
                required: ["辞書名", "内容"],
                additionalProperties: false,
                properties: {
                    辞書名: {
                        type:"string",
                        minLength: 1
                    },
                    内容: {
                        type: "array",
                        items: {
                            anyOf: [
                                {
                                    type:"object",
                                    required: ["アイテム", "調達方法", "調達価格"],
                                    additionalProperties: false,
                                    properties: {
                                        アイテム: {
                                            type: "string",
                                            minLength: 1
                                        },
                                        調達方法: {
                                            const: "自力調達"
                                        },
                                        調達価格: {
                                            type: "integer",
                                            minimum: 0
                                        }
                                    }
                                },
                                {
                                    type:"object",
                                    required: ["アイテム", "調達方法"],
                                    additionalProperties: false,
                                    properties: {
                                        アイテム: {
                                            type: "string",
                                            minLength: 1
                                        },
                                        調達方法: {
                                            const: "NPC"
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["アイテム", "調達方法", "レシピ名"],
                                    additionalProperties:false,
                                    properties: {
                                        アイテム: {
                                            type: "string",
                                            minLength: 1
                                        },
                                        調達方法: {
                                            const: "生産"
                                        },
                                        レシピ名: {
                                            type: "string",
                                            minLength: 1
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        ベンダー: {
            type: "array",
            items: {
                type: "object",
                required: ["ベンダー名", "売物"],
                additionalProperties: false,
                properties: {
                    ベンダー名: {
                        type: "string",
                        minLength: 1
                    },
                    売物: {
                        type: "object",
                        required: ["アイテム", "設定時原価", "廃棄副産物", "廃棄余剰生産", "生産個数", "販売価格"],
                        additionalProperties: false,
                        properties: {
                            アイテム: {
                                type: "string",
                                minLength: 1
                            },
                            設定時原価: {
                                type: "number",
                                minimum: 0
                            },
                            廃棄副産物: {
                                type: "array",
                                items: {
                                    type: "string",
                                    minLength: 1
                                }
                            },
                            廃棄余剰生産: {
                                type: "array",
                                items: {
                                    type: "string",
                                    minLength: 1
                                }
                            },
                            生産個数: {
                                type: "integer",
                                exclusiveMinimum: 0
                            },
                            販売価格: {
                                type: "integer",
                                exclusiveMinimum: 0
                            }
                        }
                    }
                }
            }
        }
    }
}

const schema_dictionary = {
    type: "object",
    required: ["Version","辞書内容"],
    additionalProperties: false,
    properties: {
        Version: {
            type: "number",
            minimum: 1,
            maximum: 1
        },
        辞書内容: {
            type : "array",
            items : {
                anyOf: [
                    {
                        type:"object",
                        required: ["アイテム", "調達方法", "調達価格"],
                        additionalProperties: false,
                        properties: {
                            アイテム: {
                                type: "string",
                                minLength: 1
                            },
                            調達方法: {
                                const: "自力調達"
                            },
                            調達価格: {
                                type: "integer",
                                minimum: 0
                            }
                        }
                    },
                    {
                        type:"object",
                        required: ["アイテム", "調達方法"],
                        additionalProperties: false,
                        properties: {
                            アイテム: {
                                type: "string",
                                minLength: 1
                            },
                            調達方法: {
                                const: "NPC"
                            }
                        }
                    },
                    {
                        type: "object",
                        required: ["アイテム", "調達方法", "レシピ名"],
                        additionalProperties:false,
                        properties: {
                            アイテム: {
                                type: "string",
                                minLength: 1
                            },
                            調達方法: {
                                const: "生産"
                            },
                            レシピ名: {
                                type: "string",
                                minLength: 1
                            }
                        }
                    }
                ]
            }
        }
    }
}


const instanceAjv = new ajv();
const compiledSchema_Alldata = instanceAjv.compile(schema_alldata);
const compiledSchema_dictionary = instanceAjv.compile(schema_dictionary);

/**
 * ファイルの読み取り処理 -- パース
 */
export const tryJsonParse = (str:string) => {
    try{
        const result = JSON.parse(str);
        return result;
    } catch(e) {
        throw new Error("受け取ったファイルの解析に失敗しました。\nファイルが破損しているか、あるいは何らかの加工が施されています。")
    }
}

export const varidateJson_alldata = (obj:any) => {
    const varidateResult = compiledSchema_Alldata(obj);
    if(varidateResult) return obj as {
        Version: 1,
        アプリ設定: iApplicationConfig,
        使用辞書: iUseDictionary,
        辞書: iDictionary[],
        ベンダー: iVendor[]
    }
    else{
        console.log(compiledSchema_Alldata.errors as DefinedError[])
        throw new Error("指定されたファイルの解析に失敗しました。\n意図されたファイルレイアウトではありませんでした。\n心当たりがないのであれば、不具合報告をお願いいたします。");
    }
}

export const varidateJson_dictionary = (obj:any) => {
    const varidateResult = compiledSchema_dictionary(obj);
    if(varidateResult) return obj as {
        Version: number,
        辞書内容:tDictionary_ItemInfo[]
    }
    else throw new Error("指定されたファイルの解析に失敗しました。\n意図されたファイルレイアウトではありませんでした。\n心当たりがないのであれば、不具合報告をお願いいたします。");
}
