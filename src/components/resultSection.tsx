import React from 'react';
import ResultAlertSection from './resultAlertSection';
import ResultSummarySection from './resultSummarySection';
import ResultCreationItemTable from './resultCreationItemTable';

import {tSearchSectionRtnFuncProps} from './searchSection';
import buildTree from '../scripts/buildTree';
import confirmMessages from '../scripts/confirmMessages';
import makeListArrayFromTree from '../scripts/makeListArrayFromTree';

import calc, {tNoStackCalcRoute} from '../scripts/calc';
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
            fontSize: theme.typography.h5.fontSize,
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
    const [beforeSearch,setBeforeSearch] = React.useState<tSearchSectionRtnFuncProps>(props.searched)
    const [createNumber, setCreateNumber] = React.useState(0);
    const [surplusCalcRoute,setSurplusCalcRoute] = React.useState<tNoStackCalcRoute>(undefined);
    const [userDictionary,setUserDictionary] = React.useState<iDictionary|undefined>(undefined);
    const [isOpenConfigCreateNumberDialog,setIsOpenConfigCreateNumberDialog] = React.useState<boolean>(false);

    // 空入力時
    if(props.searched === undefined){
        if(beforeSearch !== undefined){
            setBeforeSearch(undefined);
        }
        return null;
    }



    // 初期設定
    // レシピ入力時は初期設定後に再度実行する
    if(JSON.stringify(props.searched) !== JSON.stringify(beforeSearch)){
        setUserDictionary(moecostDb.辞書);
        setSurplusCalcRoute(undefined);
        setCreateNumber(0);
        setBeforeSearch(props.searched);
        return null;
    }

    // 以下、ダイアログ対応
    const openConfigCreateNumberDialog = () => {
        setIsOpenConfigCreateNumberDialog(true);
    }

    // 回答受信
    const changeTriggerCreateNumber = (number:number, route:tNoStackCalcRoute) => {
        setCreateNumber(number);
        setSurplusCalcRoute(route);
        setIsOpenConfigCreateNumberDialog(false);
    }
    // 閉じるだけ
    const closeConfigCreateNumberDialog = () => {
        setIsOpenConfigCreateNumberDialog(false);
    }
    // 生産ツリー構築
    const calcResult = calc(props.searched, userDictionary, surplusCalcRoute, createNumber );

    return (
        <>
            <ResultAlertSection messages={calcResult.メッセージ} />
            <ResultSummarySection
                recipeName={props.searched.レシピ名}
                mainTrees={calcResult.生産ツリー}
                commonTrees={calcResult.共通材料ツリー}
                useChildrenStyles={useChildrenStyles}
                openConfigCreateNumberDialog={openConfigCreateNumberDialog} />
            <ResultCreationItemTable 
                mainTrees={calcResult.生産ツリー}
                commonTrees={calcResult.共通材料ツリー}
                useChildrenStyles={useChildrenStyles} />
            





            {/*ダイアログ関係*/}
            <ResultConfigCreateNumberDialog 
                isOpen={isOpenConfigCreateNumberDialog}
                number={calcResult.生産個数.個数}
                minimumNumber={calcResult.生産個数.余剰なし最小生産個数}
                route={calcResult.生産個数.余剰対応}
                close={closeConfigCreateNumberDialog}
                changeTrigger={changeTriggerCreateNumber} />

            {/*ここからテスト用*/}
            {JSON.stringify(calcResult)}
        </>
    )
} 

export default ResultSection;