import React from 'react';
import ConfigIcon from '../resource/configlogo.svg'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { decodedTextSpanIntersectsWith } from 'typescript';
/*
interface iConfigDialogProps {
    open: boolean,
    onClose : (reflesh:boolean)=> void
}

const ConfigDialog = (props:iConfigDialogProps) => {

} 




export interface iConfigSectionProps {
    rtnFunc : () => void
}

export const ConfigSection = (props:iConfigSectionProps) => {
    const [isOpen,setIsOpen] = React.useState(false);

    const handleOpenDialog = () => {
        setIsOpen(true);
    }

    const handleCloseDialog = (reflesh:boolean) => {
        setIsOpen(false);
        if(reflesh){
            props.rtnFunc()
        }
    }
    
    return (
        <div className="configImage">
            <img
                src={ConfigIcon}
                alt="設定変更"
                onClick={handleOpenDialog}
            />
            <ConfigDialog
                open={isOpen}
                onClose={handleCloseDialog}
            />
        </div>
    )

}

*/