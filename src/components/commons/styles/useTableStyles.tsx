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
        maxWidth: "100%",
        width: "auto"
    },
    table: {
        whiteSpace: "nowrap",
        display: "inline-table",
        width: "auto"
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
const useStyleTableToBlock_isTitle = (dataLabelLength:number) => makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        [theme.breakpoints.down("xs")]: {
            width:"100%",
            display: "block"
        }
    },
    table: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%"
        }
    },
    tableHeader: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableBody: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%"
        }
    },
    tableFooter: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableRow: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%"
        }
    },
    tableCell: {
        [theme.breakpoints.down("xs")]: {
            position: "relative",
            display: "block",
            width: "100%",
            padding: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px 16px" : "16px",
            whiteSpace: "normal",
            "&:not(:first-child)": {
                paddingLeft: `${(dataLabelLength + 2)}rem`,
                "&:before":{
                    content: "attr(data-label)",
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    paddingTop: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px" : "16px",
                    paddingBottom: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px" : "16px",
                    paddingRight: "16px",
                    paddingLeft: (theme.spacing(2) + 16) + "px",
                    width: `${(dataLabelLength + 2)}rem`,
                    textAlign: "left",
                    verticalAlign: "center",
                    whiteSpace: "nowrap",
                }
            },
            "&:empty": {
                display: "none"
            }
        }
    }
}));

/**
 * スマホ対応用・ブロックへの組み換えスタイル　タイトルなしスタイル
 */
const useStyleTableToBlock_noTitle = (dataLabelLength:number) => makeStyles((theme:Theme) => createStyles({
    tableContainer: {
        [theme.breakpoints.down("xs")]: {
            width:"100%",
            display: "block"
        }
    },
    table: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%"
        }
    },
    tableHeader: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableBody: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%"
        }
    },
    tableFooter: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    tableRow: {
        [theme.breakpoints.down("xs")]: {
            display: "block",
            width: "100%",
            borderTop: (theme.palette.type === "light") ? "solid 1px rgba(0,0,0,0.3)" : "solid 1px rgba(255,255,255,0.3)",
            borderBottom: (theme.palette.type === "light") ? "solid 1px rgba(0,0,0,0.3)" : "solid 1px rgba(255,255,255,0.3)",
        }
    },
    tableCell: {
        [theme.breakpoints.down("xs")]: {
            position: "relative",
            display: "block",
            width: "100%",
            padding: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px 16px" : "16px",
            paddingLeft: `${(dataLabelLength + 2)}rem`,
            whiteSpace: "normal",
            "&:before":{
                content: "attr(data-label)",
                display: "block",
                position: "absolute",
                top: 0,
                left: 0,
                paddingTop: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px" : "16px",
                paddingBottom: moecostDb.アプリ設定.表示設定.smallテーブル ? "6px" : "16px",
                paddingRight: "16px",
                paddingLeft: (theme.spacing(2) + 6) + "px",
                width: `${(dataLabelLength + 2)}rem`,
                textAlign: "left",
                verticalAlign: "center",
                whiteSpace: "nowrap"
            },
            "&:empty": {
                display: "none"
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

const useTableStyles :(dataLabelLength:number, isTitle?:boolean) => tDefaultTableStyleResult = (dataLabelLength, isTitle=true) => {
    const def = useStyleTableDefault();
    const scroll = useStyleTableScroll();
    const blockTitle = useStyleTableToBlock_isTitle(dataLabelLength)();
    const blockNoTitle = useStyleTableToBlock_noTitle(dataLabelLength)();

    const block = isTitle ? blockTitle : blockNoTitle;
    
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

export default useTableStyles;
