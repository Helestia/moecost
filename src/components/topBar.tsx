import React from 'react';
import ConfigDisplayDialog from './configDisplayDialog'
import DispChangeLogDialog from './dispChangeLogDialog'

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Iconbutton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SettingIcon from '@material-ui/icons/SettingsApplications';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import StoreIcon from '@material-ui/icons/Store';
import ForumIcon from '@material-ui/icons/Forum';


export interface iMenuDrower {
    isMenuOpened: boolean,
    closeMenu: () => void,
    changeDisplayConfig : () => Promise<void>
}

const MenuDrower:React.FC<iMenuDrower> = (props) => {
    const [isOpenConfigDisplay,setIsOpenConfigDisplay] = React.useState(false);
    const [isOpenConfigDictionary,setIsOpenConfigDictionary] = React.useState(false);

    const [isOpenDispChangeLog,setIsOpenDispChangeLog] = React.useState(false);

    const handleClose = () => {
        props.closeMenu();
    }

    const handleConfigDisplay = () => {
        setIsOpenConfigDisplay(true);
    }
    const handleConfigDisplayClose = () => {
        setIsOpenConfigDisplay(false);
    }

    const handleConfigDictionary = () => {

    }

    const handleManegementStore = () => {

    }

    const handleDispChangeLog = () => {
        setIsOpenDispChangeLog(true);
    }
    const handleDispChangeLogClose = () => {
        setIsOpenDispChangeLog(false);
    }

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
                    <ListItem button onClick={handleConfigDisplay}>
                        <SettingIcon />
                        表示設定
                    </ListItem>
                    <ListItem button disabled onClick={handleConfigDictionary}>
                        <LocalLibraryIcon />
                        <s>辞書設定</s>
                    </ListItem>
                    <ListItem button disabled onClick={handleManegementStore}>
                        <StoreIcon />
                        <s>ベンダー管理</s>
                    </ListItem>
                    <ListItem button onClick={handleReportsBords}>
                        <ForumIcon />
                        不具合報告・機能要望
                    </ListItem>
                    <ListItem button onClick={handleDispChangeLog}>
                        <NewReleasesIcon />
                        バージョン情報・更新履歴
                    </ListItem>




                    

                </List>

            </Toolbar>
            
            <ConfigDisplayDialog 
                isOpen={isOpenConfigDisplay}
                close={handleConfigDisplayClose}
                changeDisplayConfig={() => props.changeDisplayConfig()}
            />





            <DispChangeLogDialog
                isOpen={isOpenDispChangeLog}
                close={handleDispChangeLogClose}
            />
        </Drawer>





    )
}




export interface iTopBar {
    changeDisplayConfig : () => Promise<void>
}
const TopBar: React.FC<iTopBar> = (props) => {
    const [isMenuOpened,setIsMenuOpened] = React.useState(false);

    // 表示設定値変更
    const changeDisplayConfig = async () => {
        props.changeDisplayConfig();
    }
    const handleDrowerOpenOrClose = () => {
        setIsMenuOpened(true);
    }
    const closeMenu = () => {
        setIsMenuOpened(false);
    }

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
                closeMenu={closeMenu}
                changeDisplayConfig={changeDisplayConfig} />
        </>
    )
}

export default TopBar;