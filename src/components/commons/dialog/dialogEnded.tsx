import React from 'react'

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
/**
 * クローズ不可のダイアログ
 * データベース削除時のみ使用予定
 */
type tDialogProps = {
    isOpen:boolean,
    title:React.ReactNode,
    maxWidth?: false | "lg" | "xs" | "sm" | "md" | "xl",
    actions?:React.ReactNode
}

const DialogEnded:React.FC<tDialogProps> = (props) => {
    return (
        <Dialog
            open={props.isOpen}
            fullWidth
            maxWidth={props.maxWidth}
            scroll="paper"
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent
                dividers
            >
                {props.children}
            </DialogContent>
            {(props.actions)
                ? (<DialogActions>
                    {props.actions}
                </DialogActions>)
                : null}
        </Dialog>
    )
}

export default DialogEnded;
