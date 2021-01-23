import React from 'react';

import useStyleAutocomplete         from './hooks/useStyleAutocomplete';
import useSelectorDictionaryName    from './hooks/useSelectorDictionaryName';
import useNewDictionaryInput        from './hooks/useNewDictionaryInput';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import Accordion                from '../../../../../commons/accordion/accordion';
import moecostDb                from '../../../../../../scripts/storage';

import Autocomplete     from '@material-ui/lab/Autocomplete'
import Box              from '@material-ui/core/Box';
import Button           from '@material-ui/core/Button';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import {useTheme}       from '@material-ui/core/styles';

type tRenameDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const RenameDictionary:React.FC<tRenameDictionaryProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const newInputHook = useNewDictionaryInput(props.dictionaryNames);
    const classesAutoComplete = useStyleAutocomplete();
    const theme = useTheme();

    const initialize = () => {
        selectorHook.initialize();
        newInputHook.initialize();
    }

    const handleSubmit = () => {
        props.onChange();
        moecostDb.retrieveDictionary(selectorHook.value)
        .then((dictionaryData) => {
            dictionaryData.辞書名 = newInputHook.value;
            moecostDb.registerDictionary(dictionaryData);
        })
        .then(() => {
            moecostDb.deleteDictionary(selectorHook.value);
        })
        .then(() => {
            if(selectorHook.value === props.usingDictionary) moecostDb.registerUseDictionary({
                使用中辞書: newInputHook.value
            });
        })
        .then(() => {
            props.handleSubmitAfter()
        })
        .then(() => {
            props.handleOpenSnackbar(
                "success",
                <Typography>辞書のリネーム処理が正常に完了しました。</Typography>)
        })
        .catch(() => {
            props.handleOpenSnackbar(
                "error",
                <>
                    <Typography>辞書の名前変更に失敗しました。</Typography>
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
            summary={<Typography>辞書の名前変更</Typography>}
            actions={
                <Button
                    color="primary"
                    disabled={(newInputHook.error.isError) || (selectorHook.value === "")}
                    onClick={handleSubmit}
                >
                    辞書名変更
                </Button>
            }
            initialize={initialize}
        >
            <Box width="100%">            
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>辞書の名前を変更します。</Typography>
                </Box>
                <Box
                    marginY={`${theme.spacing(1)}px`}
                    className={classesAutoComplete.root}
                >
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={selectorHook.handleChange}
                        onInputChange={selectorHook.handleChangeInput}
                        value={selectorHook.value}
                        inputValue={selectorHook.inputValue}
                        renderInput={(params) => <TextField {...params} label="名前変更する辞書名"/>}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <TextField
                        value={newInputHook.value}
                        label="新しい名前"
                        onChange={newInputHook.handleChange}
                        error={newInputHook.error.isError}
                        helperText={newInputHook.error.message}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default RenameDictionary;
