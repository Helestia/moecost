import React from 'react';
import {
    tTreeNode,
    tTreeNode_userAndNpc,
    tTreeNode_userAndNpc_durability,
    tTreeNode_creation,
    tTreeNode_creation_durability,
    tTreeNode_common,
    tTreeNode_common_durability} from '../scripts/calc';
import moecostDb from '../scripts/storage';
import {numDeform} from '../scripts/common';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import TableContainer    from '@material-ui/core/TableContainer'
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead'
import TableBody         from '@material-ui/core/TableBody';
import TableCell         from '@material-ui/core/TableCell';
import TableRow          from '@material-ui/core/TableRow';
import Paper             from '@material-ui/core/Paper';
import ExpandMoreIcon    from '@material-ui/icons/ExpandMore';
import makeStyles        from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
    tableRoot: {
        width: "100%",
        maxWidth: "750px"
    }
});

type tResultCreationItemnTable= {
    mainTrees:tTreeNode[],
    commonTrees:tTreeNode[],
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
}

const ResultCreationItemTable:React.FC<tResultCreationItemnTable> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.生成アイテム一覧));
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles();

    // 作成アイテムが1つの場合は非表示
    if(props.mainTrees.length <= 1){
        return null;
    }

    // ツリー内の計算処理
    const calcResult = calcCreationTable(props.mainTrees, props.commonTrees);

    // アコーディオンのオープン/クローズ
    const handleAccordionChange = () => {
        setDisplay((! display));
    }

    // テーブル作成
    return (
        <Accordion
            expanded={display}
            onChange={handleAccordionChange}>
            <AccordionSummary
                className={childrenStyles.accordionTitleStyle}
                expandIcon={<ExpandMoreIcon />}>
                生産アイテム一覧
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer component={Paper} className={classes.tableRoot}>
                    <Table className={classes.tableRoot}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">生産アイテム</TableCell>
                                <TableCell align="center">作成個数</TableCell>
                                <TableCell align="center">合計金額</TableCell>
                                <TableCell align="center">単価</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {calcResult.map(r => (
                                <TableRow key={"resultCreationItemTable_" + r.アイテム名}>
                                    <TableCell component="th">{r.アイテム名}</TableCell>
                                    <TableCell align="right">{numDeform(r.作成個数)}</TableCell>
                                    <TableCell align="right">{numDeform(r.合計原価)}</TableCell>
                                    <TableCell align="right">{numDeform(r.単価)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );
}
type tCalcCreationTableResult = {
    アイテム名: string,
    作成個数: number,
    合計原価: number,
    単価: number
}
type tCalcCreationTable = (main:tTreeNode[], common:tTreeNode[]) => tCalcCreationTableResult[];

const calcCreationTable: tCalcCreationTable = (main,common) => {
    type tReCallFunc = (node:tTreeNode) => number;
    const reCallFunc:tReCallFunc = (node) => {
        type tFCreation = (node:tTreeNode_creation | tTreeNode_creation_durability) => number;
        const fCreation: tFCreation = (node) => {
            // 材料の集計
            const materialCost = node.材料.reduce<number>((num,cur) => num += reCallFunc(cur),0);
            // 副産物の価格
            const byProductCost = (() => {
                if(node.副産物){
                    return node.副産物.reduce<number>((num,cur) => {
                        if(cur.原価) return num + cur.原価.合計価格;
                        return num;
                    },0);
                }
                return 0;
            })();
            // 余剰作成分のコスト
            const surplusCost = (() => {
                if(node.個数.余剰作成個数) return (materialCost - byProductCost) / node.個数.作成個数 * node.個数.余剰作成個数
                return 0
            })();

            // 耐久割材料である場合、耐久割値を取得
            const durabilityCost = (() => {
                if(node.特殊消費 !== "消費") return 0;
                return (materialCost - byProductCost - surplusCost) / (node.個数.耐久値.最大耐久値 * node.個数.作成個数) * (node.個数.耐久値.最大耐久値 * node.個数.作成個数 - node.個数.耐久値.消費耐久合計) 
            })();
            return materialCost - byProductCost - surplusCost - durabilityCost;
        }
        type tFCommon = (node:tTreeNode_common | tTreeNode_common_durability) => number;
        const fCommon:tFCommon = (node) => {
            const c = commonResult.find(c => c.アイテム名 === node.アイテム名);
            if(c){
                if(node.特殊消費 === "消費") return c.単価 / (node.個数.耐久値.最大耐久値 * node.個数.消費個数) * node.個数.耐久値.消費耐久合計;
                return c.単価 * node.個数.消費個数;
            }
            return 0;
        }
        type tFUserOrNpc = (node:tTreeNode_userAndNpc | tTreeNode_userAndNpc_durability) => number;
        const fUserAndNpc:tFUserOrNpc = (node) => {
            if(node.特殊消費 === "消費") return node.価格.耐久割合計金額;
            return node.価格.合計金額;
        }
        if(node.調達方法 === "作成") return fCreation(node);
        if(node.調達方法 === "共通素材") return fCommon(node);
        if(node.調達方法 === "未設定") return 0;
        return fUserAndNpc(node);
    }
    
    const commonResult: tCalcCreationTableResult[] = [];
    const result: tCalcCreationTableResult[] = [];
    common.forEach(c => {
        if(c.調達方法 === "作成"){
            const resultNumber = reCallFunc(c);
            commonResult.push({
                アイテム名: c.アイテム名,
                作成個数: c.個数.作成個数,
                合計原価: resultNumber,
                単価: resultNumber / (c.個数.作成個数 - c.個数.余剰作成個数)
            });
        }
    })
    main.forEach(m => {
        if(m.調達方法 === "作成"){
            const resultNumber = reCallFunc(m);
            result.push({
                アイテム名: m.アイテム名,
                作成個数: m.個数.作成個数,
                合計原価: resultNumber,
                単価: resultNumber / (m.個数.作成個数 - m.個数.余剰作成個数)
            })
        }
    })
    return result;
}

export default ResultCreationItemTable;
