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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox         from '@material-ui/core/Checkbox'
import {useTheme}       from '@material-ui/core/styles';

type tCopyDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const CopyDictionary:React.FC<tCopyDictionaryProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const newInputHook = useNewDictionaryInput(props.dictionaryNames);
    const [isChecked,setIsChecked] = React.useState(false);
    const classesAutoComplete = useStyleAutocomplete();
    const theme = useTheme();

    const initialize = () => {
        selectorHook.initialize();
        newInputHook.initialize();
        setIsChecked(false);
    }

    const handleCheckbox = () => setIsChecked((! isChecked));

    const handleSubmit = () => {
        props.onChange();
        moecostDb.retrieveDictionary(selectorHook.value)
        .then((dictionaryData) => {
            dictionaryData.辞書名 = newInputHook.value;
            moecostDb.registerDictionary(dictionaryData);
        })
        .then(() => {
            if(isChecked) moecostDb.registerUseDictionary({
                使用中辞書: newInputHook.value
            })
        })
        .then(() => {
            props.handleSubmitAfter()
        })
        .then(() => {
            props.handleOpenSnackbar(
                "success",
                <Typography>辞書のコピー処理を正常に完了しました。</Typography>)
        })
        .catch(() => {
            props.handleOpenSnackbar(
                "error",
                <>
                    <Typography>辞書のコピー処理に失敗しました。</Typography>
                    <Typography>何度やっても成功しない場合は不具合報告をお願いします。</Typography>
                </>,
                null
            )
        })
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            disabled={props.isLoading}
            onChange={props.onChange}
            summary={<Typography>辞書のコピー</Typography>}
            actions={
                <Button
                    color="primary"
                    disabled={(newInputHook.error.isError) || (selectorHook.value === "")}
                    onClick={handleSubmit}
                >
                    コピー作成
                </Button>
            }
            initialize={initialize}
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>既存の辞書を複製して新しい辞書を作成します。既存辞書を少しだけ加工した辞書の作成や、辞書編集前のバックアップとして活用できます。</Typography>
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
                        renderInput={(params) => <TextField {...params} label="コピー元の辞書名"/>}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <TextField
                        value={newInputHook.value}
                        label="コピー先の辞書名"
                        onChange={newInputHook.handleChange}
                        error={newInputHook.error.isError}
                        helperText={newInputHook.error.message}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <FormControlLabel
                        label="使用辞書をコピー先の辞書に設定"
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

export default CopyDictionary;
