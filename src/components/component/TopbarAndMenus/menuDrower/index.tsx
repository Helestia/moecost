import React from 'react';
import useDialogParent         from '../../../commons/dialog/useDialogParent';
import { tHandleOpenSnackbar } from '../../../commons/snackbar/useSnackbar';

import AppPreferenceDialog from './dialogs/appPreference/index';
import AllDataDialog       from './dialogs/allData/index';
import DictionaryPreferenceDialog from './dialogs/dictionaryPreference/index';

import ChangeLogDialog      from './dialogs/changeLog';

import Drawer               from '@material-ui/core/Drawer';
import List                 from '@material-ui/core/List';
import ListItem             from '@material-ui/core/ListItem';
import SettingIcon          from '@material-ui/icons/SettingsApplications';
import LocalLibraryIcon     from '@material-ui/icons/LocalLibrary';
import NewReleasesIcon      from '@material-ui/icons/NewReleases';
import HelpIcon             from '@material-ui/icons/Help';
import ForumIcon            from '@material-ui/icons/Forum';
import StorageIcon          from '@material-ui/icons/Storage';


type tMenuDrower = {
    isMenuOpened: boolean,
    handleOpenSnackbar: tHandleOpenSnackbar,
    closeMenu: () => void,
    changeAppPreference: () => void
}

const MenuDrower:React.FC<tMenuDrower> = (props) => {
    const hooksAppDialog        = useDialogParent();
    const hooksDictionaryDialog = useDialogParent();
    const hooksAllDataDialog    = useDialogParent();
    const hooksChangeLogDialog  = useDialogParent();

    const handleClose = () => props.closeMenu();

    const handleReportsBords = () => window.open("http://moecost.bbs.fc2.com/","_blank");
    const handleHelps = () => window.open("./helps/", "_blank");

    return (
        <Drawer
            container={window.document.body}
            variant="temporary"
            anchor="left"
            open={props.isMenuOpened}
            onClose={handleClose}
        >
            <List>
                <ListItem
                    button
                    onClick={hooksAppDialog.handleOpen}
                >
                    <SettingIcon />
                    アプリ設定
                </ListItem>
                <ListItem
                    button
                    onClick={hooksDictionaryDialog.handleOpen}
                >
                    <LocalLibraryIcon />
                    辞書データ管理
                </ListItem>
                <ListItem
                    button
                    onClick={hooksAllDataDialog.handleOpen}
                >
                    <StorageIcon />
                    全データ管理
                </ListItem>
                <ListItem
                    button
                    onClick={handleHelps}
                >
                    <HelpIcon />
                    使い方・ヘルプ
                </ListItem>
                <ListItem
                    button
                    onClick={handleReportsBords}
                >
                    <ForumIcon />
                    不具合報告・機能要望
                </ListItem>
                <ListItem
                    button
                    onClick={hooksChangeLogDialog.handleOpen}
                >
                    <NewReleasesIcon />
                    バージョン情報・更新履歴
                </ListItem>
            </List>
            {/*ダイアログ関係*/}
            <AppPreferenceDialog 
                isOpen={hooksAppDialog.isOpen}
                handleOpenSnackbar={props.handleOpenSnackbar}
                close={hooksAppDialog.handleClose}
                changeAppPreference={props.changeAppPreference}
            />

            <DictionaryPreferenceDialog
                isOpen={hooksDictionaryDialog.isOpen}
                handleOpenSnackbar={props.handleOpenSnackbar}
                close={hooksDictionaryDialog.handleClose}
            />

            <AllDataDialog
                isOpen={hooksAllDataDialog.isOpen}
                handleOpenSnackbar={props.handleOpenSnackbar}
                changeAppPreference={props.changeAppPreference}
                close={hooksAllDataDialog.handleClose}
            />

            <ChangeLogDialog
                isOpen={hooksChangeLogDialog.isOpen}
                close={hooksChangeLogDialog.handleClose}
            />
        </Drawer>
    )
}

export default MenuDrower;
