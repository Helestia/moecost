import React from 'react';
import {tHandleOpenSnackbar} from '../../../../../commons/snackbar/useSnackbar';
import moecostDb             from '../../../../../../scripts/storage';

import {
    tryJsonParse,
    varidateJson_alldata}    from '../../../../../../scripts/varidateJsonFile';

import Accordion    from '../../../../../commons/accordion/accordion';
import FileReaderButton from '../../../../../commons/buttons/fileReaderButton';

import Box              from '@material-ui/core/Box';
import Typography       from '@material-ui/core/Typography';



type tImportAllData = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleClose: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}
const ImportAllData:React.FC<tImportAllData> = (props) => {
    const handleError = () => props.handleOpenSnackbar(
        "error",
        <>
            <Typography>ファイルの内容を読み取れませんでした。</Typography>
            <Typography>処理を中断します。</Typography>
        </>,
        null);
    
    const handleLoad = async (content:string) => {
        const newDbObj = (() => {
            try{
                // 上のブロックでstringなのは確認済み
                const parseObj = tryJsonParse(content);
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

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
            summary={<Typography>全データのインポート</Typography>}
            actions={
                <FileReaderButton
                    color="primary"
                    disabled={false}
                    onLoad={handleLoad}
                    error={handleError}
                >
                    インポート実行
                </FileReaderButton>
            }
        >
            <Box width="100%">
                <Typography color="error">
                    【注意】この処理を実行すると現在ブラウザに登録されている情報はすべて削除され、ファイルから受け取った情報に上書きされます。
                </Typography>
                <Typography>
                    上記メニューでエクスポートしたファイルを指定することで、エクスポートした地点のデータに復元することができます。指定したファイルはブラウザ上でのみ使用され、サーバーには送信されません。
                </Typography>
            </Box>
        </Accordion>
    )
}

export default ImportAllData;
