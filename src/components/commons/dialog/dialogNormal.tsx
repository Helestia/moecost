import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

type tDialogProps = {
    isOpen:boolean,
    title:React.ReactNode,
    maxWidth: false | "lg" | "xs" | "sm" | "md" | "xl",
    actions?:React.ReactNode,
    handleClose:() => void,
    initialize?: () => void
}

const DialogNormal:React.FC<tDialogProps> = (props) => {
    const init = useDialog(props.isOpen);
    if(init && props.initialize) props.initialize();

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            maxWidth={props.maxWidth}
            fullWidth
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

const useDialog = (isOpen:boolean) => {
    const [beforeOpen,setBeforeOpen] = React.useState(false);
    
    if(isOpen && (! beforeOpen)){
        setBeforeOpen(true);
        return true;
    }
    if((! isOpen) && beforeOpen) setBeforeOpen(false)
    return false;
}

export default DialogNormal;
