import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tSurplus} from '../../../../scripts/makeListArrayFromTree';
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

type tSurplusTable = {
    surpluses: tSurplus[],
    handleItemClick: (itemName:string) => void,
    changeTrashItemsSurpluses : (newItems:string[]) => void,
}

const SurplusTable: React.FC<tSurplusTable> = (props) => {
    const classes = useStyles();
    const TC = useTableStyles(4);
    if(props.surpluses.length === 0) return null;

    const surplusTotal = props.surpluses.reduce((a,c) => {
        if(c.廃棄対象) return a;
        if(c.未設定含) a.hasUnknown = true;
        a.money += c.余り合計金額;
        return a;
    },{money:0,hasUnknown:false});

    const handleTrashItems_surplus = (targetItem:string) => () => {
        const nowNonTargets = props.surpluses.filter(s => s.廃棄対象).map(s => s.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeTrashItemsSurpluses(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeTrashItemsSurpluses(nowNonTargets.concat(targetItem));
    }

    return (
        <Box className={classes.boxRootSeconds}>
            <Typography variant="h6">余剰生産品</Typography>
            <Box>
                <TableContainer
                    component={Paper}
                    className={TC.container}>
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}><Typography>アイテム名</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>作成個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>余り個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>余り金額</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody  className={TC.tbody}>
                            {props.surpluses.map((s,i) => {
                                const tdClass = (s.廃棄対象) ? `${TC.td.right} ${classes.disableCell}` : TC.td.right;
                                return (
                                <TableRow
                                    key={"Result_SurplusTable_RowNo_" + i}
                                    className={TC.tr}
                                >
                                    <ItemNameCell
                                        className={TC.td.left}
                                        itemName={s.アイテム名}
                                        handleClick={props.handleItemClick}
                                        procurement="作成">
                                        <Typography>{s.アイテム名}</Typography>
                                    </ItemNameCell>
                                    <TableCell
                                        className={tdClass}
                                        data-label="作成個数"
                                    >
                                        <Typography>{s.作成個数}</Typography>
                                    </TableCell>
                                    <TableCell
                                        className={tdClass}
                                        data-label="余り個数"
                                    >
                                        <Typography>{s.余り個数}</Typography>
                                    </TableCell>
                                    {(s.未設定含) 
                                        ? (<>
                                            <TableCell
                                                className={tdClass}
                                                data-label="単価"
                                            >
                                                <Typography
                                                    color={(s.廃棄対象) ? "initial" : "error"}>
                                                    {numDeform(s.単価)} ± α
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                className={tdClass}
                                                data-label="余り金額"
                                            >
                                                <Typography
                                                    color={(s.廃棄対象) ? "initial" : "error"}>
                                                    {numDeform(s.余り合計金額)} ± α
                                                </Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                className={tdClass}
                                                data-label="単価"
                                            >
                                                <Typography>{numDeform(s.単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                className={tdClass}
                                                data-label="余り金額"
                                            >
                                                <Typography>{numDeform(s.余り合計金額)}</Typography>
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
                            )})}
                        </TableBody>
                        <TableFooter className={TC.tfoot}>
                            <TableRow className={TC.tr}>
                                <TableCell colSpan={4} className={TC.td.center}><Typography>合計金額</Typography></TableCell>
                                {surplusTotal.hasUnknown 
                                    ? <TableCell className={TC.td.right}><Typography color="error">{numDeform(surplusTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell className={TC.td.right}><Typography>{numDeform(surplusTotal.money)}</Typography></TableCell>
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

export default SurplusTable;
