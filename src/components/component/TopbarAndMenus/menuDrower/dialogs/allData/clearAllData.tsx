import React from 'react';
import {tHandleOpenSnackbar} from '../../../../../commons/snackbar/useSnackbar';
import moecostDb             from '../../../../../../scripts/storage';

import Accordion    from '../../../../../commons/accordion/accordion';

import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography       from '@material-ui/core/Typography';

type tClearAllData = {
    isExpanded:boolean,
    handleExpand:() => void,
    handleClose: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}
const ClearAllData:React.FC<tClearAllData> = (props) => {
    const [isChecked,setIsChecked] = React.useState(false);

    const handleInitialize = () => setIsChecked(false);
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
            initialize={handleInitialize}
            summary={<Typography>全データのクリア</Typography>}
            actions={
                <Button
                    variant="text"
                    color="primary"
                    disabled={isChecked　=== false}
                    onClick={handleClick}>
                    クリア実行
                </Button>
            }
        >
            <Box width="100%">
                <Typography color="error">【注意】この処理で削除したデータは復元できません。</Typography>
                <Typography>このアプリで登録した情報をすべて初期化します。削除と異なり引き続きこのアプリを利用する場合に実行してください。</Typography>
                <Typography>アプリの利用をやめる場合はこのメニューでなく、下部のデータの削除を実行することで初期化データすら残さず削除することができます。</Typography>
                <FormControlLabel
                    label="クリアを実行する場合はチェック"
                    onChange={handleCheck}
                    control={
                        <Checkbox checked={isChecked} />
                    }
                />
            </Box>
        </Accordion>
    )
}

export default ClearAllData;
