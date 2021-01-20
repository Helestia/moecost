import React from 'react';

import {
    tSwitchTarget_treeCreation,
    tSwitchTarget_treeCommonAndUnknown,
    tSwitchTarget_treeUserAndNpc,
    tSwitchTarget_treeSet}  from './index'

import ListItemInSwitch     from './listItemInSwitch';
import ListItemButton       from './listItemButton';

import Box          from '@material-ui/core/Box';
import Divider      from '@material-ui/core/Divider';
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
            flexDirection:"column"
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
}))

type tAppTabPanel = {
    isDisplay:boolean,
    listItemClassName: string,
    creationStatus: {
        isSkill: boolean,
        isTechnique: boolean,
        isDurable: boolean,
        isSpExpense: boolean,
        isByproduct: boolean,
        isSurplus: boolean,
        isCreateRemark: boolean,
        isNeedRecipe: boolean,
        isMaxCreate: boolean,
        isRemark: boolean
    },
    userStatus: {
        isDurable: boolean,
        isSpExpense: boolean,
        isPrice: boolean
    },
    npcStatus: {
        isDurable: boolean,
        isSpExpense: boolean,
        isPrice: boolean
    },
    commonStatus: {
        isDurable: boolean,
        isSpExpense: boolean,
        isMessage: boolean
    },
    unknownStatus: {
        isDurable: boolean,
        isSpExpense: boolean,
        isMessage: boolean
    }
    handler:{
        switchCreation: (target: tSwitchTarget_treeCreation, terminus?: boolean | undefined) => void,
        switchUser: (target: tSwitchTarget_treeUserAndNpc, terminus?: boolean | undefined) => void,
        switchNpc: (target: tSwitchTarget_treeUserAndNpc, terminus?: boolean | undefined) => void,
        switchCommon: (target: tSwitchTarget_treeCommonAndUnknown, terminus?: boolean | undefined) => void,
        switchUnknown: (target: tSwitchTarget_treeCommonAndUnknown, terminus?: boolean | undefined) => void,
        switchSet: (target: tSwitchTarget_treeSet, terminus: boolean) => void
    }
}
const AppTabPanel:React.FC<tAppTabPanel> = (props) => {
    const classes = useStyle();

    if(! props.isDisplay) return null;

    const isDispAllDurability =
        props.creationStatus.isDurable &&
        props.userStatus.isDurable &&
        props.npcStatus.isDurable &&
        props.commonStatus.isDurable &&
        props.unknownStatus.isDurable;
    
    const isDispAllSpExpense = 
        props.creationStatus.isSpExpense &&
        props.userStatus.isSpExpense &&
        props.npcStatus.isSpExpense &&
        props.commonStatus.isSpExpense &&
        props.unknownStatus.isSpExpense;
    
    const isDispAllPrice = props.userStatus.isPrice && props.npcStatus.isPrice;
    const isDispAllMessage = props.commonStatus.isMessage && props.unknownStatus.isMessage;

    return (
        <Box className={classes.rootBox}>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">全アイテム</Typography>}
                >
                    <ListItemButton
                        helpText={<Typography variant="body2">全ての情報を表示します。</Typography>}
                        listItemClassName={props.listItemClassName}
                        handleClick={props.handler.switchSet.bind(null,"all",true)}
                    >
                        全て表示
                    </ListItemButton>
                    <ListItemButton
                        helpText={<Typography variant="body2">全ての情報を非表示にします。</Typography>}
                        listItemClassName={props.listItemClassName}
                        handleClick={props.handler.switchSet.bind(null,"all",false)}
                    >
                        全て非表示
                    </ListItemButton>
                    <Divider component="li" />
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={isDispAllDurability}
                        onClick={props.handler.switchSet.bind(null,"durable",(! isDispAllDurability))}
                        listItemClassName={props.listItemClassName}
                    >
                        消費耐久値
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位での生産時に、該当素材が特殊消費だった場合に消費タイプを表示します。</Typography>}
                        isChecked={isDispAllSpExpense}
                        onClick={props.handler.switchSet.bind(null,"spExpense",(! isDispAllSpExpense))}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={
                            <>
                                <Typography variant="body2">金額を表に表示します。</Typography>
                                <Typography variant="body2">NPC購入アイテムや自力調達アイテムに表示されます。</Typography>
                            </>
                        }
                        isChecked={isDispAllPrice}
                        onClick={props.handler.switchSet.bind(null,"price",(! isDispAllPrice))}
                        listItemClassName={props.listItemClassName}
                    >
                        金額
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={
                            <>
                                <Typography variant="body2">アプリからのメッセージを表示します。</Typography>
                                <Typography variant="body2">共通素材や調達方法不明アイテムのセルに表示されます。</Typography>
                            </>
                        }
                        isChecked={isDispAllMessage}
                        onClick={props.handler.switchSet.bind(null,"message",(! isDispAllMessage))}
                        listItemClassName={props.listItemClassName}
                    >
                        メッセージ
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">生産アイテム</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に必要スキルの情報を表示します。</Typography>}
                        isChecked={props.creationStatus.isSkill}
                        onClick={props.handler.switchCreation.bind(null,"skill",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        必要スキル
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に生産時の使用テクニックを表示します</Typography>}
                        isChecked={props.creationStatus.isTechnique}
                        onClick={props.handler.switchCreation.bind(null,"technique",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        テクニック
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={props.creationStatus.isDurable}
                        onClick={props.handler.switchCreation.bind(null,"durable",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        消費耐久
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                        isChecked={props.creationStatus.isSpExpense}
                        onClick={props.handler.switchCreation.bind(null,"spExpense",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">生産時に副産物が生成される場合、副産物の情報を表示します。</Typography>}
                        isChecked={props.creationStatus.isByproduct}
                        onClick={props.handler.switchCreation.bind(null,"byproduct",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        副産物
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">生産されたアイテムが全て使用されずに余る場合、余りの情報を表示します。</Typography>}
                        isChecked={props.creationStatus.isSurplus}
                        onClick={props.handler.switchCreation.bind(null,"surplus",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        余剰作成
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">生産時のルーレットの特殊条件（ギャンブル／ペナルティ）の情報が表示されます。</Typography>}
                        isChecked={props.creationStatus.isCreateRemark}
                        onClick={props.handler.switchCreation.bind(null,"createRemark",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        ルーレット備考
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">生産時にレシピが必須の場合、必要レシピ名が表示されます。</Typography>}
                        isChecked={props.creationStatus.isNeedRecipe}
                        onClick={props.handler.switchCreation.bind(null,"needRecipe",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        要レシピ
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">作成個数に上限が設定されているアイテムの場合、上限数を表示します。</Typography>}
                        isChecked={props.creationStatus.isMaxCreate}
                        onClick={props.handler.switchCreation.bind(null,"maxCreate",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        同時作成可能回数
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上記以外の備考がある場合に表示されます。</Typography>}
                        isChecked={props.creationStatus.isRemark}
                        onClick={props.handler.switchCreation.bind(null,"remark",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        備考
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">自力調達</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={props.userStatus.isDurable}
                        onClick={props.handler.switchUser.bind(null,"durable",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        耐久情報
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                        isChecked={props.userStatus.isSpExpense}
                        onClick={props.handler.switchUser.bind(null,"spExpense",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">金額情報を表示します。</Typography>}
                        isChecked={props.userStatus.isPrice}
                        onClick={props.handler.switchUser.bind(null,"price",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        金額
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">NPC購入</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={props.npcStatus.isDurable}
                        onClick={props.handler.switchNpc.bind(null,"durable",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        耐久情報
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                        isChecked={props.npcStatus.isSpExpense}
                        onClick={props.handler.switchNpc.bind(null,"spExpense",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">金額情報を表示します。</Typography>}
                        isChecked={props.npcStatus.isPrice}
                        onClick={props.handler.switchNpc.bind(null,"price",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        金額
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">共通素材</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={props.commonStatus.isDurable}
                        onClick={props.handler.switchCommon.bind(null,"durable",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        耐久情報
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                        isChecked={props.commonStatus.isSpExpense}
                        onClick={props.handler.switchCommon.bind(null,"spExpense",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">メッセージ「共通素材で作成」を表示します。</Typography>}
                        isChecked={props.commonStatus.isMessage}
                        onClick={props.handler.switchCommon.bind(null,"message",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        メッセージ
                    </ListItemInSwitch>
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">未設定アイテム</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                        isChecked={props.unknownStatus.isDurable}
                        onClick={props.handler.switchUnknown.bind(null,"durable",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        耐久情報
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                        isChecked={props.unknownStatus.isSpExpense}
                        onClick={props.handler.switchUnknown.bind(null,"spExpense",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        特殊消費
                    </ListItemInSwitch>
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">メッセージ「【注意】入手手段不明」を表示します。</Typography>}
                        isChecked={props.unknownStatus.isMessage}
                        onClick={props.handler.switchUnknown.bind(null,"message",undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        メッセージ
                    </ListItemInSwitch>
                </List>
            </Paper>
        </Box>
    )
}

export default AppTabPanel;
