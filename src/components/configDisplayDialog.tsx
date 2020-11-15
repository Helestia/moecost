import React from 'react'
import moecostDb,{iDisplay} from '../scripts/storage';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

type tConfigDisplayDialog = {
    isOpen : boolean,
    close : () => void,
    changeUseDarkMode : () => Promise<void>
}

const ConfigDisplayDialog:React.FC<tConfigDisplayDialog> = (props) => {
    const [isDarkMode,setIsDarkMode] = React.useState(moecostDb.表示設定.ダークモード);
    const [isSimpleMode,setIsSimpleMode] = React.useState(moecostDb.表示設定.簡易表示);
    const [isHiddenS,setIsHiddenS] = React.useState(moecostDb.表示設定.初期非表示設定.概要);
    const [isHiddenCL,setIsHiddenCL] = React.useState(moecostDb.表示設定.初期非表示設定.生成アイテム一覧);
    const [isHiddenML,setIsHiddenML] = React.useState(moecostDb.表示設定.初期非表示設定.素材_余剰生産品_副産物一覧);
    const [isHiddenCT,setIsHiddenCT] = React.useState(moecostDb.表示設定.初期非表示設定.生産ツリー);

    const handleClickList = (str: string) => () => {
        const dbData: iDisplay = {
            "ダークモード" : isDarkMode,
            "簡易表示" : isSimpleMode,
            "初期非表示設定" : {
                "概要" : isHiddenS,
                "生成アイテム一覧" : isHiddenCL,
                "素材_余剰生産品_副産物一覧" : isHiddenML,
                "生産ツリー" : isHiddenCT
            }
        }

        if(str === "darkMode"){
            setIsDarkMode(! isDarkMode);
            dbData.ダークモード = (! isDarkMode);
            moecostDb.registerDisplay(dbData);
            props.changeUseDarkMode();
        }
        if(str === "simpleMode"){
            setIsSimpleMode(! isSimpleMode);
            dbData.簡易表示 = (! isSimpleMode);
            moecostDb.registerDisplay(dbData);
        }
        if(str === "hiddenS"){
            setIsHiddenS(! isHiddenS);
            dbData.初期非表示設定.概要 = (! isHiddenS);
            moecostDb.registerDisplay(dbData);
        }
        if(str === "hiddenCL"){
            setIsHiddenCL(! isHiddenCL);
            dbData.初期非表示設定.生成アイテム一覧 = (! isHiddenCL);
            moecostDb.registerDisplay(dbData);
        }
        if(str === "hiddenML"){
            setIsHiddenML(! isHiddenML);
            dbData.初期非表示設定.素材_余剰生産品_副産物一覧 = (! isHiddenML);
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
                        <ListItemText primary="生産品一覧" />
                        <Switch checked={isHiddenCL} onChange={handleClickList("hiddenCL")}/>
                    </ListItem>
                    <ListItem
                        button
                        dense
                        onClick={handleClickList("hiddenML")}>
                        <ListItemText primary="素材・余剰生産品・副産物一覧" />
                        <Switch checked={isHiddenML} onChange={handleClickList("hiddenML")}/>
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
