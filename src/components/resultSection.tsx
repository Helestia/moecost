import React from 'react';
import {tSearchSectionRtnFuncProps} from './searchSection';
// import calc from '../scripts/calc';
import moecostDb, { iDictionary } from '../scripts/storage'

interface iResultSectionProps {
    searched: tSearchSectionRtnFuncProps
}



const ResultSection:React.FC<iResultSectionProps> = (props) => {
    const [beforeSearch,setBeforeSearch] = React.useState<tSearchSectionRtnFuncProps>(props.searched)
    const [createCount, setCreateCount] = React.useState(0);
    const [noStackCalcRoute,setNoStackCalcRoute] = React.useState(null)
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
        setNoStackCalcRoute(null);
        setCreateCount(0);
        setBeforeSearch(props.searched);
        return null;
    }
    // 計算処理
//    const calcResult = calc(prop, userDictionary, noStackCalcRoute, createCount );

    return (
        <>
            {JSON.stringify(props.searched)}
        </>
    )
} 

export default ResultSection;