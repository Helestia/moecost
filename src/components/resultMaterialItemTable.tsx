import React from 'react';
import {
    tTreeNode,
    tTreeNode_userAndNpc,
    tTreeNode_userAndNpc_durability,
    tTreeNode_creation,
    tTreeNode_creation_durability,
    tTreeNode_common,
    tTreeNode_common_durability,
    tTreeNode_unknown,
    tTreeNode_unknown_durability} from '../scripts/calc';
import moecostDb from '../scripts/storage';
import {numDeform} from '../scripts/common';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import TableContainer    from '@material-ui/core/TableContainer'
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead'
import TableBody         from '@material-ui/core/TableBody';
import TableFooter       from '@material-ui/core/TableFooter'
import TableCell         from '@material-ui/core/TableCell';
import TableRow          from '@material-ui/core/TableRow';
import Typography        from '@material-ui/core/Typography'
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

type tResultMaterialItemTable = {
    mainTrees:tTreeNode[],
    commonTrees:tTreeNode[],
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>
}

const ResultMaterialItemTable:React.FC<tResultMaterialItemTable> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.生成アイテム一覧));
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles();

    // ツリー内の計算処理
    const calcResult = calcMaterialTable(props.mainTrees,props.commonTrees);

    // アコーディオンのオープン/クローズ
    const handleAccordionChange = () => {
        setDisplay((! display));
    }
    // テーブル表示・材料
    const renderTableMaterial = () => {
        const hasDurabilityMaterials = calcResult.材料.some(m => m.耐久消費型);
        const totalCost = calcResult.材料.reduce((acc,cur) => acc + cur.合計原価, 0);
        const totalQuantity = calcResult.材料.reduce((acc,cur) => acc + cur.消費個数, 0);
        const totalCostDurability = (() => {
            if(! hasDurabilityMaterials) return 0;
            return calcResult.材料.reduce((acc,cur) => {
                if(cur.耐久消費型) return acc + cur.耐久割原価;
                return acc + cur.合計原価;
            },0);
        })();

        return (
            <TableContainer component={Paper} className={classes.tableRoot}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>消費個数</TableCell>
                            <TableCell>調達単価</TableCell>
                            <TableCell>調達合計金額</TableCell>
                            {(()=>{
                                if(! hasDurabilityMaterials) return null;
                                return (
                                    <>
                                        <TableCell>最大耐久値</TableCell>
                                        <TableCell>消費耐久値</TableCell>
                                        <TableCell>耐久割原価</TableCell>
                                    </>
                                )
                            })()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {calcResult.材料.map(m => 
                        <TableRow>
                            <TableCell>{m.アイテム名}</TableCell>
                            <TableCell>{m.消費個数}</TableCell>
                            {m.調達方法 === "未設定" ? 
                            (<>
                                <TableCell><Typography color="error">不明</Typography></TableCell>
                                <TableCell>-</TableCell>
                            </>) :
                            (<>
                                <TableCell>{m.単価}</TableCell>
                                <TableCell>{m.合計原価}</TableCell>
                            </>)
                            }
                            {(()=>{
                                if(! hasDurabilityMaterials) return null;
                                if(! m.耐久消費型){
                                    return (
                                        <>
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>{m.合計原価}</TableCell>
                                        </>
                                    )
                                }
                                return (
                                    <>
                                        <TableCell>{m.最大耐久値}</TableCell>
                                        <TableCell>{m.消費耐久値}</TableCell>
                                        <TableCell>{m.耐久割原価}</TableCell>
                                    </>
                                )
                            })()}
                        </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>合計</TableCell>
                            <TableCell>-</TableCell>
                            
                        </TableRow>
                    </TableFooter>
                </Table>
                
            </TableContainer>
        )
    }


    // テーブル作成
    return (
        <Accordion
            expanded={display}
            onChange={handleAccordionChange}>
            <AccordionSummary
                className={childrenStyles.accordionTitleStyle}
                expandIcon={<ExpandMoreIcon />}>
                素材・余剰生産品・副産物一覧
            </AccordionSummary>
            <AccordionDetails>
                {renderTableMaterial}
                {renderTableByproduct}
                {renderTableSurplus}
                {renderTableDurability}
                {renderTableTotal}
            </AccordionDetails>
        </Accordion>
    )

}

type tCalcMaterialTableResultMaterial = {
    アイテム名: string,
    調達方法: "自力調達" | "NPC" | "未設定",
    耐久消費型: false,
    消費個数: number,
    合計原価: number,
    単価: number
}
type tCalcMaterialTableResultMaterialDurability = {
    アイテム名: string,
    調達方法: "自力調達" | "NPC" | "未設定",
    耐久消費型: true,
    消費個数: number,
    合計原価: number,
    単価: number,
    最大耐久値:number,
    消費耐久値:number,
    耐久割原価:number
}

type tCalcMaterialTableResultDurability = {
    アイテム名: string,
    調達方法: "作成"
    作成個数: number,
    最大耐久値:number
    消費耐久値:number,
    耐久割単価:number,
    未清算金額:number
}

type tCalcMaterialTableResultSurplus = {
    アイテム名: string,
    調達方法: "作成",
    余剰個数: number,
    合計金額: number,
    単価: number,
}
type tCalcMaterialTableResultByproduct = {
    アイテム名: string,
    調達方法: "作成",
    作成個数: number,
    合計金額: number,
    単価: number,
}

type tCalcMaterialTableResult = {
    耐久項目有: boolean,
    材料: Array<tCalcMaterialTableResultMaterial|tCalcMaterialTableResultMaterialDurability>,
    余剰作成: tCalcMaterialTableResultSurplus[],
    副産物: tCalcMaterialTableResultByproduct[],
    耐久付作成: tCalcMaterialTableResultDurability[]
}

type tCalcMaterialTable = (main:tTreeNode[],common:tTreeNode[]) => tCalcMaterialTableResult;
const calcMaterialTable:tCalcMaterialTable = (main,common) => {
    let resultHasDurabilityItem = false;
    /**
     * 材料
     */ 
    const resultMaterials:Array<tCalcMaterialTableResultMaterial|tCalcMaterialTableResultMaterialDurability> = [];
    /**
     * 余剰作成品
     */
    const resultSurplus: tCalcMaterialTableResultSurplus[]　= [];
    /**
     * 副産物
     */
    const resultByproduct: tCalcMaterialTableResultByproduct[] = [];
    /**
     * 耐久付作成
     */
    const resultDurability: tCalcMaterialTableResultDurability[] = [];
    type tReCall = (node:tTreeNode) => number;
    const reCall:tReCall = (node) => { 
        type tFCreation = (node:tTreeNode_creation | tTreeNode_creation_durability) => number;
        const fCreatrion:tFCreation = (node) => {
            const materialCost = node.材料.reduce<number>((acc,cur) => acc + reCall(cur),0);
            const byProductCost = (() => {
                if(! node.副産物) return 0;
                return node.副産物.reduce((acc,cur) => {
                    resultByproduct.push({
                        アイテム名: cur.アイテム名,
                        調達方法: "作成",
                        作成個数: cur.作成個数,
                        単価: (cur.原価) ? cur.原価.設定原価 : 0,
                        合計金額: (cur.原価) ? cur.原価.合計価格 : 0
                    });
                    if(cur.原価) return acc + cur.原価.合計価格;
                    return acc + 0;
                },0)
            })();
            const surplusCost = (() => {
                if(node.個数.余剰作成個数 === 0) return 0;
                resultSurplus.push({
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    余剰個数: node.個数.余剰作成個数,
                    単価: (materialCost - byProductCost) / node.個数.作成個数,
                    合計金額: (materialCost - byProductCost) / node.個数.作成個数 * node.個数.余剰作成個数
                });
                return (materialCost - byProductCost) / node.個数.作成個数 * node.個数.余剰作成個数;
            })()
            const durabilityCost = (() => {
                if(node.特殊消費 !== "消費") return 0;
                resultHasDurabilityItem = true;
                resultDurability.push({
                    アイテム名: node.アイテム名,
                    調達方法: "作成",
                    作成個数: node.個数.作成個数,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    耐久割単価: (materialCost - byProductCost - surplusCost) / (node.個数.作成個数 * node.個数.耐久値.最大耐久値),
                    消費耐久値: (node.個数.作成個数 * node.個数.耐久値.最大耐久値) - node.個数.耐久値.消費耐久合計,
                    未清算金額: (materialCost - byProductCost - surplusCost) / (node.個数.作成個数 * node.個数.耐久値.最大耐久値) * ((node.個数.作成個数 * node.個数.耐久値.最大耐久値) - node.個数.耐久値.消費耐久合計)
                })
                return (materialCost - byProductCost - surplusCost) / (node.個数.作成個数 * node.個数.耐久値.最大耐久値) * ((node.個数.作成個数 * node.個数.耐久値.最大耐久値) - node.個数.耐久値.消費耐久合計)
            })();
            return materialCost - byProductCost - surplusCost - durabilityCost;
        }
        type tFUnknown = (node:tTreeNode_unknown | tTreeNode_unknown_durability) => number;
        const fUnknown:tFUnknown = (node) => {
            if(node.特殊消費 === "消費"){
                resultHasDurabilityItem = true;
                const pushObj:tCalcMaterialTableResultMaterialDurability = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    耐久消費型: true,
                    消費個数: node.個数.消費個数,
                    単価: 0,
                    合計原価: 0,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久値: node.個数.耐久値.消費耐久合計,
                    耐久割原価: 0
                }
                resultMaterials.push(pushObj);
            } else {
                const pushObj: tCalcMaterialTableResultMaterial = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    耐久消費型: false,
                    消費個数: node.個数.消費個数,
                    単価: 0,
                    合計原価: 0
                }
                resultMaterials.push(pushObj);
            }
            return 0;
        }
        type tFUserAndNpc = (node:tTreeNode_userAndNpc | tTreeNode_userAndNpc_durability) => number;
        const fUserAndNpc:tFUserAndNpc = (node) => {
            if(node.特殊消費 === "消費"){
                resultHasDurabilityItem = true;
                const pushObj:tCalcMaterialTableResultMaterialDurability = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    耐久消費型: true,
                    消費個数: node.個数.調達個数,
                    単価: node.価格.調達単価,
                    合計原価: node.価格.合計金額,
                    最大耐久値: node.個数.耐久値.最大耐久値,
                    消費耐久値: node.個数.耐久値.消費耐久合計,
                    耐久割原価: node.価格.耐久割合計金額
                }
                resultMaterials.push(pushObj);
                return node.価格.耐久割合計金額;
            } else {
                const pushObj: tCalcMaterialTableResultMaterial = {
                    アイテム名: node.アイテム名,
                    調達方法: node.調達方法,
                    耐久消費型: false,
                    消費個数: node.個数.調達個数,
                    単価: node.価格.調達単価,
                    合計原価: node.価格.合計金額
                }
                resultMaterials.push(pushObj);
            }
            return node.価格.合計金額;
        }
        if(node.調達方法 === "作成") return fCreatrion(node);
        if(node.調達方法 === "共通素材") return 0;
        if(node.調達方法 === "未設定") return fUnknown(node);
        return fUserAndNpc(node);
    }
    common.forEach(c => reCall(c));
    main.forEach(m => reCall(m));
    return {
        耐久項目有: resultHasDurabilityItem,
        材料: resultMaterials,
        副産物: resultByproduct,
        余剰作成: resultSurplus,
        耐久付作成 : resultDurability
    }
}