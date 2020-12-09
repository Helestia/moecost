import React from 'react'
import moecostDb,{iApplicationConfig} from '../scripts/storage';

import AppBar        from '@material-ui/core/AppBar';
import Dialog        from '@material-ui/core/Dialog';
import Button        from '@material-ui/core/Button';
import Box           from '@material-ui/core/Box';
import DialogTitle   from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider       from '@material-ui/core/Divider'
import Tabs          from '@material-ui/core/Tabs';
import Tab           from '@material-ui/core/Tab';
import TextField     from '@material-ui/core/TextField';
import Tooltip       from '@material-ui/core/Tooltip';
import Typography    from '@material-ui/core/Typography';
import List          from '@material-ui/core/List';
import ListItem      from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';

import Paper         from '@material-ui/core/Paper';
import Switch        from '@material-ui/core/Switch';

import {makeStyles, Theme, createStyles}
                     from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    dialogRoot:{
        maxHeight:"80vh",
        minHeight:"50vh",
        display:"flex",
        flexDirection:"column"
    },
    listBox: {
        display: "flex",
        flexWrap:"wrap",
    },
    listPaper: {
        flexGrow: 1,
        minWidth: "380px",
        maxWidth: "40vw"
    },
    list: {
        marginBottom: theme.spacing(2),
        minWidth: "380px",
        maxWidth: "40vw"
    },
    listItem:{
        paddingLeft:"2em"
    },
    dialogAction: {
        alignSelf: "flex-end"
    }
}))

type tPanelDispConfChangeSwitchProps = "isUseDark" | "isUseSmallTable" | "isDefDispSummary" | "isDefDispCostSheet" | "isDefDispCreationTree";

type tPanelDispTreeChangeSwitchProps = 
    "crt_isSkill"   | "crt_isTechnique" | "crt_isDurable" | "crt_isSpExpense" | "crt_isSurplus" | "crt_isByproduct" | "crt_isCreateRemark" | "crt_isNeedRecipe" | "crt_isMaxCreate" | "crt_isRemark" |
    "usr_isDurable" | "usr_isSpExpense" | "usr_isPrice" |
    "npc_isDurable" | "npc_isSpExpense" | "npc_isPrice" |
    "cmn_isDurable" | "cmn_isSpExpense" | "cmn_isMessage" |
    "ukn_isDurable" | "ukn_isSpExpense" | "ukn_isMessage";

type tPanelCalcChangeSwitchProps = "clc_isUseWarNpc";







type tConfigDisplayDialog = {
    isOpen : boolean,
    close : () => void,
    changeDisplayConfig : () => void
}

