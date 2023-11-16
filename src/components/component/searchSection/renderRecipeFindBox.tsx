import React from 'react';

import moecostDb            from '../../../scripts/storage';
import {numDeform}          from '../../../scripts/common';
import {
    Recipes,
    SeriesCreationItems}    from '../../../scripts/jsonReader';

import AutoComplete,
    {createFilterOptions,
    AutocompleteChangeReason}
                            from '@material-ui/lab/Autocomplete';
import {FilterOptionsState} from '@material-ui/lab/useAutocomplete'


import Box          from '@material-ui/core/Box';
import Button       from '@material-ui/core/Button';
import Link         from '@material-ui/core/Link';
import TextField    from '@material-ui/core/TextField';
import Typography   from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme}          from '@material-ui/core/styles';

// suggestion情報
type tSuggestion = {
    "レシピ名":string,
    "シリーズレシピ" : boolean
}

const defSuggestion : tSuggestion = {
    "レシピ名" : "",
    "シリーズレシピ" : false
}

const useStyles = makeStyles((theme:Theme) => createStyles({
    rootBox:{
        display:"flex",
        flexWrap:"wrap",
        marginTop:theme.spacing(2)
    },
    Autocomplete:{
        width:"40em",
        minWidth:"0px"
    }
}))


type tRenderRecipeFindBox = {
    handleReturnSearch : (recipe:string) => void
}

const RenderRecipeFindBox:React.FC<tRenderRecipeFindBox> = (props) => {
    const {
        value,
        inputValue,
        allSuggestions,
        noOptionsText,
        helperText,
        filterOptions,
        getOptionLabel,
        renderOption,
        handleOnBlue,
        handleOnChange,
        handleInputChange,
        handleSubmit} = useSuggestion(props.handleReturnSearch)
    const classes = useStyles();

    const handleButtonClick = () => handleSubmit();

    return (
        <>
            <Box
                marginTop={1}
                marginBottom={1}
            >
                <Typography>このアプリケーションについては、<Link href="./helps/" target="_blank">ヘルプページ</Link>に使用方法等をまとめましたので、ご確認ください。</Typography>
            </Box>
            <Box
                className={classes.rootBox}
            >
                <Box
                    className={classes.Autocomplete}
                >
                    <AutoComplete
                        size="small"
                        value={value}
                        inputValue={inputValue}
                        options={allSuggestions}
                        filterOptions={filterOptions}
                        getOptionLabel={getOptionLabel}
                        onBlur={handleOnBlue}
                        clearOnEscape={true}
                        noOptionsText={noOptionsText}
                        renderInput={(p) =>
                            <TextField {...p}
                                onChange={handleInputChange}
                                label="レシピ検索"
                                variant="outlined"
                                helperText={helperText}
                            />
                        }
                        renderOption={renderOption}
                        onChange={handleOnChange} />
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={value.レシピ名 === defSuggestion.レシピ名}
                        onClick={handleButtonClick}
                    >
                        レシピ検索
                    </Button>
                </Box>
            </Box>
        </>
    );
}

