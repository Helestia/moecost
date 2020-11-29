import React from 'react';
import {
    tByproduct,
    tCreation,
    tDurability,
    tMaterial,
    tSurplus,
    tSkill
} from '../scripts/makeListArrayFromTree'
import moecostDb from '../scripts/storage';
import {numDeform, cloneObj_JSON} from '../scripts/common';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import TableContainer    from '@material-ui/core/TableContainer';
import Table             from '@material-ui/core/Table';
import TableBody         from '@material-ui/core/TableBody';
import TableCell         from '@material-ui/core/TableCell';
import Typography        from '@material-ui/core/Typography';
import Tooltip           from '@material-ui/core/Tooltip';
import Paper             from '@material-ui/core/Paper';
import ExpandMoreIcon    from '@material-ui/icons/ExpandMore';
import makeStyles        from '@material-ui/styles/makeStyles';
import { TableRow } from '@material-ui/core';

const useStyles = makeStyles({
    TableRoot: {
        width: "100%",
        maxWidth: "550px"
    }
})

 
type tResultSummarySectionProps = {
    recipeName: string,
    creations: tCreation[],
    materials: tMaterial[],
    surpluses: tSurplus[],
    byproducts: tByproduct[],
    durabilities: tDurability[],
    skills: tSkill[],
    needRecipe: string[]
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
    openConfigCreateNumberDialog: () => void
}
const ResultSummarySection:React.FC<tResultSummarySectionProps> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.概要));
    const classes = useStyles();
    const childrenStyles = props.useChildrenStyles();

    // 各フィールドで表示する情報の取得
    type tData = {
        money:number,
        hasUnknown:boolean
    }
    const initialData:tData = {
        money:0,
        hasUnknown:false
    }
    // 材料費合計
    const materialData = props.materials.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        else a.money += c.合計金額;
        return a;
    }, cloneObj_JSON(initialData));

    // 副産物合計
    const byproductData = props.byproducts.reduce((a,c) => {
        if(c.価格設定有) a.money += c.合計金額;
        else a.hasUnknown = true;
        return a;
    }, cloneObj_JSON(initialData));

    // 余剰作成品合計
    const surplusData = props.surpluses.reduce((a,c) => {
        if(c.未設定含) a.hasUnknown = true;
        a.money += c.余り合計金額;
        return a;
    }, cloneObj_JSON(initialData));

    // 耐久消費素材の残価値
    const durabilityData = props.durabilities.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        if(c.調達方法 === "作成" && c.未設定含) a.hasUnknown = true;
        if(c.調達方法 !== "未設定") a.money += c.合計価格 - c.耐久割金額;
        return a;
    }, cloneObj_JSON(initialData));

    const renderRecipeName = () => (
        <TableRow>
            <TableCell component="th">
                <Typography>レシピ名</Typography>
            </TableCell>
            <TableCell>
                <Typography>{props.recipeName}</Typography>
            </TableCell>
        </TableRow>
    );

    const renderCreateCount = () => (
        <Tooltip title="作成個数の変更">
            <TableRow 
                className={childrenStyles.activeStrings}
                onClick={props.openConfigCreateNumberDialog}>
                <TableCell component="th">
                    <Typography>作成個数</Typography>
                </TableCell>
                <TableCell align="right"><Typography>{numDeform(props.creations[0].作成個数)}</Typography></TableCell>
            </TableRow>
        </Tooltip>
    );
    
    const renderNeedSkills = () => (
        <TableRow>
            <TableCell component="th">
                <Typography>必要スキル</Typography>
            </TableCell>
            <TableCell>{props.skills.map(skill => skill.スキル名 + ":" + (numDeform(skill.スキル値))).join(" / ")}</TableCell>
        </TableRow>
    );
    
    const renderNeedRecipe = () => {
        if(props.needRecipe.length === 0) return null;
        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>必要レシピ</Typography>
                </TableCell>
                <TableCell>{props.needRecipe.join(" / ")}</TableCell>
            </TableRow>
        );
    }

    const renderMaterialCost = () => (
        <TableRow>
            <TableCell component="th"><Typography>材料費合計</Typography></TableCell>
            <TableCell
                align="right">
                <Typography color={(materialData.hasUnknown)? "error" : "textPrimary"}>
                    {numDeform(materialData.money)} 
                    {(materialData.hasUnknown)
                        ? " + 未設定価格" 
                        : ""
                    }
                </Typography>
            </TableCell>
        </TableRow>
    )


    const renderByproductRebate = () => {
        if(props.byproducts.length === 0) return null;
        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>副産物価格</Typography>
                </TableCell>
                <TableCell align="right">
                        <Typography color={(byproductData.hasUnknown) ? "error" : "textPrimary"}>
                        {numDeform(byproductData.money)}
                        {(byproductData.hasUnknown)
                            ? " + 未設定価格" 
                            : ""
                        }
                        </Typography>
                </TableCell>
            </TableRow>
        );
    }

    const renderSurplusRebate = () => {
        if(props.surpluses.length === 0) return null;
        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>余剰生産価格</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography color={(surplusData.hasUnknown) ? "error" : "textPrimary"}>
                        {numDeform(surplusData.money)}
                        {(surplusData.hasUnknown)
                            ? " + 未設定価格"
                            : ""
                        }
                    </Typography>
                </TableCell>
            </TableRow>
        )
    }

    const renderDurabilityRebate = () => {
        if(props.durabilities.length === 0) return null;
        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>耐久消費素材の残価値</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography color={(durabilityData.hasUnknown) ? "error" : "textPrimary"}>
                    {numDeform(durabilityData.money)}
                    {(durabilityData.hasUnknown)
                        ? " + 未設定価格"
                        : ""
                    }
                    </Typography>
                </TableCell>
            </TableRow>
        )
    }

    const renderResultUnitCost = () => {
        const hasUnknown = materialData.hasUnknown || byproductData.hasUnknown || surplusData.hasUnknown || durabilityData.hasUnknown;
        const totalCost  = materialData.money - byproductData.money - surplusData.money - durabilityData.money;
        const unitCost = totalCost / props.creations[0].作成個数;
        return (
            <TableRow>
                <TableCell component="th"><Typography>単価</Typography></TableCell>
                <TableCell align="right">
                    <Typography color={(hasUnknown) ? "error" : "textPrimary"}>
                    {numDeform(unitCost)}
                    {(hasUnknown)
                        ? " + 未設定価格"
                        : ""
                    }
                    </Typography>
                </TableCell>
            </TableRow>
        )
    }

    const handleAccordionChange = () => {
        setDisplay((! display));
    }

    return (
        <Accordion
            expanded={display}
            onChange={handleAccordionChange}>
            <AccordionSummary
                className={childrenStyles.accordionTitleStyle}
                expandIcon={<ExpandMoreIcon />}
                >
                生産概要
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer
                    component={Paper}
                    className={classes.TableRoot}>
                    <Table>
                        <TableBody>
                            {renderRecipeName()}
                            {renderCreateCount()}
                            {renderNeedSkills()}
                            {renderNeedRecipe()}
                            {renderMaterialCost()}
                            {renderByproductRebate()}
                            {renderSurplusRebate()}
                            {renderDurabilityRebate()}
                            {renderResultUnitCost()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    )

}

export default ResultSummarySection;
