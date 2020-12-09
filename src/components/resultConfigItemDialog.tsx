import React from 'react';

import buildTree, {tBuildTreeResult}        from '../scripts/buildTree';
import {numDeform}                          from '../scripts/common';
import makeListArrayFromTree,
    {tMakeListArrayResult}                  from '../scripts/makeListArrayFromTree';
import {
    MultiRecipesDefault,
    NpcSaleItems,
    Recipes,
    tJSON_recipe,
    tJSON_npcSaleItem} from '../scripts/jsonReader';
import moecostDb,{ 
    iDictionary, 
    tDictionary_ItemInfo_user,
    tDictionary_ItemInfo_npc,
    tDictionary_ItemInfo_creation} from '../scripts/storage';

import AppBar                   from '@material-ui/core/AppBar';
import Box                      from '@material-ui/core/Box'
import Button                   from '@material-ui/core/Button'
import Dialog                   from '@material-ui/core/Dialog';
import DialogTitle              from '@material-ui/core/DialogTitle';
import DialogContent            from '@material-ui/core/DialogContent';
import DialogActions            from '@material-ui/core/DialogActions';
import TableContainer           from '@material-ui/core/TableContainer';
import Table                    from '@material-ui/core/Table';
import TableHead                from '@material-ui/core/TableHead';
import TableBody                from '@material-ui/core/TableBody';
import TableRow                 from '@material-ui/core/TableRow';
import TableCell                from '@material-ui/core/TableCell';
import Radio                    from '@material-ui/core/Radio';
import RadioGroup               from '@material-ui/core/RadioGroup';
import TextField                from '@material-ui/core/TextField';
import FormControlRabel         from '@material-ui/core/FormControlLabel';
import Paper                    from '@material-ui/core/Paper'

import Tabs                     from '@material-ui/core/Tabs';
import Tab                      from '@material-ui/core/Tab';
import Typography               from '@material-ui/core/Typography';
import List                     from '@material-ui/core/List';
import ListItem                 from '@material-ui/core/ListItem';
import ListItemText             from '@material-ui/core/ListItemText';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';


import {
    makeStyles,
    createStyles,
    Theme} from '@material-ui/core/styles'


const useStyles = makeStyles((theme:Theme) => createStyles({
    dialogRoot:{
        maxHeight:"80vh",
        minHeight:"50vh",
        display:"flex",
        flexDirection:"column"
    },
    dialogAction: {
        alignSelf:"flex-end"
    },
    disableTab: {
        backgroundColor: theme.palette.action.disabled
    },
    warSale: {
        backgroundColor: (theme.palette.type === "light") ? "#ffc" : "#330",
    },
    warSaleText: {
        fontWeight: "bold"
    },
    userCostInput: {
        width: "10em"
    },
    racipeTableContainer: {
        marginBottom: theme.spacing(2)
    },
    recipeTableLeftCell: {
        width: "15em"
    }
}));



