import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tByproduct} from '../../../../scripts/makeListArrayFromTree';
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

type tByproductTable = {
    byproducts: tByproduct[],
    handleItemClick: (itemName:string) => void,
    changeTrashItemsByproducts : (newItems:string[]) => void,
}

const ByproductTable:React.FC<tByproductTable> = (props) => {
    const classes = useStyles();
    const TC = useTableStyles(4);
    if(props.byproducts.length === 0) return null;

    const handleTrashItems_byproduct = (targetItem:string) => () => {
        const nowNonTargets = props.byproducts.filter(b => b.廃棄対象).map(b => b.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsByproducts(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsByproducts(nowNonTargets.concat(targetItem));
    }

    const byproductTotal = props.byproducts.reduce((acc,cur) => {
        if(cur.廃棄対象) return acc;
        if(cur.価格設定有) acc.money += cur.合計金額;
        else acc.hasUnknown = true;
        return acc;
    },{money:0,hasUnknown:false})

    return (
        <Box className={classes.boxRootSeconds}>
            <Typography variant="h6">副産物</Typography>
            <Box>
                <TableContainer
                    component={Paper}
                    className={TC.container}
                >
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}><Typography>アイテム名</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>作成個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>設定単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>合計金額</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={TC.tbody}>
                            {props.byproducts.map((b,i) => {
                                const tdClass = (() => {
                                    if(b.廃棄対象) return {
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
                                    key={"Result_ByproductTable_RowNo_" + i}
                                    className={TC.tr}
                                >
                                    <ItemNameCell
                                        className={TC.td.left}
                                        itemName={b.アイテム名}
                                        handleClick={props.handleItemClick}
                                        procurement="作成">
                                        <Typography>{b.アイテム名}</Typography>
                                    </ItemNameCell>
                                    <TableCell
                                        className={tdClass.right}
                                        data-label="作成個数"
                                    >
                                        <Typography>{b.作成個数}</Typography>
                                    </TableCell>
                                    {(b.価格設定有) 
                                        ? (<>
                                            <TableCell
                                                className={tdClass.right}
                                                data-label="設定単価"
                                            >
                                                <Typography>{numDeform(b.設定単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                className={tdClass.right}
                                                data-label="合計金額"
                                            >
                                                <Typography>{numDeform(b.合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                className={tdClass.center}
                                                data-label="設定単価"
                                            >
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                            <TableCell
                                                className={tdClass.center}
                                                data-label="合計金額"
                                                >
                                                <Typography color="error">-</Typography>
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
                                {byproductTotal.hasUnknown 
                                    ? <TableCell className={TC.td.right}><Typography color="error">{numDeform(byproductTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell className={TC.td.right}><Typography>{numDeform(byproductTotal.money)}</Typography></TableCell>
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

export default ByproductTable;
