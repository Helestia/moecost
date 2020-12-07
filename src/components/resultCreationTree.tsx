import React from 'react';

import ResultItemNameCell   from './resultItemNameCell'

import moecostDb            from '../scripts/storage';
import {numDeform}          from '../scripts/common';
import {
    tTreeNode,
    tTreeNode_creation,
    tTreeNode_common,
    tTreeNode_npc,
    tTreeNode_unknown,
    tTreeNode_user}         from '../scripts/buildTree';

import Accordion            from '@material-ui/core/Accordion';
import AccordionSummary     from '@material-ui/core/AccordionSummary';
import AccordionDetails     from '@material-ui/core/AccordionDetails';

import TableContainer       from '@material-ui/core/TableContainer'
import Table                from '@material-ui/core/Table';
import TableBody            from '@material-ui/core/TableBody';
import TableRow             from '@material-ui/core/TableRow';
import Box                  from '@material-ui/core/Box'
import Paper                from '@material-ui/core/Paper';
import ExpandMoreIcon       from '@material-ui/icons/ExpandMore';
import Typography           from '@material-ui/core/Typography'
import {
    makeStyles,
    createStyles,
    Theme,
    useTheme}               from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    box: {
        maxWidth: "100%"

    },
    tableContainer : {
        display: "inline-box",
        marginTop: theme.spacing(2),
        width: "auto",
        maxWidth: "100%"
    },
    tableClass: {
        borderCollapse: "separate",
        borderSpacing: "3px",
        borderWidth: 1,
        borderColor: theme.palette.divider,
        overflowX: "scroll",
        msOverflowStyle: "none"
    }

}));

type tResultCreationTree = {
    isExpanded: boolean,
    main: tTreeNode_creation[],
    common: tTreeNode_creation[],
    handleExpand: () => void,
    handleItemClick: (str:string) => void,
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>
}

