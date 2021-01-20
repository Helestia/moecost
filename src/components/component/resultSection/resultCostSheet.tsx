import React from 'react';
import ResultItemNameCell from './resultItemNameCell';

import {
    tMaterial,
    tByproduct,
    tDurability,
    tSurplus,
    tCreation, 
    tNoLostItem}         from '../../../scripts/makeListArrayFromTree';
import {
    numDeform,
    cloneObj_JSON}      from '../../../scripts/common';

import moecostDb from '../../../scripts/storage';

import Accordion from '../../commons/accordion/accordion';

import Box               from '@material-ui/core/Box'
import Button            from '@material-ui/core/Button'
import IconButton        from '@material-ui/core/IconButton'
import TableContainer    from '@material-ui/core/TableContainer'
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead'
import TableBody         from '@material-ui/core/TableBody';
import TableFooter       from '@material-ui/core/TableFooter'
import TableCell         from '@material-ui/core/TableCell';
import TableRow          from '@material-ui/core/TableRow';
import Tooltip           from '@material-ui/core/Tooltip';
import Typography        from '@material-ui/core/Typography'
import Paper             from '@material-ui/core/Paper';

import DeleteIcon        from '@material-ui/icons/Delete';
import RestoreIcon       from '@material-ui/icons/Restore';

import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme:Theme) => 
    createStyles({
        tableRoot: {
            width: "100%",
            maxWidth: "750px"
        },
        boxRootSeconds: {
            marginTop: theme.spacing(2)
        },
        button: {
            marginTop:theme.spacing(2)
        },
        disableCell: {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.action.disabledBackground,
            textDecorationLine: "line-through"
        }
    })
);

type tResultCostSheet= {
    isExpanded: boolean,
    creations: tCreation[],
    materials: tMaterial[],
    durabilities: tDurability[],
    surpluses: tSurplus[],
    byproducts: tByproduct[],
    noLostItems: tNoLostItem[],
    handleExpand: () => void,
    changeTrashItemsSurpluses : (newItems:string[]) => void,
    changeTrashItemsByproducts : (newItems:string[]) => void,
    changeTrashItemsNoLost:(newItems:string[]) => void,
    handleItemClick: (itemName:string) => void,
    handleOpenQtyDialog: () => void
}

type tReduceResult = {
    money:number,
    hasUnknown:boolean
}
const reduceResultDefault: tReduceResult = {
    money:0,
    hasUnknown:false
}

