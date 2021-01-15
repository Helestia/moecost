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
        display:"flex",
        [theme.breakpoints.up("lg")] : {
            flexWrap: "wrap"
        },
        [theme.breakpoints.down("md")] : {
            flexDirection:"column",
            width:"100%"
        }
    },
    paper: {
        flex: "1 1",
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
        isFailLostUnlost: boolean,
        isFailLostOverwrite: boolean,
        isUnlostOverwrite: boolean
    }
    handler:{
        switch: (target:tSwitchTarget_calc,terminus?:boolean) => void,
    }
}
const AppTabPanel:React.FC<tAppTabPanel> = (props) => {
    const classes = useStyle();

    if(! props.isDisplay) return null;

    const hanldeChangeSwitchFailLostOverwrite = () => {
        if(! props.status.isFailLostUnlost) return () => {};
        return props.handler.switch.bind(null,"failLostOverwrite",undefined)
    }
    
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
                    subheader={<Typography variant="subtitle1">特殊消費:失敗時消失</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">コンバイン成功を前提とし、必要個数を常に１に固定します。</Typography>}
                        isChecked={props.status.isFailLostUnlost}
                        onClick={props.handler.switch.bind(null,"failLostUnlost",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        必要個数を1に固定
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={
                            <>
                                <Typography variant="body2">消失しないアイテムなので、原価をゼロとして計算します。</Typography>
                                <Typography variant="body2">「必要個数を1に固定」を使用することが前提です。</Typography>
                            </>
                        }
                        isChecked={props.status.isFailLostOverwrite}
                        disabled={(! props.status.isFailLostUnlost)}
                        onClick={hanldeChangeSwitchFailLostOverwrite()}
                        listItemClassName={props.listItemClassName}
                    >
                        原価をゼロに固定
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">特殊消費:未消費</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">消失しないアイテムなので、原価をゼロとして計算します。</Typography>}
                        isChecked={props.status.isUnlostOverwrite}
                        onClick={props.handler.switch.bind(null,"unLostOverwrite",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        原価をゼロに固定
                    </ListItemInSwitch>
                </List>
            </Paper>
        </Box>
    )
}

export default AppTabPanel;
