import React from 'react';

import useStyleAutocomplete         from './hooks/useStyleAutocomplete';
import useSelectorDictionaryName    from './hooks/useSelectorDictionaryName';

import {tHandleOpenSnackbar}        from '../../../../../commons/snackbar/useSnackbar';
import Accordion                    from '../../../../../commons/accordion/accordion';

import moecostDb                    from '../../../../../../scripts/storage';
import {downloadTextFileProsess}    from '../../../../../../scripts/common';

import Autocomplete     from '@material-ui/lab/Autocomplete'
import Box              from '@material-ui/core/Box';
import Button           from '@material-ui/core/Button';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import {useTheme}       from '@material-ui/core/styles';

type tExportDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const ExportDictionary:React.FC<tExportDictionaryProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const classesAutoComplete = useStyleAutocomplete();
    const theme = useTheme();
    
    const handleSubmit = () => {
        props.onChange();
        (async() => {
            const dictionary = await moecostDb.retrieveDictionary(selectorHook.value)
                .catch(() => {
                    props.handleOpenSnackbar(
                        "error",
                        <>
                            <Typography>エクスポートする辞書情報の取得に失敗しました。</Typography>
                            <Typography>何度やっても成功しない場合は不具合報告をお願いします。</Typography>
                        </>,
                        null
                    );
                    return undefined;
                });
            if(dictionary === undefined) return;
            // windowsファイルシステムで使用できない文字一覧
            // 他システム上で使用できない文字はよくわかりません；；
            const escapedDictName = dictionary.辞書名
                .replace(/\\/g,"")
                .replace(/\//g,"")
                .replace(/:/g,"")
                .replace(/\*/g,"")
                .replace(/\?/g,"")
                .replace(/"/g,"")
                .replace(/</g,"")
                .replace(/>/g,"")
                .replace(/\|/g,"");
            const fileName = `もえこすと_辞書_${escapedDictName}.txt`;
            const fileContent = {
                Version: moecostDb.verno,
                辞書内容: dictionary.内容
            }
            downloadTextFileProsess(fileContent, fileName);
        })();
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            disabled={props.isLoading}
            summary={<Typography>辞書のエクスポート</Typography>}
            actions={
                <Button
                    color="primary"
                    onClick={handleSubmit}
                >
                    辞書のエクスポート
                </Button>
            }
            initialize={selectorHook.initialize}
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>指定の辞書をファイルとしてエクスポートします。「辞書のインポート」機能を用いることで、抽出したファイルを再度ツール内に復元することができます。</Typography>
                    <Typography>ツール全体のバックアップとしては「全データ管理」から「全データのエクスポート」機能がありますので、そちらを利用してください。</Typography>
                </Box>
                <Box
                    className={classesAutoComplete.root}
                    marginY={`${theme.spacing(1)}px`}
                >
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={selectorHook.handleChange}
                        onInputChange={selectorHook.handleChangeInput}
                        value={selectorHook.value}
                        inputValue={selectorHook.inputValue}
                        renderInput={(params) => <TextField {...params} label="エクスポートする辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default ExportDictionary;
