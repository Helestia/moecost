import React from 'react';

/**
 * 既存辞書名のセレクタ―用hooks
 * 基本的にAutoCompleteコンポーネントで使用することを想定
 */
type tUseSelectorDictionaryName = (dictionaryNames:string[],defaultValue:string) => {
    value: string,
    inputValue: string,
    handleChange: (event:React.ChangeEvent<{}>, newValue:string|null) => void,
    handleChangeInput: (event:React.ChangeEvent<{}>, newValue:string|null) => void,
    initialize: (initValue?:string) => void
}

const useSelectorDictionaryName: tUseSelectorDictionaryName = (dictionaryNames,defaultValue) => {
    const [value,setValue] = React.useState(defaultValue);
    const [inputValue,setInputValue] = React.useState(defaultValue);

    const handleChange = (event:React.ChangeEvent<{}>, newValue:string | null) => {
        if(newValue){
            if(dictionaryNames.includes(newValue)) setValue(newValue);
            else setValue(defaultValue);
        } else setValue(defaultValue);
    }
    const handleChangeInput = (event:React.ChangeEvent<{}>,newValue:string | null) => {
        if(newValue) setInputValue(newValue);
        else setInputValue("");
    }

    const initialize = (initValue:string = defaultValue) => {
        setValue(initValue);
        setInputValue(initValue);
    }

    return {
        value: value,
        inputValue: inputValue,
        handleChange: handleChange,
        handleChangeInput: handleChangeInput,
        initialize: initialize
    }
}

export default useSelectorDictionaryName;
