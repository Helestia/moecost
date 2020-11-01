import React from 'react'
import {tJSON_seriesCreationItem} from '../scripts/jsonReader'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import CheckBox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

export type tSeriesSelectItems = {
    レシピ名 : string,
    生成アイテム : string[]
}

type seriesRecipeSelectProps = {
    seriesObj : tJSON_seriesCreationItem,
    rtnFunc : (rtnFuncProps:tSeriesSelectItems) => void
}
type tItemList = {
    アイテム:string,
    接頭:string,
    checked:boolean
}

const definedStyles = makeStyles({
    cord : {
        marginLeft: 10,
        marginTop:10,
        padding: 10,
        width:440
    },
    title : {
        fontSize:16
    },
    form : {
        display: "flex",
        flexDirection: "column"
    },
    button : {
        marginTop:15,
        marginleft:15
    }
});

export const SeriesRecipeSelect:React.FC<seriesRecipeSelectProps> = (props) => {
    const [recipe,setRecipe] = React.useState("");
    const [itemList,setItemList] = React.useState<tItemList[]>([]);

    const classes = definedStyles();

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
            <>
                <FormControlLabel
                    key={index}
                    control={<CheckBox color="primary" checked={item.checked} onChange={handleChange} name={item.アイテム} />}
                    label={label}
                    style={{display:"inline-block"}} /><br />
            </>
        )
    })

    // 送信ボタンの有効・無効化
    const isSubmitDurable = itemList.every(item => {return item.checked === false});
    return (
        <Card className={classes.cord}>
            <form onSubmit={handleOnSubmit} className={classes.form}>
                <FormLabel className={classes.title}>シリーズ一括生産・対象アイテム選択</FormLabel>
                <FormGroup style={{display:"inline-block"}}>
                    {renderCheckBox}
                </FormGroup>
                <Button className={classes.button} color="primary" variant="text" type="submit" disabled={isSubmitDurable}>
                        選択完了
                </Button>
            </form>
        </Card>
    )
}

export default SeriesRecipeSelect;
