import React from 'react';
import {tHandleOpenSnackbar} from '../../../App';

import ResultAlertSection                   from './resultAlertSection';
import ResultSummarySection                 from './resultSummarySection';
import ResultCostSheet                      from './resultCostSheet';
import ResultCreationTree                   from './resultCreationTree';
import ResultConfigCreateNumberDialog       from './resultConfigCreateNumberDialog';
import ResultConfigItemDialog               from './resultConfigItemDialog';

import useAccordionList from '../../commons/accordion/useAccordionList';
import useDialogParent  from '../../commons/dialog/useDialogParent';

import buildTree,
    {tQtyRole,tQtyRoleResult} from '../../../scripts/buildTree';
import confirmMessages        from '../../../scripts/confirmMessages';
import makeListArrayFromTree  from '../../../scripts/makeListArrayFromTree';
import moecostDb              from '../../../scripts/storage';


type tResultSectionProps = {
    recipe:string,
    items:string[],
    handleOpenSnackbar: tHandleOpenSnackbar,
}
const ResultSection:React.FC<tResultSectionProps> = (props) => {
    // メインロジック
    const hooks = useResultSection(props.recipe, props.items,)
    
    // 作成個数変更ダイアログ関係
    const {
        isOpen:isOpenQtyD,
        handleOpen:handleOpenQtyD,
        handleClose:handleCloseQtyD} = useDialogParent();
    
    // アイテム調達方法変更ダイアログ関係
    const {
        isOpen:isOpenItemD,
        handleOpen:handleOpenItemD,
        handleClose:handleCloseItemD} = useDialogParent();
    const [itemConfigTarget, setItemConfigTarget] = React.useState("");

    // アコーディオンリストの統括コントロール
    const {
        isExpandeds,
        handleChangeAccordions,
        expandInitialize
    } = useAccordionList(
        "unitExpand",
        3,
        [
            moecostDb.アプリ設定.表示設定.初期表示設定.概要,
            moecostDb.アプリ設定.表示設定.初期表示設定.原価表,
            moecostDb.アプリ設定.表示設定.初期表示設定.生産ツリー
        ]);

    // 画面描画関係での初期化
    if(hooks.requireInitialize){
        expandInitialize();
        handleCloseQtyD();
        handleCloseItemD();
    }


    const handleItemClick = (itemName:string) => {
        setItemConfigTarget(itemName);
        handleOpenItemD();
    }

    if(props.recipe === "") return null;

    if(hooks.isCanceledCalcuration) return <ResultAlertSection messages={hooks.messages} />
    // ダイアログ関係のレンダリング
    const renderDialogs = () => (
        <>
            {/*個数変更ダイアログ*/}
            <ResultConfigCreateNumberDialog 
                isOpen={isOpenQtyD}
                quantity={hooks.quantities.resultQty}
                minimumQty={hooks.quantities.fullyMinimumQuantity}
                role={hooks.quantities.resultRoute}
                close={handleCloseQtyD}
                changeQty={hooks.handler.changeQty}
            />
            
            {/*アイテム情報ダイアログ*/}
            <ResultConfigItemDialog
                isOpen={isOpenItemD}
                itemName={itemConfigTarget}
                handleOpenSnackbar={props.handleOpenSnackbar}
                close={handleCloseItemD}
            />
        </>
    )

    const renderAlertSection = () => <ResultAlertSection messages={hooks.messages} />;
    
    // 最終処理
    if(props.recipe === "") return renderDialogs();
    if(hooks.isCanceledCalcuration) return (
        <>
            {renderAlertSection()}
            {renderDialogs()}
        </>
    );

    return (
        <>
            {renderAlertSection()}
            <ResultSummarySection
                isExpanded={isExpandeds[0]}
                handleExpand={handleChangeAccordions.bind(null,0)}
                recipeName={props.recipe}
                creations={hooks.lists.creations}
                materials={hooks.lists.materials}
                surpluses={hooks.lists.surpluses}
                byproducts={hooks.lists.byproducts}
                durabilities={hooks.lists.durabilities}
                noLostItems={hooks.lists.noLostItems}
                skills={hooks.lists.skills}
                needRecipes={hooks.lists.needRecipes}
                changeTrashItemsByproducts={hooks.handler.trashItemsByproducts}
                changeTrashItemsSurpluses={hooks.handler.trashItemsSurplus}
                changeTrashItemsNoLost={hooks.handler.trashItemsNoLost}
                handleOpenQtyDialog={handleOpenQtyD}
            />

            <ResultCostSheet
                isExpanded={isExpandeds[1]}
                handleExpand={handleChangeAccordions.bind(null,1)}
                materials={hooks.lists.materials}
                durabilities={hooks.lists.durabilities}
                surpluses={hooks.lists.surpluses}
                byproducts={hooks.lists.byproducts}
                noLostItems={hooks.lists.noLostItems}
                creations={hooks.lists.creations}
                changeTrashItemsByproducts={hooks.handler.trashItemsByproducts}
                changeTrashItemsSurpluses={hooks.handler.trashItemsSurplus}
                changeTrashItemsNoLost={hooks.handler.trashItemsNoLost}
                handleItemClick={handleItemClick}
                handleOpenQtyDialog={handleOpenQtyD}
            />

            <ResultCreationTree
                isExpanded={isExpandeds[2]}
                main={hooks.trees.mains}
                common={hooks.trees.commons}
                handleExpand={handleChangeAccordions.bind(null,2)}
                handleItemClick={handleItemClick}
            />

            {/*ダイアログ関係*/}
            {renderDialogs()}
        </>
    )
}

