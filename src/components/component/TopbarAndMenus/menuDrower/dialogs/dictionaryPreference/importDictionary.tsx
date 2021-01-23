import React from 'react';

import useNewDictionaryInput    from './hooks/useNewDictionaryInput';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import Accordion                from '../../../../../commons/accordion/accordion';
import FileReaderButton         from '../../../../../commons/buttons/fileReaderButton';
import moecostDb,{iDictionary}  from '../../../../../../scripts/storage';
import {
    tryJsonParse,
    varidateJson_dictionary}    from '../../../../../../scripts/varidateJsonFile';

import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import FromControlLabel from '@material-ui/core/FormControlLabel';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import {useTheme}       from '@material-ui/core/styles';

type tImportDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    handleSubmitAfter: () => void
}
const ImportDictionary:React.FC<tImportDictionaryProps> = (props) => {
    const newInputHook = useNewDictionaryInput(props.dictionaryNames);
    const [isChecked,setIsChecked] = React.useState(false);
    const theme = useTheme();

    const initialize = () => {
        newInputHook.initialize();
        setIsChecked(false);
    }
    
    const handleCheckbox = () => setIsChecked(! isChecked);

    const handleFileError = () => {
        props.handleOpenSnackbar(
            "error",
            <>
                <Typography>ファイルの内容が読み取れませんでした。</Typography>
                <Typography>辞書データのインポート処理は中断されました</Typography>
            </>,
            null
        )
    }

    const handleFileOnload = (content:string) => {
        // JSONのパース処理
        const readObj = (() => {
            try{
                const parsedObj = tryJsonParse(content);
                return parsedObj;
            } catch(e) {
                const errorMessage:React.ReactNode = (e instanceof Error) 
                    ? (
                        <>
                            {e.message.split("\n").map((m,i) => 
                                <Typography key={`errorMessageOfFileReader_${i}`}>{m}</Typography>)}
                        </>)
                    : <Typography>データ解析中に意図しないエラーによりインポート処理が中断されました。</Typography>
                props.handleOpenSnackbar(
                    "error",
                    errorMessage,
                    null
                );
                return undefined;
            }
        })();
        if(readObj === undefined) return;
        // objectのバリデーション
        const readDictionary = (() => {
            try{
                return varidateJson_dictionary(readObj);
            } catch(e) {
                const errorMessage:React.ReactNode = (e instanceof Error)
                    ? (
                        <>
                            {e.message.split("\n").map((m,i) => 
                                <Typography key={`errorMessageOfFileReader_${i}`}>{m}</Typography>)}
                        </>)
                    : <Typography>データ解析中に意図しないエラーによりインポート処理が中断されました。</Typography>
                props.handleOpenSnackbar(
                    "error",
                    errorMessage,
                    null
                );
                return undefined;
            }
        })()
        if(readDictionary === undefined) return;

        const registerObj:iDictionary = {
            辞書名: newInputHook.value,
            内容: readDictionary.辞書内容
        }
        // 更新処理
        moecostDb.registerDictionary(registerObj)
        .then(() => {
            if(isChecked) moecostDb.registerUseDictionary({
                使用中辞書: newInputHook.value
            })
        })
        .then(() => props.handleSubmitAfter())
        .then(() => props.handleOpenSnackbar(
            "success",
            <Typography>辞書ファイルのインポートが正常に完了しました。</Typography>
        ))
        .catch(() => props.handleOpenSnackbar(
            "error",
            <>
                <Typography>辞書ファイルのインポート処理に失敗しました。</Typography>
                <Typography>インポートファイルのファイル形式は正常でした。</Typography>
                <Typography>再度実行してみて、同様の問題が発生するようでしたら不具合報告をお願いします。</Typography>
            </>,
            null)
        );
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            disabled={props.isLoading}
            summary={<Typography>辞書のインポート</Typography>}
            actions={
                <FileReaderButton
                    color="primary"
                    disabled={newInputHook.error.isError}
                    onSubmit={props.onChange}
                    error={handleFileError}
                    onLoad={handleFileOnload}
                >
                    辞書のインポート
                </FileReaderButton>
            }
            initialize={initialize}
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>「辞書のエクスポート」機能で出力されたファイルをツール内に復元します。</Typography>
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <TextField
                        value={newInputHook.value}
                        label="保存する辞書名"
                        onChange={newInputHook.handleChange}
                        error={newInputHook.error.isError}
                        helperText={newInputHook.error.message}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <FromControlLabel
                        label="使用辞書をインポートする辞書に設定"
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={handleCheckbox}
                            />
                        }
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default ImportDictionary;
