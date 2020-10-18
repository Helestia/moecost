import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import CheckBox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
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

export type tSeriesSelectItems = {
    レシピ名 : string,
    生成アイテム : string[]
}

type seriesRecipeSelectProps = {
    seriesObj : moecost.JSON.seriesCreationItems,
    rtnFunc : (rtnFuncProps:tSeriesSelectItems) => void
}
type tItemList = {
    アイテム:string,
    接頭:string,
    checked:boolean
}

export const SeriesRecipeSelect:React.FC<seriesRecipeSelectProps> = (props) => {
    const [recipe,setRecipe] = React.useState("");
    const [itemList,setItemList] = React.useState<tItemList[]>([])

    if(props.seriesObj.シリーズ名 !== recipe){
        setRecipe(props.seriesObj.シリーズ名);
        const il = props.seriesObj.アイテム一覧.map(i => {return {アイテム:i.アイテム,接頭:i.接頭,checked:true}});
        setItemList(il);
    }
    // onChange
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const i = itemList.findIndex(i => {return i.アイテム === e.target.name});
        if(i !== -1){
            const result = itemList.concat();
            result[i].checked = e.target.checked;
            setItemList(result);
        }
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
    const renderCheckBox = itemList.map((item,index) => {
        const label = "[" + item.接頭 + "]" + item.アイテム
        return (
            <FormControlLabel
                key={index}
                control={<CheckBox color="primary" checked={item.checked} onChange={handleChange} name={item.アイテム} />}
                label={label} />
        )
    })

    // 送信ボタンの有効・無効化
    const isSubmitDurable = itemList.every(item => {return item.checked === false});
    return (
        <div style={styles.box}>
            <form onSubmit={handleOnSubmit}>
                    <FormLabel>シリーズ一括生産・対象アイテム選択</FormLabel>
                    <FormGroup>
                        {renderCheckBox}
                    </FormGroup>
                <Button color="primary" variant="outlined" type="submit" disabled={isSubmitDurable}>
                        選択完了
                </Button>
            </form>
        </div>
    )
}

export default SeriesRecipeSelect;