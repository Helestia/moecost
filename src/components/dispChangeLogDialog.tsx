import React from 'react';
import history from './../reference/history.json';
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
                <Typography variant="h6">version.{history.version}</Typography>
            </DialogTitle>
            <DialogContent
                dividers={true}
            >
                {history.history.map((h) => {
                    return (
                        <>
                            <Typography variant="subtitle1">[ver.{h.version}] {h.更新日}</Typography>
                            <ul>
                                {h.更新内容.map((updateText)=>{
                                    return (
                                        <li>{updateText}</li>
                                    )
                                })}
                            </ul>
                        </>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}

export default DispChangeLogDialog