type tUseSuggestionProps = (recipe:string) => void
type tUseSuggestionResult = {
    value:             tSuggestion,
    inputValue:        string,
    allSuggestions:    tSuggestion[],
    noOptionsText:     React.ReactNode,
    helperText:        React.ReactNode,
    filterOptions:     (options: tSuggestion[], state: FilterOptionsState<tSuggestion>) => tSuggestion[],
    getOptionLabel:    (option: tSuggestion) => string,
    renderOption:      (option: tSuggestion) => React.ReactNode,
    handleOnBlue:      (event: React.FocusEvent<HTMLDivElement>) => void,
    handleOnChange:    (event: React.ChangeEvent<{}>, newValue: tSuggestion | null, reason: AutocompleteChangeReason) => void,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit:      (suggetion?:tSuggestion) => void
}
type tUseSuggestion = (handleReturnSearch:tUseSuggestionProps) => tUseSuggestionResult;
const useSuggestion:tUseSuggestion = (handleReturnSearch) => {
    const [value,setValue] = React.useState<tSuggestion>(defSuggestion);
    const [inputValue,setInputValue] = React.useState("");
    const [allSuggestions,setAllSuggestion] = React.useState<tSuggestion[]>([])
    // 初回のみ実行
    React.useEffect(() => {
        const suggestionSeriese:tSuggestion[] = SeriesCreationItems.map(s => {
            return {
                レシピ名: s.シリーズ名,
                シリーズレシピ: true
            }
        });
        const suggestionRecipes:tSuggestion[] = Recipes.map(r => {
            return {
                レシピ名: r.レシピ名,
                シリーズレシピ: false
            }
        });
        const result = [defSuggestion].concat(suggestionSeriese).concat(suggestionRecipes);
        setAllSuggestion(result);
    },[])

    const inputRegPattern = inputValue
        .replace(/\\/g,"\\\\")
        .replace(/\*/g,"\\*")
        .replace(/\+/g,"\\+")
        .replace(/\./g,"\\.")
        .replace(/\?/g,"\\?")
        .replace(/\{/g,"\\{")
        .replace(/\}/g,"\\}")
        .replace(/\[/g,"\\[")
        .replace(/\]/g,"\\]")
        .replace(/\(/g,"\\(")
        .replace(/\)/g,"\\)")
        .replace(/\^/g,"\\^")
        .replace(/\$/g,"\\$")
        .replace(/\|/g,"\\|");
    
    const noOptionsText = (
        <>
            <Typography>レシピが見つかりませんでした。</Typography>
            <Typography>入力内容を減らしてみてください。</Typography>
        </>
    );

    const helperText = (moecostDb.アプリ設定.表示設定.検索候補表示数 === 0)
        ? <>現在の設定上、検索候補数の上限なしです。<br />動作が重い場合はアプリメニューから候補数を絞ってください。</>
        : <>現在の設定上、{numDeform(moecostDb.アプリ設定.表示設定.検索候補表示数)}件でレシピ検索を終了します。<br />左上のメニューのアプリ設定から変更が可能です。</>

    const filterOptions = createFilterOptions<tSuggestion>({
        limit: (moecostDb.アプリ設定.表示設定.検索候補表示数 === 0)
            ? undefined
            : moecostDb.アプリ設定.表示設定.検索候補表示数
    });

    const getOptionLabel = (option:tSuggestion) => option.レシピ名;

    const renderOption = (option:tSuggestion) => {
        if (option.レシピ名 === "") return (<Typography>未選択</Typography>);
        const reg = new RegExp("^(.*)(" + inputRegPattern + ")(.*)$");
        const matches = option.レシピ名.match(reg);
        const displayLabel = matches 
            ? <>{matches[1]}<b>{matches[2]}</b>{matches[3]}</> 
            : <>{option.レシピ名}</>
        if(option.シリーズレシピ) return <Typography>[セット]{displayLabel}</Typography>
        return <Typography>{displayLabel}</Typography>
    }
    
    const handleOnBlue = () => {
        const findedSuggest = allSuggestions.find(s => s.レシピ名 === inputValue);
        if(findedSuggest) setValue(findedSuggest);
        else setInputValue(value.レシピ名);
    }

    const handleOnChange = (event:React.ChangeEvent<{}>, newValue:tSuggestion | null, reason:AutocompleteChangeReason) => {
        switch(reason){
            case "select-option":
                if(newValue){
                    setValue(newValue);
                    setInputValue(newValue.レシピ名);
                    handleSubmit(newValue);
                } else {
                    setValue(defSuggestion);
                    setInputValue(defSuggestion.レシピ名);
                    handleSubmit(defSuggestion);
                }
                return;
            case "clear":
                setValue(defSuggestion);
                setInputValue(defSuggestion.レシピ名);
                handleSubmit(defSuggestion);
                return;
            
            case "blur":
                handleOnBlue();
                return;
        }
    }

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);    
    const handleSubmit = (suggest:tSuggestion=value) => handleReturnSearch(suggest.レシピ名);

    return {
        value:             value,
        inputValue:        inputValue,
        allSuggestions:    allSuggestions,
        noOptionsText:     noOptionsText,
        helperText:        helperText,
        filterOptions:     filterOptions,
        getOptionLabel:    getOptionLabel,
        renderOption:      renderOption,
        handleOnBlue:      handleOnBlue,
        handleOnChange:    handleOnChange,
        handleInputChange: handleInputChange,
        handleSubmit:      handleSubmit
    }
}

export default RenderRecipeFindBox;
