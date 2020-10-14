import React , {useState} from 'react'
import AutoSuggest from 'react-autosuggest'

// react-autosuggest送付用スタイル　
type theme = {
    container? : React.CSSProperties,
    containerOpen? : React.CSSProperties,
    input?: React.CSSProperties,
    inputOpen?: React.CSSProperties,
    inputFocused?: React.CSSProperties,
    suggestionsContainer?: React.CSSProperties,
    suggestionsContainerOpen?: React.CSSProperties,
    suggestionsList? : React.CSSProperties,
    suggestion?:React.CSSProperties,
    suggestionFirst?:React.CSSProperties,
    suggestionHighlighted?:React.CSSProperties,
    sectionContainer?:React.CSSProperties,
    sectionTitle?:React.CSSProperties
}

const theme : theme = {
    container:{
        position : "relative",
        marginLeft : "2em"
    },
    input : {
        minWidth : "120px",
        maxWidth : "400px",
        width : "50%",
        height : "35px",
        padding : "5px 10px",
        borderStyle : "solid",
        borderWidth : "1px"
    },
    inputFocused : {
        borderWidth: "3px"
    },
    suggestionsContainerOpen : {
        display:"block",
        position:"absolute",
        top : "36px",
        left: "0px",
        minWidth : "120px",
        maxWidth : "400px",
        width : "50%",
        maxHeight : "50vh",
        overflowY: "scroll",
        borderStyle : "solid",
        borderWidth : "1px",
        zIndex : 2
    },
    suggestionsList : {
        margin : "0px",
        padding: "0px"
    },
    suggestion : {
        borderTopStyle:"solid",
        borderTopWidth:"1px",
        listStyle: "none"
    },
    suggestionFirst : {
        borderTopWidth:"0px"
    }
}

// suggestのレイアウト
const stylesheets : {[s:string]: React.CSSProperties} = {
    suggest : {
        padding:"5px 10px"
    },
    setSuggest : {
        padding:"5px 10px",
        backgroundColor:"#ffb"
    },
    noSetSuggestHirighted : {
        padding:"5px 10px",
        backgroundColor:"#bbb"
    },
    setSuggestHirighted : {
        padding:"5px 10px",
        backgroundColor:"#bb8"
    }
}
// suggestion情報
export type tSuggestion = {
    "レシピ名":string,
    "シリーズレシピ" : boolean
}

// props Interface
interface suggestionAreaProps {
    allSuggestions : tSuggestion[]
    rtnFunc : (suggestion?:tSuggestion) => void
}

export const SuggestionArea:React.FC<suggestionAreaProps> = (props) => {
    
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState<tSuggestion[]>([]);
    // サジェスト候補取得
    const getSuggest = (val:string) => {
        if(val.length === 0) return [];
        var result = props.allSuggestions.filter(obj => {
            return obj.レシピ名.indexOf(val) !== -1
        })
        return result;
    }
    // submit判定用
    const canSubmit = (value:string) => {
        const finded = props.allSuggestions.find(recipe => {
            return recipe.レシピ名 === value;
        });
        return finded !== undefined ? true : false;
    }

    // サジェスト表示
    const renderSuggestion = (suggestion:tSuggestion,options:{query:string,isHighlighted:boolean}) => {
        props.rtnFunc();
        // 正規表現のサニタイズ
        const sanitizeQuery = options.query.replace(/\\/g,"\\\\").replace(/\./g,"\\.").replace(/\+/g,"\\+").replace(/\*/g,"\\*").replace(/\?/g,"\\?").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\{/g,"\\{").replace(/\}/g,"\\}");
        const reg = new RegExp("^(.*?)(" + sanitizeQuery + ")(.*?)$", "");
        const matches = suggestion.レシピ名.match(reg);
        const renderObject = ((matches === null) || (matches.length !== 4)) ? (<span>suggestion.レシピ名</span>) : (<span>{matches[1]}<b>{matches[2]}</b>{matches[3]}</span>);
        if(suggestion.シリーズレシピ && options.isHighlighted){
            return (
                <div style={stylesheets.setSuggestHirighted}>{renderObject}</div>
            )
        } else if(suggestion.シリーズレシピ && (! options.isHighlighted)){
            return (
                <div style={stylesheets.setSuggest}>{renderObject}</div>
            )
        } else if((! suggestion.シリーズレシピ) && options.isHighlighted){
            return (
                <div style={stylesheets.noSetSuggestHirighted}>{renderObject}</div>
            )
        } else {
            return (
                <div style={stylesheets.suggest}>{renderObject}</div>
            )
        }
    }
    const inputProps : AutoSuggest.InputProps<tSuggestion> = {
        value : value,
        onChange : (event : React.FormEvent<HTMLInputElement>,onChangeProps : AutoSuggest.ChangeEvent) => {
            setValue(onChangeProps.newValue);
            if(onChangeProps.method === "click" || onChangeProps.method === "enter" || onChangeProps.method === "escape"){
                if(canSubmit(onChangeProps.newValue)){
                    submitFunction()
                }
            }
        },
        onBlur : (event : React.FocusEvent<HTMLInputElement>) => {
            if(canSubmit(value)){
                submitFunction();
            }
        }
    }
    const submitFunction = (event? : React.FormEvent<HTMLFormElement>) => {
        // バリデーション
        const finded= props.allSuggestions.find(suggest => {
            return suggest.レシピ名 === value;
        });
        if(finded === undefined){
            alert('レシピが見つかりません。');
            props.rtnFunc();
        } else {
            props.rtnFunc(finded);
        }
        if(event){
            event.preventDefault();
        }
    }
    return (
        <div>
            <form onSubmit={submitFunction}>
                <label>
                    レシピ検索 : 
                    <AutoSuggest 
                        suggestions={suggestions}
                        onSuggestionsClearRequested={() => setSuggestions(getSuggest(value))}
                        onSuggestionsFetchRequested={({value}) => {
                            setValue(value);
                            setSuggestions(getSuggest(value));
                        }}
                        getSuggestionValue={suggestion => suggestion.レシピ名}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        theme={theme}
                    />
                </label>
            </form>
        </div>
    );
}
