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

type tChangeUsingProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const ChangeUsing: React.FC<tChangeUsingProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(props.dictionaryNames, props.usingDictionary);
    const classesAutoComplete = useStyleAutocomplete();
    const theme = useTheme();

    const handleSubmit = () => {
        props.onChange();
        moecostDb.registerUseDictionary({
            使用中辞書: selectorHook.value
        }).then(() => {
            props.handleSubmitAfter()
        }).then(() => {
            props.handleOpenSnackbar(
                "success",
                <Typography>使用辞書の変更処理が正常に完了しました。</Typography>);
        }).catch(() => {
            props.handleOpenSnackbar(
                "error",
                <>
                    <Typography>使用辞書の変更処理に失敗しています。</Typography>
                    <Typography>何度やっても成功しない場合は不具合報告をお願いします。</Typography>
                </>,
                null
            )
        });
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            disabled={props.isLoading}
            summary={<Typography>使用辞書の変更</Typography>}
            initialize={selectorHook.initialize.bind(null,props.usingDictionary)}
            actions={
                <Button
                    color="primary"
                    disabled={selectorHook.value === props.usingDictionary}
                    onClick={handleSubmit}
                >
                    使用する辞書の変更
                </Button>
            }
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>使用する辞書を変更します。</Typography>
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
                        renderInput={(params) => <TextField {...params} label="使用する辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default ChangeUsing;
