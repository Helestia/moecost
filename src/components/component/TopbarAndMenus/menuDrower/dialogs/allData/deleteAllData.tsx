import React from 'react';

import moecostDb from '../../../../../../scripts/storage';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import useDialogParent          from '../../../../../commons/dialog/useDialogParent';
import DialogEnded              from '../../../../../commons/dialog/dialogEnded';
import Accordion                from '../../../../../commons/accordion/accordion';

import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography       from '@material-ui/core/Typography';

type tDeleteAllData = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
}

const DeleteAllData:React.FC<tDeleteAllData> = (props) => {
    const hooksDialog = useDialogParent();
    const [isChecked,setIsChecked] = React.useState(false);

    const handleInitialize = () => setIsChecked(false);

    const handleChecked = () => setIsChecked(! isChecked);

    const handleClick = () => {
        hooksDialog.handleOpen();
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
            )
        )
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
            initialize={handleInitialize}
            summary={<Typography>全データの削除</Typography>}
            actions={
                <Button
                    variant="text"
                    color="primary"
                    disabled={isChecked　=== false}
                    onClick={handleClick}
                >
                    削除実行
                </Button>
            }
        >
            <Box width="100%">
                <Box>
                    <Typography color="error">【注意】削除したデータは復元できません！</Typography>
                    <Typography color="error">このアプリケーションで利用しているブラウザ上の全ての情報を削除します。アプリケーションの利用をやめるときにのみ、この処理を実行してください。</Typography>
                    <Typography>処理実行後、ダイアログを表示してアプリケーション上の全ての動作を無効にします。アプリケーションに再度アクセスすると自動的に初期データを作成し、再度利用可能になります。</Typography>
                    
                    <FormControlLabel
                        label={
                            <Typography>削除を実行する場合はチェック</Typography>
                        }
                        onChange={handleChecked}
                        control={
                            <Checkbox checked={isChecked} />
                        }/>
                </Box>
            </Box>
            <DialogEnded
                isOpen={hooksDialog.isOpen}                            
                title="削除処理の受付完了"
                maxWidth="md"
            >
                <Typography>削除の成否については画面下部の通知をご確認ください。</Typography>
                <Typography>この画面は閉じられませんので、そのままブラウザバックやブラウザタブを閉じるなどで対処してください。</Typography>
                <Typography>ご利用ありがとうございました。</Typography>
            </DialogEnded>
        </Accordion>
    )
}

export default DeleteAllData;
