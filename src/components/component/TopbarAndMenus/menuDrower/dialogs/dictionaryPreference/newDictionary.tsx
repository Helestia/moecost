import React from 'react';

import useNewDictionaryInput    from './hooks/useNewDictionaryInput';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import Accordion                from '../../../../../commons/accordion/accordion';
import moecostDb                from '../../../../../../scripts/storage';

import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import FromControlLabel from '@material-ui/core/FormControlLabel';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import {useTheme}       from '@material-ui/core/styles';

type tNewDictionary = {
    isExpanded: boolean,
    isLoading: boolean,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const NewDictionary: React.FC<tNewDictionary> = (props) => {
    const newInputHook = useNewDictionaryInput(props.dictionaryNames)
    const [usingDictionary,setUsingDictionary] = React.useState(false);
    const theme = useTheme();

    const initialize = () => {
        newInputHook.initialize();
        setUsingDictionary(false);
    }

    const handleCheckbox = (event:React.ChangeEvent<HTMLInputElement>) => setUsingDictionary(! usingDictionary)

    const handleSubmit = () => {
        props.onChange();
        moecostDb.registerDictionary({
            "辞書名": newInputHook.value,
            "内容" : []
        }).then(() => {
            if(usingDictionary){
                moecostDb.registerUseDictionary({
                    使用中辞書: newInputHook.value
                })
            }
        }).then(() => {
            props.handleSubmitAfter()
        }).then(() => {
            props.handleOpenSnackbar(
                "success",
                <Typography>新規辞書の作成が正常に完了しました。</Typography>);
        }).catch(() => {
            props.handleOpenSnackbar(
                "error",
                <>
                    <Typography>新規辞書の作成に失敗しています。</Typography>
                    <Typography>何度やっても成功しない場合は不具合報告をお願いします。</Typography>
                </>,
                null
            )
        });
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            disabled={props.isLoading}
            onChange={props.onChange}
            summary={<Typography>新規辞書の作成</Typography>}
            actions={
                <Button
                    color="primary"
                    disabled={newInputHook.error.isError}
                    onClick={handleSubmit}
                >
                    新辞書作成
                </Button>
            }
            initialize={initialize}
        >
            <Box width="100%">
                <Box marginBottom={`${theme.spacing(4)}px`}>
                    <Typography>何も登録されていない辞書を作成します。既存の辞書情報を流用したい場合は、この機能ではなく「辞書のコピー」を利用してください。</Typography>
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <TextField
                        value={newInputHook.value}
                        label="新しい辞書名"
                        onChange={newInputHook.handleChange}
                        error={newInputHook.error.isError}
                        helperText={newInputHook.error.message}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    <FromControlLabel
                        label="使用辞書を新規辞書に設定"
                        control={
                            <Checkbox
                                checked={usingDictionary}
                                onChange={handleCheckbox}
                            />
                        }
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

export default NewDictionary;
