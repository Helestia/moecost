import React from 'react';
import {tHandleOpenSnackbar} from '../App';
import moecostDb        from '../scripts/storage';

import {
    tryJsonParse,
    varidateJson_alldata} from '../scripts/varidateJsonFile';   

import Accordion        from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import Dialog           from '@material-ui/core/Dialog';
import DialogTitle      from '@material-ui/core/DialogTitle';
import DialogContent    from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography       from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme}              from '@material-ui/core/styles';
import ExpandMoreIcon   from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme:Theme) => 
    createStyles({
        inputFileElement : {
            display: "none"
        }
    })
);


type tAllDataDialog = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}

const AllDataDialog:React.FC<tAllDataDialog> = (props) => {
    const [befOpen,setBefOpen] = React.useState(false);
    const [isExpandedExport,setIsExpandedExport] = React.useState(false);
    const [isExpandedImport,setIsExpandedImport] = React.useState(false);
    const [isExpandedClear,setIsExpandedClear] = React.useState(false);
    const [isExpandedDelete,setIsExpandedDelete] = React.useState(false);

    if(props.isOpen && (! befOpen)){
        setIsExpandedImport(false);
        setIsExpandedExport(false);
        setIsExpandedClear(false);
        setIsExpandedDelete(false);
        setBefOpen(true);
        return null;
    }
    if((! props.isOpen) && befOpen) setBefOpen(false);

    const handleExpandExport = () => setIsExpandedExport(! isExpandedExport);
    const handleExpandImport = () => setIsExpandedImport(! isExpandedImport);
    const handleExpandClear  = () => setIsExpandedClear(! isExpandedClear);
    const handleExpandDelete = () => setIsExpandedDelete(! isExpandedDelete);

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.close}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                <Typography>データ全体の管理</Typography>
            </DialogTitle>
            <DialogContent>
                <RenderExport
                    isExpanded={isExpandedExport}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                    handleExpand={handleExpandExport}
                    handleClose={props.close}
                />
                <RenderImport
                    isExpanded={isExpandedImport}
                    handleExpand={handleExpandImport}
                    changeAppPreference={props.changeAppPreference}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                    handleClose={props.close}
                />
                <RenderClear
                    isExpanded={isExpandedClear}
                    handleExpand={handleExpandClear}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                    changeAppPreference={props.changeAppPreference}
                    handleClose={props.close}
                />
                <RenderDelete
                    isExpanded={isExpandedDelete}
                    handleExpand={handleExpandDelete}
                    handleOpenSnackbar={props.handleOpenSnackbar}
                />
            </DialogContent>
        </Dialog>
    )
}

type tRenderExport = {
    isExpanded:boolean,
    handleOpenSnackbar: tHandleOpenSnackbar,
    handleExpand:() => void,
    handleClose: () => void
}

const RenderExport:React.FC<tRenderExport> = (props) => {

    const handleClick = () => {
        const results = Promise.all([moecostDb.refleshProperties(),moecostDb.retrieveAllDictionary(),moecostDb.retrieveAllVendor()])
        .then((resultList) => {
            const dbVersion = moecostDb.verno;
            const appPreference = moecostDb.アプリ設定;
            const useDictionary = moecostDb.使用辞書;
            const dictionaryList = resultList[1];
            const vendorList = resultList[2];
            const downloadObj = {
                "Version": dbVersion,
                "アプリ設定" : appPreference,
                "使用辞書" : useDictionary,
                "辞書" : dictionaryList,
                "ベンダー" : vendorList
            };
            const downloadContent = JSON.stringify(downloadObj);
            const blob = new Blob([downloadContent], {"type" : "text/plain"});
            const url = URL.createObjectURL(blob);
            const elementA = document.createElement("a");
            elementA.download = "もえこすと_全データバックアップ.txt";
            elementA.href = url;
            elementA.click();
            elementA.remove();
            URL.revokeObjectURL(url);
        })
        .catch(() => props.handleOpenSnackbar(
            "error",
            <>
                <Typography>何らかの理由により、データベースのエクスポートに失敗しました。</Typography>
                <Typography>もう一度リトライし、それでも失敗するようでしたら不具合報告をお願いします。</Typography>
            </>,
            null
        ));
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>全データのエクスポート</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box>
                        <Typography>
                            既存のブラウザに保存されている全ての情報をファイル形式で保存します。ブラウザ上に保存されているデータは、クッキーのクリアが実行されることで比較的簡単に消えるので、ある程度安定した情報を登録した後はバックアップしておくことを推奨しております。そのほかには下記用途で使用します。
                        </Typography>
                        <Typography>
                            <ul>
                                <li>別のブラウザへ利用情報を移動する</li>
                                <li>パソコンの変更などに伴う移行作業・バックアップ</li>
                            </ul>
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleClick}>
                            エクスポート実行
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tRenderImport = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleClose: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}

