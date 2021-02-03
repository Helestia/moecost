import React from 'react';

import AppTabPanel from './appTabPanel';
import TreeDispTabPanel from './treeDispTabPanel';
import CalcTabPanel from './calcTabPanel';

import moecostDb,
    { iApplicationConfig }      from '../../../../../../scripts/storage';

import {tHandleOpenSnackbar}    from '../../../../../commons/snackbar/useSnackbar';
import Tabs , {tTabState}       from '../../../../../commons/tabs/tabs';
import useTabs                  from '../../../../../commons/tabs/useTabs';
import DialogNormal             from '../../../../../commons/dialog/dialogNormal';

import Box           from '@material-ui/core/Box';
import Button        from '@material-ui/core/Button';
import Typography    from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme}          from '@material-ui/core/styles'

const useStyles = makeStyles((theme:Theme) => createStyles({
    PanelRoot: {
        width: "100%",
        display: "flex",
        flexWrap: "wrap"
    },
    listClassName: {
        paddingLeft: theme.spacing(3)
    }
}));

const tabsStatus: tTabState[] = [
    {
        value: "appConf",
        label: (
            <>
                <Typography>アプリ</Typography>
                <Typography>表示設定</Typography>
            </>
        )
    },
    {
        value: "dispTree",
        label: (
        <>
            <Typography>ツリー</Typography>
            <Typography>表示設定</Typography>
        </>
        )
    },
    {
        value: "calc",
        label: <Typography>計算設定</Typography>
    }
]

type tAppPrefeerenceDialog = {
    isOpen : boolean,
    close : () => void,
    handleOpenSnackbar: tHandleOpenSnackbar,
    changeAppPreference : () => void
}

const AppPreferenceDialog:React.FC<tAppPrefeerenceDialog> = (props) => {
    const tabHooks = useTabs("appConf",tabsStatus);

    const hooks = useAppPreferenceDialog(
        props.handleOpenSnackbar,
        props.close,
        props.changeAppPreference);
    const classes = useStyles();

    const initialize = () => {
        hooks.handler.initialize();
        tabHooks.initialize();
    }

    return (
        <DialogNormal
            isOpen={props.isOpen}
            handleClose={props.close}
            initialize={initialize}
            maxWidth="lg"
            title={
                <>
                    <Typography>アプリケーション設定変更</Typography>
                    <Tabs
                        value={tabHooks.selected}
                        reactKeyPrefix="topAndMenus_AppPreferenceDialog_Tabs_"
                        tabInfo={tabsStatus}
                        handleChange={tabHooks.handleChange}
                    />
                </>
            }
            actions={
                <>
                    <Button
                        color="default"
                        onClick={props.close}>
                        キャンセル
                    </Button>
                    <Button
                        color="primary"
                        onClick={hooks.handler.submit}>
                        設定完了
                    </Button>
                </>
            }
        >
            <Box
                width="100%"
                className={classes.PanelRoot}
            >
                <AppTabPanel
                    isDisplay={tabHooks.selected === "appConf"}
                    status={hooks.status.app}
                    handler={hooks.handler.app}
                />
                <TreeDispTabPanel
                    isDisplay={tabHooks.selected === "dispTree"}
                    creationStatus={hooks.status.treeCreation}
                    userStatus={hooks.status.treeUser}
                    npcStatus={hooks.status.treeNpc}
                    commonStatus={hooks.status.treeCommon}
                    unknownStatus={hooks.status.treeUnknown}
                    handler={hooks.handler.trees}
                />
                <CalcTabPanel
                    isDisplay={tabHooks.selected === "calc"}
                    status={hooks.status.calc}
                    handler={hooks.handler.calcs}
                />
            </Box>
        </DialogNormal>
    )
}

// スイッチ制御用文字列
export type tSwitchTarget_app = "useDark" | "useSmallTable" | "dispCreationEverytime" | "defDispSummary" | "defDispCostSheet" | "defDispCreationTree";
export type tSwitchTarget_treeCreation = "skill" | "technique" | "durable" | "spExpense" | "byproduct" | "surplus" | "createRemark" | "needRecipe" | "maxCreate" | "remark";
export type tSwitchTarget_treeUserAndNpc = "durable" | "spExpense" | "price";
export type tSwitchTarget_treeCommonAndUnknown = "durable" | "spExpense" | "message";
export type tSwitchTarget_treeSet = "all" | "durable" | "spExpense" | "price" | "message";
export type tSwitchTarget_calc = "useWarNpc" | "trashNoLost" | "trashByproduct" | "trashSurplus";