const ConfigDisplayDialog:React.FC<tConfigDisplayDialog> = (props) => {
    const [befOpen, setBefOpen] = React.useState(false);
    const [tabSelected, setTabSelected] = React.useState("");

    const [dispConf_isUseDark,             setDispConf_isUseDark]             = React.useState(false);
    const [dispConf_isUseSmallTable,       setDispConf_isUseSmallTable]       = React.useState(false);
    const [dispConf_suggestMax,            setDispConf_suggestMax]            = React.useState(0);
    const [dispConf_isDefDispSummary,      setDispConf_isDefDispSummary]      = React.useState(true);
    const [dispConf_isDefDispCostSheet,    setDispConf_isDefDispCostSheet]    = React.useState(true);
    const [dispConf_isDefDispCreationTree, setDispConf_isDefDispCreationTree] = React.useState(true);

    const [dispTree_creation_isSkill,        setDispTree_creation_isSkill]        = React.useState(true);
    const [dispTree_creation_isTechnique,    setDispTree_creation_isTechnique]    = React.useState(true);
    const [dispTree_creation_isDurable,      setDispTree_creation_isDurable]      = React.useState(true);
    const [dispTree_creation_isSpExpense,    setDispTree_creation_isSpExpense]    = React.useState(true);
    const [dispTree_creation_isByproduct,    setDispTree_creation_isByproduct]    = React.useState(true);
    const [dispTree_creation_isSurplus,      setDispTree_creation_isSurplus]      = React.useState(true);
    const [dispTree_creation_isCreateRemark, setDispTree_creation_isCreateRemark] = React.useState(true);
    const [dispTree_creation_isNeedRecipe,   setDispTree_creation_isNeedRecipe]   = React.useState(true);
    const [dispTree_creation_isMaxCreate,    setDispTree_creation_isMaxCreate]    = React.useState(true);
    const [dispTree_creation_isRemark,       setDispTree_creation_isRemark]       = React.useState(true);

    const [dispTree_user_isDurable,   setDispTree_user_isDurable]   = React.useState(true);
    const [dispTree_user_isSpExpense, setDispTree_user_isSpExpense] = React.useState(true);
    const [dispTree_user_isPrice,     setDispTree_user_isPrice]     = React.useState(true);

    const [dispTree_npc_isDurable,   setDispTree_npc_isDurable]   = React.useState(true);
    const [dispTree_npc_isSpExpense, setDispTree_npc_isSpExpense] = React.useState(true);
    const [dispTree_npc_isPrice,     setDispTree_npc_isPrice]     = React.useState(true);

    const [dispTree_common_isDurable,   setDispTree_common_isDurable]   = React.useState(true);
    const [dispTree_common_isSpExpense, setDispTree_common_isSpExpense] = React.useState(true);
    const [dispTree_common_isMessage,   setDispTree_common_isMessage]   = React.useState(true);

    const [dispTree_unknown_isDurable,   setDispTree_unknown_isDurable]   = React.useState(true);
    const [dispTree_unknown_isSpExpense, setDispTree_unknown_isSpExpense] = React.useState(true);
    const [dispTree_unknown_isMessage,   setDispTree_unknown_isMessage]   = React.useState(true);

    const [calc_isUseWarNpc, setCalc_isUseWarNpc] = React.useState(false);

    const classes = useStyles();

    if((! befOpen) && props.isOpen){
        // indexeddbのリフレッシュ
        moecostDb.refleshProperties(dialogInitialize);
    }
    function dialogInitialize (){
        // 初期化処理　indexedDbの内容反映
        setDispConf_isUseDark(moecostDb.アプリ設定.表示設定.ダークモード);
        setDispConf_isUseSmallTable(moecostDb.アプリ設定.表示設定.smallテーブル);
        setDispConf_suggestMax(moecostDb.アプリ設定.表示設定.検索候補表示数);

        setDispConf_isDefDispSummary(moecostDb.アプリ設定.表示設定.初期表示設定.概要);
        setDispConf_isDefDispCostSheet(moecostDb.アプリ設定.表示設定.初期表示設定.原価表);
        setDispConf_isDefDispCreationTree(moecostDb.アプリ設定.表示設定.初期表示設定.生産ツリー);

        setDispTree_creation_isSkill(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.スキル);
        setDispTree_creation_isTechnique(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.テクニック);
        setDispTree_creation_isDurable(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.消費耐久);
        setDispTree_creation_isSpExpense(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.特殊消費);
        setDispTree_creation_isSurplus(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.余剰個数);
        setDispTree_creation_isByproduct(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.副産物);
        setDispTree_creation_isCreateRemark(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.作成時備考);
        setDispTree_creation_isNeedRecipe(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.要レシピ);
        setDispTree_creation_isMaxCreate(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.最大作成回数);
        setDispTree_creation_isRemark(moecostDb.アプリ設定.表示設定.ツリー表示内容.生産.備考);

        setDispTree_user_isDurable(moecostDb.アプリ設定.表示設定.ツリー表示内容.自力調達.消費耐久);
        setDispTree_user_isSpExpense(moecostDb.アプリ設定.表示設定.ツリー表示内容.自力調達.特殊消費);
        setDispTree_user_isPrice(moecostDb.アプリ設定.表示設定.ツリー表示内容.自力調達.価格);

        setDispTree_npc_isDurable(moecostDb.アプリ設定.表示設定.ツリー表示内容.NPC.消費耐久);
        setDispTree_npc_isSpExpense(moecostDb.アプリ設定.表示設定.ツリー表示内容.NPC.特殊消費);
        setDispTree_npc_isPrice(moecostDb.アプリ設定.表示設定.ツリー表示内容.NPC.価格);

        setDispTree_common_isDurable(moecostDb.アプリ設定.表示設定.ツリー表示内容.共通素材.消費耐久);
        setDispTree_common_isSpExpense(moecostDb.アプリ設定.表示設定.ツリー表示内容.共通素材.特殊消費);
        setDispTree_common_isMessage(moecostDb.アプリ設定.表示設定.ツリー表示内容.共通素材.メッセージ);

        setDispTree_unknown_isDurable(moecostDb.アプリ設定.表示設定.ツリー表示内容.未設定.消費耐久);
        setDispTree_unknown_isSpExpense(moecostDb.アプリ設定.表示設定.ツリー表示内容.未設定.特殊消費);
        setDispTree_unknown_isMessage(moecostDb.アプリ設定.表示設定.ツリー表示内容.未設定.メッセージ);

        setCalc_isUseWarNpc(moecostDb.アプリ設定.その他設定.War販売物使用);

        setTabSelected("dispConf");
        // 初期化完了フラグ
        setBefOpen(true);
    }

    function handleSubmit () {
        const newDbObj = {
            表示設定 : {
                検索候補表示数 : dispConf_suggestMax,
                smallテーブル:   dispConf_isUseSmallTable,
                ダークモード :   dispConf_isUseDark,
                初期表示設定 :{
                    概要 :       dispConf_isDefDispSummary,
                    原価表 :     dispConf_isDefDispCostSheet,
                    生産ツリー : dispConf_isDefDispCreationTree
                },
                ツリー表示内容: {
                    生産:{
                        スキル:       dispTree_creation_isSkill,
                        テクニック:   dispTree_creation_isTechnique,
                        消費耐久:     dispTree_creation_isDurable,
                        特殊消費:     dispTree_creation_isSpExpense,
                        余剰個数:     dispTree_creation_isSurplus,
                        副産物:       dispTree_creation_isByproduct,
                        作成時備考:   dispTree_creation_isCreateRemark,
                        要レシピ:     dispTree_creation_isNeedRecipe,
                        最大作成回数: dispTree_creation_isMaxCreate,
                        備考:         dispTree_creation_isRemark
                    },
                    自力調達:{
                        消費耐久: dispTree_user_isDurable,
                        特殊消費: dispTree_user_isSpExpense,
                        価格:     dispTree_user_isPrice
                    },
                    NPC:{
                        消費耐久: dispTree_npc_isDurable,
                        特殊消費: dispTree_npc_isSpExpense,
                        価格:     dispTree_npc_isPrice
                    },
                    共通素材:{
                        消費耐久:   dispTree_common_isDurable,
                        特殊消費:   dispTree_common_isSpExpense,
                        メッセージ: dispTree_common_isMessage
                    },
                    未設定: {
                        消費耐久:   dispTree_unknown_isDurable,
                        特殊消費:   dispTree_unknown_isSpExpense,
                        メッセージ: dispTree_unknown_isMessage
                    }
                }
            },
            その他設定: {
                War販売物使用: calc_isUseWarNpc
            }
        } as iApplicationConfig
        moecostDb.registerAppConf(newDbObj);
        props.changeDisplayConfig();
        props.close();
    }

    function handleTabChange (e:React.ChangeEvent<{}>, tab:string) {
        setTabSelected(tab);
    }

    const handleSwitchDispConf = (str:tPanelDispConfChangeSwitchProps) => {
        if(str === "isUseDark") setDispConf_isUseDark(! dispConf_isUseDark);
        if(str === "isUseSmallTable") setDispConf_isUseSmallTable(! dispConf_isUseSmallTable);
        if(str === "isDefDispSummary") setDispConf_isDefDispSummary(! dispConf_isDefDispSummary);
        if(str === "isDefDispCostSheet") setDispConf_isDefDispCostSheet(! dispConf_isDefDispCostSheet);
        if(str === "isDefDispCreationTree") setDispConf_isDefDispCreationTree(! dispConf_isDefDispCreationTree);
    }

    const handleChangeSuggestion = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDispConf_suggestMax(Number(e.target.value));
    }

    const handleSwitchDispTree = (str:tPanelDispTreeChangeSwitchProps) => {
        if(str === "crt_isSkill") setDispTree_creation_isSkill(! dispTree_creation_isSkill);
        if(str === "crt_isTechnique") setDispTree_creation_isTechnique(! dispTree_creation_isTechnique);
        if(str === "crt_isDurable") setDispTree_creation_isDurable(! dispTree_creation_isDurable);
        if(str === "crt_isSpExpense") setDispTree_creation_isSpExpense(! dispTree_creation_isSpExpense);
        if(str === "crt_isByproduct") setDispTree_creation_isByproduct(! dispTree_creation_isByproduct);
        if(str === "crt_isSurplus") setDispTree_creation_isSurplus(! dispTree_creation_isSurplus);
        if(str === "crt_isCreateRemark") setDispTree_creation_isCreateRemark(! dispTree_creation_isCreateRemark);
        if(str === "crt_isNeedRecipe") setDispTree_creation_isNeedRecipe(! dispTree_creation_isNeedRecipe);
        if(str === "crt_isMaxCreate") setDispTree_creation_isMaxCreate(! dispTree_creation_isMaxCreate);
        if(str === "crt_isRemark") setDispTree_creation_isRemark(! dispTree_creation_isRemark);

        if(str === "usr_isDurable") setDispTree_user_isDurable(! dispTree_user_isDurable);
        if(str === "usr_isSpExpense") setDispTree_user_isSpExpense(! dispTree_user_isSpExpense);
        if(str === "usr_isPrice") setDispTree_user_isPrice(! dispTree_user_isPrice);

        if(str === "npc_isDurable") setDispTree_npc_isDurable(! dispTree_npc_isDurable);
        if(str === "npc_isSpExpense") setDispTree_npc_isSpExpense(! dispTree_npc_isSpExpense);
        if(str === "npc_isPrice") setDispTree_npc_isPrice(! dispTree_npc_isPrice);

        if(str === "cmn_isDurable") setDispTree_common_isDurable(! dispTree_common_isDurable);
        if(str === "cmn_isSpExpense") setDispTree_common_isSpExpense(! dispTree_common_isSpExpense);
        if(str === "cmn_isMessage") setDispTree_common_isMessage(! dispTree_common_isMessage);

        if(str === "ukn_isDurable") setDispTree_unknown_isDurable(! dispTree_unknown_isDurable);
        if(str === "ukn_isSpExpense") setDispTree_unknown_isSpExpense(! dispTree_unknown_isSpExpense);
        if(str === "ukn_isMessage") setDispTree_unknown_isMessage(! dispTree_unknown_isMessage);
    }
    const handleSwitchCalc = (str:tPanelCalcChangeSwitchProps) => {
        if(str === "clc_isUseWarNpc") setCalc_isUseWarNpc(! calc_isUseWarNpc);
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.close}
            fullWidth
            maxWidth="lg"
        >
            <Box className={classes.dialogRoot}>
                <DialogTitle>
                    <Typography>アプリケーション設定変更</Typography>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={tabSelected}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            indicatorColor="primary"
                        >
                            <Tab
                                value="dispConf"
                                label="表示設定"
                            />
                            <Tab
                                value="dispTree"
                                label={<>ツリー<br />表示設定</>}
                            />
                            <Tab
                                value="calc"
                                label="計算設定"
                            />
                        </Tabs>
                    </AppBar>
                </DialogTitle>
                <DialogContent>
                    <PanelDispConf
                        isDisplay={tabSelected === "dispConf"}
                        isUseDark={dispConf_isUseDark}
                        isUseSmallTable={dispConf_isUseSmallTable}
                        suggestMax={dispConf_suggestMax}
                        isDefDispSummary={dispConf_isDefDispSummary}
                        isDefDispCostSheet={dispConf_isDefDispCostSheet}
                        isDefDispCreationTree={dispConf_isDefDispCreationTree}
                        handleSwitch={handleSwitchDispConf}
                        handleChangeSuggestion={handleChangeSuggestion}
                    />
                    <PanelDispTree
                        isDisplay={tabSelected === "dispTree"}
                        crtIsSkill={dispTree_creation_isSkill}
                        crtIsTechnique={dispTree_creation_isTechnique}
                        crtIsDurable={dispTree_creation_isDurable}
                        crtIsSpExpense={dispTree_creation_isSpExpense}
                        crtIsByproduct={dispTree_creation_isByproduct}
                        crtIsSurplus={dispTree_creation_isSurplus}
                        crtIsCreateRemark={dispTree_creation_isCreateRemark}
                        crtIsNeedRecipe={dispTree_creation_isNeedRecipe}
                        crtIsMaxCreate={dispTree_creation_isMaxCreate}
                        crtIsRemark={dispTree_creation_isRemark}
                        usrIsDurable={dispTree_user_isDurable}
                        usrIsSpExpense={dispTree_user_isSpExpense}
                        usrIsPrice={dispTree_user_isPrice}
                        npcIsDurable={dispTree_npc_isDurable}
                        npcIsSpExpense={dispTree_npc_isSpExpense}
                        npcIsPrice={dispTree_npc_isPrice}
                        cmnIsDurable={dispTree_common_isDurable}
                        cmnIsSpExpense={dispTree_common_isSpExpense}
                        cmnIsMessage={dispTree_common_isMessage}
                        uknIsDurable={dispTree_unknown_isDurable}
                        uknIsSpExpense={dispTree_unknown_isSpExpense}
                        uknIsMessage={dispTree_unknown_isMessage}
                        handleSwitch={handleSwitchDispTree}
                    />
                    <PanelCalc
                        isDisplay={tabSelected === "calc"}
                        isUseWarNpc={calc_isUseWarNpc}
                        handleSwitch={handleSwitchCalc}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="default"
                        onClick={props.close}>
                        キャンセル
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleSubmit}>
                        設定完了
                    </Button>
                </DialogActions>
            </Box>
       </Dialog>
    )
}

