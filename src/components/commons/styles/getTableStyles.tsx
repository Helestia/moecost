import {
    makeStyles,
    createStyles,
    Theme
} from '@material-ui/core/styles';

import moecostDb from '../../../scripts/storage';

/**
 * スマホ対応用テーブルレイアウトcss
 * 
 * 1. tableToBlock
 *      tableの各要素をブロックに変換し整形
 *      data-label要素が存在する場合はfloatで左にdata-labelを表示
 * 2. tableScroll
 *      table要素全体を左右にスクロールできるようにする。
 */
/**
 * 通常時のクラス
 */
const useStyleTableDefault = makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        display: "inline-block",
        maxWidth: "100%"
    },
    table: {
        whiteSpace: "nowrap"
    },
    tableCellLeft: {
        textAlign: "left"
    },
    tableCellRight: {
        textAlign: "right"
    },
    tableCellCenter: {
        textAlign: "center"
    }
}));

/**
 * スマホ対応用・ブロックへの組み換えスタイル
 */
const useStyleTableToBlock = (dataLabelLength:number) => makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        [theme.breakpoints.down("xs")]: {
            width:"100%",
            display: "block"
        }
    },
    table: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
        }
    },
    tableHeader: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableBody: {
        [theme.breakpoints.down("xs")]: {
            display: "block"
        }
    },
    tableFooter: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableRow: {
        [theme.breakpoints.down("xs")]: {
            display: "block"
        }
    },
    tableCell: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%",
            padding: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px 16px" : "16px",
            "&:not(:first-child)": {
                "&:before":{
                    content: "attr(data-label)",
                    display: "block",
                    padding: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px 16px" : "16px",
                    width: `${(dataLabelLength + 1)}rem`,
                    float: "left",
                    textAlign: "center"
                }
            }
        }
    }
}));

/**
 * スマホ対応用・横スクロール対応
 */
const useStyleTableScroll = makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        [theme.breakpoints.down("xs")]: {
            width:"100%",
            display: "block",
            overflowX: "scroll",
            msOverflowStyle: "none"
        }
    },
    table: {
        [theme.breakpoints.down("xs")]: {
            display: "inline-table"
        }
    }
}));

type tDefaultTableStyleResult = {
    container: string,
    table: string,
    thead: string,
    tbody: string,
    tfoot: string,
    tr: string,
    td: {
        left: string,
        center: string,
        right: string
    }
}

const getTableStyles :(dataLabelLength:number) => tDefaultTableStyleResult = (dataLabelLength) => {
    const def = useStyleTableDefault();
    const scroll = useStyleTableScroll();
    const block = useStyleTableToBlock(dataLabelLength)();
    
    if(moecostDb.アプリ設定.表示設定.表横スクロール表示) return {
        container: `${def.tableContainer} ${scroll.tableContainer}`,
        table: `${def.table} ${scroll.table}`,
        thead: "",
        tbody: "",
        tfoot: "",
        tr: "",
        td: {
            left: def.tableCellLeft,
            right: def.tableCellRight,
            center: def.tableCellCenter
        }
    };
    return {
        container: `${def.tableContainer} ${block.tableContainer}`,
        table: `${def.table} ${block.table}`,
        thead: block.tableHeader,
        tbody: block.tableBody,
        tfoot: block.tableFooter,
        tr: block.tableRow,
        td: {
            left: `${def.tableCellLeft} ${block.tableCell}`,
            right: `${def.tableCellRight} ${block.tableCell}`,
            center: `${def.tableCellCenter} ${block.tableCell}`
        }
    }
}

export default getTableStyles;
