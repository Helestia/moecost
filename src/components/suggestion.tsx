import React from 'react'
import AutoComplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'


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
    
    const [value, setValue] = React.useState("");
    const handleSubmit : (e:React.FormEvent<HTMLFormElement>)=> void = (e) => {
        e.preventDefault();
        const returnObj = props.allSuggestions.find((suggestion) => {return (suggestion.レシピ名 === value)});
        if(returnObj){
            props.rtnFunc(returnObj);
        }
    }
    const handleChange : (e:React.ChangeEvent<HTMLTextAreaElement>) => void = (e) => {
        setValue(e.target.value);
    }
    const renderOptionFunc = (p:tSuggestion) => {
        const reg = new RegExp("^(.*)(" + value + ")(.*)$");
        const matches = p.レシピ名.match(reg);
        const displayLabel = matches ? <>{matches[1]}<b>{matches[2]}</b>{matches[3]}</> : <>{p.レシピ名}</>
        if(p.シリーズレシピ){
            return (
                <div className="suggestion selese">{displayLabel}</div>
            )
        } else {
            return (
                <div className="suggestion">{displayLabel}</div>
            )
        }
    } 
    return (
        <form onSubmit={handleSubmit}>
            <AutoComplete
                id="searchRecipe"
                options={props.allSuggestions}
                getOptionLabel={(option)=>option.レシピ名}
                style={{display:"inline"}}
                renderInput={(p) =><TextField {...p} style={{width:"350px"}} size="small" value={value} onChange={handleChange} label="レシピ検索" variant="outlined" />}
                renderOption={renderOptionFunc}/>
            <Button type="submit" variant="outlined" color="primary" size="large">
                検索
            </Button>
        </form>
    );
}