type tPanelDispConfProps = {
    isDisplay:boolean,
    isUseDark:boolean,
    isUseSmallTable:boolean,
    suggestMax:number
    isDefDispSummary:boolean,
    isDefDispCostSheet:boolean,
    isDefDispCreationTree:boolean,
    handleSwitch:(str:tPanelDispConfChangeSwitchProps) => void,
    handleChangeSuggestion:(e:React.ChangeEvent<HTMLInputElement>) => void
}
const PanelDispConf:React.FC<tPanelDispConfProps> = (props) => {
    const classes = useStyles();
    const textInputRef = React.useRef({} as HTMLInputElement);

    if(! props.isDisplay) return null;

    const handleChangeSwitch = (str:tPanelDispConfChangeSwitchProps) => () => {
        props.handleSwitch(str);
    }

    const focusInput = () => {
        textInputRef.current.focus();
    }
    return (
        <Box
            className={classes.listBox}>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">全般</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">アプリ全体の色設定を黒背景に変更します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("isUseDark")}>
                            <ListItemText>ダークモード</ListItemText>
                            <Switch
                                checked={props.isUseDark}
                                onClick={handleChangeSwitch("isUseDark")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<>
                            <Typography variant="body2">表の余白を狭くすることにより、画面内の情報密度を上げます。</Typography>
                            <Typography variant="body2">スマホなどを使用中の場合、表の中をタップしづらくなる可能性があります。</Typography>
                        </>}>    
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("isUseSmallTable")}>
                            <ListItemText>緻密表の使用</ListItemText>
                            <Switch
                                checked={props.isUseSmallTable}
                                onClick={handleChangeSwitch("isUseSmallTable")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">レシピ検索候補</Typography>}
                >
                    <Tooltip
                        title={<>
                            <Typography variant="body2">レシピ検索候補の表示可能とする最大上限数を設定します。</Typography>
                            <Typography variant="body2">0を指定することで無制限となり、未入力時にすべてのレシピが表示されます。</Typography>
                            <Typography variant="body2">動作が重いようでしたら、30程度に絞ることで検索時の動作を軽くできます。</Typography>
                        </>}>
                        <ListItem
                            button
                            className={classes.listItem}
                            onClick={focusInput}>
                            <ListItemText>検索候補表示数</ListItemText>
                            <TextField
                                type="number"
                                size="small"
                                label="候補表示数"
                                inputRef={textInputRef}
                                value={props.suggestMax}
                                onChange={props.handleChangeSuggestion}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">結果の初期表示</Typography>}
                >
                    <Tooltip
                        title={<>
                            <Typography variant="body2">計算後の画面で、結果の概要を初期状態で展開します。</Typography>
                        </>}>    
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("isDefDispSummary")}>
                            <ListItemText>概要</ListItemText>
                            <Switch
                                checked={props.isDefDispSummary}
                                onClick={handleChangeSwitch("isDefDispSummary")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">計算後の画面で、結果の原価表を初期状態で展開します。</Typography>}
                    >    
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("isDefDispCostSheet")}>
                            <ListItemText>原価表</ListItemText>
                            <Switch
                                checked={props.isDefDispCostSheet}
                                onClick={handleChangeSwitch("isDefDispCostSheet")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">計算後の画面で、結果の生産ツリーを初期状態で展開します。</Typography>}>    
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("isDefDispCreationTree")}>
                            <ListItemText>生産ツリー</ListItemText>
                            <Switch
                                checked={props.isDefDispCreationTree}
                                onClick={handleChangeSwitch("isDefDispCreationTree")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
        </Box>
    )
}