const RenderImport:React.FC<tRenderImport> = (props) => {
    const [befExpanded,setBefExpanded] = React.useState(false);
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const classes = useStyles();

    if(props.isExpanded && (! befExpanded)) setBefExpanded(true);
    
    if((! props.isExpanded) && befExpanded) setBefExpanded(false);
    // ファイル選択を実施するための小細工
    const handleClickButton = () => {
        if(inputFileRef.current === null) return;
        inputFileRef.current.click();
    }
    const handleChangeFile = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(inputFileRef.current === null) return;
        if(inputFileRef.current.files === null) return;
        const fr = new FileReader()
        fr.readAsText(inputFileRef.current.files[0]);
        fr.onload = async () => {
            if(typeof fr.result !== "string"){
                props.handleOpenSnackbar(
                    "error",
                    <>
                        <Typography>ファイルの内容を読み取れませんでした。</Typography>
                        <Typography>処理を中断します。</Typography>
                    </>,
                    null);
                return;
            }
            const newDbObj = (() => {
                try{
                    // 上のブロックでstringなのは確認済み
                    const parseObj = tryJsonParse(fr.result as string);
                    return varidateJson_alldata(parseObj);
                } catch(e) {
                    if (e instanceof Error){
                        props.handleOpenSnackbar(
                            "error",
                            <>
                                {e.message.split("\n").map(m => 
                                    <Typography>{m}</Typography>)}
                            </>,
                            null
                        )
                    } else {
                        props.handleOpenSnackbar(
                            "error",
                            <>
                                <Typography>意図しないエラーにより処理が中断されました。</Typography>
                            </>
                        );
                        console.log(e);
                    }
                    return undefined;
                }
            })();
            if(newDbObj === undefined) return;
            // 全てのdbの初期化処理実施
            try{
                await moecostDb.clearAll();
            } catch (e) {
                props.handleOpenSnackbar(
                    "error",
                    <>
                        <Typography>既存データのクリア処理中に何らかのエラーが発生しています</Typography>
                        <Typography>処理を中断しました。</Typography>
                        <Typography>一部のクリア処理が正常に完了している恐れがあります。</Typography>
                    </>,
                    null
                )
                return;
            }

            // 一括でdb更新処理
            const jobs:Promise<unknown>[] = [
                (async() => await moecostDb.registerAppPreference(newDbObj.アプリ設定))(),
                (async() => await moecostDb.registerUseDictionary(newDbObj.使用辞書))(),
                (async() => await Promise.all(
                    newDbObj.辞書.map(async(d) => await moecostDb.registerDictionary(d))
                ))(),
                (async() => await Promise.all(
                    newDbObj.ベンダー.map(async (v) => await moecostDb.registerVendor(v))
                ))()
            ]
            Promise.all(jobs).then((event) => {
                props.changeAppPreference();
                props.handleOpenSnackbar(
                    "success",
                    <>
                        <Typography>正常にインポートが完了しました。</Typography>
                    </>
                );
                props.handleClose();
            }).catch(() => {
                props.handleOpenSnackbar(
                    "error",
                    <>
                        <Typography>クリア後のデータ登録時に何らかの異常が発生しています。</Typography>
                        <Typography>データが正常に登録されていません。</Typography>
                        <Typography>よろしければ不具合報告をいただければ助かります。</Typography>
                    </>,
                    null
                );
            })
        }
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>全データのインポート</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box>
                        <Typography color="error">
                            【注意】この処理を実行すると現在ブラウザに登録されている情報はすべて削除され、ファイルから受け取った情報に上書きされます。
                        </Typography>
                        <Typography>
                            上記メニューでエクスポートしたファイルを指定することで、エクスポートした地点のデータに復元することができます。指定したファイルはブラウザ上でのみ使用され、サーバーには送信されません。
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleClickButton}>
                            インポート実行
                        </Button>
                        <input
                            type="file"
                            ref={inputFileRef}
                            onChange={handleChangeFile}
                            className={classes.inputFileElement}
                        />

                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tRenderClear = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleClose: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}

