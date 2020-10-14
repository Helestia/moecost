import React,{FormEvent, useState} from 'react'
import {moecost} from '../types/app'

// css styles
type tStyles = {
    box? : React.CSSProperties,
    listUl? : React.CSSProperties,
    listLi? : React.CSSProperties,
    checkbox? : React.CSSProperties,
    label? : React.CSSProperties
}

const styles:tStyles = {
    box : {
        borderWidth : "3px",
    },
    listUl : {
        listStyle : "none"
    }
}



type rtnFuncProps = {
    レシピ名 : string,
    生成アイテム : string[]
}

type seriesRecipeSelectProps = {
    seriesObj : moecost.JSON.seriesCreationItems,
    rtnFunc : (rtnFuncProps:rtnFuncProps) => void
}

export const SeriesRecipeSelect:React.FC<seriesRecipeSelectProps> = (props) => {
    const itemListDef = props.seriesObj.アイテム一覧.map(item => {
        return {
            アイテム : item.アイテム,
            接頭 : item.接頭,
            checked : true}
    });
    const [itemList,setItemList] = useState(itemListDef);

    // onChange
    const renderCheckBoxRtnFunc = (index:number,checked:boolean) =>{
        const newItemList = Array.from(itemList);
        newItemList[index].checked = checked;
        setItemList(newItemList);
    }
    // onSubmit
    const handleOnSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        const rtnArray = itemList.filter(item=>{return item.checked}).map(item=>{return item.アイテム})
        props.rtnFunc({
            レシピ名 : props.seriesObj.シリーズ名,
            生成アイテム : rtnArray
        });
        
        event.preventDefault();
    }

    const renderLi = itemList.map((item,index) => {
        const renderCheckBoxProps = {
            index : index,
            checked : item.checked,
            rtnFunc : renderCheckBoxRtnFunc
        }
        return (
            <li key={index}>
                <label>
                    {RenderCheckBox(renderCheckBoxProps)}
                    [{item.接頭}]{item.アイテム}
                </label>
            </li>
        );
    });
    // 送信ボタンの有効・無効化
    const isSubmitDurable = itemList.every(item => {return item.checked === false});
    return (
        <div style={styles.box}>
            <form onSubmit={handleOnSubmit}>
                <ul style={styles.listUl}>
                    {renderLi}
                </ul>
                <input type="submit" value="計算" disabled={isSubmitDurable} />
            </form>
        </div>
    )
}

interface renderCheckBoxProps {
    index : number,
    checked : boolean
    rtnFunc : (index : number, checked : boolean) => void
}
const RenderCheckBox:React.FC<renderCheckBoxProps> = (props) => {
    const handleOnChange = () => {
        const rtnChecked = props.checked ? false : true;
        props.rtnFunc(props.index, rtnChecked);
    }
    return (
        <input type="checkbox" checked={props.checked}　onChange={handleOnChange} />
    )
}