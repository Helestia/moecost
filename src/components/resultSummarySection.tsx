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
    },initialData);

    // 副産物合計
    const byproductData = props.byproducts.reduce((a,c) => {
        if(c.価格設定有) a.money += c.合計金額;
        else a.hasUnknown = true;
        return a;
    },initialData);

    // 余剰作成品合計
    const surplusData = props.surpluses.reduce((a,c) => {
        if(c.未設定含) a.hasUnknown = true;
        a.money += c.余り合計金額;
        return a;
    },initialData);

    // 耐久消費素材の残価値
    const durabilityData = props.durabilities.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        if(c.調達方法 === "作成" && c.未設定含) a.hasUnknown = true;
        if(c.調達方法 !== "未設定") a.money += c.合計価格 - c.耐久割金額;
        return a;
    },initialData)

    const renderRecipeName = () => (
        <>
            <ListItem>
                <ListItemText
                    primary="レシピ名"
                    secondary={props.recipeName}
                    secondaryTypographyProps={{align:"right", color:"textPrimary"}}
                    />
            </ListItem>
            <Divider component="li" />
        </>
    );

    const renderCreateCount = () => (
        <>
            <ListItem>
                <ListItemText
                    primary="作成個数"
                    secondary={numDeform(props.creations[0].作成個数)}
                    secondaryTypographyProps={{align:"right",color:"textPrimary"}} 
                    onClick={props.openConfigCreateNumberDialog}
                    className={childrenStyles.activeStrings}
                />
            </ListItem>
            <Divider component="li" />
        </>
    );
    
    const renderNeedSkills = () => (
        <>
            <ListItem>
                <ListItemText
                    primary="必要スキル"
                    secondary={props.skills.map(skill => 
                        skill.スキル名 + ":" + (numDeform(skill.スキル値))).join(" / ")}
                    secondaryTypographyProps={{align:"right", color:"textPrimary"}}
                />
            </ListItem>
            <Divider component="li" />
        </>
    );
    
    const renderNeedRecipe = () => {
        if(props.needRecipe.length === 0) return null;
        return (
            <>
                <ListItem>
                    <ListItemText 
                        primary="必要レシピ"
                        secondary={props.needRecipe.join(" / ")}
                        secondaryTypographyProps={{align:"right", color:"textPrimary"}}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        );
    }

    const renderMaterialCost = () => (
        <>
            <ListItem>
                <ListItemText
                    primary="材料費合計"
                    secondary={numDeform(materialData.money) + (materialData.hasUnknown) ? " + 未設定価格" : ""}
                    secondaryTypographyProps={{align:"right", color:(materialData.hasUnknown) ? "error" : "textPrimary"}}
                />
            </ListItem>
        </>
    )


    const renderByproductRebate = () => {
        if(props.byproducts.length === 0) return null;
        return (
            <>
                <ListItem>
                    <ListItemText
                        primary="副産物価格"
                        secondary={numDeform(byproductData.money) + (byproductData.hasUnknown) ? " + 未設定価格" : ""}
                        secondaryTypographyProps={{align:"right", color:(byproductData.hasUnknown) ? "error" : "textPrimary"}}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        );
    }

    const renderSurplusRebate = () => {
        if(props.surpluses.length === 0) return null;
        return (
            <>
                <ListItem>
                    <ListItemText
                        primary="余剰生産価格"
                        secondary={numDeform(surplusData.money) + (surplusData.hasUnknown) ? " + 未設定価格" : ""}
                        secondaryTypographyProps={{align:"right", color:(surplusData.hasUnknown) ? "error" : "textPrimary"}}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        )
    }

    const renderDurabilityRebate = () => {
        if(props.durabilities.length === 0) return null;
        return (
            <>
                <ListItem>
                    <ListItemText
                        primary="耐久消費素材の残価値"
                        secondary={numDeform(durabilityData.money) + (durabilityData.hasUnknown) ? " + 未設定価格" : ""}
                        secondaryTypographyProps={{align:"right", color:(durabilityData.hasUnknown) ? "error" : "textPrimary"}}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        )
    }

    const renderResultUnitCost = () => {
        const hasUnknown = materialData.hasUnknown || byproductData.hasUnknown || surplusData.hasUnknown || durabilityData.hasUnknown;
        const totalCost  = materialData.money - byproductData.money - surplusData.money - durabilityData.money;
        const unitCost = totalCost / props.creations[0].作成個数;
        return (
            <>
                <ListItem>
                    <ListItemText
                        primary="単価"
                        secondary={numDeform(unitCost) + (hasUnknown) ? " ± 未設定価格" : ""}
                        secondaryTypographyProps={{align:"right", color:(hasUnknown) ? "error" : "textPrimary"}}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        )
    }

    const handleAccordionChange = () => {
        setDisplay((! display));
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
                        {renderRecipeName()}
                        {renderCreateCount()}
                        {renderNeedSkills()}
                        {renderNeedRecipe()}
                        {renderMaterialCost()}
                        {renderByproductRebate()}
                        {renderSurplusRebate()}
                        {renderDurabilityRebate()}
                        {renderResultUnitCost()}
                    </List>
                </AccordionDetails>

            </Accordion>
        </>

    )

}

export default ResultSummarySection;
