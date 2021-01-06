import React from 'react';
import {tHandleOpenSnackbar} from '../../../App';
import moecostDb,{iDictionary} from '../../../scripts/storage';
import FileReaderButton from '../../commons/buttons/fileReaderButton';
import {
    numDeform,
    downloadTextFileProsess} from '../../../scripts/common';

import {
    tryJsonParse,
    varidateJson_dictionary} from '../../../scripts/varidateJsonFile';

import Accordion        from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Autocomplete     from '@material-ui/lab/Autocomplete'
import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog           from '@material-ui/core/Dialog';
import DialogTitle      from '@material-ui/core/DialogTitle';
import DialogContent    from '@material-ui/core/DialogContent';
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
import ExpandMoreIcon   from '@material-ui/icons/ExpandMore';

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


type tUseDictionaryNames = () => [
    {
        isLoading:boolean,
        usingDictionaryName: string,
        dictionaryNames: string[]
    },
    () => void
];

const useDictionaryNames:tUseDictionaryNames = () => {
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

type tUseAccordionControl_hanldeTarget = 
    "changeUsing" |
    "create" |
    "copy" |
    "rename" |
    "delete" |
    "export" |
    "import" |
    "display" |
    ""
type tUseAccordionControl = () => [
    tUseAccordionControl_hanldeTarget,
    (target:tUseAccordionControl_hanldeTarget) => void,
    () => void
]

const useAccordionControl:tUseAccordionControl = () => {
    const [expanded,setExpanded] = React.useState<tUseAccordionControl_hanldeTarget>("");
    const handle = (target:tUseAccordionControl_hanldeTarget) => {
        if(expanded === target) setExpanded("");
        else setExpanded(target);
    }
    const initialize = () => setExpanded("");
    return [
        expanded,
        handle,
        initialize
    ]
}

type tDictionaryPreferenceDialogProps = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const DictionaryPreferenceDialog:React.FC<tDictionaryPreferenceDialogProps> = (props) => {
    const [befOpen, setBefOpen] = React.useState(false);
    const [dictionaryNames,dictionaryInitialize] = useDictionaryNames();
    const [expanded,AccordionHandle,AccordionInitialize] = useAccordionControl();

    if(props.isOpen && (! befOpen)){
        AccordionInitialize();
        dictionaryInitialize();
        setBefOpen(true);
    }
    if((! props.isOpen) && befOpen) setBefOpen(false);

    const handleSubmitAfter = () => dictionaryInitialize();

    const renderDialog = (node:React.ReactNode) => (
        <Dialog
            open={props.isOpen}
            onClose={props.close}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                <Typography>辞書データ管理</Typography>
            </DialogTitle>
            <DialogContent>
                {node}
            </DialogContent>
        </Dialog>
    );

    if(dictionaryNames.isLoading) return renderDialog(
        <>
            <CircularProgress />
            <Typography>現在辞書データ読込中</Typography>
        </>
    )
    else return renderDialog(
        <>
            <DisplayDictionary
                isExpanded={expanded === "display"}
                onChange={AccordionHandle.bind(null,"display")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
            />
            <ChangeUsing
                isExpanded={expanded === "changeUsing"}
                onChange={AccordionHandle.bind(null,"changeUsing")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <NewDictionary
                isExpanded={expanded === "create"}
                onChange={AccordionHandle.bind(null,"create")}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <CopyDictionary
                isExpanded={expanded === "copy"}
                onChange={AccordionHandle.bind(null,"copy")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <RenameDictionary
                isExpanded={expanded === "rename"}
                onChange={AccordionHandle.bind(null,"rename")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <DeleteDictionary
                isExpanded={expanded === "delete"}
                onChange={AccordionHandle.bind(null,"delete")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ExportDictionary
                isExpanded={expanded === "export"}
                onChange={AccordionHandle.bind(null,"export")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ImportDictionary
                isExpanded={expanded === "import"}
                onChange={AccordionHandle.bind(null,"import")}
                usingDictionary={dictionaryNames.usingDictionaryName}
                dictionaryNames={dictionaryNames.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleSubmitAfter={handleSubmitAfter}
            />
        </>
    )
}

type tDisplayDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
}
const DisplayDictionary:React.FC<tDisplayDictionaryProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [dictionaryData,setDictionaryData] = React.useState<iDictionary|null>(null);
    const initRequire = useAccordionControlChild(props.isExpanded);
    const classes = useStylesDisplayTable();

    if(initRequire){
        selectorInitialize(props.usingDictionary);
    }

    if(dictionaryData == null || dictionaryData.辞書名 !== value){
        retrieveDictionary(value);
    }

    async function retrieveDictionary(dictionaryName:string) {
        const d = await moecostDb.retrieveDictionary(dictionaryName);
        setDictionaryData(d);
    } 

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書内容の確認</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={handleChange}
                        onInputChange={handleChangeInput}
                        value={value}
                        inputValue={inputValue}
                        renderInput={(params) => <TextField {...params} label="辞書名"/>}
                    />
                    {dictionaryData === null
                        ? null
                        : (
                            <TableContainer component={Paper} className={classes.tableRoot}>
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
                                                            <TableCell  className={classes.create}>{d.アイテム}</TableCell>
                                                            <TableCell>生産</TableCell>
                                                            <TableCell align="left">{d.レシピ名}</TableCell>
                                                        </TableRow>
                                                    );
                                                case "自力調達":
                                                    return (
                                                        <TableRow key={key}>
                                                            <TableCell  className={classes.user}>{d.アイテム}</TableCell>
                                                            <TableCell>自力調達</TableCell>
                                                            <TableCell align="right">{numDeform(d.調達価格)}</TableCell>
                                                        </TableRow>
                                                    );
                                                default:
                                                    return (
                                                        <TableRow key={key}>
                                                            <TableCell className={classes.npc}>{d.アイテム}</TableCell>
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
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tChangeUsingProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}

const ChangeUsing: React.FC<tChangeUsingProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary)
    const initRequire = useAccordionControlChild(props.isExpanded);
    
    if(initRequire){
        selectorInitialize(props.usingDictionary);
    }

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
            disabled={props.dictionaryNames.length <= 1}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>使用辞書の変更</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>使用する辞書を変更します。</Typography>
                    <Box>
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
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            disabled={value === props.usingDictionary}
                            onClick={handleSubmit}
                        >
                            使用する辞書の変更
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tNewDictionaryProps = {
    isExpanded: boolean,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const NewDictionary: React.FC<tNewDictionaryProps> = (props) => {
    const [value,isError,errorMessage,setValue] = useNewDictionaryNameInput(props.dictionaryNames)
    const [usingDictionary,setUsingDictionary] = React.useState(false);
    const initRequire = useAccordionControlChild(props.isExpanded);
    
    if(initRequire){
        setValue("");
        return null;
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
            onChange={props.onChange}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>新規辞書の作成</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>何も登録されていない辞書を作成します。既存の辞書情報を流用したい場合は、この機能ではなく「辞書のコピー」を利用してください。</Typography>
                    <Box>
                        <TextField
                            value={value}
                            label="新しい辞書名"
                            onChange={handleChange}
                            error={isError}
                            helperText={errorMessage}
                        />
                    </Box>
                    <Box>
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
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            disabled={isError}
                            onClick={handleSubmit}
                        >
                            新辞書作成
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tCopyDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const CopyDictionary:React.FC<tCopyDictionaryProps> = (props) => {
    const [selectorValue,selectorInputValue,handleChangeSelector,handleChangeSelectorInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [inputValue,inputIsError,inputErrorMessage,setInputValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const initRequire = useAccordionControlChild(props.isExpanded);
    const [isChecked,setIsChecked] = React.useState(false);

    if(initRequire){
        selectorInitialize(props.usingDictionary);
        setInputValue("");
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
            onChange={props.onChange}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書のコピー</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>既存の辞書を複製して新しい辞書を作成します。既存辞書を少しだけ加工した辞書の作成や、辞書編集前のバックアップとして活用できます。</Typography>
                    <Box>
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
                    <Box>
                        <TextField
                            value={inputValue}
                            label="コピー先の辞書名"
                            onChange={handleChangeInput}
                            error={inputIsError}
                            helperText={inputErrorMessage}
                        />
                    </Box>
                    <Box>
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
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            disabled={(inputIsError) || (selectorValue === "")}
                            onClick={handleSubmit}
                        >
                            コピー作成
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tRenameDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const RenameDictionary:React.FC<tRenameDictionaryProps> = (props) => {
    const [selectorValue,selectorInputValue,handleChangeSelector,handleChangeSelectorInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [inputValue,inputIsError,inputErrorMessage,setInputValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const initRequire = useAccordionControlChild(props.isExpanded);

    if(initRequire){
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
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書の名前変更</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>辞書の名前を変更します。</Typography>
                    <Box>
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
                    <Box>
                        <TextField
                            value={inputValue}
                            label="新しい名前"
                            onChange={handleChangeInput}
                            error={inputIsError}
                            helperText={inputErrorMessage}
                        />
                    </Box>
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            disabled={(inputIsError) || (selectorValue === "")}
                            onClick={handleSubmit}
                        >
                            コピー作成
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}


type tDeleteDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleSubmitAfter: () => void
    handleOpenSnackbar: tHandleOpenSnackbar
}
const DeleteDictionary:React.FC<tDeleteDictionaryProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(filterCurrentDictionary(),"");
    const initRequire = useAccordionControlChild(props.isExpanded);

    function filterCurrentDictionary() {
        return [""].concat(props.dictionaryNames.filter(dn => dn !== props.usingDictionary));
    }
    const filtered = filterCurrentDictionary();
    
    if(initRequire) selectorInitialize("");
    
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
            disabled={filtered.length <= 1}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書の削除</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>指定された辞書を削除します。現在使用中の辞書を削除することはできません。使用辞書を変更して削除などを行ってください。このツールの使用をやめる場合はこのメニューからではなく、「全データ処理」からデータの削除を実行してください。</Typography>
                    <Box>
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
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            disabled={value === ""}
                            onClick={handleSubmit}
                        >
                            辞書の削除
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tExportDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const ExportDictionary:React.FC<tExportDictionaryProps> = (props) => {
    const [value,inputValue,handleChange,handleChangeInput,selectorInitialize] = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const initRequire = useAccordionControlChild(props.isExpanded);
    
    if(initRequire) selectorInitialize(props.usingDictionary);
    
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
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書のエクスポート</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>指定された辞書をファイル形式にエクスポートします。他の利用者との辞書情報共有や、バックアップ目的に利用できます。ツール全体のバックアップとしては「全データ管理」から「全データのエクスポート」機能がありますので、そちらを利用してください。</Typography>
                    <Box>
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
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            onClick={handleSubmit}
                        >
                            辞書のエクスポート
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tImportDictionaryProps = {
    isExpanded: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    handleSubmitAfter: () => void
}
const ImportDictionary:React.FC<tImportDictionaryProps> = (props) => {
    const [value,isError,errorMessage,setValue] = useNewDictionaryNameInput(props.dictionaryNames);
    const initRequire = useAccordionControlChild(props.isExpanded);
    
    if(initRequire) setValue("");
    
    const handleChangeName = (event:React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

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
         .then(() => props.handleSubmitAfter()
        ).then(() => props.handleOpenSnackbar(
            "success",
            <Typography>辞書ファイルのインポートが正常に完了しました。</Typography>)
        ).catch(() => props.handleOpenSnackbar(
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
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                <Typography>辞書のインポート</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Typography>「辞書のエクスポート」機能で出力されたファイルをツール内に展開します。</Typography>
                    <Box>
                        <TextField
                            value={value}
                            label="保存する辞書名"
                            onChange={handleChangeName}
                            error={isError}
                            helperText={errorMessage}
                        />
                    </Box>
                    <Box textAlign="right">
                        <FileReaderButton
                            color="primary"
                            disabled={isError}
                            error={handleFileError}
                            onLoad={handleFileOnload}
                        >
                            辞書のインポート
                        </FileReaderButton>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}
/**
 * アコーディオンのコントロールhooks
 * open時に初期化実行用
 * @param expanded 
 */
const useAccordionControlChild = (expanded:boolean) => {
    const [befExpanded,setBefExpanded] = React.useState(false);
    
    if(expanded && (! befExpanded)){
        setBefExpanded(true);
        return true;
    }
    if((! expanded) && befExpanded){
        setBefExpanded(false);
    }
    return false;
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