type tResultConfigItemDialogProps = {
    isOpen: boolean,
    userDictionary: iDictionary | undefined
    itemName: string,
    close: () => void,
    changeTrigger : () => void
}
const ResultConfigItemDialog: React.FC<tResultConfigItemDialogProps> = (props) => {
    const [befOpen,setBefOpen] = React.useState(false);
    const [tabSelected, setTabSelected] = React.useState("summary");

    const [radioSelected,setRadioSelected] = React.useState("");
    const [userCostValue,setUserCostValue] = React.useState(0);

    const classes = useStyles();
    
    // リセット処理
    if((! befOpen) && props.isOpen){
        setTabSelected("summary");
        // 選択肢を設定
        type tDefConf = {"調達方法": string, "ユーザー価格": number};
        const defConf:tDefConf = (() => {
            if(props.userDictionary){
                const dictObj = props.userDictionary.内容.find(d => d.アイテム === props.itemName);
                if(dictObj){
                    if(dictObj.調達方法 === "NPC") return {調達方法:"NPC", ユーザー価格:0};
                    if(dictObj.調達方法 === "生産") return {調達方法:"生産_" + dictObj.レシピ名, ユーザー価格:0};
                    return {調達方法:"自力調達", ユーザー価格:dictObj.調達価格};
                };
            }
            const npcObj = NpcSaleItems.find(n => n.アイテム === props.itemName);
            if(npcObj) return {調達方法:"NPC", ユーザー価格:0};
            const recipeObj = Recipes.filter(r => r.生成物.アイテム === props.itemName);
            if(recipeObj.length > 1){
                const multi = MultiRecipesDefault.find(m => m.アイテム名 === props.itemName);
                if(multi) return {調達方法:"生産_" + multi.標準レシピ名 , ユーザー価格:0};
                return {調達方法:"生産_" + recipeObj[0].レシピ名 , ユーザー価格:0};
            }
            if(recipeObj.length === 1) return {調達方法:"生産_" + recipeObj[0].レシピ名 , ユーザー価格:0};
            return {調達方法:"" , ユーザー価格:0};
        })();
        setRadioSelected(defConf.調達方法);
        setUserCostValue(defConf.ユーザー価格);

        setBefOpen(true);
    }
    if(befOpen && (! props.isOpen)){
        setBefOpen(false);
    }

    const recipes = RetrieveItemData_Recipe(props.itemName, props.userDictionary)
    const npcs = RetrieveItemData_Npc(props.itemName);

    const hasRecipe = (recipes.length === 0) ? false : true;
    const hasNpcSale = (npcs === undefined) ? false: true; 

    // ダイアログクローズ
    const closeDialog = () => {
        props.close();
    }

    const handleTabChange = (e:React.ChangeEvent<{}>, tab:string) => setTabSelected(tab);

    const handleRadio = (str:string) => setRadioSelected(str);

    const handleUserCost = (num:number) => setUserCostValue(num);

    // 登録情報の最新化
    const handleSubmit = () => {
        moecostDb.refleshProperties(submitItemData);
    }

    // 登録情報の修正
    const submitItemData = () => {
        const resultObj = (() => {
            if(radioSelected === "自力調達") return {
                アイテム: props.itemName,
                調達方法: "自力調達",
                調達価格: userCostValue
            } as tDictionary_ItemInfo_user
            if(radioSelected === "NPC") return {
                アイテム: props.itemName,
                調達方法: "NPC"
            } as tDictionary_ItemInfo_npc
            const recipeName = radioSelected.replace("生産_","")
            return {
                アイテム: props.itemName,
                調達方法: "生産",
                レシピ名: recipeName
            } as tDictionary_ItemInfo_creation
        })();
        const dictionaryObj = moecostDb.辞書.内容.filter(d => d.アイテム !== props.itemName).concat(resultObj);
        const newDictionary:iDictionary = {
            辞書名: moecostDb.辞書.辞書名,
            内容: dictionaryObj
        }
        moecostDb.registerDictionary(newDictionary);
        props.changeTrigger();
        props.close();
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth="lg"
            scroll="paper">
            <Box className={classes.dialogRoot}>
                <DialogTitle>
                    <Typography>アイテム情報の確認 - {props.itemName}</Typography>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={tabSelected}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            indicatorColor="primary"
                        >
                            <Tab
                                value="summary"
                                label="概要・入手方法選択"
                            />
                            <Tab
                                value="npc"
                                label="NPC販売情報"
                                className={(! hasNpcSale) ? classes.disableTab : ""}
                                disabled={(! hasNpcSale)}
                            />
                            <Tab
                                value="recipe"
                                label="生産情報"
                                className={(! hasRecipe) ? classes.disableTab : ""}
                                disabled={(! hasRecipe)}
                            />
                        </Tabs>
                    </AppBar>
                </DialogTitle>
                <DialogContent>
                    <RenderSummary
                        itemName={props.itemName}
                        tabSelected={(tabSelected === "summary")}
                        recipes={recipes}
                        npcs={npcs}
                        procurement={radioSelected}
                        userCost={userCostValue}
                        handleRadio={handleRadio}
                        handleUserCost={handleUserCost}
                        handleSubmit={submitItemData}
                    />
                    <RenderNpc
                        tabSelected={(tabSelected === "npc")}
                        npcs={npcs}
                        itemName={props.itemName}
                    />
                    <RenderRecipe
                        tabSelected={(tabSelected === "recipe")}
                        recipes={recipes}
                        itemName={props.itemName}
                    />
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        color="default"
                        onClick={closeDialog}
                    >
                        キャンセル
                    </Button>
                    <Button
                        color="primary"
                        disabled={tabSelected !== "summary"}
                        onClick={handleSubmit}>
                        登録
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

type tRenderSummaryProps = {
    itemName: string,
    tabSelected: boolean,
    recipes: tRetrieveItemData_RecipeResult[],
    npcs: tJSON_npcSaleItem | undefined,
    procurement: string,
    userCost: number,
    handleRadio:    (str:string) => void,
    handleUserCost: (num:number) => void,
    handleSubmit: () => void
}
const RenderSummary:React.FC<tRenderSummaryProps> = (props) => {
    const classes = useStyles();

    if(! props.tabSelected) return null;

    const renderNpcSalesRow = () => {
        const saleCell = (props.npcs === undefined)
            ? <TableCell><Typography>販売情報なし</Typography></TableCell>
            : <TableCell><Typography>最低販売額 {numDeform(props.npcs.最低販売価格)}</Typography></TableCell>
        return (
            <TableRow>
                <TableCell>NPC販売情報</TableCell>
                {saleCell}
            </TableRow>
        )
    }
    const handleChangeRadio = (e:React.ChangeEvent<HTMLInputElement>,value:string) => {
        props.handleRadio(value);
    }

    const handleClickUserTextField = (e:React.MouseEvent<HTMLInputElement>) => {
        props.handleRadio("自力調達");
    }

    const handleUserCost = (e:React.ChangeEvent<HTMLInputElement>) => {
        const valueNumber = Number(e.target.value);
        if(valueNumber < 0) props.handleUserCost(0);
        return props.handleUserCost(valueNumber);
    }

    const renderRecipeRow = () => {
        const recipeCell = (() => {
            if(props.recipes.length === 0) return <TableCell><Typography>生産情報なし</Typography></TableCell>
            if(props.recipes.length === 1){
                const r = props.recipes[0];
                return (
                    <TableCell>
                        <Typography
                            color={(r.リスト.最終作成物[0].未設定含) ? "error" : "textPrimary"}>
                            {(r.リスト.最終作成物[0].未設定含) 
                                ? numDeform(r.リスト.最終作成物[0].単価) + " ± 未設定"
                                : numDeform(r.リスト.最終作成物[0].単価)
                            }
                        </Typography>
                    </TableCell>
                );
            }

            const Lists = props.recipes.map((r,i) => {
                const isError = r.リスト.最終作成物[0].未設定含;
                return (
                    <ListItem
                        key={"resultConfigItemDialog_Summary_CreationList_" + i}>
                        <ListItemText
                            primary={
                                <Typography>{r.レシピ.レシピ名}</Typography>
                            }
                            secondary={
                                <Typography
                                    color={(isError) ? "error" : "textPrimary"}>
                                    {(isError) 
                                        ? numDeform(r.リスト.最終作成物[0].単価) + " ± 未設定"
                                        : numDeform(r.リスト.最終作成物[0].単価)
                                    }
                                </Typography>
                            }
                            />
                    </ListItem>
                )
            });
            return (
                <TableCell>
                    <List>
                        {Lists}
                    </List>
                </TableCell>
            );
        })()
        return (
            <TableRow>
                <TableCell>
                    <Typography>
                        生産情報
                    </Typography>
                </TableCell>
                {recipeCell}
            </TableRow>
        );
    }

    // アイテム入手手段選択肢
    const renderRadioList = () => {
        const npc = (props.npcs !== undefined) 
            ? (
                <ListItem>
                    <ListItemText primary={
                        <FormControlRabel
                            control={<Radio size="small" />}
                            label={<Typography>NPC購入</Typography>}
                            value="NPC"
                            checked={props.procurement === "NPC"}
                        />
                        }
                    />
                </ListItem>
            )
            : null;
        const create = (() => {
            if(props.recipes.length > 1) return (
                <>
                    {props.recipes.map((r,i) => {
                        const valueName: string = `生産_${r.レシピ.レシピ名}`;
                        
                        return (
                            <ListItem key={"resultConfigItemDialog_Summary_RadioListCreationList_" + i}>
                                <ListItemText
                                    primary={
                                    <FormControlRabel
                                        control={<Radio size="small" />}
                                        label={<Typography>生産 - {r.レシピ.レシピ名}</Typography>}
                                        value={valueName}
                                        checked={props.procurement === valueName}

                                    />
                                    }
                                />
                            </ListItem>
                        )
                    })}
                </>
            );
            if(props.recipes.length === 1) {
                const valueName = `生産_${props.recipes[0].レシピ.レシピ名}`;
                return (
                <ListItem>
                    <ListItemText
                        primary={
                            <FormControlRabel
                                control={<Radio size="small" />}
                                label={<Typography>生産作成</Typography>}
                                value={valueName}
                                checked={props.procurement === valueName}
                            />
                        }
                    />
                </ListItem>
                );
            }
            return null;
        })();
        const user = (
            <ListItem>
                <ListItemText
                    primary={
                        <FormControlRabel
                            control={<Radio size="small" />}
                            label={<Typography>自力調達(単価指定)</Typography>}
                            value="自力調達"
                            checked={props.procurement === "自力調達"}
                        />
                    }
                    secondary={
                        <TextField
                            type="number"
                            label="単価"
                            disabled={props.procurement !== "自力調達"}
                            size="small"
                            value={props.userCost}
                            onClick={handleClickUserTextField}
                            onChange={handleUserCost}
                            className={classes.userCostInput}
                    />
                    }
                />
                <ListItemSecondaryAction>

                </ListItemSecondaryAction>
            </ListItem>
        );

        const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
            props.handleSubmit();
            e.preventDefault();
        }
        return (
            <TableRow>
                <TableCell>調達方法</TableCell>
                <TableCell>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <RadioGroup value={props.procurement} onChange={handleChangeRadio}>
                            <List dense>
                                {npc}
                                {create}
                                {user}
                            </List>
                        </RadioGroup>
                    </form>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>アイテム名</TableCell>
                        <TableCell>{props.itemName}</TableCell>
                    </TableRow>
                    {renderNpcSalesRow()}
                    {renderRecipeRow()}
                    {renderRadioList()}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

type tRenderNpcProps = {
    tabSelected: boolean,
    npcs: tJSON_npcSaleItem | undefined,
    itemName: string
}
const RenderNpc:React.FC<tRenderNpcProps> = (props) => {
    const classes = useStyles();
    if(! props.tabSelected) return null;
    if(! props.npcs) return null;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>時代</TableCell>
                        <TableCell>地域</TableCell>
                        <TableCell>販売員名</TableCell>
                        <TableCell>販売価格</TableCell>
                        <TableCell>備考</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.npcs.販売情報.map((s,i) => (
                            <TableRow
                                key={`resultConfigItemDialog_Npc_TableRow_${i}`}
                                className={(s.時代 === "War Age") ? classes.warSale : ""}>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.時代}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.エリア}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.販売員}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {(s.時代 === "War Age")
                                        ? <Typography className={classes.warSaleText}>
                                            {numDeform(s.価格)} jade
                                        </Typography>
                                        : <Typography>
                                            {numDeform(s.価格)} gold
                                        </Typography>
                                    }

                                </TableCell>
                                <TableCell>
                                    {(s.備考)
                                        ? <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.備考}</Typography>
                                        : null
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
type tRenderRecipeProps = {
    tabSelected: boolean,
    recipes: tRetrieveItemData_RecipeResult[],
    itemName: string
}
const RenderRecipe:React.FC<tRenderRecipeProps> = (props) => {
    const classes = useStyles();
    if(! props.tabSelected) return null;
    if(! props.recipes) return null;
    

    const renderRouletteRow = (recipe:tJSON_recipe) => {
        if((! recipe.ギャンブル) && (! recipe.ペナルティ)) return null;
        const text = (()=> {
            if(recipe.ギャンブル && recipe.ペナルティ) return "ギャンブル・ペナルティ型";
            if(recipe.ギャンブル) return "ギャンブル型";
            return "ペナルティ";
        })()
        return (
            <TableRow>
                <TableCell className={classes.recipeTableLeftCell}><Typography>ルーレット</Typography></TableCell>
                <TableCell><Typography>{text}</Typography></TableCell>
            </TableRow>
        )
    }
    const renderByproduct = (recipe:tJSON_recipe) => {
        if(! recipe.副産物) return null;
        const text = recipe.副産物.map(b => {
            const afix = (b.個数) ? ` × ${b.個数}` : "";
            return b.アイテム + afix;
        }).join(" / ");
        const resultJSX = (text.length > 20)
            ? <Typography>
                {text.split(" / ").map((t,i) => {
                    if(i) return <><br />{t}</>;
                    return <>{t}</>;
                })}
            </Typography>
            : <Typography>{text}</Typography>
        return (
            <TableRow>
                <TableCell className={classes.recipeTableLeftCell}><Typography>副産物</Typography></TableCell>
                <TableCell>{resultJSX}</TableCell>
            </TableRow>
        )
    }

    return (
        <>
        {    
            props.recipes.map((r,i) => (
                <TableContainer
                    component={Paper}
                    key={`resultConfigItemDialog_Recipe_TableContainer_${i}`}
                    className={classes.racipeTableContainer}
                >
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.recipeTableLeftCell}><Typography>レシピ名</Typography></TableCell>
                                <TableCell><Typography>{r.レシピ.レシピ名}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.recipeTableLeftCell}><Typography>作成物</Typography></TableCell>
                                <TableCell>
                                    <Typography>
                                        {r.レシピ.生成物.アイテム}{(r.レシピ.生成物.個数)
                                            ? ` × ${numDeform(r.レシピ.生成物.個数)}`
                                            : ""
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {/*副産物*/}
                            {renderByproduct(r.レシピ)}
                            <TableRow>
                                <TableCell className={classes.recipeTableLeftCell}><Typography>材料</Typography></TableCell>
                                <TableCell>
                                    <Typography>
                                    {r.レシピ.材料.map(m => {
                                        const countAfix = (m.個数) ? ` × ${m.個数}` : "";
                                        return <>{m.アイテム + countAfix}<br /></>; 
                                    })}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {/*ルーレット配置*/}
                            {renderRouletteRow(r.レシピ)}
                            {(r.レシピ.要レシピ)
                                ? (<TableRow>
                                    <TableCell className={classes.recipeTableLeftCell}><Typography>要レシピ</Typography></TableCell>
                                    <TableCell><Typography>レシピが必要</Typography></TableCell>
                                </TableRow>)
                                : null
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            ))
        }
        </>
    );
}

type tRetrieveItemData_RecipeResult = {
    レシピ: tJSON_recipe,
    ツリー: tBuildTreeResult,
    リスト: tMakeListArrayResult
}


const RetrieveItemData_Recipe = (itemName:string, dictionary:iDictionary | undefined) => {
    const recipeAll = Recipes.filter(r => r.生成物.アイテム === itemName);
    const propBuildTrees = recipeAll.map(r => {return {レシピ名:r.レシピ名, 生成アイテム:[r.生成物.アイテム]}})
    
    const buildTreeResults = propBuildTrees.map(p => buildTree(p,"fully",0));
    const lists = buildTreeResults.map(tree => makeListArrayFromTree(tree.main, tree.common, [], []));
    
    const result: tRetrieveItemData_RecipeResult[] = [];
    for(let i=0;i<recipeAll.length;i++){
        result.push({
            レシピ: recipeAll[i],
            ツリー: buildTreeResults[i],
            リスト: lists[i]
        });
    };
    return result;
}

const RetrieveItemData_Npc = (itemName:string) => {
    const npcSales = NpcSaleItems.find(i => i.アイテム === itemName);
    return npcSales;
}

export default ResultConfigItemDialog
