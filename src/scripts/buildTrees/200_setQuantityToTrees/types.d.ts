export type tCommonData = tCommonData_noLost | tCommonData_nonDurable | tCommonData_durable;


export type tCommonData_noLost = {
    アイテム名: string,
    タイプ: "noLost"
}

export type tCommonData_nonDurable = {
    アイテム名: string,
    タイプ: "nonDurable",
    要求個数: number
}

export type tCommonData_durable = {
    アイテム名: string,
    タイプ: "durable",
    要求耐久値: number
}
