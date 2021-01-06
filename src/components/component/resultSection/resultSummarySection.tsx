import React from 'react';
import {
    tByproduct,
    tCreation,
    tDurability,
    tMaterial,
    tSurplus,
    tSkill
} from '../../../scripts/makeListArrayFromTree'
import {numDeform, cloneObj_JSON} from '../../../scripts/common';

import Accordion     from '../../commons/accordion/accordion';
import useStyleHover from '../../commons/styles/useStyleHover';

import TableContainer    from '@material-ui/core/TableContainer';
import Table             from '@material-ui/core/Table';
import TableBody         from '@material-ui/core/TableBody';
import TableCell         from '@material-ui/core/TableCell';
import Typography        from '@material-ui/core/Typography';
import Tooltip           from '@material-ui/core/Tooltip';
import Paper             from '@material-ui/core/Paper';
import makeStyles        from '@material-ui/styles/makeStyles';
import { TableRow } from '@material-ui/core';

const useStyles = makeStyles({
    TableRoot: {
        width: "100%",
        maxWidth: "550px"
    },
    strikeOut: {
        textDecorationLine: "line-through"
    }
});

type tResultSummarySectionProps = {
    isExpanded: boolean,
    recipeName: string,
    creations: tCreation[],
    materials: tMaterial[],
    surpluses: tSurplus[],
    byproducts: tByproduct[],
    durabilities: tDurability[],
    skills: tSkill[],
    needRecipes: string[],
    handleExpand: () => void,
    changeNotTargetSurpluses : (newItems:string[]) => void,
    changeNotTargetByproducts : (newItems:string[]) => void,
    handleOpenQtyDialog: () => void
}
const ResultSummarySection:React.FC<tResultSummarySectionProps> = (props) => {
    const classes = useStyles();
    const classHover = useStyleHover();

    // 各フィールドで表示する情報の取得
    type tData = {
        money:number,
        hasUnknown:boolean
    }
    const initialData:tData = {
        money:0,
        hasUnknown:false
    }

    type tDataHasStrike = {
        hasStrike: boolean,
        nonStrike: tData,
        Strike: tData
    }
    const initialDataHasStrike = {
        hasStrike: false,
        nonStrike: cloneObj_JSON(initialData),
        strike: cloneObj_JSON(initialData)
    }

    // 材料費合計
    const materialData = props.materials.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        else a.money += c.合計金額;
        return a;
    }, cloneObj_JSON(initialData));

    // 副産物合計
    const byproductData = props.byproducts.reduce((a,c) => {
        if(c.計算対象外) a.hasStrike = true;
        if(c.価格設定有) {
            a.nonStrike.money += c.合計金額;
            if(! c.計算対象外) a.strike.money += c.合計金額;
        }
        else {
            a.nonStrike.hasUnknown = true;
            if(! c.計算対象外) a.strike.hasUnknown = true;
        }
        return a;
    }, cloneObj_JSON(initialDataHasStrike));

    // 余剰作成品合計
    const surplusData = props.surpluses.reduce((a,c) => {
        if(c.計算対象外) a.hasStrike = true;
        if(c.余り合計金額) {
            a.nonStrike.money += c.余り合計金額;
            if(! c.計算対象外) a.strike.money += c.余り合計金額;
        }
        if(c.未設定含) {
            a.nonStrike.hasUnknown = true;
            if(! c.計算対象外) a.strike.hasUnknown = true;
        }
        return a;
    }, cloneObj_JSON(initialDataHasStrike));

    // 耐久消費素材の残価値
    const durabilityData = props.durabilities.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        if(c.調達方法 === "作成" && c.未設定含) a.hasUnknown = true;
        if(c.調達方法 !== "未設定") a.money += c.合計価格 - c.耐久割金額;
        return a;
    }, cloneObj_JSON(initialData));

    const handleToggleNotTargetSurplus = () => {
        const testAllTrue  = props.surpluses.every(s => s.計算対象外 === true);
        if(testAllTrue) props.changeNotTargetSurpluses([]);
        else props.changeNotTargetSurpluses(props.surpluses.map(s => s.アイテム名));
    }

    const handleToggleNotTargetByproduct = () => {
        const testAllTrue  = props.byproducts.every(s => s.計算対象外 === true);
        if(testAllTrue) props.changeNotTargetByproducts([]);
        else props.changeNotTargetByproducts(props.byproducts.map(s => s.アイテム名));
    }




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
                className={classHover.hover}
                onClick={props.handleOpenQtyDialog}>
                <TableCell component="th">
                    <Typography>作成個数</Typography>
                </TableCell>
                <TableCell align="right"><Typography>{numDeform(props.creations[0].作成個数)}</Typography></TableCell>
            </TableRow>
        </Tooltip>
    );
    
    const renderNeedSkills = () => {
        const renderText = props.skills.map(skill => skill.スキル名 + ":" + (numDeform(skill.スキル値))).join(" / ");
        const renderJSX = (() => {
            if(renderText.length > 20) return (
                <Typography>
                    {renderText.split(" / ").map((s,i) => {
                        if(i === 0) return <>{s}</>
                        return <><br />{s}</>
                    })}
                </Typography>
            );
            return (
                <Typography>{renderText}</Typography>
            );
        })();

        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>必要スキル</Typography>
                </TableCell>
                <TableCell>{renderJSX}</TableCell>
            </TableRow>
        )
    };
    
    const renderneedRecipes = () => {
        if(props.needRecipes.length === 0) return null;
        const needRecipesText = props.needRecipes.join(" / ");
        const renderJSX = (() => {
            if(needRecipesText.length > 20) return (
                <Typography>
                    {needRecipesText.split(" / ").map((r,i) => {
                        if(i === 0) return <>{r}</>
                        return <><br />{r}</>
                    })}
                </Typography>
            );
            return (
                <Typography>{needRecipesText}</Typography>
            );
        })();

        return (
            <TableRow>
                <TableCell component="th">
                    <Typography>必要レシピ</Typography>
                </TableCell>
                <TableCell>{renderJSX}</TableCell>
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
            <TableRow
                onClick={handleToggleNotTargetByproduct}
                className={classHover.hover}>
                <TableCell component="th">
                    <Typography>副産物価格</Typography>
                </TableCell>
                <TableCell
                    align="right">
                    {(byproductData.hasStrike)
                        ? <Typography
                            color={(byproductData.nonStrike.hasUnknown) ? "error" : "textPrimary"}
                            className={classes.strikeOut}>
                            {(byproductData.nonStrike.hasUnknown)
                                ? numDeform(byproductData.nonStrike.money) + " + 未設定価格"
                                : numDeform(byproductData.nonStrike.money)}
                        </Typography>
                        : null
                    }
                    <Typography
                        color={(byproductData.strike.hasUnknown) ? "error" : "textPrimary"}>
                        {(byproductData.strike.hasUnknown)
                            ? numDeform(byproductData.strike.money) + " + 未設定価格"
                            : numDeform(byproductData.strike.money)
                        }
                    </Typography>
                </TableCell>
            </TableRow>
        );
    }

    const renderSurplusRebate = () => {
        if(props.surpluses.length === 0) return null;
        return (
            <TableRow
                onClick={handleToggleNotTargetSurplus}
                className={classHover.hover}>
                <TableCell component="th">
                    <Typography>余剰生産価格</Typography>
                </TableCell>
                <TableCell
                    align="right">
                    {(surplusData.hasStrike)
                        ? <Typography
                            color={(surplusData.nonStrike.hasUnknown) ? "error" : "textPrimary"}
                            className={classes.strikeOut}>
                            {(surplusData.nonStrike.hasUnknown)
                                ? numDeform(surplusData.nonStrike.money) + " ± 未設定価格"
                                : numDeform(surplusData.nonStrike.money)
                            }
                        </Typography>
                        : null
                    }
                    <Typography color={(surplusData.strike.hasUnknown) ? "error" : "textPrimary"}>
                        {(surplusData.strike.hasUnknown)
                            ? numDeform(surplusData.strike.money) + " ± 未設定価格"
                            : numDeform(surplusData.strike.money)
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
        const hasUnknown = materialData.hasUnknown || byproductData.strike.hasUnknown || surplusData.strike.hasUnknown || durabilityData.hasUnknown;
        const totalCost  = materialData.money - byproductData.strike.money - surplusData.strike.money - durabilityData.money;
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

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
            summary="概要"
        >
            <TableContainer
                component={Paper}
                className={classes.TableRoot}>
                <Table>
                    <TableBody>
                        {renderRecipeName()}
                        {renderCreateCount()}
                        {renderNeedSkills()}
                        {renderneedRecipes()}
                        {renderMaterialCost()}
                        {renderByproductRebate()}
                        {renderSurplusRebate()}
                        {renderDurabilityRebate()}
                        {renderResultUnitCost()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Accordion>
    )
}

export default ResultSummarySection;
