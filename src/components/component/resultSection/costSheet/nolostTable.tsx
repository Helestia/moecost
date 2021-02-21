import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tNoLostItem} from '../../../../scripts/makeListArrayFromTree';
import {numDeform}  from '../../../../scripts/common';

import useTableStyles   from '../../../commons/styles/useTableStyles';

import Box              from '@material-ui/core/Box';
import IconButton       from '@material-ui/core/IconButton'
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead'
import TableBody        from '@material-ui/core/TableBody';
import TableFooter      from '@material-ui/core/TableFooter'
import TableCell        from '@material-ui/core/TableCell';
import TableRow         from '@material-ui/core/TableRow';
import Tooltip          from '@material-ui/core/Tooltip';
import Typography       from '@material-ui/core/Typography';
import Paper            from '@material-ui/core/Paper';
import {createStyles,
        Theme,
        makeStyles}     from '@material-ui/core/styles';

import DeleteIcon        from '@material-ui/icons/Delete';
import RestoreIcon       from '@material-ui/icons/Restore';

const useStyles = makeStyles((theme:Theme) => createStyles({
    boxRootSeconds: {
        marginTop: theme.spacing(2)
    },
    disableCell: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground,
        textDecorationLine: "line-through"
    }
}));

type tNoLostTable = {
    noLostItems: tNoLostItem[],
    handleItemClick: (itemName:string) => void,
    changeTrashItemsNoLost : (newItems:string[]) => void,
}

const NoLostTable: React.FC<tNoLostTable> = (props) => {
    const classes = useStyles();
    const TC = useTableStyles(4);
    
    if(props.noLostItems.length === 0) return null;

    const nolostTotal = props.noLostItems.reduce((a,c) => {
        if(c.廃棄対象) return a;
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        if(c.調達方法 === "作成" && c.未設定含) a.hasUnknown = true;
        if(c.調達方法 !== "未設定") a.money += c.合計金額;
        return a;
    },{money:0,hasUnknown:false});

    const handleTrashItems_noLost = (targetItem:string) => () => {
        const nowNonTargets = props.noLostItems.filter(s => s.廃棄対象).map(s => s.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsNoLost(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsNoLost(nowNonTargets.concat(targetItem));
    }

    return (
        <Box className={classes.boxRootSeconds}>
            <Typography variant="h6">未消費素材</Typography>
            <Box>
                <TableContainer
                    component={Paper}
                    className={TC.container}>
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}><Typography>アイテム名</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>使用個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>金額</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.noLostItems.map((item,i) => {
                                const tdClass = (() => {
                                    if(item.廃棄対象) return {
                                        center: `${TC.td.center} ${classes.disableCell}`,
                                        right: `${TC.td.right} ${classes.disableCell}`
                                    }
                                    return {
                                        center: TC.td.center,
                                        right: TC.td.right
                                    }
                                })();
                                return (
                                    <TableRow
                                        className={TC.tr}
                                        key={"Result_NoLostTable_RowNo_" + i}
                                    >
                                        <ItemNameCell
                                            className={TC.td.left}
                                            itemName={item.アイテム名}
                                            handleClick={props.handleItemClick}
                                            procurement={item.調達方法}
                                        >
                                            <Typography>{item.アイテム名}</Typography>
                                        </ItemNameCell>
                                        <TableCell
                                            className={tdClass.right}
                                            data-label="使用個数"
                                        >
                                            <Typography>{item.個数}</Typography>
                                        </TableCell>
                                        {(item.調達方法 === "未設定")
                                            ? (<>
                                                <TableCell
                                                    className={tdClass.center}
                                                    data-label="単価"
                                                >
                                                    <Typography color="error">
                                                        -
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    className={tdClass.center}
                                                    data-label="金額"
                                                >
                                                    <Typography color="error">
                                                        -
                                                    </Typography>
                                                </TableCell>
                                            </>)
                                            : (item.調達方法 === "作成" && item.未設定含) 
                                                ? (<>
                                                    <TableCell
                                                        className={tdClass.right}
                                                        data-label="単価"
                                                    >
                                                        <Typography color="error">
                                                            {numDeform(item.単価)} ± α
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        className={tdClass.right}
                                                        data-label="金額"
                                                    >
                                                        <Typography color="error">
                                                            {numDeform(item.合計金額)} ± α
                                                        </Typography>
                                                    </TableCell>
                                                </>)
                                                : (<>
                                                    <TableCell
                                                        className={tdClass.right}
                                                        data-label="単価"
                                                    >
                                                        <Typography>
                                                            {numDeform(item.単価)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        className={tdClass.right}
                                                        data-label="金額"
                                                    >
                                                        <Typography>
                                                            {numDeform(item.合計金額)}
                                                        </Typography>
                                                    </TableCell>
                                                </>)
                                    }
                                    <TableCell
                                        className={TC.td.center}
                                        data-label="除外切替"
                                    >
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
                            )})}
                        </TableBody>
                        <TableFooter className={TC.tfoot}>
                            <TableRow className={TC.tr}>
                                <TableCell
                                    colSpan={3}
                                    className={TC.td.center}
                                >
                                    <Typography>合計金額</Typography>
                                </TableCell>
                                {nolostTotal.hasUnknown 
                                    ? <TableCell className={TC.td.right}><Typography color="error">{numDeform(nolostTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell className={TC.td.right}><Typography>{numDeform(nolostTotal.money)}</Typography></TableCell>
                                }
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default NoLostTable;
