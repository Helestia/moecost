import React from 'react';

type tUseNewDictionaryInput = (dictionaryNames:string[],initValue?:string) => {
    value: string,
    error: {
        isError: boolean,
        message: string
    },
    handleChange:(event:React.ChangeEvent<HTMLInputElement>) => void,
    initialize: () => void
}
const useNewDictionaryInput:tUseNewDictionaryInput = (dictionaryNames,initValue = "") => {
    const [value,setValue] = React.useState(initValue);
    type tErrorObj = {
        isError:boolean,
        message:string
    }
    const errorObj = (() => {
        if(value === ""){
            const result:tErrorObj = {
                isError: true,
                message: "辞書名を入力してください。"
            }
            return result;
        }
        if(dictionaryNames.includes(value)){
            const result:tErrorObj = {
                isError: true,
                message: "既に同名の辞書名があります。"
            }
            return result;
        }
        const result:tErrorObj = {
            isError: false,
            message: ""
        }
        return result;
    })();

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
    const initialize = () => setValue(initValue);
    
    return {
        value: value,
        error: errorObj,
        handleChange: handleChange,
        initialize: initialize

    }
}

export default useNewDictionaryInput;
