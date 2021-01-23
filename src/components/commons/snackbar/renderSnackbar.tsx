import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import Alert    from '@material-ui/lab/Alert';
import {tSnackbarSeverity} from './useSnackbar';


// スナックバー関連処理
type tSnackbarProps = {
    isOpen: boolean
    severity: tSnackbarSeverity,
    message: React.ReactNode,
    timeout: number | null,
    onClose: () => void
}
const RenderSnackbar:React.FC<tSnackbarProps> = (props) => {
    return (
        <Snackbar
            open={props.isOpen}
            onClose={props.onClose}
            autoHideDuration={props.timeout}
        >
        <Alert
            severity={props.severity}
            onClose={props.onClose}
        >
            {props.message}   
        </Alert>
      </Snackbar>
    )
}

export default RenderSnackbar;
