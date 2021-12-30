export type tMessage = {
    重大度: "error" | "warning" | "info" | "success"
    タイトル: string,
    メッセージ: string[]
}

export type tProcurement = "作成" | "共通素材" | "NPC" | "自力調達" | "未設定";

export type tTreeNode = tTreeNode_creation | tTreeNode_npc | tTreeNode_user | tTreeNode_common | tTreeNode_unknown;

export type tTreeNode_creation = tTreeNode_creation_nonDurable | tTreeNode_creation_durable;
export type tTreeNode_npc      = tTreeNode_npc_nonDurable      | tTreeNode_npc_durable;
export type tTreeNode_user     = tTreeNode_user_nonDurable     | tTreeNode_user_durable;
export type tTreeNode_common   = tTreeNode_common_nonDurable   | tTreeNode_common_durable;
export type tTreeNode_unknown  = tTreeNode_unknown_nonDurable  | tTreeNode_unknown_durable;

type tTreeNode_creation_nonDurable = {
    アイテム名: string,
    調達方法: "作成",
    特殊消費: "消失" | "失敗時消失" | "未消費"
    個数: {
        セット作成個数: number,
        作成個数: number,
        余剰作成個数: number
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number,
        作成個数: number,
        原価?: {
            設定原価: number,
            合計価格: number
        }
    }[],
    材料 : tTreeNode[],
}

export type tTreeNode_creation_durable = {
    アイテム名 : string,
    調達方法 : "作成",
    特殊消費: "消費"
    個数 : {
        セット作成個数 : number,
        作成個数: number,
        余剰作成個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number
        作成個数: number
        原価?: {
            設定原価: number,
            合計価格: number
        }
    }[]
    材料 : tTreeNode[]
}

type tTreeNode_npc_nonDurable = {
    アイテム名 : string,
    調達方法 : "NPC",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        調達個数: number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    }
}

export type tTreeNode_npc_durable = {
    アイテム名 : string,
    調達方法 : "NPC",
    特殊消費: "消費",
    個数 : {
        調達個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number,
        合計金額: number,
        耐久割合計金額: number
    }
}

type tTreeNode_user_nonDurable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        調達個数: number
    },
    価格 : {
        調達単価 : number,
        合計金額 : number
    }
}

export type tTreeNode_user_durable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    特殊消費: "消費",
    個数 : {
        調達個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number,
        合計金額: number,
        耐久割合計金額: number
    }
}

type tTreeNode_common_nonDurable = {
    アイテム名 : string,
    調達方法 : "共通素材",
    特殊消費: "消失" | "失敗時消失" | "未消費"
    個数 : {
        消費個数: number
    }
}

export type tTreeNode_common_durable = {
    アイテム名 : string,
    調達方法 : "共通素材",
    特殊消費: "消費"
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    }
}

type tTreeNode_unknown_nonDurable = {
    アイテム名 : string,
    調達方法 : "未設定",
    特殊消費: "消失" | "失敗時消失" | "未消費",
    個数 : {
        消費個数: number
    }
}

export type tTreeNode_unknown_durable = {
    アイテム名 : string,
    調達方法 : "未設定",
    特殊消費: "消費",
    個数 : {
        消費個数: number,
        耐久値 : {
            最大耐久値 : number,
            消費耐久合計: number
        }
    }
}

// 以下　プログラム内でのみ使用する型情報
type tTreeNodeD = tTreeNodeD_creation | tTreeNodeD_npc | tTreeNodeD_user | tTreeNodeD_common | tTreeNodeD_unknown;

type tTreeNodeD_creation = tTreeNodeD_creation_nonDurable | tTreeNodeD_creation_durable;
type tTreeNodeD_npc      = tTreeNodeD_npc_nonDurable      | tTreeNodeD_npc_durable;
type tTreeNodeD_user     = tTreeNodeD_user_nonDurable     | tTreeNodeD_user_durable;
type tTreeNodeD_common   = tTreeNodeD_common_nonDurable   | tTreeNodeD_common_durable;
type tTreeNodeD_unknown  = tTreeNodeD_unknown_nonDurable  | tTreeNodeD_unknown_durable;

type tTreeNodeD_creation_nonDurable = {
    アイテム名 : string,
    調達方法 : "作成"
    個数 : {
        上位レシピ要求個数 : number,
        セット作成個数 : number
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number,
        価格? :{
            設定原価:number
        }
    }[]
    材料 : tTreeNodeD[],
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_creation_durable = {
    アイテム名 : string,
    調達方法 : "作成"
    個数 : {
        上位レシピ要求個数 : number,
        セット作成個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    テクニック: string,
    スキル: {
        スキル名: string,
        スキル値: number,
    }[],
    ギャンブル: boolean,
    ペナルティ: boolean,
    要レシピ: boolean,
    備考?: string,
    副産物?: {
        アイテム名: string,
        セット作成個数: number
        価格? :{
            設定原価:number
        }
    }[]
    材料 : tTreeNodeD[],
    特殊消費: "消費"
}

type tTreeNodeD_npc_nonDurable = {
    アイテム名 : string,
    調達方法 : "NPC",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_npc_durable = {
    アイテム名 : string,
    調達方法 : "NPC",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number
    },
    特殊消費: "消費"
}

type tTreeNodeD_user_nonDurable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    個数 : {
        上位レシピ要求個数 : number
    },
    価格 : {
        調達単価 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_user_durable = {
    アイテム名 : string,
    調達方法 : "自力調達",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    価格 : {
        調達単価 : number,
        耐久割単価 : number
    },
    特殊消費: "消費"
}

type tTreeNodeD_common_nonDurable = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_common_durable = {
    アイテム名 : string,
    調達方法 : "共通素材"
    個数 : {
        上位レシピ要求個数 : number
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    特殊消費: "消費"
}

type tTreeNodeD_unknown_nonDurable = {
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number
    },
    特殊消費: "消失" | "失敗時消失" | "未消費"
}

type tTreeNodeD_unknown_durable = {
    アイテム名 : string,
    調達方法 : "未設定",
    個数 : {
        上位レシピ要求個数 : number,
        耐久値 : {
            最大耐久値 : number,
            上位要求: number
        }
    },
    特殊消費: "消費"
}

type t特殊消費 = "消費" | "消失" | "失敗時消失" | "未消費"

export type tQtyRole = "surplus" | "fully" | undefined
export type tQtyRoleResult = "surplus" | "fully";

export type tBuildTreeResult = {
    main:tTreeNode_creation[],
    common:tTreeNode_creation[],
    qtyRoleResult: tQtyRoleResult,
    totalQuantity: number,
    fullyMinimumQuantity: number,
    message:tMessage[]
}