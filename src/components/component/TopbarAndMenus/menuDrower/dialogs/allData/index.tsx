import React from 'react';

import ExportAllData from './exportAllData';
import ImportAllData from './importAllData';
import ClearAllData  from './clearAllData';
import DeleteAllData from './deleteAllData';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import useAccordionList         from '../../../../../commons/accordion/useAccordionList';
import DialogNormal             from '../../../../../commons/dialog/dialogNormal';

import Typography       from '@material-ui/core/Typography';

type tAllDataDialog = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}

const AllDataDialog:React.FC<tAllDataDialog> = (props) => {
    const accordionHooks = useAccordionList("accordion",4);

    return (
        <DialogNormal
            isOpen={props.isOpen}
            handleClose={props.close}
            title={<Typography>データ全体の管理</Typography>}
            maxWidth="lg"
            initialize={accordionHooks.expandInitialize}
        >
            <ExportAllData
                isExpanded={accordionHooks.isExpandeds[0]}
                handleExpand={accordionHooks.handleChangeAccordions.bind(null,0)}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleClose={props.close}
            />
            <ImportAllData
                isExpanded={accordionHooks.isExpandeds[1]}
                handleExpand={accordionHooks.handleChangeAccordions.bind(null,1)}
                changeAppPreference={props.changeAppPreference}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleClose={props.close}
            />
            <ClearAllData
                isExpanded={accordionHooks.isExpandeds[2]}
                handleExpand={accordionHooks.handleChangeAccordions.bind(null,2)}
                handleOpenSnackbar={props.handleOpenSnackbar}
                changeAppPreference={props.changeAppPreference}
                handleClose={props.close}
            />
            <DeleteAllData
                isExpanded={accordionHooks.isExpandeds[3]}
                handleExpand={accordionHooks.handleChangeAccordions.bind(null,3)}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
        </DialogNormal>
    )
}




export default AllDataDialog;
