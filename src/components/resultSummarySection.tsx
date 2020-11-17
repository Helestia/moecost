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
import Divider           from '@material-ui/core/Divider';
import List              from '@material-ui/core/List';
import ListItem          from '@material-ui/core/ListItem';
import ListItemText      from '@material-ui/core/ListItemText';
import ExpandMoreIcon    from '@material-ui/icons/ExpandMore';
import makeStyles        from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
    listRoot: {
        width: "100%",
        maxWidth: "750px"
    }
})


type tResultSummarySectionProps = {
    recipeName:string,
    mainTrees:tTreeNode[],
    commonTrees:tTreeNode[],
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
    openConfigCreateNumberDialog: () => void
}
const ResultSummarySection:React.FC<tResultSummarySectionProps> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.概要));
    const classes = useStyles();
    const childrenStyles = props.useChildrenStyles();

    // ツリー内の計算処理
    const calcResult = calcSummary(props.mainTrees, props.commonTrees);

    const handleAccordionChange = () => {
        setDisplay((! display));
    }


    const buildTotalCost = () => {
        if(calcResult.材料未設定有){
            return (
                <>
                    <ListItem>
                        <ListItemText primary="材料費合計" secondary={numDeform(calcResult.合計材料費) + " + 未設定価格"} secondaryTypographyProps={{align:"right", color:"error"}} />
                    </ListItem>
                    <Divider component="li" />
                </>
            );
        } else {
            return (
                <>
                    <ListItem>
                        <ListItemText primary="材料費合計" secondary={numDeform(calcResult.合計材料費)} secondaryTypographyProps={{align:"right", color:"textPrimary"}} />
                    </ListItem>
                    <Divider component="li" />
                </>
            );
        }
    }

    const buildDurabilityCost = () => {
        if(calcResult.耐久消費素材の未償却額){
            return (
                <>
                    <ListItem>
                        <ListItemText primary="耐久消耗材料の残価値" secondary={numDeform(calcResult.耐久消費素材の未償却額)} secondaryTypographyProps={{align:"right", color:"textPrimary"}} />
                    </ListItem>
                    <Divider component="li" />
                </>

            )
        } else return <></>;
    }

    const buildByProductCost = () => {
        if(calcResult.副産物未設定有){
            return (
                <>
                    <ListItem>
                        <ListItemText primary="副産物価格" secondary={numDeform(calcResult.副産物価格) + " + 未設定価格"} secondaryTypographyProps={{align:"right", color:"error"}} />
                    </ListItem>                    
                    <Divider component="li" />
                </>
            )
        } else if(calcResult.副産物価格) {
            return (
                <>
                    <ListItem>
                        <ListItemText primary="副産物価格" secondary={numDeform(calcResult.副産物価格)} secondaryTypographyProps={{align:"right", color:"textPrimary"}} />
                    </ListItem>
                    <Divider component="li" />
                </>
            )
        } else return <></>;
    }

    const buildSurplusCost = () => {
        if(calcResult.余剰生産品原価){
            return (
                <>
                    <ListItem>
                        <ListItemText primary="余剰生産品価値" secondary={numDeform(calcResult.余剰生産品原価)} secondaryTypographyProps={{align:"right", color:"textPrimary"}} />
                    </ListItem>
                    <Divider component="li" />
                </>
            )
        } else {
            return <></>;
        }
    }

    const buildUnitCost = () => {
        const unitCost = (calcResult.合計材料費 - calcResult.余剰生産品原価 - calcResult.副産物価格 - calcResult.耐久消費素材の未償却額) / calcResult.作成セット数;
        return (
            <ListItem>
                <ListItemText primary="作成原価" secondary={numDeform(unitCost)} secondaryTypographyProps={{align:"right", color:"textPrimary"}} />
            </ListItem>
        );
    }

    return (
        <>
            <Accordion
                expanded={display}
                onChange={handleAccordionChange}>
                <AccordionSummary
                    className={childrenStyles.accordionTitleStyle}
                    expandIcon={<ExpandMoreIcon />}>
                    生産概要
                </AccordionSummary>
                <AccordionDetails>
                    <List dense={true} className={classes.listRoot}>
                        <ListItem>
                            <ListItemText primary="生産名" secondary={props.recipeName} secondaryTypographyProps={{align:"right",color:"textPrimary"}} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="必要スキル" secondary={
                                calcResult.必要スキル.map(s => s.スキル名 + ": " + s.スキル値).join(" / ")
                            } 
                            secondaryTypographyProps={{align:"right", color:"textPrimary"}}
                            />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem className={childrenStyles.activeStrings}>
                            <ListItemText
                                primary="作成個数"
                                secondary={numDeform(calcResult.作成セット数)}
                                secondaryTypographyProps={{align:"right",color:"textPrimary"}} 
                                onClick={props.openConfigCreateNumberDialog}/>
                        </ListItem>                        
                        <Divider component="li" />
                        {buildTotalCost()}
                        {buildDurabilityCost()}
                        {buildSurplusCost()}
                        {buildByProductCost()}
                        {buildUnitCost()}                        
                    </List>
                </AccordionDetails>

            </Accordion>
        </>

    )

}

