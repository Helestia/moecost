import React from 'react';

import useStyleAutocomplete         from './hooks/useStyleAutocomplete';
import useSelectorDictionaryName    from './hooks/useSelectorDictionaryName';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import Accordion                from '../../../../../commons/accordion/accordion';

import moecostDb                from '../../../../../../scripts/storage';

import Autocomplete     from '@material-ui/lab/Autocomplete'
import Box              from '@material-ui/core/Box';
import Button           from '@material-ui/core/Button';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import {useTheme}       from '@material-ui/core/styles';

type tDeleteDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const DeleteDictionary:React.FC<tDeleteDictionaryProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(filterCurrentDictionary(),"");
    const classesAutoComplete = useStyleAutocomplete()
    const theme = useTheme();

    // 現在利用中にセットされている辞書は削除出来ないように制御
    function filterCurrentDictionary() {
        return [""].concat(props.dictionaryNames.filter(dn => dn !== props.usingDictionary));
    }

    const filtered = filterCurrentDictionary();
    
    const handleSubmit = () => {
        props.onChange();
        moecostDb.deleteDictionary(selectorHook.value)
        .then(() => {
            props.handleSubmitAfter()
        })
        .then(() => {
            props.handleOpenSnackbar(
                "success",
                <Typography>辞書の削除処理が正常に完了しました。</Typography>)
        })
        .catch(() => {
            props.handleOpenSnackbar(
                "error",
                <>
                    <Typography>辞書の削除処理に失敗しました。</Typography>
                    <Typography>何度やっても成功しない場合は不具合報告をお願いします。</Typography>
                </>,
                null
            )
        })
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            disabled={props.isLoading}
            summary={<Typography>辞書の削除</Typography>}
            actions={
                <Button
                    color="primary"
                    disabled={selectorHook.value === ""}
                    onClick={handleSubmit}
                >
                    辞書の削除
                </Button>
            }
            initialize={selectorHook.initialize}
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>指定された辞書を削除します。現在使用中の辞書を削除することはできません。使用辞書を変更して削除などを行ってください。このアプリケーションの使用をやめる場合はこのメニューからではなく、「全データ処理」からデータの削除を実行してください。</Typography>
                </Box>
                <Box className={classesAutoComplete.root}>
                    <Autocomplete
                        options={filtered}
                        getOptionLabel={option => option}
                        onChange={selectorHook.handleChange}
                        onInputChange={selectorHook.handleChangeInput}
                        value={selectorHook.value}
                        inputValue={selectorHook.inputValue}
                        renderInput={(params) => <TextField {...params} label="削除する辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default DeleteDictionary;
