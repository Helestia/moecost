import React from 'react';
import Button from '@material-ui/core/Button';
import {
    makeStyles,
    createStyles} from '@material-ui/core/styles';

const useStylesImport = makeStyles(() => createStyles({
    inputFileElement:{
        display:"none"
    }
}));

type tFileReaderButton = {
    color: "primary" | "secondary" | "inherit" | "default"
    disabled: boolean,
    onSubmit?: () => void, 
    onLoad: (fileContent:string) => void,
    error : () => void
}

const FileReaderButton:React.FC<tFileReaderButton> = (props) => {
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const classes = useStylesImport();

    // ボタンクリック時の動作…非表示にしているfileのクリック
    const handleClickButton = () => {
        if(inputFileRef.current === null) return;
        inputFileRef.current.click();
    }

    // file選択後の処理
    const handleChangeFile = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(inputFileRef.current === null) return;
        if(inputFileRef.current.files === null) return;
        const fileReader = new FileReader();
        fileReader.readAsText(inputFileRef.current.files[0]);
        fileReader.onload = handleLoadFile.bind(null,fileReader);
        if(props.onSubmit) props.onSubmit();
    }

    const handleLoadFile = (fileReader:FileReader) => {
        if(typeof fileReader.result !== "string"){
            props.error();
            return;
        }
        props.onLoad(fileReader.result)
    }

    return (
        <>
            <Button
                color={props.color}
                disabled={props.disabled}
                onClick={handleClickButton}
            >
                {props.children}
            </Button>
            <input
                type="file"
                ref={inputFileRef}
                onChange={handleChangeFile}
                className={classes.inputFileElement}
            />
        </>
    )
}

export default FileReaderButton;
