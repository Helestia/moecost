import React from 'react';
import {tSearchSectionRtnFuncProps} from './searchSection';
import calc, {tNoStackCalcRoute} from '../scripts/calc';
import moecostDb, { iDictionary } from '../scripts/storage';
import {Alert, AlertTitle} from '@material-ui/lab'


interface iResultSectionProps {
    searched: tSearchSectionRtnFuncProps
}

const ResultSection:React.FC<iResultSectionProps> = (props) => {
    const [beforeSearch,setBeforeSearch] = React.useState<tSearchSectionRtnFuncProps>(props.searched)
    const [createCount, setCreateCount] = React.useState(0);
    const [noStackCalcRoute,setNoStackCalcRoute] = React.useState<tNoStackCalcRoute>(undefined)
    const [userDictionary,setUserDictionary] = React.useState<iDictionary|undefined>(undefined)

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
        setNoStackCalcRoute(undefined);
        setCreateCount(0);
        setBeforeSearch(props.searched);
        return null;
    }
    // 計算処理
    const calcResult = calc(props.searched, userDictionary, noStackCalcRoute, createCount );
    const criticalErrorIndex = calcResult.メッセージ.findIndex(m => m.重大度 === "Critical");
    if(criticalErrorIndex !== -1){
        return (
            <>
                <Alert severity="error">
                    <AlertTitle>例外による処理中断</AlertTitle>
                    {calcResult.メッセージ[criticalErrorIndex].メッセージ}
                </Alert>
                {JSON.stringify(calcResult)}
            </>
        )
    }

    return (
        <>
            {JSON.stringify(calcResult)}
        </>
    )
} 

export default ResultSection;