import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tMaterial,
        tCreation}  from '../../../../scripts/makeListArrayFromTree';
import {numDeform}  from '../../../../scripts/common';
import moecostDb    from '../../../../scripts/storage';

import useTableStyles   from '../../../commons/styles/useTableStyles';

import Box              from '@material-ui/core/Box';
import Checkbox         from '@material-ui/core/Checkbox';
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead'
import TableBody        from '@material-ui/core/TableBody';
import TableFooter      from '@material-ui/core/TableFooter'
import TableCell        from '@material-ui/core/TableCell';
import TableRow         from '@material-ui/core/TableRow';
import Typography       from '@material-ui/core/Typography';
import Paper            from '@material-ui/core/Paper';

type tMaterialTable = {
    materials: tMaterial[],
    creations: tCreation[],
    handleItemClick: (itemName:string) => void,
}

const MaterialTable: React.FC<tMaterialTable> = (props) => {
    const hookResults = MaterialTableHooks(props.creations, props.materials);
    const TC = useTableStyles(4);

    const materialTotal = props.materials.reduce((acc,cur) => {
        if(cur.調達方法 === "未設定") acc.hasUnknown = true;
        else acc.money += cur.合計金額;
        return acc;
    },{money:0,hasUnknown:false});

    const sortFunc = (bef:tMaterial,aft:tMaterial) => {
        if(bef.調達方法 === aft.調達方法) return 0;
        if(bef.調達方法 === "未設定") return -1;
        if(aft.調達方法 === "未設定") return 1;
        if(bef.調達方法 === "NPC") return -1;
        if(aft.調達方法 === "NPC") return 1;
        return 0;
    }

    const sortedMaterials = props.materials.concat();
    sortedMaterials.sort(sortFunc);

    const renderTableRow = (material:tMaterial) => {
        const hookResult:tMaterialHookResult = (() => {
            const finded = hookResults.find(h => h.name === material.アイテム名);
            if(finded === undefined) return {
                name: material.アイテム名,
                checked:false,
                onChange: () => {}
            };
            return finded;
        })();

        return (
            <TableRow
                className={TC.tr}
                key={`Result_MaterialTable_RowNo_${material.アイテム名}`}
            >
                <ItemNameCell
                    className={TC.td.left}
                    itemName={material.アイテム名}
                    handleClick={props.handleItemClick}
                    procurement={material.調達方法}
                >
                    <Typography>{material.アイテム名}</Typography>
                </ItemNameCell>
                <TableCell
                    data-label="消費個数"
                    className={TC.td.right}
                >
                    <Typography>{numDeform(material.必要個数)}</Typography>
                </TableCell>
                {(material.調達方法 === "未設定") 
                    ? (<>
                        <TableCell
                            data-label="設定単価"
                            className={TC.td.center}
                        >
                            <Typography color="error">-</Typography>
                        </TableCell>
                        <TableCell
                            data-label="合計金額"
                            className={TC.td.center}
                        >
                            <Typography color="error">-</Typography>
                        </TableCell>
                    </>)
                    : (<>
                        <TableCell
                            data-label="設定単価"
                            className={TC.td.right}
                        >
                            <Typography>{numDeform(material.設定単価)}</Typography>
                        </TableCell>
                        <TableCell
                            data-label="合計金額"
                            className={TC.td.right}
                        >
                            <Typography>{numDeform(material.合計金額)}</Typography>
                        </TableCell>
                    </>)
                }
                {(moecostDb.アプリ設定.表示設定.材料にチェック表示)
                    ? (
                        <TableCell
                            data-label="check"
                            className={TC.td.center}
                        >
                            <Checkbox
                                size="small"
                                checked={hookResult.checked}
                                onChange={hookResult.onChange}
                            />
                        </TableCell>
                    )
                    : null
                }
            </TableRow>
        )
    }

    return (
        <Box width="100%">
            <Typography variant="h6">材料費</Typography>
            <Box>
                <TableContainer
                    component={Paper}
                    className={TC.container}
                >
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}><Typography>アイテム名</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>消費個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>設定単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>合計金額</Typography></TableCell>
                                {(moecostDb.アプリ設定.表示設定.材料にチェック表示)
                                    ? <TableCell className={TC.td.center}><Typography>check</Typography></TableCell>
                                    : null
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody className={TC.tbody}>
                            {sortedMaterials.map((m,i) => renderTableRow(m))}
                        </TableBody>
                        <TableFooter className={TC.tfoot}>
                            <TableRow className={TC.tr}>
                                <TableCell
                                    colSpan={3}
                                    className={TC.td.center}
                                >
                                    <Typography>合計金額</Typography>
                                </TableCell>
                                {materialTotal.hasUnknown 
                                    ? <TableCell className={TC.td.right}><Typography color="error">{numDeform(materialTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell className={TC.td.right}><Typography>{numDeform(materialTotal.money)}</Typography></TableCell>
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

type tStateMaterials = {
    name: string,
    qty: number,
    checked: boolean
}

type tMaterialHookResult = {
    name: string,
    checked: boolean,
    onChange: () => void
}
type tMaterialTableHooks = (creations: tCreation[], materials: tMaterial[]) => tMaterialHookResult[];

const MaterialTableHooks:tMaterialTableHooks = (creations,materials) => {
    const [befCreations,setBefCreations] = React.useState<string[]>([]);
    const [befMaterials,setBefMaterials] = React.useState<tStateMaterials[]>([]);

    const handleChange = (itemName:string) => {
        const newMaterials = befMaterials.concat();
        const target = newMaterials.find(material => itemName === material.name);
        if(target === undefined) return;
        target.checked = ! target.checked;
        setBefMaterials(newMaterials);
    }
    
    type tStateMaterialsToResult = (materials:tStateMaterials[]) => tMaterialHookResult[];
    const stateMaterialsToResult:tStateMaterialsToResult = (materials) => materials.map(m => ({
        name: m.name,
        checked: m.checked,
        onChange: handleChange.bind(null,m.name)
    }));
    
    const creationItems = creations.map(c => c.アイテム名);
    // 初期化判定・作成物が全て一致しているか判断
    const allInitialize = (() => {
        const isAllEntryedCreationItems = creationItems.every(c => befCreations.includes(c));
        const isAllEntryedBefCreations = befCreations.every(c => creationItems.includes(c));
        if(isAllEntryedCreationItems && isAllEntryedBefCreations) return false;
        return true;
    })();

    // 作成物変更による全クリア
    if(allInitialize){
        setBefCreations(creationItems);
        const newMaterials:tStateMaterials[] = materials.map(m => ({
            name:m.アイテム名,
            qty:m.必要個数,
            checked: false,
        }));
        setBefMaterials(newMaterials);
        return stateMaterialsToResult(newMaterials);
    }

    // 作成物変更ない場合の処理
    let isUpdate = false;
    const newMaterials = befMaterials.filter(bef => {
        const target = materials.find(m => m.アイテム名 === bef.name);
        if(target === undefined || target.必要個数 !== bef.qty){
            isUpdate = true;
            return false;
        }
        return true;
    });
    materials.forEach(m => {
        if(! newMaterials.some(nm => nm.name === m.アイテム名)){
            isUpdate = true;
            newMaterials.push({
                name: m.アイテム名,
                qty: m.必要個数,
                checked: false
            });
        }
    });
    if(isUpdate) setBefMaterials(newMaterials);
    return stateMaterialsToResult(newMaterials);
}

export default MaterialTable;