type tPanelDispTreeProps = {
    isDisplay: boolean,
    crtIsSkill: boolean,
    crtIsTechnique: boolean,
    crtIsDurable: boolean,
    crtIsSpExpense: boolean,
    crtIsByproduct: boolean,
    crtIsSurplus: boolean,
    crtIsCreateRemark: boolean,
    crtIsNeedRecipe: boolean,
    crtIsMaxCreate: boolean,
    crtIsRemark: boolean,
    usrIsDurable: boolean,
    usrIsSpExpense: boolean,
    usrIsPrice: boolean,
    npcIsDurable: boolean,
    npcIsSpExpense: boolean,
    npcIsPrice: boolean,
    cmnIsDurable: boolean,
    cmnIsSpExpense: boolean,
    cmnIsMessage: boolean,
    uknIsDurable: boolean,
    uknIsSpExpense: boolean,
    uknIsMessage: boolean,
    handleSwitch: (str:tPanelDispTreeChangeSwitchProps) => void,
}
const PanelDispTree:React.FC<tPanelDispTreeProps> = (props) => {
    const classes = useStyles();
    if(! props.isDisplay) return null;

    const handleChangeSwitch = (str:tPanelDispTreeChangeSwitchProps) => () => {
        props.handleSwitch(str);
    }

    // 項目別で全部変更
    // 耐久消費
    const handleChangeSwitch_durable = () => {
        if (props.cmnIsDurable === props.crtIsDurable &&
            props.cmnIsDurable === props.npcIsDurable &&
            props.cmnIsDurable === props.uknIsDurable &&
            props.cmnIsDurable === props.usrIsDurable){
            props.handleSwitch("cmn_isDurable");
            props.handleSwitch("crt_isDurable");
            props.handleSwitch("npc_isDurable");
            props.handleSwitch("ukn_isDurable");
            props.handleSwitch("usr_isDurable");
        } else {
            if(! props.cmnIsDurable) props.handleSwitch("cmn_isDurable");
            if(! props.crtIsDurable) props.handleSwitch("crt_isDurable");
            if(! props.npcIsDurable) props.handleSwitch("npc_isDurable");
            if(! props.uknIsDurable) props.handleSwitch("ukn_isDurable");
            if(! props.usrIsDurable) props.handleSwitch("usr_isDurable");
        }
    }
    // 特殊消費
    const handleChangeSwitch_spExpense = () => {
        if (props.cmnIsSpExpense === props.crtIsSpExpense &&
            props.cmnIsSpExpense === props.npcIsSpExpense &&
            props.cmnIsSpExpense === props.uknIsSpExpense &&
            props.cmnIsSpExpense === props.usrIsSpExpense){
            props.handleSwitch("cmn_isSpExpense");
            props.handleSwitch("crt_isSpExpense");
            props.handleSwitch("npc_isSpExpense");
            props.handleSwitch("ukn_isSpExpense");
            props.handleSwitch("usr_isSpExpense");
        } else {
            if(! props.cmnIsSpExpense) props.handleSwitch("cmn_isSpExpense");
            if(! props.crtIsSpExpense) props.handleSwitch("crt_isSpExpense");
            if(! props.npcIsSpExpense) props.handleSwitch("npc_isSpExpense");
            if(! props.uknIsSpExpense) props.handleSwitch("ukn_isSpExpense");
            if(! props.usrIsSpExpense) props.handleSwitch("usr_isSpExpense");
        }
    }
    // メッセージ
    const handleChangeSwitch_message = () => {
        if (props.cmnIsMessage === props.uknIsMessage){
            props.handleSwitch("cmn_isMessage");
            props.handleSwitch("ukn_isMessage");
        } else {
            if(! props.cmnIsMessage) props.handleSwitch("cmn_isMessage");
            if(! props.uknIsMessage) props.handleSwitch("ukn_isMessage");
        }
    }
    // 価格
    const handleChangeSwitch_price = () => {
        if (props.npcIsPrice === props.usrIsPrice){
            props.handleSwitch("npc_isPrice");
            props.handleSwitch("usr_isPrice");
        } else {
            if(! props.npcIsPrice) props.handleSwitch("npc_isPrice");
            if(! props.usrIsPrice) props.handleSwitch("usr_isPrice");
        }
    }

    // 全て変更
    const handleChangeSwitch_All = (b:boolean) => () => {
        if(props.cmnIsDurable !== b) props.handleSwitch("cmn_isDurable");
        if(props.cmnIsMessage !== b) props.handleSwitch("cmn_isMessage");
        if(props.cmnIsSpExpense !== b) props.handleSwitch("cmn_isSpExpense");

        if(props.crtIsByproduct !== b) props.handleSwitch("crt_isByproduct");
        if(props.crtIsCreateRemark !== b) props.handleSwitch("crt_isCreateRemark");
        if(props.crtIsDurable !== b) props.handleSwitch("crt_isDurable");
        if(props.crtIsMaxCreate !== b) props.handleSwitch("crt_isMaxCreate");
        if(props.crtIsNeedRecipe !== b) props.handleSwitch("crt_isNeedRecipe");
        if(props.crtIsRemark !== b) props.handleSwitch("crt_isRemark");
        if(props.crtIsSkill !== b) props.handleSwitch("crt_isSkill");
        if(props.crtIsSpExpense !== b) props.handleSwitch("crt_isSpExpense");
        if(props.crtIsSurplus !== b) props.handleSwitch("crt_isSurplus");
        if(props.crtIsTechnique !== b) props.handleSwitch("crt_isTechnique");

        if(props.npcIsDurable !== b) props.handleSwitch("npc_isDurable");
        if(props.npcIsPrice !== b) props.handleSwitch("npc_isPrice");
        if(props.npcIsSpExpense !== b) props.handleSwitch("npc_isSpExpense");

        if(props.usrIsDurable !== b) props.handleSwitch("usr_isDurable");
        if(props.usrIsPrice !== b) props.handleSwitch("usr_isPrice");
        if(props.usrIsSpExpense !== b) props.handleSwitch("usr_isSpExpense");
        
        if(props.uknIsDurable !== b) props.handleSwitch("ukn_isDurable");
        if(props.uknIsMessage !== b) props.handleSwitch("ukn_isMessage");
        if(props.uknIsSpExpense !== b) props.handleSwitch("ukn_isSpExpense");
        
    }

    return (
        <Box className={classes.listBox}>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">全アイテム</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">全ての情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_All(true)}>
                            <ListItemText>全て表示</ListItemText>
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">全ての情報を非表示にします。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_All(false)}>
                            <ListItemText>全て非表示</ListItemText>
                        </ListItem>
                    </Tooltip>
                    <Divider component="li" />
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_durable}>
                            <ListItemText>耐久値</ListItemText>
                            <Switch
                                checked={props.cmnIsDurable && props.crtIsDurable && props.npcIsDurable && props.uknIsDurable && props.usrIsDurable}
                                onClick={handleChangeSwitch_durable}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位での生産時に、該当素材が特殊消費だった場合に消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_spExpense}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.cmnIsSpExpense && props.crtIsSpExpense && props.npcIsSpExpense && props.uknIsSpExpense && props.usrIsSpExpense}
                                onClick={handleChangeSwitch_spExpense}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<>
                            <Typography variant="body2">金額を表に表示します。</Typography>
                            <Typography variant="body2">NPC購入アイテムや自力調達アイテムに表示されます。</Typography>
                        </>}>
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_price}>
                            <ListItemText>金額</ListItemText>
                            <Switch
                                checked={props.npcIsPrice && props.usrIsPrice}
                                onClick={handleChangeSwitch_price}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<>
                            <Typography variant="body2">アプリからのメッセージを表示します。</Typography>
                            <Typography variant="body2">共通素材や調達方法不明アイテムのセルに表示されます。</Typography>
                        </>}>
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch_message}>
                            <ListItemText>メッセージ</ListItemText>
                            <Switch
                                checked={props.cmnIsMessage && props.uknIsMessage}
                                onClick={handleChangeSwitch_message}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">生産アイテム</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に必要スキルの情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isSkill")}>
                            <ListItemText>必要スキル</ListItemText>
                            <Switch
                                checked={props.crtIsSkill}
                                onClick={handleChangeSwitch("crt_isSkill")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に生産時の使用テクニックを表示します</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isTechnique")}>
                            <ListItemText>テクニック</ListItemText>
                            <Switch
                                checked={props.crtIsTechnique}
                                onClick={handleChangeSwitch("crt_isTechnique")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isDurable")}>
                            <ListItemText>消費耐久</ListItemText>
                            <Switch
                                checked={props.crtIsDurable}
                                onClick={handleChangeSwitch("crt_isDurable")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isSpExpense")}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.crtIsSpExpense}
                                onClick={handleChangeSwitch("crt_isSpExpense")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">生産時に副産物が生成される場合、副産物の情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isByproduct")}>
                            <ListItemText>副産物</ListItemText>
                            <Switch
                                checked={props.crtIsByproduct}
                                onClick={handleChangeSwitch("crt_isByproduct")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">生産されたアイテムが全て使用されずに余る場合、余りの情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isSurplus")}>
                            <ListItemText>余剰作成</ListItemText>
                            <Switch
                                checked={props.crtIsSurplus}
                                onClick={handleChangeSwitch("crt_isSurplus")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">生産時のルーレットの特殊条件（ギャンブル／ペナルティ）の情報が表示されます。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isCreateRemark")}>
                            <ListItemText>ルーレット備考</ListItemText>
                            <Switch
                                checked={props.crtIsCreateRemark}
                                onClick={handleChangeSwitch("crt_isCreateRemark")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">生産時にレシピが必須の場合、必要レシピ名が表示されます。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isNeedRecipe")}>
                            <ListItemText>要レシピ</ListItemText>
                            <Switch
                                checked={props.crtIsNeedRecipe}
                                onClick={handleChangeSwitch("crt_isNeedRecipe")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">作成個数に上限が設定されているアイテムの場合、上限数を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isMaxCreate")}>
                            <ListItemText>同時作成回数</ListItemText>
                            <Switch
                                checked={props.crtIsMaxCreate}
                                onClick={handleChangeSwitch("crt_isMaxCreate")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上記以外の備考がある場合に表示されます。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("crt_isRemark")}>
                            <ListItemText>備考</ListItemText>
                            <Switch
                                checked={props.crtIsRemark}
                                onClick={handleChangeSwitch("crt_isRemark")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">自力調達</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("usr_isDurable")}>
                            <ListItemText>耐久情報</ListItemText>
                            <Switch
                                checked={props.usrIsDurable}
                                onClick={handleChangeSwitch("usr_isDurable")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("usr_isSpExpense")}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.usrIsSpExpense}
                                onClick={handleChangeSwitch("usr_isSpExpense")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">金額情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("usr_isPrice")}>
                            <ListItemText>金額</ListItemText>
                            <Switch
                                checked={props.usrIsPrice}
                                onClick={handleChangeSwitch("usr_isPrice")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">NPC購入</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("npc_isDurable")}>
                            <ListItemText>耐久情報</ListItemText>
                            <Switch
                                checked={props.npcIsDurable}
                                onClick={handleChangeSwitch("npc_isDurable")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("npc_isSpExpense")}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.npcIsSpExpense}
                                onClick={handleChangeSwitch("npc_isSpExpense")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">金額情報を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("npc_isPrice")}>
                            <ListItemText>金額</ListItemText>
                            <Switch
                                checked={props.npcIsPrice}
                                onClick={handleChangeSwitch("npc_isPrice")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">共通素材</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("cmn_isDurable")}>
                            <ListItemText>耐久情報</ListItemText>
                            <Switch
                                checked={props.cmnIsDurable}
                                onClick={handleChangeSwitch("cmn_isDurable")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("cmn_isSpExpense")}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.cmnIsSpExpense}
                                onClick={handleChangeSwitch("cmn_isSpExpense")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">メッセージ「共通素材で作成」を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("cmn_isMessage")}>
                            <ListItemText>メッセージ</ListItemText>
                            <Switch
                                checked={props.cmnIsMessage}
                                onClick={handleChangeSwitch("cmn_isMessage")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">未設定アイテム</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">ツリー上に上位生産時に消費する耐久値を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("ukn_isDurable")}>
                            <ListItemText>耐久情報</ListItemText>
                            <Switch
                                checked={props.uknIsDurable}
                                onClick={handleChangeSwitch("ukn_isDurable")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">上位生産時に該当素材が特殊消費だった場合、消費タイプを表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("ukn_isSpExpense")}>
                            <ListItemText>特殊消費</ListItemText>
                            <Switch
                                checked={props.uknIsSpExpense}
                                onClick={handleChangeSwitch("ukn_isSpExpense")}
                            />
                        </ListItem>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant="body2">メッセージ「【注意】入手手段不明」を表示します。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("ukn_isMessage")}>
                            <ListItemText>メッセージ</ListItemText>
                            <Switch
                                checked={props.uknIsMessage}
                                onClick={handleChangeSwitch("ukn_isMessage")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
        </Box>
    )

}

type tPanelCalcProps = {
    isDisplay: boolean,
    isUseWarNpc: boolean,
    handleSwitch: (str:tPanelCalcChangeSwitchProps) => void
}

const PanelCalc:React.FC<tPanelCalcProps> = (props) => {
    const classes = useStyles();

    if(! props.isDisplay) return null;

    const handleChangeSwitch = (str:tPanelCalcChangeSwitchProps) => () => {
        if(str === "clc_isUseWarNpc") props.handleSwitch(str);
    }
    return (
        <Box className={classes.listBox}>
            <Paper
                className={classes.listPaper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">販売情報</Typography>}
                >
                    <Tooltip
                        title={<Typography variant="body2">War Ageの販売情報を計算結果に含めます。</Typography>}
                    >
                        <ListItem
                            className={classes.listItem}
                            button
                            onClick={handleChangeSwitch("clc_isUseWarNpc")}>
                            <ListItemText>War販売物の利用</ListItemText>
                            <Switch
                                checked={props.isUseWarNpc}
                                onClick={handleChangeSwitch("clc_isUseWarNpc")}
                            />
                        </ListItem>
                    </Tooltip>
                </List>
            </Paper>
        </Box>
    );
}















export default ConfigDisplayDialog;
