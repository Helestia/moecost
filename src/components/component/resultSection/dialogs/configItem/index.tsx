import React from 'react';
import {tHandleOpenSnackbar}    from '../../../../commons/snackbar/useSnackbar';

import {buildTrees} from '../../../../../scripts/buildTrees/buildTrees';
import {tBuildTreeResult}   from '../../../../../scripts/buildTrees/commonTypes';
import makeListArrayFromTree,
    {tMakeListArrayResult}      from '../../../../../scripts/makeListArrayFromTree';
import {
    MultiRecipesDefault,
    NpcSaleItems,
    Recipes,
    tJSON_recipe}          from '../../../../../scripts/jsonReader';
import moecostDb,
    {iDictionary, 
    tDictionary_ItemInfo_user,
    tDictionary_ItemInfo_npc,
    tDictionary_ItemInfo_creation,
    tDictionary_ItemInfo} from '../../../../../scripts/storage';

import DialogNormal             from '../../../../commons/dialog/dialogNormal';
import Tabs, {tTabState}        from '../../../../commons/tabs/tabs';
import useTabs                  from '../../../../commons/tabs/useTabs'

import RenderSummary            from './summary';
import RenderNpc                from './npc';
import RenderRecipe             from './recipe';

import Button                   from '@material-ui/core/Button';

import Typography               from '@material-ui/core/Typography';

type tRenderConfigItem = {
    isOpen: boolean,
    itemName: string,
    close: () => void,
    handleOpenSnackbar: tHandleOpenSnackbar
}
const RenderConfigItem: React.FC<tRenderConfigItem> = (props) => {
    const tabHooks = useTabs("summary",calcTabState())

    const [radioSelected,setRadioSelected] = React.useState("");
    const [userCostValue,setUserCostValue] = React.useState(0);
    
    function calcTabState() {
        const hasRecipe = Recipes.some(recipe => recipe.生成物.アイテム === props.itemName);
        const hasNpcSale = NpcSaleItems.some(npcs => npcs.アイテム === props.itemName);

        const result : tTabState[] = [
            {
                value: "summary",
                label: "概要・入手方法選択"
            },
            {
                value: "npc",
                label: "NPC販売情報",
                disabled: (! hasNpcSale)
            },
            {
                value: "recipe",
                label: "生産情報",
                disabled: (! hasRecipe)
            }
        ]
        return result;
    }

    const handleInitialize = () => {
        tabHooks.initialize();
        // 選択肢を設定
        type tDefConf = {"調達方法": string, "ユーザー価格": number};
        const defConf:tDefConf = (() => {
            const dictObj = moecostDb.辞書.内容.find(d => d.アイテム === props.itemName);
            if(dictObj){
                if(dictObj.調達方法 === "NPC") return {調達方法:"NPC", ユーザー価格:0};
                if(dictObj.調達方法 === "生産") return {調達方法:"生産_" + dictObj.レシピ名, ユーザー価格:0};
                return {調達方法:"自力調達", ユーザー価格:dictObj.調達価格};
            };
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
    }

    const recipes = RetrieveItemData_Recipe(props.itemName)
    const npcs = RetrieveItemData_Npc(props.itemName);

    // ダイアログクローズ
    const closeDialog = () => props.close();

    const handleRadio = (str:string) => setRadioSelected(str);
    const handleUserCost = (num:number) => setUserCostValue(num);

    // 登録情報の最新化
    const handleSubmit = () => moecostDb.refleshProperties(submitItemData);

    // 登録情報の修正
    const submitItemData = () => {
        const resultObj:tDictionary_ItemInfo = (() => {
            if(radioSelected === "自力調達"){
                const result:tDictionary_ItemInfo_user = {
                    アイテム: props.itemName,
                    調達方法: "自力調達",
                    調達価格: userCostValue
                }
                return result;
            }
            if(radioSelected === "NPC"){
                const result:tDictionary_ItemInfo_npc = {
                    アイテム: props.itemName,
                    調達方法: "NPC"
                }
                return result;
            }
            const recipeName = radioSelected.replace("生産_","")
            const result: tDictionary_ItemInfo_creation = {
                アイテム: props.itemName,
                調達方法: "生産",
                レシピ名: recipeName
            }
            return result;
        })();
        const dictionaryObj = moecostDb.辞書.内容.filter(d => d.アイテム !== props.itemName).concat(resultObj);
        const newDictionary:iDictionary = {
            辞書名: moecostDb.辞書.辞書名,
            内容: dictionaryObj
        }
        moecostDb.registerDictionary(newDictionary)
            .catch(() => {
                props.handleOpenSnackbar(
                    "error",
                    (<>
                        <Typography>設定情報のブラウザへの保存に失敗しています。</Typography>
                        <Typography>リトライなどを行っても正常にできない場合は、バグ報告等をいただければと思います。</Typography>
                    </>),
                    null
                )
            })
        props.close();
    }

    return (
        <DialogNormal
            isOpen={props.isOpen}
            handleClose={closeDialog}
            title={
                <>
                    <Typography>アイテム情報の確認 - {props.itemName}</Typography>
                    <Tabs
                        value={tabHooks.selected}
                        reactKeyPrefix="resultSection_resultComfingItemDialog_Tabs_"
                        tabInfo={calcTabState()}
                        handleChange={tabHooks.handleChange}
                    />
                </>
            }
            actions={
                <>
                    <Button
                        color="default"
                        onClick={closeDialog}
                    >
                        キャンセル
                    </Button>
                    <Button
                        color="primary"
                        disabled={tabHooks.selected !== "summary"}
                        onClick={handleSubmit}>
                        登録
                    </Button>
                </>
            }
            maxWidth="lg"
            initialize={handleInitialize}
        >
            <RenderSummary
                itemName={props.itemName}
                tabSelected={(tabHooks.selected === "summary")}
                recipes={recipes}
                npcs={npcs}
                procurement={radioSelected}
                userCost={userCostValue}
                handleRadio={handleRadio}
                handleUserCost={handleUserCost}
                handleSubmit={submitItemData}
            />
            <RenderNpc
                tabSelected={(tabHooks.selected === "npc")}
                npcs={npcs}
                itemName={props.itemName}
            />
            <RenderRecipe
                tabSelected={(tabHooks.selected === "recipe")}
                recipes={recipes}
                itemName={props.itemName}
            />
        </DialogNormal>
    )
}



export type tRetrieveItemData_RecipeResult = {
    レシピ: tJSON_recipe,
    ツリー: tBuildTreeResult,
    リスト: tMakeListArrayResult
}

const RetrieveItemData_Recipe = (itemName:string) => {
    const recipeAll = Recipes.filter(r => r.生成物.アイテム === itemName);
    const propBuildTrees = recipeAll.map(r => {return {レシピ名:r.レシピ名, 生成アイテム:[r.生成物.アイテム]}})
    
    const buildTreeResults = propBuildTrees.map(p => buildTrees(p.レシピ名, p.生成アイテム, "fully", 0));
    const lists = buildTreeResults.map(tree => makeListArrayFromTree(tree.main, tree.common, [], [], []));
    
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

export default RenderConfigItem;