const RenderClear:React.FC<tRenderClear> = (props) => {
    const [befExpanded,setBefExpanded] = React.useState(false);
    const [isChecked,setIsChecked] = React.useState(false);

    if(props.isExpanded && (! befExpanded)){
        setIsChecked(false);
        setBefExpanded(true);
        return null;
    }
    if((! props.isExpanded) && befExpanded){
        setBefExpanded(false);
    }

    const handleCheck = () => setIsChecked(! isChecked);

    const handleClick = () => {
        moecostDb.clearAll()
            .then(() => 
                props.handleOpenSnackbar(
                    "success",
                    <Typography>データの初期化が正常に完了しました。</Typography>
                )
            ).catch(()=> props.handleOpenSnackbar(
                "error",
                <Typography>データの初期化処理が原因不明な理由で失敗しました。</Typography>,
                null
            )).finally(() => {
                props.changeAppPreference();
            });
        props.handleClose();
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>全データのクリア</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box>
                        <Typography color="error">【注意】この処理で削除したデータは復元できません。</Typography>
                        <Typography>
                            このアプリで登録した情報をすべて初期化します。削除と異なり引き続きこのアプリを利用する場合に実行してください。
                        </Typography>
                        <Typography>
                            アプリの利用をやめる場合はこのメニューでなく、下部のデータの削除を実行することで初期化データすら残さず削除することができます。
                        </Typography>
                        <FormControlLabel
                            label="クリアを実行する場合はチェック"
                            onChange={handleCheck}
                            control={
                                <Checkbox checked={isChecked} />
                            }/>
                    </Box>
                    <Box textAlign="right">
                        <Button
                            variant="text"
                            color="primary"
                            disabled={isChecked　=== false}
                            onClick={handleClick}>
                            クリア実行
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

type tRenderDelete = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
}

const RenderDelete:React.FC<tRenderDelete> = (props) => {
    const [befExpanded,setBefExpanded] = React.useState(false);
    const [isChecked,setIsChecked] = React.useState(false);
    const [isOpenLockDialog,setIsOpenLockDialog] = React.useState(false);

    if(props.isExpanded && (! befExpanded)){
        setIsChecked(false);
        setBefExpanded(true);
        setIsOpenLockDialog(false);
        return null;
    }
    if((! props.isExpanded) && befExpanded) setBefExpanded(false);

    const handleChecked = () => setIsChecked(! isChecked);

    const handleClick = () => {
        setIsOpenLockDialog(true);
        moecostDb.delete()
            .then(() => 
                props.handleOpenSnackbar(
                    "success",
                    <>
                        <Typography>削除処理が正常に完了しました。</Typography>
                        <Typography>これまでのご利用ありがとうございました。</Typography>
                    </>,
                    null
                )
            ).catch(() => 
                props.handleOpenSnackbar(
                    "error",
                    <>
                        <Typography>何らかの理由により、データベースの削除に失敗しています</Typography>
                        <Typography>大変申し訳ないのですが、バグ報告いただくか、ご自身で削除を実施してください。</Typography>
                        <Typography>削除方法は「indexedDb 削除」などで検索するとわかると思います。</Typography>
                    </>,
                    null
                ))
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>全データの削除</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box>
                        <Typography color="error">【注意】削除したデータは復元できません！</Typography>
                        <Typography color="error">
                            このアプリで利用しているブラウザ上の全ての情報を削除します。アプリの利用をやめるときにのみ、この処理を実行してください。
                        </Typography>
                        <Typography>
                            処理実行後、ダイアログを表示してアプリ上の全ての動作を無効にします。アプリに再度アクセスすると自動的に初期データを作成し、再度アプリが利用可能になります。
                        </Typography>
                        
                        <FormControlLabel
                            label={
                                <Typography>削除を実行する場合はチェック</Typography>
                            }
                            onChange={handleChecked}
                            control={
                                <Checkbox checked={isChecked} />
                            }/>
                    </Box>
                    <Box textAlign="right">
                        <Button
                            variant="text"
                            color="primary"
                            disabled={isChecked　=== false}
                            onClick={handleClick}>
                            削除実行
                        </Button>
                    </Box>
                </Box>
                <Dialog
                    open={isOpenLockDialog}                            
                    fullWidth
                    maxWidth="md">
                    <DialogTitle>削除処理の受付完了</DialogTitle>
                    <DialogContent>
                        <Typography>削除の成否については画面下部の通知をご確認ください。</Typography>
                        <Typography>この画面は閉じられませんので、そのままブラウザバックやブラウザタブを閉じるなどで対処してください。</Typography>
                        <Typography>ご利用ありがとうございました。</Typography>
                    </DialogContent>
                </Dialog>
            </AccordionDetails>
        </Accordion>
    )
}

export default AllDataDialog;
