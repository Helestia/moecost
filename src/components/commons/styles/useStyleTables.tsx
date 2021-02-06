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

export const useStyleTableScroll = makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        [theme.breakpoints.down("xs")]: {
            width:"100%",
            display: "block",
            overflowX: "scroll",
            msOverflowStyle: "none"
        }
    },
    tableContainerInline: {
        display: "inline-block",
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
    },
    tableHeader: {
    },
    tableBody: {
    },
    tableFooter: {
    },
    tableRow: {
    },
    tableCell: {
    },
    tableCellArignRight: {
        textAlign: "right"
    },
    tableCellAlignLeft: {
        textAlign: "left"
    },
    tableCellAlignCenter: {
        textAlign: "center"
    }
}));

export const useStyleTableToBlock = (dataLabelLength:number) => makeStyles((theme:Theme) => createStyles({
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
            display: "inline-table",
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
            "&:before":{
                content: "attr(data-label)",
                display: "block",
                padding: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px 16px" : "16px",
                width: `${(dataLabelLength + 1)}rem`,
                float: "left",
                textAlign: "center"
            }
        }
    },
    tableCellArignRight: {
        textAlign: "right"
    },
    tableCellAlignLeft: {
        textAlign: "left"
    },
    tableCellAlignCenter: {
        textAlign: "center"
    }
}));