const ResultCreationTree:React.FC<tResultCreationTree> = (props) => {
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles(useTheme());

    // テーブルセルクリックのハンドル
    const handleItemCellClick = (str:string) => {props.handleItemClick(str)};

    const tableObj = buildTableObj(props.main, props.common);


    const renderCommons = () => {
        if(tableObj.common.length === 0) return null;
        return (
            <Box className={classes.box}>
                <Typography variant="h6">共通素材</Typography>
                {
                    tableObj.common.map((c,i) => renderTable(c, "Result_RenderDispray_Common", i))
                }
            </Box>
        )
    }

    const renderMain = () => (
        <Box className={classes.box}>
            <Typography variant="h6">製品作成</Typography>
            {
                tableObj.main.map((m,i) => renderTable(m, "Result_RenderDispray_Main", i))
            }
        </Box>
    );
    
    const renderTable = (nodeArray:tBuildTableObjElement[][],prefix:string,index:number) => (
        <Box
            className={classes.box}
            key={prefix + "_" + index}
        >
            <TableContainer
                component={Paper}
                className={classes.tableContainer}>
                <Table className={classes.tableClass}>
                    <TableBody>
                        {nodeArray.map((a1,i1) => (
                            <TableRow key={prefix + "_" + index + "_" + i1}>
                                {
                                    a1.map((a2,i2) => {
                                        if(a2 === undefined) return null;
                                        const key = prefix + "_" + index + "_" + i1 + "_" + i2;
                                        return renderTableCell(a2,key);
                                    })
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
    const renderTableCell = (node:tBuildTableObjElement, key:string) => {
        if(node === undefined) return null;
        if(node.調達方法 === "作成") return renderTableCellCreation(node,key);
        return renderTableCellOtherCreation(node,key);
    }
    
    const renderTableCellCreation = (node:tTreeNodeT_creation, key:string) => {
        const appConfig = moecostDb.アプリ設定.表示設定.ツリー表示内容.生産
        const skill = (appConfig.スキル)
            ? <Typography variant="caption" color="textSecondary">[ {node.スキル.map(s => s.スキル名 + ":" + numDeform(s.スキル値)).join(", ")}]</Typography>
            : null;
        const technique = (appConfig.テクニック)
            ? <Typography variant="body2" color="textPrimary">{node.テクニック}</Typography>
            : null;
        const itemName = <Typography variant="body1" noWrap={true} display="inline">{node.アイテム名}</Typography>
        const creationNumber = (node.個数.作成個数 === 1) 
            ? null
            : <Typography variant="body1" noWrap={true} display="inline">  &times; {numDeform(node.個数.作成個数)}</Typography>;
        const lostDurability = (appConfig.消費耐久 && node.特殊消費 === "消費") 
            ? <Typography variant="body2">消費耐久: {numDeform(node.個数.耐久値.消費耐久合計)}</Typography>
            : null
        const specialUsage = (() => {
            if(! appConfig.特殊消費) return null;
            if(node.特殊消費 === "失敗時消失") return <Typography variant="body2">※作成失敗時消失</Typography>
            if(node.特殊消費 === "未消費") return <Typography variant="body2">※未消費</Typography>
            return null;
        })();
        const surplus = (appConfig.余剰個数 && node.個数.余剰作成個数)
            ? <Typography variant="body2">余り: {numDeform(node.個数.余剰作成個数)}</Typography>
            : null
        const byproduct = (() => {
            if(! appConfig.副産物) return null;
            if(! node.副産物) return null;
            const results = node.副産物.map((b,i) => {
                const countObj = (b.作成個数 !== 1)
                    ? <Typography> &times; {numDeform(b.作成個数)}</Typography>
                    : null;
                return <Typography key={key + "_ByProducts_" + i} variant="body2">{b.アイテム名}{countObj}</Typography>;
            });
            return <Typography variant="body2">副産物: {
                results.map((r,i) => {
                    if(i === 0) return r;
                    return <> / {r}</>
                }
                )}</Typography>;
        })();
        const createRemarks = (() => {
            if(! appConfig.作成時備考) return null;
            if(node.ギャンブル && node.ペナルティ) return <Typography variant="body2">ギャンブル・ペナルティ</Typography>
            if(node.ギャンブル) return <Typography variant="body2">ギャンブル配置</Typography>
            if(node.ペナルティ) return <Typography variant="body2">ペナルティ型</Typography>
            return null
        })();
        const requireRecipes = (appConfig.要レシピ && node.要レシピ)
            ? <Typography variant="body2">要レシピ</Typography>
            : null;
        const remarks = (appConfig.備考 && (typeof node.備考 === "string"))
            ? <Typography variant="body2">※{node.備考}</Typography>
            : null;
        return (
            <ResultItemNameCell
                itemName={node.アイテム名}
                procurement={node.調達方法}
                handleClick={handleItemCellClick}
                rowspan={node.rowSpan}
                colspan={node.colSpan}
                isTree={true}
                keyName={key}>
                <Box>
                    {skill}
                    {technique}
                    <Box>{itemName}{creationNumber}</Box>
                    {lostDurability}
                    {specialUsage}
                    {surplus}
                    {byproduct}
                    {createRemarks}
                    {requireRecipes}
                    {remarks}
                </Box>
            </ResultItemNameCell>
        )
    }
    const renderTableCellOtherCreation = (node:tTreeNodeT_common | tTreeNodeT_user | tTreeNodeT_npc | tTreeNodeT_unknown, key:string) => {
        const appConfig = (() => {
            if(node.調達方法 === "NPC") return moecostDb.アプリ設定.表示設定.ツリー表示内容.NPC;
            if(node.調達方法 === "共通素材") return moecostDb.アプリ設定.表示設定.ツリー表示内容.共通素材;
            if(node.調達方法 === "自力調達") return moecostDb.アプリ設定.表示設定.ツリー表示内容.自力調達;
            return moecostDb.アプリ設定.表示設定.ツリー表示内容.未設定;
        })();
        const itemName = <Typography variant="body1" noWrap={true} display="inline">{node.アイテム名}</Typography>
        const creationNumber = (() => {
            if(node.調達方法 === "NPC"      && node.個数.調達個数 !== 1) return <Typography variant="body1" noWrap={true} display="inline"> &times; {numDeform(node.個数.調達個数)}</Typography>;
            if(node.調達方法 === "自力調達" && node.個数.調達個数 !== 1) return <Typography variant="body1" noWrap={true} display="inline"> &times; {numDeform(node.個数.調達個数)}</Typography>;
            if(node.調達方法 === "未設定"   && node.個数.消費個数 !== 1) return <Typography variant="body1" noWrap={true} display="inline"> &times; {numDeform(node.個数.消費個数)}</Typography>;
            if(node.調達方法 === "共通素材" && node.個数.消費個数 !== 1) return <Typography variant="body1" noWrap={true} display="inline"> &times; {numDeform(node.個数.消費個数)}</Typography>;
            return null;
        })();
        const lostDurability = (appConfig.消費耐久 && node.特殊消費 === "消費")
            ? <Typography variant="body2">消費耐久: {numDeform(node.個数.耐久値.消費耐久合計)}</Typography>
            : null;
        const specialUsage = (() => {
            if(! appConfig.特殊消費) return null;
            if(node.特殊消費 === "失敗時消失") return <Typography variant="body2">※作成失敗時消失</Typography>
            if(node.特殊消費 === "未消費") return <Typography variant="body2">※未消費</Typography>
            return null;
        })();
        const costs = (() => {
            if(("価格" in appConfig) && (! appConfig.価格)) return null;
            if(node.調達方法 === "NPC" || node.調達方法 === "自力調達"){
                const unit = (node.個数.調達個数 !== 1)
                    ? <>(@{numDeform(node.価格.調達単価)})</>
                    : null
                return <Typography variant="body2">価格:{numDeform(node.価格.合計金額)}{unit}</Typography>
            }
            return null;
        })();
        const message = (() => {
            if(("メッセージ" in appConfig) && (! appConfig.メッセージ)) return null;
            if(node.調達方法 === "共通素材") return <Typography variant="body2">共通素材で作成</Typography>
            if(node.調達方法 === "未設定")   return <Typography variant="body2">【注意】入手手段不明</Typography>
            return null;
        })();
        return (
            <ResultItemNameCell
                itemName={node.アイテム名}
                procurement={node.調達方法}
                handleClick={handleItemCellClick}
                rowspan={node.rowSpan}
                colspan={node.colSpan}
                isTree={true}
                keyName={key}>
                <Box>
                    <Box>{itemName}{creationNumber}</Box>
                    {lostDurability}
                    {specialUsage}
                    {costs}
                    {message}
                </Box>
            </ResultItemNameCell>
        );
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}>
            <AccordionSummary
                className={childrenStyles.accordionTitleStyle}
                expandIcon={<ExpandMoreIcon />}>
                生産ツリー
            </AccordionSummary>
            <AccordionDetails>
                <Box className={classes.box}>
                    {renderCommons()}
                    {renderMain()}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tTableInfo = {
    colSpan:number,
    rowSpan:number,
    outX: number,
    outY: number
}

type tTreeNodeT = tTreeNodeT_creation | tTreeNodeT_common | tTreeNodeT_npc | tTreeNodeT_user | tTreeNodeT_unknown 

type tTreeNodeT_common  = tTreeNode_common  & tTableInfo
type tTreeNodeT_user    = tTreeNode_user    & tTableInfo
type tTreeNodeT_npc     = tTreeNode_npc     & tTableInfo
type tTreeNodeT_unknown = tTreeNode_unknown & tTableInfo

// 材料の型情報を上書きする必要があるため、作成系定義は別定義

type tTreeNodeT_creation = tTreeNodeT_creation_durable | tTreeNodeT_creation_nonDurable;

type tTreeNodeT_creation_nonDurable = {
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
    材料 : tTreeNodeT[],
} & tTableInfo

type tTreeNodeT_creation_durable = {
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
    材料 : tTreeNodeT[]
} & tTableInfo

type tBuildTableObjElement = tTreeNodeT | undefined;

type tBuildTbleObj = (main:tTreeNode_creation[],common:tTreeNode_creation[]) => {
    main:Array<tBuildTableObjElement[][]>,
    common:Array<tBuildTableObjElement[][]>
}

const buildTableObj:tBuildTbleObj = (main,common) => {

    // table全体のcolsを計測
    const measureDepth : (node: tTreeNode,depth:number) => number = (node, depth) => {
        if(node.調達方法 !== "作成") return depth + 1;
        return node.材料.reduce((a,c) => {
            const newDepth = measureDepth(c,depth + 1);
            if(a < newDepth) return newDepth;
            return a; 
        },depth)
    }
    // colspan, rowspan情報の付与
    const mapTableObj: (node: tTreeNode, nowX:number, nowY:number) => {newNode: tTreeNodeT, useRow:number} = (node,nowX,nowY) => {
        if(node.調達方法 !== "作成") return {
            newNode: {...node, ...{colSpan:nowX, rowSpan:1, outX:1, outY:nowY}},
            useRow: 1
        }
        const defMaterialsObj: {materials:tTreeNodeT[], useRows:number} = {materials:[], useRows:0}
        const materialsObj = node.材料.reduce((a,c) => {
            const obj = mapTableObj(c, nowX - 1, nowY + a.useRows);
            a.materials.push(obj.newNode);
            a.useRows += obj.useRow
            return a;
        },defMaterialsObj);
        const resultNode:tTreeNodeT_creation = {...node, ...{材料:materialsObj.materials, colSpan:1, rowSpan:materialsObj.useRows, outX:nowX, outY:nowY}};
        return {
            newNode: resultNode,
            useRow: materialsObj.useRows
        }
    }
    // undefinedで埋まった2次元配列の作成
    const generateUndefined2DArray = (row:number,col:number) => Array(row).fill(undefined).map(() => Array(col).fill(undefined));


    // オブジェクトから2次元配列へ置換
    type tMapObjToArray = (node: tTreeNodeT, result2DArray:tBuildTableObjElement[][]) => void
    const mapObjToArray:tMapObjToArray = (node,result2DArray) => {
        const outX = node.outX - 1;
        const outY = node.outY - 1;
        result2DArray[outY][outX] = (node.調達方法 === "作成") ? {...node, ...{材料:[]}} : node;
        if(node.調達方法 !== "作成") return;
        node.材料.forEach(m => mapObjToArray(m, result2DArray));
        return;
    }

    const newCommon: Array<tBuildTableObjElement[][]> = common.map(c => {
        const depth = measureDepth(c,0);
        const mappedObj = mapTableObj(c, depth, 1);
        const result2DArray = generateUndefined2DArray(mappedObj.useRow, depth);
        mapObjToArray(mappedObj.newNode, result2DArray)
        return result2DArray
    });

    const newMain: Array<tBuildTableObjElement[][]> = main.map(m => {
        const depth = measureDepth(m,0);
        const mappedObj = mapTableObj(m, depth, 1);
        const result2DArray = generateUndefined2DArray(mappedObj.useRow, depth);
        mapObjToArray(mappedObj.newNode, result2DArray)
        return result2DArray
    });

    return {
        main: newMain,
        common: newCommon
    }
}

export default ResultCreationTree;