type tSkills = {
    スキル名: string,
    スキル値: number
}

// ツリー内の調査
type tCalcResult = {
    作成セット数: number,
    合計材料費: number,
    耐久消費素材の未償却額: number,
    副産物価格: number,
    余剰生産品原価: number
    材料未設定有: boolean,
    副産物未設定有: boolean,
    必要スキル: tSkills[]
}
type tCalcSummary = (
    main:tTreeNode[],
    commons:tTreeNode[]
) => tCalcResult

const calcSummary:tCalcSummary = (main,common) => {
    // 返答オブジェクト
    const resultObj:tCalcResult = {
        作成セット数: 0,
        合計材料費: 0,
        耐久消費素材の未償却額: 0,
        副産物価格: 0,
        余剰生産品原価: 0,
        材料未設定有: false,
        副産物未設定有: false,
        必要スキル:[]
    }

    type tCommonMaterialCost = {
        アイテム名: string,
        単価: number
    }
    const commonMaterialCost:tCommonMaterialCost[] = [];
    // 原価計算処理
    const reCallFunc:(node:tTreeNode) => number = (node)=> {
        const funcNPCorUser = (node:tTreeNode_userAndNpc | tTreeNode_userAndNpc_durability) => {
            resultObj.合計材料費 += node.価格.合計金額;
            if(node.特殊消費 === "消費"){
                resultObj.耐久消費素材の未償却額 += node.価格.合計金額 - node.価格.耐久割合計金額;
                return node.価格.耐久割合計金額;
            }
            return node.価格.合計金額;
        }
        const funcCommon = (node:tTreeNode_common | tTreeNode_common_durability) => {
            const c = commonMaterialCost.find(c => c.アイテム名 === node.アイテム名);
            if(c){
                if(node.特殊消費 === "消費") return c.単価 / (node.個数.耐久値.最大耐久値 * node.個数.消費個数) * node.個数.耐久値.消費耐久合計;
                return c.単価 * node.個数.消費個数;
            }
            return 0;
        }
        const funcUnknown = ()  => {
            resultObj.材料未設定有 = true;
            return 0;
        }
        const funcCreation = (node:tTreeNode_creation | tTreeNode_creation_durability) => {
            // 必要スキルの登録
            node.スキル.forEach(s => {
                const skillObj = (() => {
                    const obj = resultObj.必要スキル.find(rs => rs.スキル名 === s.スキル名);
                    if(obj) return obj;
                    const rtnobj:tSkills = {
                        スキル名: s.スキル名,
                        スキル値: s.スキル値
                    }
                    resultObj.必要スキル.push(rtnobj);
                    return rtnobj;
                })();
                if(s.スキル値 > skillObj.スキル値){
                    skillObj.スキル値 = s.スキル値;
                }
            })
            // 材料費の計算
            const materialCost = node.材料.reduce<number>((acc,cur) => acc += reCallFunc(cur),0);
            // 副産物の有無の確認
            const byProductCost = (() =>{
                if(node.副産物){
                    return node.副産物.reduce<number>((acc,cur) => {
                        if(cur.原価){
                            acc += cur.原価.合計価格;
                        } else {
                            resultObj.副産物未設定有 = true;
                        }
                        return acc;
                    },0);
                } else {
                    return 0;
                }
            })();
            const subByProduct = materialCost - byProductCost;
            // 余剰作成分の計算
            const surplusCost = (()=> {
                if(node.個数.余剰作成個数) return subByProduct / node.個数.作成個数 * node.個数.余剰作成個数;
                return 0;
            })();
            resultObj.余剰生産品原価 += surplusCost;
            // 余剰を除いた原価
            const subByProductAndSurplus = subByProduct - surplusCost;

            if(node.特殊消費 === "消費"){
                const durabilityCost = subByProductAndSurplus / node.個数.耐久値.最大耐久値;
                resultObj.耐久消費素材の未償却額 += durabilityCost * (node.個数.耐久値.最大耐久値 * node.個数.作成個数 - node.個数.耐久値.消費耐久合計);
                return durabilityCost * node.個数.耐久値.消費耐久合計;
            } else {
                return subByProductAndSurplus;
            }
        }
        // 再起読込時関数の処理部
        if(node.調達方法 === "作成") return funcCreation(node);
        if(node.調達方法 === "共通素材") return funcCommon(node);
        if(node.調達方法 === "未設定") return funcUnknown();
        return funcNPCorUser(node);
    }
    common.forEach(c => {
        const treeCost = reCallFunc(c);
        if(c.調達方法 === "作成"){
            commonMaterialCost.push({
                アイテム名: c.アイテム名,
                単価: treeCost / (c.個数.作成個数 - c.個数.余剰作成個数)
            });
        }
    });
    main.forEach(m => reCallFunc(m));
    if(main[0].調達方法 === "作成"){
        resultObj.作成セット数 = main[0].個数.作成個数 - main[0].個数.余剰作成個数;
    }
    return resultObj;
}

export default ResultSummarySection;
