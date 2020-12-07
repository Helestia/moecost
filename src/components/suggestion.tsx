import React from 'react';
import AutoComplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import moecostDb from '../scripts/storage';
import {numDeform} from '../scripts/common'

// suggestion情報
export type tSuggestion = {
    "レシピ名":string,
    "シリーズレシピ" : boolean
}

const defSuggestion : tSuggestion = {
    "レシピ名" : "",
    "シリーズレシピ" : false
}

// props Interface
interface iSuggestionAreaProps {
    allSuggestions : tSuggestion[]
    rtnFunc : (suggestion?:tSuggestion) => void
}

export const SuggestionArea:React.FC<iSuggestionAreaProps> = (props) => {
    const [value,setValue] = React.useState<tSuggestion>(defSuggestion);
    const [strValue,setStrValue] = React.useState("");

    const allSuggestions = [defSuggestion].concat(props.allSuggestions);

    const helperText = (moecostDb.アプリ設定.表示設定.検索候補表示数 === 0)
        ? <>現在の設定上、検索候補数の上限なしです。<br />動作が重い場合はアプリメニューから候補数を絞ってください。</>
        : <>現在の設定上、{numDeform(moecostDb.アプリ設定.表示設定.検索候補表示数)}件でレシピ検索を終了します。<br />左上のメニューのアプリ設定から変更が可能です。</>

    const filterOptions = createFilterOptions<tSuggestion>({
        limit: (moecostDb.アプリ設定.表示設定.検索候補表示数 === 0)
            ? undefined
            : moecostDb.アプリ設定.表示設定.検索候補表示数
    });

    const handleChange : (e:React.ChangeEvent<{}>,val:tSuggestion|null) => void = (e,val) => {
        if(val === null){
            setValue(defSuggestion);
            props.rtnFunc(undefined);
        } else {
            setValue(val);
            props.rtnFunc(val)
        }
    }

    const renderOptionFunc = (option:tSuggestion) => {
        if (option.レシピ名 === "") return (<div className="suggestion">未選択</div>);
        const reg = new RegExp("^(.*)(" + strValue + ")(.*)$");
        const matches = option.レシピ名.match(reg);
        const displayLabel = matches 
            ? <>{matches[1]}<b>{matches[2]}</b>{matches[3]}</> 
            : <>{option.レシピ名}</>
        if(option.シリーズレシピ) return <div>[セット]{displayLabel}</div>
        return <div>{displayLabel}</div>
    }
    const handleTChange : (e:React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        const setVal = e.target.value
            .replace("\\","\\\\")
            .replace("*","\\*")
            .replace("+","\\+")
            .replace(".","\\.")
            .replace("?","\\?")
            .replace("{","\\{")
            .replace("}","\\}")
            .replace("[","\\[")
            .replace("]","\\]")
            .replace("(","\\(")
            .replace(")","\\)")
            .replace("^","\\^")
            .replace("$","\\$")
            .replace("|","\\|");
        setStrValue(setVal);
        if(setVal.length === 0){
            setValue(defSuggestion);
        }
    }

    return (
        <AutoComplete
            id="searchRecipe"
            value={value}
            options={allSuggestions}
            filterOptions={filterOptions}
            getOptionSelected={(option,value) => {return (option.レシピ名 === value.レシピ名)}}
            getOptionLabel={(option)=>option.レシピ名}
            clearOnEscape={true}
            noOptionsText={
                <>
                    <Typography>レシピが見つかりませんでした。</Typography>
                    <Typography>入力内容を減らしてみてください。</Typography>
                </>
            }
            renderInput={(p) =>
                <TextField {...p} 
                    name="serchRecipeField"
                    onChange={handleTChange}
                    style={{width:"450px",marginTop:"10px"}}
                    label="レシピ検索"
                    variant="outlined"
                    helperText={helperText}
                    />
            }
            renderOption={renderOptionFunc}
            onChange={handleChange} />
    );
}

export default SuggestionArea;