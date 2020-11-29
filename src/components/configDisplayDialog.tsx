import React from 'react'
import moecostDb,{iDisplay} from '../scripts/storage';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

type tConfigDisplayDialog = {
    isOpen : boolean,
    close : () => void,
    changeDisplayConfig : () => Promise<void>
}

const ConfigDisplayDialog:React.FC<tConfigDisplayDialog> = (props) => {
    const [isDarkMode,setIsDarkMode] = React.useState(moecostDb.表示設定.ダークモード);
    const [isSmallTable,setIsSmallTable] = React.useState(moecostDb.表示設定.smallテーブル);
    const [isSimpleMode,setIsSimpleMode] = React.useState(moecostDb.表示設定.簡易表示);
    const [isHiddenS,setIsHiddenS] = React.useState(moecostDb.表示設定.初期非表示設定.概要);
    const [isHiddenCL,setIsHiddenCL] = React.useState(moecostDb.表示設定.初期非表示設定.原価表);
    const [isHiddenCT,setIsHiddenCT] = React.useState(moecostDb.表示設定.初期非表示設定.生産ツリー);

    const handleClickList = (str: string) => () => {
        const dbData: iDisplay = {
            ダークモード : isDarkMode,
            smallテーブル: isSmallTable,
            簡易表示 : isSimpleMode,
            初期非表示設定 : {
                概要 : isHiddenS,
                原価表 : isHiddenCL,
                生産ツリー : isHiddenCT
            }
        }

        if(str === "darkMode"){
            setIsDarkMode(! isDarkMode);
            dbData.ダークモード = (! isDarkMode);
            moecostDb.registerDisplay(dbData);
            props.changeDisplayConfig();
        }
        if(str === "smallTable"){
            setIsSmallTable(! isSmallTable);
            dbData.smallテーブル = (! isSmallTable);
            moecostDb.registerDisplay(dbData);
            props.changeDisplayConfig();
        }
        if(str === "simpleMode"){
            setIsSimpleMode(! isSimpleMode);
            dbData.簡易表示 = (! isSimpleMode);
            moecostDb.registerDisplay(dbData);
            props.changeDisplayConfig();
        }
        if(str === "hiddenS"){
            setIsHiddenS(! isHiddenS);
            dbData.初期非表示設定.概要 = (! isHiddenS);
            moecostDb.registerDisplay(dbData);
        }
        if(str === "hiddenCL"){
            setIsHiddenCL(! isHiddenCL);
            dbData.初期非表示設定.原価表 = (! isHiddenCL);
            moecostDb.registerDisplay(dbData);
        }
        if(str === "hiddenCT"){
            setIsHiddenCT(! isHiddenCT);
            dbData.初期非表示設定.生産ツリー = (! isHiddenCT);
            moecostDb.registerDisplay(dbData);
        }
    }

    return (
        <Dialog 
            open={props.isOpen}
            onClose={props.close}
        >
            <Box marginX={2}>
                <DialogTitle>表示設定変更</DialogTitle>
                <List
                    subheader={<ListSubheader>一般</ListSubheader>}>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("darkMode")}>
                        <ListItemText primary="ダークモードを使用" />
                        <Switch checked={isDarkMode} onChange={handleClickList("darkMode")}/>
                    </ListItem>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("smallTable")}>
                        <ListItemText primary="緻密テーブルの使用" />
                        <Switch checked={isSmallTable} onChange={handleClickList("smallTable")}/>
                    </ListItem>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("simpleMode")}>
                        <ListItemText primary="生産ツリーの簡易表示" />
                        <Switch checked={isSimpleMode} onChange={handleClickList("simpleMode")}/>
                    </ListItem>
                </List>
                <List
                    subheader={<ListSubheader>初期状態での非表示設定</ListSubheader>}>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("hiddenS")}>
                        <ListItemText primary="概要" />
                        <Switch checked={isHiddenS} onChange={handleClickList("hiddenS")}/>
                    </ListItem>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("hiddenCL")}>
                        <ListItemText primary="原価表" />
                        <Switch checked={isHiddenCL} onChange={handleClickList("hiddenCL")}/>
                    </ListItem>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("hiddenCT")}>
                        <ListItemText primary="生産ツリー" />
                        <Switch checked={isHiddenCT} onChange={handleClickList("hiddenCT")}/>
                    </ListItem>
                </List>
            </Box>
        </Dialog>
    )
}

export default ConfigDisplayDialog;