export type tTrashState = {
    アイテム:string,
    廃棄:boolean
}


const useResultSection = (recipe:string,items:string[]) => {
    const [befRecipe,setBefRecipe] = React.useState("");
    const [befItems,setBefItems] = React.useState<string[]>([]);

    const [quantity,setQuantity] = React.useState(0);
    const [qtyRole,setQtyRole] = React.useState<tQtyRole>(undefined);
    const [trashItemsByproduct,setTrashItemsByproduct] = React.useState<tTrashState[]>([]);
    const [trashItemsSurplus,setTrashItemsSurplus] = React.useState<tTrashState[]>([]);
    const [trashItemsNoLost, setTrashItemsNoLost] = React.useState<tTrashState[]>([]);

    // 初期化・判別処理
    const requireInitialize = (() => {
        if(
            recipe !== befRecipe || 
            items.some((item,index) => item !== befItems[index])
        ){
            setBefRecipe(recipe);
            setBefItems(items.concat());
            setQuantity(0);
            setQtyRole(undefined);
            setTrashItemsByproduct([]);
            setTrashItemsSurplus([]);
            setTrashItemsNoLost([]);
            return true;
        } else {
            return false;
        }
    })();

    // ツリー構築
    const {
        main:mainTrees,
        common:commonTrees,
        message:buildTreeMessage,
        qtyRoleResult,
        totalQuantity,
        fullyMinimumQuantity
    } = buildTree(recipe, items, qtyRole, quantity);

    // メッセージ取得・リスト化処理
    const {isCanceledCalcuration ,resultMessage, lists} = (() => {
        if(buildTreeMessage.length){
            return {
                isCanceledCalcuration: true,
                resultMessage: buildTreeMessage,
                lists: {
                    材料: [],
                    副産物: [],
                    余剰作成: [],
                    最終作成物: [],
                    耐久消費: [],
                    スキル: [],
                    要レシピ: [],
                    未消費素材: []
                }
            }
        } else {
            return {
                isCanceledCalcuration: false,
                resultMessage: confirmMessages(mainTrees,commonTrees,quantity),
                lists: makeListArrayFromTree(
                    mainTrees,
                    commonTrees,
                    trashItemsByproduct,
                    trashItemsSurplus,
                    trashItemsNoLost)
            }
        }
    })();

    // 以下リアクティブ
    const handleTrashItem_Surpluses =   (trashList: string[]) => {
        const newTrashArray:tTrashState[] = lists.余剰作成.map(surplus => ({
            アイテム: surplus.アイテム名,
            廃棄: trashList.includes(surplus.アイテム名)
        }));
        setTrashItemsSurplus(newTrashArray);
    }
    const handleTrashItem_Byproducts =  (trashList: string[]) => {
        const newTrashArray:tTrashState[] = lists.副産物.map(byproduct => ({
            アイテム: byproduct.アイテム名,
            廃棄: trashList.includes(byproduct.アイテム名)
        }));
        setTrashItemsByproduct(newTrashArray);
    }

    const handleTrashItem_NoLost = (trashList: string[]) => {
        const newTrashArray:tTrashState[] = lists.未消費素材.map(noLost => ({
            アイテム: noLost.アイテム名,
            廃棄: trashList.includes(noLost.アイテム名)
        }));
        setTrashItemsNoLost(newTrashArray);
    }

    const handleChangeQty = (qty:number, role:tQtyRoleResult) => {
        setQuantity(qty);
        setQtyRole(role);
    }
    return {
        isCanceledCalcuration: isCanceledCalcuration,
        trees: {
            mains: mainTrees,
            commons: commonTrees
        },
        quantities: {
            order: quantity,
            orderRole: qtyRole,
            resultQty: totalQuantity,
            resultRoute: qtyRoleResult,
            fullyMinimumQuantity: fullyMinimumQuantity
        },
        messages: resultMessage,
        lists: {
            materials: lists.材料,
            byproducts: lists.副産物,
            surpluses: lists.余剰作成,
            durabilities: lists.耐久消費,
            creations: lists.最終作成物,
            skills: lists.スキル,
            needRecipes: lists.要レシピ,
            noLostItems: lists.未消費素材
        },
        trashItems: {
            surpluses: trashItemsSurplus,
            byProducts: trashItemsByproduct,
            noLosts: trashItemsNoLost
        },
        handler: {
            trashItemsByproducts: handleTrashItem_Byproducts,
            trashItemsSurplus: handleTrashItem_Surpluses,
            trashItemsNoLost: handleTrashItem_NoLost,
            
            changeQty: handleChangeQty,
        },
        requireInitialize: requireInitialize
    }
}

export default ResultSection;
