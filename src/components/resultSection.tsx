import React from 'react';
import ResultAlertSection from './resultAlertSection';
import ResultSummarySection from './resultSummarySection'

import {tSearchSectionRtnFuncProps} from './searchSection';
import calc, {tNoStackCalcRoute,tNoStackCalcRouteResult} from '../scripts/calc';
import moecostDb, { iDictionary } from '../scripts/storage';
import makeStyles from '@material-ui/styles/makeStyles';
import {useTheme} from '@material-ui/core/styles';

interface iResultSectionProps {
    searched: tSearchSectionRtnFuncProps
}


const ResultSection:React.FC<iResultSectionProps> = (props) => {
    const [beforeSearch,setBeforeSearch] = React.useState<tSearchSectionRtnFuncProps>(props.searched)
    const [createCount, setCreateCount] = React.useState(0);
    const [noStackCalcRoute,setNoStackCalcRoute] = React.useState<tNoStackCalcRoute>(undefined)
    const [userDictionary,setUserDictionary] = React.useState<iDictionary|undefined>(undefined)
    const theme = useTheme();

    // 空入力時
    if(props.searched === undefined){
        if(beforeSearch !== undefined){
            setBeforeSearch(undefined);
        }
        return null;
    }

    // 子要素で共通するスタイル情報
    const useChildrenStyles = makeStyles({
        accordionTitleStyle : {
            fontSize: theme.typography.h5.fontSize,
            '&:hover': {
                backgroundColor : theme.palette.action.hover
            }
        },
        activeStrings : {
            '&:hover': {
                backgroundColor : theme.palette.action.hover
            }
        }
    });

    // 初期設定
    // レシピ入力時は初期設定後に再度実行する
    if(JSON.stringify(props.searched) !== JSON.stringify(beforeSearch)){
        setUserDictionary(moecostDb.辞書);
        setNoStackCalcRoute(undefined);
        setCreateCount(0);
        setBeforeSearch(props.searched);
        return null;
    }
    // 計算処理
    const calcResult = calc(props.searched, userDictionary, noStackCalcRoute, createCount );
    const summalySectionReturnFunc = (number:number, surplusCalcRoute:tNoStackCalcRouteResult) => {
        if(createCount !== number){
            setCreateCount(number);
        }
        if(surplusCalcRoute !== noStackCalcRoute){
            setNoStackCalcRoute(surplusCalcRoute);
        }
    };




    return (
        <>
            <ResultAlertSection messages={calcResult.メッセージ} />
            <ResultSummarySection
                recipeName={props.searched.レシピ名}
                mainTrees={calcResult.生産ツリー}
                commonTrees={calcResult.共通材料ツリー}
                minimumNumber={calcResult.生産個数.余剰なし最小生産個数}
                surplusCalcRoute={calcResult.生産個数.余剰対応}
                useChildrenStyles={useChildrenStyles}
                returnFunc={summalySectionReturnFunc} />
            {JSON.stringify(calcResult)}
        </>
    )
} 

export default ResultSection;