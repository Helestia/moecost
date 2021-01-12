import React from 'react';
import {tHandleOpenSnackbar} from '../../../App';
import moecostDb,{iDictionary} from '../../../scripts/storage';

import useAccordionControl from '../../commons/accordion/useAccordionList';

import FileReaderButton from '../../commons/buttons/fileReaderButton';
import DialogNormal from '../../commons/dialog/dialogNormal';
import Accordion from '../../commons/accordion/accordion';

import {
    numDeform,
    downloadTextFileProsess} from '../../../scripts/common';
import {
    tryJsonParse,
    varidateJson_dictionary} from '../../../scripts/varidateJsonFile';

import Autocomplete     from '@material-ui/lab/Autocomplete'
import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FromControlLabel from '@material-ui/core/FormControlLabel';
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead';
import TableBody        from '@material-ui/core/TableBody';
import TableRow         from '@material-ui/core/TableRow';
import TableCell        from '@material-ui/core/TableCell';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import Paper            from '@material-ui/core/TableContainer';
import {
    makeStyles,
    createStyles,
    Theme}              from '@material-ui/core/styles';

const useStylesDisplayTable = makeStyles((theme:Theme) => createStyles({
    tableRoot:{
        maxHeight:"50vh",
        overflowY:"scroll"
    },
    create:{
        backgroundColor: (theme.palette.type === "light") ? "#fcc" : "#300"
    },
    user:{
        backgroundColor: (theme.palette.type === "light") ? "#cff" : "#033"
    },
    npc:{
        backgroundColor: (theme.palette.type === "light") ? "#cfc" : "#030"
    }
}));

const useStyleAutocomplete = makeStyles((theme:Theme) => createStyles({
    root:{
        width:"40em",
        maxWidth:"100%"
    }
}))

const useStyleBox = makeStyles((theme:Theme) => createStyles({
    section: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    textSection: {
        marginBottom: theme.spacing(4)
    }
}));

type tUseDictionaryState = () => [
    {
        isLoading:boolean,
        usingDictionaryName: string,
        dictionaryNames: string[]
    },
    () => void
];

const useDictionaryState:tUseDictionaryState = () => {
    const [isLoading,setIsLoading] = React.useState(false);
    const [usingDictionaryName,setUsingDictionaryName] = React.useState("");
    const [dictionaryNames,setDictionaryNames] = React.useState<string[]>([]);

    const initialize:()=> void = () => {
        setIsLoading(true);
        setUsingDictionaryName("");
        setDictionaryNames([]);
        (async() => {
            const dictionaryNames = await moecostDb.retrieveAllDictionaryNames();
            setDictionaryNames(dictionaryNames);
            setUsingDictionaryName(moecostDb.使用辞書.使用中辞書)
            setIsLoading(false);
        })();
    }
    return [{
        isLoading: isLoading,
        usingDictionaryName: usingDictionaryName,
        dictionaryNames: dictionaryNames
    },initialize]
}

type tDictionaryPreferenceDialogProps = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const DictionaryPreferenceDialog:React.FC<tDictionaryPreferenceDialogProps> = (props) => {
    const [dictionaryState,dictionaryInitialize] = useDictionaryState();
    const {
        isExpandeds,
        handleChangeAccordions,
        expandInitialize} = useAccordionControl("accordion",8);
    
    // ダイアログオープン時
    const dialogInitialize = () => {
        expandInitialize();
        dictionaryInitialize();
    }

    const handleSubmitAfter = () => dictionaryInitialize();

    const renderNowLoading = () => {
        if(dictionaryState.isLoading) return (
            <Box display="flex">
                <CircularProgress />
                <Box marginLeft="12px">
                    <Typography>現在辞書データ読込中</Typography>
                    <Typography>しばらくお待ちください</Typography>
                </Box>
            </Box>
        )
        return null;
    }

    return (
        <DialogNormal
            isOpen={props.isOpen}
            title="辞書データ管理"
            maxWidth="lg"
            handleClose={props.close}
            initialize={dialogInitialize}
        >
            {renderNowLoading()}
            <DisplayDictionary
                isExpanded={isExpandeds[0]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,0)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
            />
            <ChangeUsing
                isExpanded={isExpandeds[1]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,1)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <NewDictionary
                isExpanded={isExpandeds[2]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,2)}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <CopyDictionary
                isExpanded={isExpandeds[3]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,3)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <RenameDictionary
                isExpanded={isExpandeds[4]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,4)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <DeleteDictionary
                isExpanded={isExpandeds[5]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,5)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ExportDictionary
                isExpanded={isExpandeds[6]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,6)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ImportDictionary
                isExpanded={isExpandeds[7]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,7)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleSubmitAfter={handleSubmitAfter}
            />
        </DialogNormal>
    )
}

type tDisplayDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
}
const DisplayDictionary:React.FC<tDisplayDictionaryProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [dictionaryData,setDictionaryData] = React.useState<iDictionary|null>(null);
    const classesTable = useStylesDisplayTable();
    const classesAutoComplete = useStyleAutocomplete();
    const classesBox = useStyleBox();

    if(dictionaryData === null || dictionaryData.辞書名 !== value) retrieveDictionary(value);

    async function retrieveDictionary(dictionaryName:string) {
        const d = await moecostDb.retrieveDictionary(dictionaryName);
        setDictionaryData(d);
    }
    
    const initialize = () => {
        selectorInitialize(props.usingDictionary);
        retrieveDictionary(props.usingDictionary);
    }

    const renderTable = () => {
        if(dictionaryData === null) return null;
        return (
            <TableContainer
                component={Paper}
                className={classesTable.tableRoot}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>調達方法</TableCell>
                            <TableCell>価格／レシピ名</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dictionaryData.内容.map(d => {
                            const key = `DisplayDictionary_${d.アイテム}`
                            switch(d.調達方法){
                                case "生産":
                                    return (
                                        <TableRow key={key}>
                                            <TableCell  className={classesTable.create}>{d.アイテム}</TableCell>
                                            <TableCell>生産</TableCell>
                                            <TableCell align="left">{d.レシピ名}</TableCell>
                                        </TableRow>
                                    );
                                case "自力調達":
                                    return (
                                        <TableRow key={key}>
                                            <TableCell  className={classesTable.user}>{d.アイテム}</TableCell>
                                            <TableCell>自力調達</TableCell>
                                            <TableCell align="right">{numDeform(d.調達価格)}</TableCell>
                                        </TableRow>
                                    );
                                default:
                                    return (
                                        <TableRow key={key}>
                                            <TableCell className={classesTable.npc}>{d.アイテム}</TableCell>
                                            <TableCell>NPC購入</TableCell>
                                            <TableCell align="center">-</TableCell>
                                        </TableRow>
                                    );
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            summary={<Typography>辞書内容の確認</Typography>}
            disabled={props.isLoading}
            initialize={initialize}
        >
            <Box width="100%">
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChange}
                        onInputChange={handleChangeInput}
                        value={value}
                        inputValue={inputValue}
                        renderInput={(params) => <TextField {...params} label="辞書名"/>}
                    />
                </Box>
                <Box className={classesBox.section}>
                    {renderTable()}
                </Box>
            </Box>
        </Accordion>
    )
}

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
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const classesAutoComplete = useStyleAutocomplete();
    const classesBox = useStyleBox();

    const handleSubmit = () => {
        props.onChange();
        moecostDb.registerUseDictionary({
            使用中辞書: value
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
            initialize={selectorInitialize.bind(null,props.usingDictionary)}
            actions={
                <Button
                    color="primary"
                    disabled={value === props.usingDictionary}
                    onClick={handleSubmit}
                >
                    使用する辞書の変更
                </Button>
            }
        >
            <Box width="100%">
                <Box className={classesBox.textSection}>
                    <Typography>使用する辞書を変更します。</Typography>
                </Box>
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChange}
                        onInputChange={handleChangeInput}
                        value={value}
                        inputValue={inputValue}
                        renderInput={(params) => <TextField {...params} label="使用する辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

type tNewDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const NewDictionary: React.FC<tNewDictionaryProps> = (props) => {
    const [value,isError,errorMessage,setValue] = useNewDictionaryNameInput(props.dictionaryNames)
    const [usingDictionary,setUsingDictionary] = React.useState(false);
    const classesBox = useStyleBox();

    const initialize = () => {
        setValue("");
        setUsingDictionary(false);
    }

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)
    const handleCheckbox = (event:React.ChangeEvent<HTMLInputElement>) => setUsingDictionary(! usingDictionary)

    const handleSubmit = () => {
        props.onChange();
        moecostDb.registerDictionary({
            "辞書名": value,
            "内容" : []
        }).then(() => {
            if(usingDictionary){
                moecostDb.registerUseDictionary({
                    使用中辞書: value
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
                    disabled={isError}
                    onClick={handleSubmit}
                >
                    新辞書作成
                </Button>
            }
            initialize={initialize}
        >
            <Box width="100%">
                <Box className={classesBox.textSection}>
                    <Typography>何も登録されていない辞書を作成します。既存の辞書情報を流用したい場合は、この機能ではなく「辞書のコピー」を利用してください。</Typography>
                </Box>
                <Box className={classesBox.section}>
                    <TextField
                        value={value}
                        label="新しい辞書名"
                        onChange={handleChange}
                        error={isError}
                        helperText={errorMessage}
                    />
                </Box>
                <Box className={classesBox.section}>
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
    const [selectorValue,selectorInputValue,handleChangeSelector,handleChangeSelectorInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [inputValue,inputIsError,inputErrorMessage,setInputValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const [isChecked,setIsChecked] = React.useState(false);
    const classesAutoComplete = useStyleAutocomplete();
    const classesBox = useStyleBox()

    const initialize = () => {
        selectorInitialize(props.usingDictionary);
        setInputValue("");
        setIsChecked(false);
    }

    const handleChangeInput = (event:React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);
    const handleCheckbox = () => setIsChecked((! isChecked));

    const handleSubmit = () => {
        props.onChange();
        moecostDb.retrieveDictionary(selectorValue)
        .then((dictionaryData) => {
            dictionaryData.辞書名 = inputValue;
            moecostDb.registerDictionary(dictionaryData);
        })
        .then(() => {
            if(isChecked) moecostDb.registerUseDictionary({
                使用中辞書: inputValue
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
                    disabled={(inputIsError) || (selectorValue === "")}
                    onClick={handleSubmit}
                >
                    コピー作成
                </Button>
            }
            initialize={initialize}
        >
            
            <Box width="100%">
                
                <Box className={classesBox.textSection}>
                    <Typography>既存の辞書を複製して新しい辞書を作成します。既存辞書を少しだけ加工した辞書の作成や、辞書編集前のバックアップとして活用できます。</Typography>
                </Box>
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChangeSelector}
                        onInputChange={handleChangeSelectorInput}
                        value={selectorValue}
                        inputValue={selectorInputValue}
                        renderInput={(params) => <TextField {...params} label="コピー元の辞書名"/>}
                    />
                </Box>
                <Box className={classesBox.section}>
                    <TextField
                        value={inputValue}
                        label="コピー先の辞書名"
                        onChange={handleChangeInput}
                        error={inputIsError}
                        helperText={inputErrorMessage}
                    />
                </Box>
                <Box className={classesBox.section}>
                    <FromControlLabel
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
    const [selectorValue,selectorInputValue,handleChangeSelector,handleChangeSelectorInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [inputValue,inputIsError,inputErrorMessage,setInputValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const classesAutoComplete = useStyleAutocomplete();
    const classesBox = useStyleBox();

    const initialize = () => {
        selectorInitialize(props.usingDictionary);
        setInputValue("");
    }

    const handleChangeInput = (event:React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);

    const handleSubmit = () => {
        props.onChange();
        moecostDb.retrieveDictionary(selectorValue)
        .then((dictionaryData) => {
            dictionaryData.辞書名 = inputValue;
            moecostDb.registerDictionary(dictionaryData);
        })
        .then(() => {
            moecostDb.deleteDictionary(selectorValue);
        })
        .then(() => {
            if(selectorValue === props.usingDictionary) moecostDb.registerUseDictionary({
                使用中辞書: inputValue
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
                    disabled={(inputIsError) || (selectorValue === "")}
                    onClick={handleSubmit}
                >
                    辞書名変更
                </Button>
            }
            initialize={initialize}
        >
            <Box width="100%">            
                <Box className={classesBox.textSection}>
                    <Typography>辞書の名前を変更します。</Typography>
                </Box>
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChangeSelector}
                        onInputChange={handleChangeSelectorInput}
                        value={selectorValue}
                        inputValue={selectorInputValue}
                        renderInput={(params) => <TextField {...params} label="名前変更する辞書名"/>}
                    />
                </Box>
                <Box className={classesBox.section}>
                    <TextField
                        value={inputValue}
                        label="新しい名前"
                        onChange={handleChangeInput}
                        error={inputIsError}
                        helperText={inputErrorMessage}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}


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
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(filterCurrentDictionary(),"");
    const classesAutoComplete = useStyleAutocomplete()
    const classesBox = useStyleBox();

    function filterCurrentDictionary() {
        return [""].concat(props.dictionaryNames.filter(dn => dn !== props.usingDictionary));
    }
    const filtered = filterCurrentDictionary();
    
    const handleSubmit = () => {
        props.onChange();
        moecostDb.deleteDictionary(value)
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
                    disabled={value === ""}
                    onClick={handleSubmit}
                >
                    辞書の削除
                </Button>
            }
            initialize={selectorInitialize.bind(null,"")}
        >
            <Box width="100%">
                <Box className={classesBox.textSection}>
                    <Typography>指定された辞書を削除します。現在使用中の辞書を削除することはできません。使用辞書を変更して削除などを行ってください。このツールの使用をやめる場合はこのメニューからではなく、「全データ処理」からデータの削除を実行してください。</Typography>
                </Box>
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={filtered}
                        getOptionLabel={option => option}
                        onChange={handleChange}
                        onInputChange={handleChangeInput}
                        value={value}
                        inputValue={inputValue}
                        renderInput={(params) => <TextField {...params} label="削除する辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

type tExportDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const ExportDictionary:React.FC<tExportDictionaryProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const classesAutoComplete = useStyleAutocomplete();
    const classesBox = useStyleBox();
    
    const handleSubmit = () => {
        props.onChange();
        (async() => {
            const dictionary = await moecostDb.retrieveDictionary(value)
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
            initialize={selectorInitialize.bind(null,props.usingDictionary)}
        >
            <Box width="100%">
                <Box className={classesBox.textSection}>
                    <Typography>指定の辞書をファイルとしてエクスポートします。「辞書のインポート」機能を用いることで、抽出したファイルを再度ツール内に復元することができます。</Typography>
                    <Typography>ツール全体のバックアップとしては「全データ管理」から「全データのエクスポート」機能がありますので、そちらを利用してください。</Typography>
                </Box>
                <Box className={`${classesAutoComplete.root} ${classesBox.section}`}>
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChange}
                        onInputChange={handleChangeInput}
                        value={value}
                        inputValue={inputValue}
                        renderInput={(params) => <TextField {...params} label="エクスポートする辞書名"/>}
                    />
                </Box>
            </Box>
        </Accordion>
    )
}

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
    const [value,isError,errorMessage,setValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const [isChecked,setIsChecked] = React.useState(false);
    const classesBox = useStyleBox();

    const initialize = () => {
        setValue("");
        setIsChecked(false);
    }
    
    const handleChangeName = (event:React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
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

        const registerObj = {
            辞書名: value,
            内容: readDictionary.辞書内容
        } as iDictionary;
        // 更新処理
        moecostDb.registerDictionary(registerObj)
        .then(() => {
            if(isChecked) moecostDb.registerUseDictionary({
                使用中辞書: value
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
                    disabled={isError}
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
                <Box className={classesBox.textSection}>
                    <Typography>「辞書のエクスポート」機能で出力されたファイルをツール内に復元します。</Typography>
                </Box>
                <Box className={classesBox.section}>
                    <TextField
                        value={value}
                        label="保存する辞書名"
                        onChange={handleChangeName}
                        error={isError}
                        helperText={errorMessage}
                    />
                </Box>
                <Box className={classesBox.section}>
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

/**
 * 既存辞書名のセレクタ―用hooks
 * 基本的にAutoCompleteコンポーネントで使用することを想定
 */
type tUseSelectorDictionaryName = (dictionaryNames:string[],defaultValue:string) => [
    string,
    string,
    (event:React.ChangeEvent<{}>, newValue:string|null) => void,
    (event:React.ChangeEvent<{}>, newValue:string|null) => void,
    (initValue:string) => void
]
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

    const initialize = (initValue:string) => {
        setValue(initValue);
        setInputValue(initValue);
    }

    return [
        value,
        inputValue,
        handleChange,
        handleChangeInput,
        initialize
    ]
}

/**
 * 新しい辞書名を入力させる。
 * 未入力チェック／既存辞書名との重複チェックを実施
 */
type tUseNewDictionaryInput = (dictionaryNames:string[]) => [
    string,
    boolean,
    string,
    (newValue:string) => void
]

const useNewDictionaryNameInput:tUseNewDictionaryInput = (dictionaryNames) => {
    const [value,setValue] = React.useState("");
    type tErrorObj = {
        isError:boolean,
        message:string
    }
    const errorObj = (() => {
        if(value === "") return {
            isError: true,
            message: "辞書名を入力してください。"
        } as tErrorObj
        if(dictionaryNames.includes(value)) return {
            isError: true,
            message: "既に同名の辞書名があります。"
        } as tErrorObj
        return {
            isError: false,
            message: ""
        } as tErrorObj
    })();
    return [
        value,
        errorObj.isError,
        errorObj.message,
        setValue
    ]
}

export default DictionaryPreferenceDialog;
