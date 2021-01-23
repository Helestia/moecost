import React from 'react';
import { tHandleOpenSnackbar } from '../../commons/snackbar/useSnackbar';
import MenuDrower from './menuDrower/index';

import AppBar     from '@material-ui/core/AppBar';
import Toolbar    from '@material-ui/core/Toolbar';
import Iconbutton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon   from '@material-ui/icons/Menu';

type tTopBar = {
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}
const TopBar: React.FC<tTopBar> = (props) => {
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