const useAppPreferenceDialog = (handleOpenSnackbar:tHandleOpenSnackbar,handleClose:() => void, changeAppPreference: () => void) => {
    const [app_suggestMax, setApp_suggestMax] = React.useState(0);

    const [app_isUseDark,             setApp_isUseDark]                 = React.useState(false);
    const [app_isUseSmallTable,       setApp_isUseSmallTable]           = React.useState(false);
    const [app_isDispCreationEverytime, setApp_isDispCreationEverytime] = React.useState(false);
    const [app_isDefDispSummary,      setApp_isDefDispSummary]          = React.useState(true);
    const [app_isDefDispCostSheet,    setApp_isDefDispCostSheet]        = React.useState(true);
    const [app_isDefDispCreationTree, setApp_isDefDispCreationTree]     = React.useState(true);

    const [treeCreation_isSkill,        setTreeCreation_isSkill]        = React.useState(true);
    const [treeCreation_isTechnique,    setTreeCreation_isTechnique]    = React.useState(true);
    const [treeCreation_isDurable,      setTreeCreation_isDurable]      = React.useState(true);
    const [treeCreation_isSpExpense,    setTreeCreation_isSpExpense]    = React.useState(true);
    const [treeCreation_isByproduct,    setTreeCreation_isByproduct]    = React.useState(true);
    const [treeCreation_isSurplus,      setTreeCreation_isSurplus]      = React.useState(true);
    const [treeCreation_isCreateRemark, setTreeCreation_isCreateRemark] = React.useState(true);
    const [treeCreation_isNeedRecipe,   setTreeCreation_isNeedRecipe]   = React.useState(true);
    const [treeCreation_isMaxCreate,    setTreeCreation_isMaxCreate]    = React.useState(true);
    const [treeCreation_isRemark,       setTreeCreation_isRemark]       = React.useState(true);

    const [treeUser_isDurable,   setTreeUser_isDurable]   = React.useState(true);
    const [treeUser_isSpExpense, setTreeUser_isSpExpense] = React.useState(true);
    const [treeUser_isPrice,     setTreeUser_isPrice]     = React.useState(true);

    const [treeNpc_isDurable,   setTreeNpc_isDurable]   = React.useState(true);
    const [treeNpc_isSpExpense, setTreeNpc_isSpExpense] = React.useState(true);
    const [treeNpc_isPrice,     setTreeNpc_isPrice]     = React.useState(true);

    const [treeCommon_isDurable,   setTreeCommon_isDurable]   = React.useState(true);
    const [treeCommon_isSpExpense, setTreeCommon_isSpExpense] = React.useState(true);
    const [treeCommon_isMessage,   setTreeCommon_isMessage]   = React.useState(true);

    const [treeUnknown_isDurable,   setTreeUnknown_isDurable]   = React.useState(true);
    const [treeUnknown_isSpExpense, setTreeUnknown_isSpExpense] = React.useState(true);
    const [treeUnknown_isMessage,   setTreeUnknown_isMessage]   = React.useState(true);

    const [calc_isUseWarNpc   , setCalc_isUseWarNpc]    = React.useState(false);
    const [calc_trashNoLost   , setCalc_trashNoLost]    = React.useState(false);
    const [calc_trashByproduct, setCalc_trashByproduct] = React.useState(false);
    const [calc_trashSurplus  , setCalc_trashSurplus]   = React.useState(false);

    const initialize = () => moecostDb.refleshProperties(initStatus);

    const initStatus = () => {
        const app = moecostDb.アプリ設定;
        setApp_suggestMax(app.表示設定.検索候補表示数);

        setApp_isUseDark(app.表示設定.ダークモード);
        setApp_isUseSmallTable(app.表示設定.smallテーブル);
        setApp_isDispCreationEverytime(app.表示設定.常時最終作成物表示);

        const defDisp = app.表示設定.初期表示設定
        setApp_isDefDispSummary(defDisp.概要);
        setApp_isDefDispCostSheet(defDisp.原価表);
        setApp_isDefDispCreationTree(defDisp.生産ツリー);

        const treeCreation = app.表示設定.ツリー表示内容.生産;
        setTreeCreation_isSkill(treeCreation.スキル);
        setTreeCreation_isTechnique(treeCreation.テクニック);
        setTreeCreation_isDurable(treeCreation.消費耐久);
        setTreeCreation_isSpExpense(treeCreation.特殊消費);
        setTreeCreation_isByproduct(treeCreation.副産物);
        setTreeCreation_isSurplus(treeCreation.余剰個数);
        setTreeCreation_isCreateRemark(treeCreation.作成時備考);
        setTreeCreation_isNeedRecipe(treeCreation.要レシピ);
        setTreeCreation_isMaxCreate(treeCreation.最大作成回数);
        setTreeCreation_isRemark(treeCreation.備考);

        const treeUser = app.表示設定.ツリー表示内容.自力調達;
        setTreeUser_isDurable(treeUser.消費耐久);
        setTreeUser_isSpExpense(treeUser.特殊消費);
        setTreeUser_isPrice(treeUser.価格);

        const treeNpc = app.表示設定.ツリー表示内容.NPC;
        setTreeNpc_isDurable(treeNpc.消費耐久);
        setTreeNpc_isSpExpense(treeNpc.特殊消費);
        setTreeNpc_isPrice(treeNpc.価格);

        const treeCommon = app.表示設定.ツリー表示内容.共通素材;
        setTreeCommon_isDurable(treeCommon.特殊消費);
        setTreeCommon_isSpExpense(treeCommon.特殊消費);
        setTreeCommon_isMessage(treeCommon.メッセージ);

        const treeUnknown = app.表示設定.ツリー表示内容.共通素材;
        setTreeUnknown_isDurable(treeUnknown.特殊消費);
        setTreeUnknown_isSpExpense(treeUnknown.特殊消費);
        setTreeUnknown_isMessage(treeUnknown.メッセージ);

        const calc = app.計算設定;
        setCalc_isUseWarNpc(calc.War販売物使用);
        setCalc_trashNoLost(calc.廃棄設定.未消費素材);
        setCalc_trashByproduct(calc.廃棄設定.副産物);
        setCalc_trashSurplus(calc.廃棄設定.余剰生産物);
    }

    const handleSwitchProcess = (dispatch: React.Dispatch<React.SetStateAction<boolean>>, current:boolean, terminus?:boolean) => {
        if(terminus === undefined) dispatch((! current));
        else dispatch(terminus);
    }
    
    const handleSwitchApp = (target:tSwitchTarget_app, terminus?:boolean) => {
        console.log(terminus);
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "useDark":                 return {targetDispatch:setApp_isUseDark, current:app_isUseDark};
                case "useSmallTable":           return {targetDispatch:setApp_isUseSmallTable, current:app_isUseSmallTable};
                case "dispCreationEverytime":   return {targetDispatch:setApp_isDispCreationEverytime, current:app_isDispCreationEverytime};
                case "defDispSummary":          return {targetDispatch:setApp_isDefDispSummary, current:app_isDefDispSummary};
                case "defDispCostSheet":        return {targetDispatch:setApp_isDefDispCostSheet, current:app_isDefDispCostSheet};
                case "defDispCreationTree":     return {targetDispatch:setApp_isDefDispCreationTree, current:app_isDefDispCreationTree};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }

    const handleSwitchTreeCreation = (target:tSwitchTarget_treeCreation, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "skill":           return {targetDispatch:setTreeCreation_isSkill, current:treeCreation_isSkill};
                case "technique":       return {targetDispatch:setTreeCreation_isTechnique, current:treeCreation_isTechnique};
                case "durable":         return {targetDispatch:setTreeCreation_isDurable, current:treeCreation_isDurable};
                case "spExpense":       return {targetDispatch:setTreeCreation_isSpExpense, current:treeCreation_isSpExpense};
                case "byproduct":       return {targetDispatch:setTreeCreation_isByproduct, current:treeCreation_isByproduct};
                case "surplus":         return {targetDispatch:setTreeCreation_isSurplus, current:treeCreation_isSurplus};
                case "createRemark":    return {targetDispatch:setTreeCreation_isCreateRemark, current:treeCreation_isCreateRemark};
                case "needRecipe":      return {targetDispatch:setTreeCreation_isNeedRecipe, current:treeCreation_isNeedRecipe};
                case "maxCreate":       return {targetDispatch:setTreeCreation_isMaxCreate, current:treeCreation_isMaxCreate};
                case "remark":          return {targetDispatch:setTreeCreation_isRemark, current:treeCreation_isRemark};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }

    const handleSwitchTreeUser = (target:tSwitchTarget_treeUserAndNpc, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "durable":     return {targetDispatch:setTreeUser_isDurable ,current:treeUser_isDurable};
                case "spExpense":   return {targetDispatch:setTreeUser_isSpExpense ,current:treeUser_isSpExpense};
                case "price":       return {targetDispatch:setTreeUser_isPrice ,current:treeUser_isPrice};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }

    const handleSwitchTreeNpc = (target:tSwitchTarget_treeUserAndNpc, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "durable":     return {targetDispatch:setTreeNpc_isDurable ,current:treeNpc_isDurable};
                case "spExpense":   return {targetDispatch:setTreeNpc_isSpExpense ,current:treeNpc_isSpExpense};
                case "price":       return {targetDispatch:setTreeNpc_isPrice ,current:treeNpc_isPrice};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }

    const handleSwitchTreeCommon = (target:tSwitchTarget_treeCommonAndUnknown, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "durable":     return {targetDispatch:setTreeCommon_isDurable ,current:treeCommon_isDurable};
                case "spExpense":   return {targetDispatch:setTreeCommon_isSpExpense ,current:treeCommon_isSpExpense};
                case "message":       return {targetDispatch:setTreeCommon_isMessage ,current:treeCommon_isMessage};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }

    const handleSwitchTreeUnknown = (target:tSwitchTarget_treeCommonAndUnknown, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "durable":     return {targetDispatch:setTreeUnknown_isDurable ,current:treeUnknown_isDurable};
                case "spExpense":   return {targetDispatch:setTreeUnknown_isSpExpense ,current:treeUnknown_isSpExpense};
                case "message":     return {targetDispatch:setTreeUnknown_isMessage ,current:treeUnknown_isMessage};
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }
    const handleSwitchTreeSets = (target:tSwitchTarget_treeSet, terminus:boolean) => {
        const targetDispatchList:React.Dispatch<React.SetStateAction<boolean>>[] = (() => {
            switch(target) {
                case "all": return [
                    setTreeCreation_isSkill,
                    setTreeCreation_isTechnique,
                    setTreeCreation_isDurable,
                    setTreeCreation_isSpExpense,
                    setTreeCreation_isByproduct,
                    setTreeCreation_isSurplus,
                    setTreeCreation_isCreateRemark,
                    setTreeCreation_isNeedRecipe,
                    setTreeCreation_isMaxCreate,
                    setTreeCreation_isRemark,
                    setTreeUser_isDurable,
                    setTreeUser_isSpExpense,
                    setTreeUser_isPrice,
                    setTreeNpc_isDurable,
                    setTreeNpc_isSpExpense,
                    setTreeNpc_isPrice,
                    setTreeCommon_isDurable,
                    setTreeCommon_isSpExpense,
                    setTreeCommon_isMessage,
                    setTreeUnknown_isDurable,
                    setTreeUnknown_isSpExpense,
                    setTreeUnknown_isMessage
                ];
                case "durable": return [
                    setTreeCreation_isDurable,
                    setTreeUser_isDurable,
                    setTreeNpc_isDurable,
                    setTreeCommon_isDurable,
                    setTreeUnknown_isDurable
                ];
                case "spExpense": return [
                    setTreeCreation_isSpExpense,
                    setTreeUser_isSpExpense,
                    setTreeNpc_isSpExpense,
                    setTreeCommon_isSpExpense,
                    setTreeUnknown_isSpExpense
                ];
                case "price": return [
                    setTreeUser_isPrice,
                    setTreeNpc_isPrice
                ];
                case "message" : return [
                    setTreeCommon_isMessage,
                    setTreeUnknown_isMessage
                ]
            }
        })();
        targetDispatchList.forEach(dispatch => dispatch(terminus));
    }
    const handleSwitchCalc = (target: tSwitchTarget_calc, terminus?:boolean) => {
        const {targetDispatch, current} = (() => {
            switch(target) {
                case "useWarNpc":       return {targetDispatch:setCalc_isUseWarNpc ,current:calc_isUseWarNpc}
                case "trashNoLost":     return {targetDispatch:setCalc_trashNoLost ,current:calc_trashNoLost}
                case "trashByproduct":  return {targetDispatch:setCalc_trashByproduct ,current:calc_trashByproduct}
                case "trashSurplus":    return {targetDispatch:setCalc_trashSurplus ,current:calc_trashSurplus}
            }
        })();
        handleSwitchProcess(targetDispatch, current, terminus);
    }
    const handleSuggestMax = (event:React.ChangeEvent<HTMLInputElement>) => setApp_suggestMax(Number(event.target.value));

    const handleSubmit = () => {
        const resultDbStatus: iApplicationConfig = {
            表示設定:{
                ダークモード: app_isUseDark,
                smallテーブル: app_isUseSmallTable,
                常時最終作成物表示: app_isDispCreationEverytime,
                検索候補表示数: app_suggestMax,
                初期表示設定: {
                    概要: app_isDefDispSummary,
                    原価表: app_isDefDispCostSheet,
                    生産ツリー: app_isDefDispCreationTree
                },
                ツリー表示内容: {
                    生産: {
                        スキル: treeCreation_isSkill,
                        テクニック: treeCreation_isTechnique,
                        消費耐久: treeCreation_isDurable,
                        特殊消費: treeCreation_isSpExpense,
                        余剰個数: treeCreation_isSurplus,
                        副産物: treeCreation_isByproduct,
                        作成時備考: treeCreation_isCreateRemark,
                        要レシピ: treeCreation_isNeedRecipe,
                        最大作成回数: treeCreation_isMaxCreate,
                        備考: treeCreation_isRemark
                    },
                    自力調達: {
                        消費耐久: treeUser_isDurable,
                        特殊消費: treeUser_isSpExpense,
                        価格: treeUser_isPrice
                    },
                    NPC: {
                        消費耐久: treeNpc_isDurable,
                        特殊消費: treeNpc_isSpExpense,
                        価格: treeNpc_isPrice
                    },
                    共通素材: {
                        消費耐久: treeCommon_isDurable,
                        特殊消費: treeCommon_isSpExpense,
                        メッセージ: treeCommon_isMessage,
                    },
                    未設定: {
                        消費耐久: treeUnknown_isDurable,
                        特殊消費: treeUnknown_isSpExpense,
                        メッセージ: treeUnknown_isMessage,
                    }
                }
            },
            計算設定: {
                War販売物使用: calc_isUseWarNpc,
                廃棄設定: {
                    副産物: calc_trashByproduct,
                    余剰生産物: calc_trashSurplus,
                    未消費素材: calc_trashNoLost
                }
            }
        };

        moecostDb.registerAppPreference(resultDbStatus)
            .then(() => handleOpenSnackbar(
                "success",
                <Typography>設定情報のブラウザへの保存が正常に完了しました。</Typography>
            ))
            .catch((error) => {
                console.log(error);
                handleOpenSnackbar(
                "error",
                <>
                    <Typography>設定情報のブラウザへの保存に失敗しています。</Typography>
                    <Typography>リトライなどを行っても正常にできない場合は、バグ報告等をいただければと思います。</Typography>
                </>,
                null
            )});
        changeAppPreference();
        handleClose();
    };
    return {
        status: {
            app: {
                isUseDark: app_isUseDark,
                isUseSmallTable: app_isUseSmallTable,
                isDispCreationEverytime: app_isDispCreationEverytime,
                suggestMax: app_suggestMax,
                isDefDispSummary: app_isDefDispSummary,
                isDefDispCostSheet: app_isDefDispCostSheet,
                isDefDispCreationTree: app_isDefDispCreationTree
            },
            treeCreation: {
                isSkill: treeCreation_isSkill,
                isTechnique: treeCreation_isTechnique,
                isDurable: treeCreation_isDurable,
                isSpExpense: treeCreation_isSpExpense,
                isByproduct: treeCreation_isByproduct,
                isSurplus: treeCreation_isSurplus,
                isCreateRemark: treeCreation_isCreateRemark,
                isNeedRecipe: treeCreation_isNeedRecipe,
                isMaxCreate: treeCreation_isMaxCreate,
                isRemark: treeCreation_isRemark
            },
            treeUser: {
                isDurable: treeUser_isDurable,
                isSpExpense: treeUser_isSpExpense,
                isPrice: treeUser_isPrice
            },
            treeNpc: {
                isDurable: treeNpc_isDurable,
                isSpExpense: treeNpc_isSpExpense,
                isPrice: treeNpc_isPrice
            },
            treeCommon: {
                isDurable: treeCommon_isDurable,
                isSpExpense: treeCommon_isSpExpense,
                isMessage: treeCommon_isMessage
            },
            treeUnknown: {
                isDurable: treeUnknown_isDurable,
                isSpExpense: treeUnknown_isSpExpense,
                isMessage: treeUnknown_isMessage
            },
            calc:{
                isUseWarNpc: calc_isUseWarNpc,
                isTrashNoLost: calc_trashNoLost,
                isTrashSurplus: calc_trashSurplus,
                isTrashByproduct: calc_trashByproduct
            }
        },
        handler:{
            app: {
                suggestMax: handleSuggestMax,
                switch: handleSwitchApp
            },
            trees: {
                switchCreation: handleSwitchTreeCreation,
                switchUser: handleSwitchTreeUser,
                switchNpc: handleSwitchTreeNpc,
                switchCommon: handleSwitchTreeCommon,
                switchUnknown: handleSwitchTreeUnknown,
                switchSet: handleSwitchTreeSets
            },
            calcs: {
                switch : handleSwitchCalc,
            },
            initialize: initialize,
            submit: handleSubmit
        }
    }
}

export default AppPreferenceDialog;
