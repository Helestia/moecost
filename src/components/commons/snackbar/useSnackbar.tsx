import React from 'react';
import {SnackbarCloseReason} from '@material-ui/core/Snackbar';

export type tSnackbarSeverity = "success" | "warning" | "info" | "error" | undefined;
export type tHandleOpenSnackbar = (
    severity: tSnackbarSeverity,
    message: React.ReactNode,
    autoHideDuration?: number|null) => void

// スナックバーの標準のタイムアウト時間
const defSnackbarTimeout = 5000;

type tUseSnackbar = () => {
    snackbarIsOpen:boolean,
    snackbarSeverity:tSnackbarSeverity,
    snackbarMessage:React.ReactNode,
    snackbarAutoHideDuration: number|null,
    handleOpenSnackbar: tHandleOpenSnackbar,
    handleCloseSnackbar: (event?:React.SyntheticEvent,reason?:SnackbarCloseReason) => void
}

const useSnackbar:tUseSnackbar = () => {
    const [isOpenSnackbar,setIsOpenSnackbar] = React.useState(false);
    const [snackbarSeverity,setSnackbarSeverity] = React.useState<tSnackbarSeverity>(undefined);
    const [snackbarMessage,setSnackbarMessage] = React.useState<React.ReactNode>(<></>);
    const [snackbarTimeout,setSnackbarTimeout] = React.useState<number|null>(null);

    const handleOpenSnackbar:tHandleOpenSnackbar = (severity,message,autoHideDuration) => {
        setIsOpenSnackbar(true);
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        if(autoHideDuration === undefined) setSnackbarTimeout(defSnackbarTimeout);
        else setSnackbarTimeout(autoHideDuration);
    }
    const handleCloseSnackbar = (event?:React.SyntheticEvent,reason?:SnackbarCloseReason) =>{
        if(reason === "clickaway") return;
        setIsOpenSnackbar(false);
    }

    return {
        snackbarIsOpen:isOpenSnackbar,
        snackbarSeverity: snackbarSeverity,
        snackbarMessage: snackbarMessage,
        snackbarAutoHideDuration: snackbarTimeout,
        handleOpenSnackbar: handleOpenSnackbar,
        handleCloseSnackbar: handleCloseSnackbar
    }
}

export default useSnackbar;
