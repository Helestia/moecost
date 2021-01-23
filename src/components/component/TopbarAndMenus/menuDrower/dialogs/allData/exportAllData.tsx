import React from 'react';
import {tHandleOpenSnackbar} from '../../../../../commons/snackbar/useSnackbar';
import moecostDb             from '../../../../../../scripts/storage';

import Accordion    from '../../../../../commons/accordion/accordion';

import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Typography       from '@material-ui/core/Typography';




type tExportAllData = {
    isExpanded:boolean,
    handleOpenSnackbar: tHandleOpenSnackbar,
    handleExpand:() => void,
    handleClose: () => void
}

const ExportAllData:React.FC<tExportAllData> = (props) => {
    const handleClick = () => {
        Promise.all([
            moecostDb.refleshProperties(),
            moecostDb.retrieveAllDictionary(),
            moecostDb.retrieveAllVendor()
        ])
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
            summary={<Typography>全データのエクスポート</Typography>}
            actions={
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleClick}
                >
                    エクスポート実行
                </Button>
            }
        >
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
            </Box>
        </Accordion>
    )
}

export default ExportAllData;
