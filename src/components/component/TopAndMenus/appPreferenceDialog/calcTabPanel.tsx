import React from 'react';

import {tSwitchTarget_calc} from './index'

import ListItemInSwitch     from './listItemInSwitch';

import Box          from '@material-ui/core/Box';
import Paper        from '@material-ui/core/Paper';
import List         from '@material-ui/core/List';
import Typography   from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme}  from '@material-ui/core/styles';
const useStyle = makeStyles((theme:Theme) => createStyles({
    rootBox: {
        width:"100%",
        display:"flex",
        justifyContent: "center",
        [theme.breakpoints.up("lg")] : {
            flexWrap: "wrap"
        },
        [theme.breakpoints.down("md")] : {
            flexDirection:"column",
        }
    },
    paper: {
        flex: "auto",
        [theme.breakpoints.down("md")]: {
            width: "100%"
        }
    },
    list:{
        marginBottom:theme.spacing(2),
        minWidth:"380px"
    }
}));

type tAppTabPanel = {
    isDisplay:boolean,
    listItemClassName: string,
    status:{
        isUseWarNpc: boolean,
        isTrashNoLost: boolean,
        isTrashSurplus: boolean,
        isTrashByproduct: boolean
    }
    handler:{
        switch: (target:tSwitchTarget_calc,terminus?:boolean) => void,
    }
}
const AppTabPanel:React.FC<tAppTabPanel> = (props) => {
    const classes = useStyle();

    if(! props.isDisplay) return null;
    return (
        <Box className={classes.rootBox}>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">販売情報</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">War Ageの販売情報を計算結果に含めます。</Typography>}
                        isChecked={props.status.isUseWarNpc}
                        onClick={props.handler.switch.bind(null,"useWarNpc",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        War販売物の利用
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">目標物以外の廃棄設定</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">未消費系素材（未消費／失敗時消失）を使用時、初期で廃棄状態にセットします。</Typography>}
                        isChecked={props.status.isTrashNoLost}
                        onClick={props.handler.switch.bind(null,"trashNoLost",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        消失しない素材
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">副産物が生成されるレシピ作成時、初期で廃棄状態にセットします。</Typography>}
                        isChecked={props.status.isTrashByproduct}
                        onClick={props.handler.switch.bind(null,"trashByproduct",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        副産物
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">余分に作成された生産物が作成される場合、初期で廃棄状態にセットします。</Typography>}
                        isChecked={props.status.isTrashSurplus}
                        onClick={props.handler.switch.bind(null,"trashSurplus",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        余剰生産品
                    </ListItemInSwitch>
                </List>
            </Paper>
        </Box>
    )
}

export default AppTabPanel;
