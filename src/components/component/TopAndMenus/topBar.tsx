import React from 'react';
import { tHandleOpenSnackbar } from '../../../App';
import AppPreferenceDialog from './appPreferenceDialog'
import DispChangeLogDialog from './dispChangeLogDialog'
import AllDataDialog       from './allDataDialog';
import DictionaryPreferenceDialog from './dictionaryPreferenceDialog';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Iconbutton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';



import MenuIcon             from '@material-ui/icons/Menu';
import SettingIcon          from '@material-ui/icons/SettingsApplications';
import LocalLibraryIcon     from '@material-ui/icons/LocalLibrary';
import NewReleasesIcon      from '@material-ui/icons/NewReleases';
import StoreIcon            from '@material-ui/icons/Store';
import ForumIcon            from '@material-ui/icons/Forum';
import StorageIcon          from '@material-ui/icons/Storage';


export interface iMenuDrower {
    isMenuOpened: boolean,
    handleOpenSnackbar: tHandleOpenSnackbar,
    closeMenu: () => void,
    changeAppPreference: () => void
}

const MenuDrower:React.FC<iMenuDrower> = (props) => {
    const [isOpenAppPreferenceDialog,setIsOpenAppPreferenceDialog] = React.useState(false);
    const [isOpenDictionaryPreferenceDialog,setIsOpenDictionaryPreferenceDialog]       = React.useState(false);
    const [isOpenVendorDialog,setIsOpenVendorDialog]               = React.useState(false);
    const [isOpenAllDataDialog,setIsOpenAllDataDialog]             = React.useState(false);
    const [isOpenChangeLogDialog,setIsOpenChangeLogDialog]         = React.useState(false);

    const handleClose = () => props.closeMenu();

    const handleOpenAppPreferenceDialog  = () => setIsOpenAppPreferenceDialog(true);
    const handleCloseAppPreferenceDialog = () => setIsOpenAppPreferenceDialog(false);

    const handleOpenDictionaryPreferenceDialog  = () => setIsOpenDictionaryPreferenceDialog(true);
    const handleCloseDictionaryPreferenceDialog = () => setIsOpenDictionaryPreferenceDialog(false);

    const handleOpenVendorDialog  = () => setIsOpenVendorDialog(true);
    const handleCloseVendorDialog = () => setIsOpenVendorDialog(false);

    const handleOpenAllDataDialog  = () => setIsOpenAllDataDialog(true);
    const handleCloseAllDataDialog = () => setIsOpenAllDataDialog(false);

    const handleOpenChangeLogDialog  = () => setIsOpenChangeLogDialog(true);
    const handleCloseChangeLogDialog = () => setIsOpenChangeLogDialog(false);

    const handleReportsBords = () => {
        window.open("http://moecost.bbs.fc2.com/","_blank");
    }

    return (
        <Drawer
            container={window.document.body}
            variant="temporary"
            anchor="left"
            open={props.isMenuOpened}
            onClose={handleClose}
        >
            <Toolbar>
                <List>
                    <ListItem button onClick={handleOpenAppPreferenceDialog}>
                        <SettingIcon />
                        アプリ設定
                    </ListItem>
                    <ListItem button onClick={handleOpenDictionaryPreferenceDialog}>
                        <LocalLibraryIcon />
                        辞書データ管理
                    </ListItem>
                    <ListItem button disabled onClick={handleOpenVendorDialog}>
                        <StoreIcon />
                        <s>ベンダー管理</s>
                    </ListItem>
                    <ListItem button onClick={handleOpenAllDataDialog}>
                        <StorageIcon />
                        全データ管理
                    </ListItem>
                    <ListItem button onClick={handleReportsBords}>
                        <ForumIcon />
                        不具合報告・機能要望
                    </ListItem>
                    <ListItem button onClick={handleOpenChangeLogDialog}>
                        <NewReleasesIcon />
                        バージョン情報・更新履歴
                    </ListItem>
                </List>

            </Toolbar>
            {/*ダイアログ関係*/}
            <AppPreferenceDialog 
                isOpen={isOpenAppPreferenceDialog}
                handleOpenSnackbar={props.handleOpenSnackbar}
                close={handleCloseAppPreferenceDialog}
                changeAppPreference={props.changeAppPreference}
            />

            <DictionaryPreferenceDialog
                isOpen={isOpenDictionaryPreferenceDialog}
                handleOpenSnackbar={props.handleOpenSnackbar}
                close={handleCloseDictionaryPreferenceDialog}
            />

            <AllDataDialog
                isOpen={isOpenAllDataDialog}
                handleOpenSnackbar={props.handleOpenSnackbar}
                changeAppPreference={props.changeAppPreference}
                close={handleCloseAllDataDialog}
            />

            <DispChangeLogDialog
                isOpen={isOpenChangeLogDialog}
                close={handleCloseChangeLogDialog}
            />

        </Drawer>





    )
}




export interface iTopBar {
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}
const TopBar: React.FC<iTopBar> = (props) => {
    const [isMenuOpened,setIsMenuOpened] = React.useState(false);

    // 表示設定値変更
    const changeAppPreference = () => props.changeAppPreference();
    const handleDrowerOpenOrClose = () => setIsMenuOpened(true);
    const closeMenu = () => setIsMenuOpened(false);

    return (
        <>
            <AppBar 
                position="sticky"
                color="default">
                <Toolbar>
                    <Iconbutton
                        color="inherit"
                        aria-label="open drower"
                        edge="start"
                        onClick={handleDrowerOpenOrClose}
                        >
                        <MenuIcon />
                    </Iconbutton>
                    <Typography variant="h6" component="h1" noWrap >
                        もえこすと - 生産品原価計算器
                    </Typography>
                </Toolbar>
            </AppBar>
            <MenuDrower
                isMenuOpened={isMenuOpened}
                handleOpenSnackbar={props.handleOpenSnackbar}
                closeMenu={closeMenu}
                changeAppPreference={changeAppPreference} />
        </>
    )
}

export default TopBar;