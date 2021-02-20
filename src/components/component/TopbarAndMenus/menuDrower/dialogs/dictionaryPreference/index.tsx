import React from 'react';

import DisplayDictionary    from './display';
import ChangeUsing          from './changeUsing';
import NewDictionary        from './newDictionary';
import CopyDictionary       from './copyDictionary';
import RenameDictionary     from './renameDictionary';
import DeleteDictionary     from './deleteDictionary';
import ExportDictionary     from './exportDictionary';
import ImportDictionary     from './importDictionary';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import DialogNormal             from '../../../../../commons/dialog/dialogNormal';
import useAccordionControl      from '../../../../../commons/accordion/useAccordionList';

import moecostDb                from '../../../../../../scripts/storage';

import Box              from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography       from '@material-ui/core/Typography';

type tDictionaryPreferenceDialogProps = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const DictionaryPreferenceDialog:React.FC<tDictionaryPreferenceDialogProps> = (props) => {
    const [dictionaryState,dictionaryInitialize] = useDictionaryState();
    const {
        isExpandeds,
        handleChangeAccordions,
        expandInitialize} = useAccordionControl("accordion",8);
    
    // ダイアログオープン時
    const dialogInitialize = () => {
        expandInitialize();
        dictionaryInitialize();
    }

    const handleSubmitAfter = () => dictionaryInitialize();

    const renderNowLoading = () => {
        if(dictionaryState.isLoading) return (
            <Box display="flex">
                <CircularProgress />
                <Box marginLeft="12px">
                    <Typography>現在辞書データ読込中</Typography>
                    <Typography>しばらくお待ちください</Typography>
                </Box>
            </Box>
        )
        return null;
    }

    return (
        <DialogNormal
            isOpen={props.isOpen}
            title="辞書データ管理"
            maxWidth="lg"
            handleClose={props.close}
            initialize={dialogInitialize}
        >
            <Box marginBottom={2}>
                <Typography>このダイアログでは、辞書(=ツール内で登録されたアイテムの入手手段)を管理することができます。</Typography>
                <Typography>利用サーバーごとにアイテムの入手金額が異なる場合や、身内販売用に安い金額を設定したい場合等に利用できます。</Typography>
            </Box>
            {renderNowLoading()}
            <DisplayDictionary
                isExpanded={isExpandeds[0]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,0)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
            />
            <ChangeUsing
                isExpanded={isExpandeds[1]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,1)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <NewDictionary
                isExpanded={isExpandeds[2]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,2)}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <CopyDictionary
                isExpanded={isExpandeds[3]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,3)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <RenameDictionary
                isExpanded={isExpandeds[4]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,4)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <DeleteDictionary
                isExpanded={isExpandeds[5]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,5)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleSubmitAfter={handleSubmitAfter}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ExportDictionary
                isExpanded={isExpandeds[6]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,6)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
            />
            <ImportDictionary
                isExpanded={isExpandeds[7]}
                isLoading={dictionaryState.isLoading}
                onChange={handleChangeAccordions.bind(null,7)}
                usingDictionary={dictionaryState.usingDictionaryName}
                dictionaryNames={dictionaryState.dictionaryNames}
                handleOpenSnackbar={props.handleOpenSnackbar}
                handleSubmitAfter={handleSubmitAfter}
            />
        </DialogNormal>
    )
}

type tUseDictionaryState = () => [
    {
        isLoading:boolean,
        usingDictionaryName: string,
        dictionaryNames: string[]
    },
    () => void
];

const useDictionaryState:tUseDictionaryState = () => {
    const [isLoading,setIsLoading] = React.useState(false);
    const [usingDictionaryName,setUsingDictionaryName] = React.useState("");
    const [dictionaryNames,setDictionaryNames] = React.useState<string[]>([]);

    const initialize:()=> void = () => {
        setIsLoading(true);
        setUsingDictionaryName("");
        setDictionaryNames([]);
        (async() => {
            const dictionaryNames = await moecostDb.retrieveAllDictionaryNames();
            setDictionaryNames(dictionaryNames);
            setUsingDictionaryName(moecostDb.使用辞書.使用中辞書)
            setIsLoading(false);
        })();
    }
    return [{
        isLoading: isLoading,
        usingDictionaryName: usingDictionaryName,
        dictionaryNames: dictionaryNames
    },initialize]
}

export default DictionaryPreferenceDialog;
