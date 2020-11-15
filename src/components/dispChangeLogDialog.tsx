import React from 'react';
import {History} from '../scripts/jsonReader';
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

interface iDispChangeLogDialog {
    isOpen : boolean,
    close:() => void
}

const DispChangeLogDialog:React.FC<iDispChangeLogDialog> = (props) => {
    return (
        <Dialog
            open={props.isOpen}
            onClose={props.close}
            scroll="paper"
        >
            <DialogTitle>
                <Typography variant="h4">開発状況・ログ</Typography>
                <Typography variant="h6">version.{History.version}</Typography>
            </DialogTitle>
            <DialogContent
                dividers={true}
            >
                {History.history.map((h,index) => {
                    return (
                        <Box key={"history-" + index}>
                            <Typography key={index} variant="subtitle1">[ver.{h.version}] {h.更新日}</Typography>
                            <ul>
                                {h.更新内容.map((updateText,index2)=>{
                                    return (
                                        <li key={"history-" +index + "-" + index2}>{updateText}</li>
                                    )
                                })}
                            </ul>
                        </Box>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}

export default DispChangeLogDialog