import React from 'react';
import ResultAlertSection from './resultAlertSection';
import ResultSummarySection from './resultSummarySection';
import ResultCostSheet from './ResultCostSheet';
import ResultCreationTree from './resultCreationTree';

import {tSearchSectionRtnFuncProps} from './searchSection';
import buildTree, {tQtyRole,tQtyRoleResult} from '../scripts/buildTree';
import confirmMessages from '../scripts/confirmMessages';
import makeListArrayFromTree from '../scripts/makeListArrayFromTree';

import moecostDb, { iDictionary } from '../scripts/storage';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import ResultConfigCreateNumberDialog from './resultConfigCreateNumberDialog';

interface iResultSectionProps {
    searched: tSearchSectionRtnFuncProps
}

    // 子要素で共通するスタイル情報
const useChildrenStyles = makeStyles((theme:Theme) => 
    createStyles({
        accordionTitleStyle : {
            fontSize: theme.typography.h6.fontSize,
            '&:hover': {
                backgroundColor : theme.palette.action.hover
            }
        },
        activeStrings : {
            '&:hover': {
                backgroundColor : theme.palette.action.hover,
                cursor: "pointer"
            }
        }
    })
);



const ResultSection:React.FC<iResultSectionProps> = (props) => {
    const [beforeSearch,setBeforeSearch] = React.useState<tSearchSectionRtnFuncProps>(props.searched);

    const [createNumber, setCreateNumber] = React.useState(0);
    const [surplusCalcRoute,setSurplusCalcRoute] = React.useState<tQtyRole>(undefined);
    const [userDictionary,setUserDictionary] = React.useState<iDictionary|undefined>(undefined);
    const [isOpenConfigCreateNumberDialog,setIsOpenConfigCreateNumberDialog] = React.useState(false);

    const [isOpenConfigItemDialog,setIsOpenConfigItemDialog] = React.useState(false);
    const [configItemDialogTarget,setConfigItemDialogTarget] = React.useState("");

    // 空入力時
    if(props.searched === undefined){
        if(beforeSearch !== undefined){
            setBeforeSearch(undefined);
        }
        return null;
    }

    // 以下、ダイアログ対応
    
    // ====== 作成数変更ダイアログ
    const openConfigCreateNumberDialog = () => {
        setIsOpenConfigCreateNumberDialog(true);
    }

    // 回答受信
    const changeTriggerCreateNumber = (number:number, route:tQtyRoleResult) => {
        setCreateNumber(number);
        setSurplusCalcRoute(route);
        setIsOpenConfigCreateNumberDialog(false);
    }
    // 閉じるだけ
    const closeConfigCreateNumberDialog = () => {
        setIsOpenConfigCreateNumberDialog(false);
    }

    // ====== アイテム情報の表示・変更ダイアログ
    const openConfigItemDialog = (itemName:string) => {
        /*
        setConfigItemDialogTarget(itemName);
        setIsOpenConfigItemDialog(true);
        */
       console.log(itemName);
    }
    // 辞書情報変更
    const changeTriggerItem = () => {
        setUserDictionary(moecostDb.辞書);
        setIsOpenConfigItemDialog(false);
    }

    // 閉じるだけ
    const closeConfigItemDialog = () => {
        setConfigItemDialogTarget("");
        setIsOpenConfigItemDialog(false);
    }

    // 初期設定
    // レシピ入力時は初期設定後に再度実行する
    if(JSON.stringify(props.searched) !== JSON.stringify(beforeSearch)){
        setUserDictionary(moecostDb.辞書);
        setSurplusCalcRoute(undefined);
        setCreateNumber(0);
        setBeforeSearch(props.searched);
/*
        return (
            <>
                <ResultSummarySection
                    isInitialize={true}
                    recipeName={""}
                    creations={[]}
                    materials={[]}
                    surpluses={[]}
                    byproducts={[]}
                    durabilities={[]}
                    skills={[]}
                    needRecipe={[]}
                    useChildrenStyles={useChildrenStyles}
                    openConfigCreateNumberDialog={openConfigCreateNumberDialog} />
                <ResultCostSheet
                    isInitialize={true}
                    materials={[]}
                    durabilities={[]}
                    surpluses={[]}
                    byproducts={[]}
                    creations={[]}
                    useChildrenStyles={useChildrenStyles}
                    handleItemClick={openConfigItemDialog} />
                <ResultCreationTree
                    isInitialize={true}
                    main={[]}
                    common={[]}
                    useChildrenStyles={useChildrenStyles}
                    handleItemClick={openConfigItemDialog} />
            </>
        )
*/
        return null;
    }

    // 生産ツリー構築
    const treesAndQuantities = buildTree(props.searched, userDictionary, surplusCalcRoute, createNumber);
    console.log(treesAndQuantities);
    if(treesAndQuantities.message.length !== 0) return (
        <ResultAlertSection messages={treesAndQuantities.message} />
    );
    const messages = confirmMessages(treesAndQuantities.main, treesAndQuantities.common, createNumber);
    
    const lists = makeListArrayFromTree(treesAndQuantities.main, treesAndQuantities.common);

    return (
        <>
            <ResultAlertSection messages={messages} />
            <ResultSummarySection
                isInitialize={false}
                recipeName={props.searched.レシピ名}
                creations={lists.最終作成物}
                materials={lists.材料}
                surpluses={lists.余剰作成}
                byproducts={lists.副産物}
                durabilities={lists.耐久消費}
                skills={lists.スキル}
                needRecipe={lists.要レシピ}
                useChildrenStyles={useChildrenStyles}
                openConfigCreateNumberDialog={openConfigCreateNumberDialog} />

            <ResultCostSheet
                isInitialize={false}
                materials={lists.材料}
                durabilities={lists.耐久消費}
                surpluses={lists.余剰作成}
                byproducts={lists.副産物}
                creations={lists.最終作成物}
                useChildrenStyles={useChildrenStyles}
                handleItemClick={openConfigItemDialog} />

            <ResultCreationTree
                isInitialize={false}
                main={treesAndQuantities.main}
                common={treesAndQuantities.common}
                useChildrenStyles={useChildrenStyles}
                handleItemClick={openConfigItemDialog}
            />

            {/*ダイアログ関係*/}
            <ResultConfigCreateNumberDialog 
                isOpen={isOpenConfigCreateNumberDialog}
                number={treesAndQuantities.totalQuantity}
                minimumNumber={treesAndQuantities.fullyMinimumQuantity}
                route={treesAndQuantities.qtyRoluResult}
                close={closeConfigCreateNumberDialog}
                changeTrigger={changeTriggerCreateNumber} />
            
        </>
    )
} 

export default ResultSection;