const ResultCostSheet:React.FC<tResultCostSheet> = (props) => {
    const classes = useStyles();

    // アイテム名クリック
    const handleItemNameClick = (str:string) => {props.handleItemClick(str)};

    const materialTotal = props.materials.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        else a.money += c.合計金額;
        return a;
    },cloneObj_JSON(reduceResultDefault))

    const byproductTotal = props.byproducts.reduce((a,c) => {
        if(c.廃棄対象) return a;
        if(c.価格設定有) a.money += c.合計金額;
        else a.hasUnknown = true;
        return a;
    },cloneObj_JSON(reduceResultDefault))

    const surplusTotal = props.surpluses.reduce((a,c) => {
        if(c.廃棄対象) return a;
        if(c.未設定含) a.hasUnknown = true;
        a.money += c.余り合計金額;
        return a;
    },cloneObj_JSON(reduceResultDefault));

    const durabilityTotal = props.durabilities.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        if(c.調達方法 === "作成" && c.未設定含 === true) a.hasUnknown = true;
        if(c.調達方法 !== "未設定"){
            a.total += c.合計価格;
            a.durable += c.耐久割金額;
            a.undepreciated += c.合計価格 - c.耐久割金額;
        }
        return a;
    },{
        hasUnknown:false,
        total:0,
        durable:0,
        undepreciated:0});
    
    const handleTrashItems_byproduct = (targetItem:string) => () => {
        const nowNonTargets = props.byproducts.filter(b => b.廃棄対象).map(b => b.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsByproducts(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsByproducts(nowNonTargets.concat(targetItem));
    }

    const handleTrashItems_surplus = (targetItem:string) => () => {
        const nowNonTargets = props.surpluses.filter(s => s.廃棄対象).map(s => s.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsSurpluses(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsSurpluses(nowNonTargets.concat(targetItem));
    }

    const handleTrashItems_noLost = (targetItem:string) => () => {
        const nowNonTargets = props.noLostItems.filter(s => s.廃棄対象).map(s => s.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsNoLost(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsNoLost(nowNonTargets.concat(targetItem));
    }

    const renderTableMaterial = () => {
        return (
            <Box>
                <Typography variant="h6">材料費</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>消費個数</Typography></TableCell>
                                <TableCell><Typography>設定単価</Typography></TableCell>
                                <TableCell><Typography>合計金額</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.materials.map((m,i) => (
                                <TableRow key={"Result_MaterialTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={m.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement={m.調達方法}>
                                        <Typography>{m.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        align="right">
                                        <Typography>{numDeform(m.必要個数)}</Typography>
                                    </TableCell>
                                    {(m.調達方法 === "未設定") 
                                        ? (<>
                                            <TableCell align="center">
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell align="right">
                                                <Typography>{numDeform(m.設定単価)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography>{numDeform(m.合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="center"><Typography>合計金額</Typography></TableCell>
                                {materialTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(materialTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(materialTotal.money)}</Typography></TableCell>
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableByproduct = () => {
        if(props.byproducts.length === 0) return null;

        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">副産物</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>作成個数</Typography></TableCell>
                                <TableCell><Typography>設定単価</Typography></TableCell>
                                <TableCell><Typography>合計金額</Typography></TableCell>
                                <TableCell><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.byproducts.map((b,i) => (
                                <TableRow key={"Result_ByproductTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={b.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{b.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        className={(b.廃棄対象) ? classes.disableCell : ""}>
                                        <Typography>{b.作成個数}</Typography>
                                    </TableCell>
                                    {(b.価格設定有) 
                                        ? (<>
                                            <TableCell
                                                align="right"
                                                className={(b.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(b.設定単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={(b.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(b.合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                align="center"
                                                className={(b.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={(b.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                    <TableCell>
                                        <Tooltip
                                            title="原価反映／廃棄の切り替え"
                                            arrow
                                        >
                                            <IconButton
                                                onClick={handleTrashItems_byproduct(b.アイテム名)}
                                                size="small">
                                                {b.廃棄対象
                                                    ? <RestoreIcon />
                                                    : <DeleteIcon />
                                                }
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="center"><Typography>合計金額</Typography></TableCell>
                                {byproductTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(byproductTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(byproductTotal.money)}</Typography></TableCell>
                                }
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableSurplus = () => {
        if(props.surpluses.length === 0) return null;

        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">余剰生産品</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>作成個数</Typography></TableCell>
                                <TableCell><Typography>余り個数</Typography></TableCell>
                                <TableCell><Typography>単価</Typography></TableCell>
                                <TableCell><Typography>余り金額</Typography></TableCell>
                                <TableCell><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.surpluses.map((s,i) => (
                                <TableRow  key={"Result_SurplusTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={s.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{s.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        align="right"
                                        className={(s.廃棄対象) ? classes.disableCell : ""}>
                                        <Typography>{s.作成個数}</Typography>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        className={(s.廃棄対象) ? classes.disableCell : ""}>
                                        <Typography>{s.余り個数}</Typography>
                                    </TableCell>
                                    {(s.未設定含) 
                                        ? (<>
                                            <TableCell
                                                align="right"
                                                className={(s.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography
                                                    color={(s.廃棄対象) ? "initial" : "error"}>
                                                    {numDeform(s.単価)} ± α
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"                                                
                                                className={(s.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography
                                                    color={(s.廃棄対象) ? "initial" : "error"}>
                                                    {numDeform(s.余り合計金額)} ± α
                                                </Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                align="right"
                                                className={(s.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(s.単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={(s.廃棄対象) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(s.余り合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                    <TableCell>
                                        <Tooltip
                                            title="原価反映／廃棄の切り替え"
                                            arrow
                                        >
                                            <IconButton
                                                onClick={handleTrashItems_surplus(s.アイテム名)}
                                                size="small">
                                                {s.廃棄対象
                                                    ? <RestoreIcon />
                                                    : <DeleteIcon />
                                                }
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} align="center"><Typography>合計金額</Typography></TableCell>
                                {surplusTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(surplusTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(surplusTotal.money)}</Typography></TableCell>
                                }
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableDurability = () => {
        if(props.durabilities.length === 0) return null;

        const renderObj = props.durabilities.map(d => {
            if(d.調達方法 === "未設定") return{
                アイテム名: (
                <ResultItemNameCell
                    itemName={d.アイテム名}
                    handleClick={handleItemNameClick}
                    procurement={d.調達方法}>
                    <Typography>{d.アイテム名}</Typography>
                </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                )
            };
            if(d.調達方法 === "作成" && d.未設定含) return{
                アイテム名: (
                    <ResultItemNameCell
                        itemName={d.アイテム名}
                        handleClick={handleItemNameClick}
                        procurement={d.調達方法}>
                        <Typography>{d.アイテム名}</Typography>
                    </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.単価)} ± α</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.合計価格)} ± α</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.耐久割単価)} ± α</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.耐久割金額)} ± α</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.合計価格 - d.耐久割金額)} ± α</Typography>
                    </TableCell>
                )
            };
            return {
                アイテム名: (
                    <ResultItemNameCell
                        itemName={d.アイテム名}
                        handleClick={handleItemNameClick}
                        procurement={d.調達方法}>
                        <Typography>{d.アイテム名}</Typography>
                    </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.単価)}</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.合計価格)}</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.耐久割単価)}</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.耐久割金額)}</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.合計価格 - d.耐久割金額)}</Typography>
                    </TableCell>
                )
            }
        });
        
        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">耐久割</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>消費<br />個数</Typography></TableCell>
                                <TableCell><Typography>調達<br />単価</Typography></TableCell>
                                <TableCell><Typography>合計<br />金額</Typography></TableCell>
                                <TableCell><Typography>最大<br />耐久値</Typography></TableCell>
                                <TableCell><Typography>消費<br />耐久値</Typography></TableCell>
                                <TableCell><Typography>耐久割<br />単価</Typography></TableCell>
                                <TableCell><Typography>耐久割<br />金額</Typography></TableCell>
                                <TableCell><Typography>未償却</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                renderObj.map((d,i) => (
                                    <TableRow key={"Result_DurabilitiesTable_RowNo_" + i}>
                                        {d.アイテム名}
                                        {d.消費個数}
                                        {d.調達単価}
                                        {d.合計金額}
                                        {d.最大耐久}
                                        {d.消費耐久}
                                        {d.耐久割単価}
                                        {d.耐久割金額}
                                        {d.未償却金額}
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell align="center" colSpan={3}><Typography>合計金額</Typography></TableCell>
                                {(durabilityTotal.hasUnknown)
                                    ? <TableCell align="right"><Typography color="error">{numDeform(durabilityTotal.total)} ± α</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(durabilityTotal.total)}</Typography></TableCell>
                                }
                                <TableCell colSpan={3}></TableCell>
                                {(durabilityTotal.hasUnknown)
                                    ? (
                                        <>
                                            <TableCell align="right">
                                                <Typography color="error">{numDeform(durabilityTotal.durable)} ± α</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography color="error">{numDeform(durabilityTotal.undepreciated)} ± α</Typography>
                                            </TableCell>
                                        </>
                                    )
                                    : (
                                        <>
                                            <TableCell align="right">
                                                <Typography>{numDeform(durabilityTotal.durable)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography>{numDeform(durabilityTotal.undepreciated)}</Typography>
                                            </TableCell>
                                        </>
                                    )
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
    
    const renderTableNoLost = () => {
        if(props.noLostItems.length === 0) return null;

        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">未消費素材</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>使用個数</Typography></TableCell>
                                <TableCell><Typography>単価</Typography></TableCell>
                                <TableCell><Typography>金額</Typography></TableCell>
                                <TableCell><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.noLostItems.map((item,i) => (
                                <TableRow  key={"Result_NoLostTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={item.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement={item.調達方法}
                                    >
                                        <Typography>{item.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        align="right"
                                        className={(item.廃棄対象) ? classes.disableCell : ""}>
                                        <Typography>{item.個数}</Typography>
                                    </TableCell>
                                    {(item.調達方法 === "未設定")
                                        ? (<>
                                            <TableCell
                                                align="center"
                                                className={(item.廃棄対象) ? classes.disableCell : ""}
                                            >
                                                <Typography color="error">
                                                    -
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={(item.廃棄対象) ? classes.disableCell : ""}
                                            >
                                                <Typography color="error">
                                                    -
                                                </Typography>
                                            </TableCell>
                                        </>)
                                        : (item.調達方法 === "作成" && item.未設定含) 
                                            ? (<>
                                                <TableCell
                                                    align="right"
                                                    className={(item.廃棄対象) ? classes.disableCell : ""}
                                                >
                                                    <Typography color="error">
                                                        {numDeform(item.単価)} ± α
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={(item.廃棄対象) ? classes.disableCell : ""}
                                                >
                                                    <Typography color="error">
                                                        {numDeform(item.合計金額)} ± α
                                                    </Typography>
                                                </TableCell>
                                            </>)
                                            : (<>
                                                <TableCell
                                                    align="right"
                                                    className={(item.廃棄対象) ? classes.disableCell : ""}
                                                >
                                                    <Typography>
                                                        {numDeform(item.単価)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    className={(item.廃棄対象) ? classes.disableCell : ""}
                                                >
                                                    <Typography>
                                                        {numDeform(item.合計金額)}
                                                    </Typography>
                                                </TableCell>
                                            </>)
                                    }
                                    <TableCell>
                                        <Tooltip
                                            title="原価反映／廃棄の切り替え"
                                            arrow
                                        >
                                            <IconButton
                                                onClick={handleTrashItems_noLost(item.アイテム名)}
                                                size="small">
                                                {item.廃棄対象
                                                    ? <RestoreIcon />
                                                    : <DeleteIcon />
                                                }
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="center"><Typography>合計金額</Typography></TableCell>
                                {surplusTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(surplusTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(surplusTotal.money)}</Typography></TableCell>
                                }
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableCreate = () => {
        if( (! moecostDb.アプリ設定.表示設定.常時最終作成物表示) &&
            (props.creations.length <= 1)) return null;
        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">最終作成物</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>アイテム名</TableCell>
                                <TableCell>作成個数</TableCell>
                                <TableCell>合計金額</TableCell>
                                <TableCell>単価</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.creations.map((c,i) =>
                                <TableRow  key={"Result_CreationTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={c.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{c.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell align="right"><Typography>{numDeform(c.作成個数)}</Typography></TableCell>
                                    {
                                        (c.未設定含)
                                            ? <>
                                                <TableCell align="right">
                                                    <Typography color="error">{numDeform(c.合計材料費)} ± α</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography color="error">{numDeform(c.単価)} ± α</Typography>
                                                </TableCell>
                                            </>
                                            : <>
                                                <TableCell align="right">
                                                    <Typography>{numDeform(c.合計材料費)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography>{numDeform(c.単価)}</Typography>
                                                </TableCell>
                                            </>
                                    }
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
            summary={<Typography component="span" variant="h6">原価表</Typography>}
        >
            <Box>
                {renderTableMaterial()}
                {renderTableByproduct()}
                {renderTableSurplus()}
                {renderTableDurability()}
                {renderTableNoLost()}
                {renderTableCreate()}
                <Button
                    variant="outlined"
                    onClick={props.handleOpenQtyDialog}
                    className={classes.button}
                >
                    作成個数の変更
                </Button>
            </Box>
        </Accordion>
    )

}

export default ResultCostSheet;