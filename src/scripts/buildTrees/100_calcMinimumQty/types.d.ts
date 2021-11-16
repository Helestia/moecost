export type tCreationMultiple = {
    アイテム: string,
    作成数:number,
    要求数: number
}

export type tTreeData = {
    アイテム名: string,
    素材情報: tCreationMultiple[]
};

export type tCommonUsage = {
    アイテム名: string,
    使用状況: tCreationMultiple[]
}
