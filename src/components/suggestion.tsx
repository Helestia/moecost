import React from 'react'
import AutoComplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'



// suggestion情報
export type tSuggestion = {
    "レシピ名":string,
    "シリーズレシピ" : boolean
}

// props Interface
interface iSuggestionAreaProps {
    allSuggestions : tSuggestion[]
    rtnFunc : (suggestion?:tSuggestion) => void
}

export const SuggestionArea:React.FC<iSuggestionAreaProps> = (props) => {
    const [value,setValue] = React.useState("");
    const [tValue,setTValue] = React.useState("");

    const handleSubmit : (e:React.FormEvent<HTMLFormElement>)=> void = (e) => {
        e.preventDefault();
        if(value.length >= 1){
            escalation(value);
        }
    }
    const handleChange : (e:React.ChangeEvent<{}>,val:tSuggestion|null) => void = (e,val) => {
        if(val){
            setValue(val.レシピ名);
            escalation(val.レシピ名);
        } else {
            setValue("");
        }
    }
    // 親関数の呼び出し
    const escalation : (str:string | null) => void = (str) => {
        if(str === null || str.length === 0){
            props.rtnFunc(undefined);
            return;
        }
        const escalationObj = props.allSuggestions.find((suggestion) => {return (suggestion.レシピ名 === str)});
        if(escalationObj){
            props.rtnFunc(escalationObj);
        }
        return;
    }

    const renderOptionFunc = (option:tSuggestion) => {
        const reg = new RegExp("^(.*)(" + tValue + ")(.*)$");
        const matches = option.レシピ名.match(reg);
        const displayLabel = matches ? <>{matches[1]}<b>{matches[2]}</b>{matches[3]}</> : <>{option.レシピ名}</>
        if(option.シリーズレシピ){
            return (
                <div className="suggestion selese">{displayLabel}</div>
            )
        } else {
            return (
                <div className="suggestion">{displayLabel}</div>
            )
        }
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
            .replace("|","\\|")
        setTValue(setVal);
    }

    return (
        <form onSubmit={handleSubmit}>
            <AutoComplete
                id="searchRecipe"
                options={props.allSuggestions}
                getOptionLabel={(option)=>option.レシピ名}
                style={{display:"inline"}}
                renderInput={(p) =><TextField {...p} name="serchRecipeField" onChange={handleTChange} style={{width:"350px"}} size="small" label="レシピ検索" variant="outlined" />}
                renderOption={renderOptionFunc}
                onChange={handleChange}/>
        </form>
    );
}
