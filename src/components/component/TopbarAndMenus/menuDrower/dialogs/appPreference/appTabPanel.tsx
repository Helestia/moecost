import React from 'react';

import {tSwitchTarget_app}  from './index'

import ListItemInSwitch     from './commons/listItemInSwitch';
import ListItemInTextField  from './commons/listItemInTextField';

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
        [theme.breakpoints.down("xs")]: {
            width:"100%"
        },
        [theme.breakpoints.up("sm")]: {
            minWidth:"380px"
        }
    }
}))

type tAppTabPanel = {
    isDisplay:boolean,
    status:{
        isUseDark: boolean,
        isUseSmallTable: boolean,
        isDispCreationEverytime: boolean,
        suggestMax: number,
        isDefDispSummary: boolean,
        isDefDispCostSheet: boolean,
        isDefDispCreationTree: boolean,
    }
    handler:{
        suggestMax: (event: React.ChangeEvent<HTMLInputElement>) => void,
        switch: (target:tSwitchTarget_app, terminus?:boolean) => void,
    }
}
const AppTabPanel:React.FC<tAppTabPanel> = (props) => {
    const classes = useStyle();

    if(! props.isDisplay) return null;

    return (
        <Box
            className={classes.rootBox}
        >
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">表示設定全般</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">アプリ全体の色設定を黒背景に変更します。</Typography>}
                        isChecked={props.status.isUseDark}
                        onClick={props.handler.switch.bind(null,"useDark",undefined)}
                    >
                        ダークモード使用
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={
                            <>
                                <Typography variant="body2">表の余白を狭くすることにより、画面内の情報密度を上げます。</Typography>
                                <Typography variant="body2">スマホなどを使用中の場合、表の中をタップしづらくなる可能性があります。</Typography>
                            </>
                        }
                        isChecked={props.status.isUseSmallTable}
                        onClick={props.handler.switch.bind(null,"useSmallTable",undefined)}
                    >
                        緻密表の使用
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={
                            <>
                                <Typography variant="body2">原価表に常に最終成果物を表示します。</Typography>
                                <Typography variant="body2">OFFの場合、セット生産時のみ表示します。</Typography>
                            </>
                        }
                        isChecked={props.status.isDispCreationEverytime}
                        onClick={props.handler.switch.bind(null,"dispCreationEverytime",undefined)}
                    >
                        常時最終作成物表示
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">レシピ入力支援</Typography>}
                >
                    <ListItemInTextField
                        helpText={
                            <>
                                <Typography variant="body2">レシピ検索候補の表示可能とする最大上限数を設定します。</Typography>
                                <Typography variant="body2">0を指定することで無制限となり、未入力時にすべてのレシピが表示されます。</Typography>
                                <Typography variant="body2">動作が重いようでしたら、30程度に絞ることで検索時の動作を軽くできます。</Typography>
                            </>
                        }
                        value={props.status.suggestMax}
                        handleChange={props.handler.suggestMax}
                    >
                        検索候補表示数
                    </ListItemInTextField>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">結果の初期表示</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">計算後の画面で、結果の概要を初期状態で展開します。</Typography>}
                        isChecked={props.status.isDefDispSummary}
                        onClick={props.handler.switch.bind(null,"defDispSummary",undefined)}
                    >
                        概要
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">計算後の画面で、結果の原価表を初期状態で展開します。</Typography>}
                        isChecked={props.status.isDefDispCostSheet}
                        onClick={props.handler.switch.bind(null,"defDispCostSheet",undefined)}
                    >
                        原価表
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">計算後の画面で、結果の生産ツリーを初期状態で展開します。</Typography>}
                        isChecked={props.status.isDefDispCreationTree}
                        onClick={props.handler.switch.bind(null,"defDispCreationTree",undefined)}
                    >
                        原価表
                    </ListItemInSwitch>
                </List>
            </Paper>
        </Box>
    )
}

export default AppTabPanel;
