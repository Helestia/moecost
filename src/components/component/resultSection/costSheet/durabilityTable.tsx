import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tDurability} from '../../../../scripts/makeListArrayFromTree';
import {numDeform}  from '../../../../scripts/common';

import useTableStyles   from '../../../commons/styles/useTableStyles';

import Box              from '@material-ui/core/Box';
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead'
import TableBody        from '@material-ui/core/TableBody';
import TableFooter      from '@material-ui/core/TableFooter'
import TableCell        from '@material-ui/core/TableCell';
import TableRow         from '@material-ui/core/TableRow';
import Typography       from '@material-ui/core/Typography';
import Paper            from '@material-ui/core/Paper';
import {createStyles,
        Theme,
        makeStyles}     from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    boxRootSeconds: {
        marginTop: theme.spacing(2)
    }
}));

type tDurabilityTable = {
    durabilities: tDurability[],
    handleItemClick: (itemName:string) => void
}

const DurabilityTable: React.FC<tDurabilityTable> = (props) => {
    const classes = useStyles();
    const TC = useTableStyles(4);
    if(props.durabilities.length === 0) return null;

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


    const renderObj = props.durabilities.map(d => {
        if(d.調達方法 === "未設定") return{
            アイテム名: (
            <ItemNameCell
                className={TC.td.left}
                itemName={d.アイテム名}
                handleClick={props.handleItemClick}
                procurement={d.調達方法}>
                <Typography>{d.アイテム名}</Typography>
            </ItemNameCell>
            ),
            消費個数: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費個数"
                >
                    <Typography>{numDeform(d.消費個数)}</Typography>
                </TableCell>
            ),
            調達単価: (
                <TableCell
                    className={TC.td.center}
                    data-label="調達単価"
                >
                    <Typography color="error">-</Typography>
                </TableCell>
            ),
            合計金額: (
                <TableCell
                    className={TC.td.center}
                    data-label="合計金額"
                >
                    <Typography color="error">-</Typography>
                </TableCell>
            ),
            最大耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="最大耐久"
                >
                    <Typography>{numDeform(d.最大耐久値)}</Typography>
                </TableCell>
            ),
            消費耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費耐久"
                >
                    <Typography>{numDeform(d.消費耐久値)}</Typography>
                </TableCell>
            ),
            耐久割単価: (
                <TableCell
                    className={TC.td.center}
                    data-label="耐久割単価"
                >
                    <Typography color="error">-</Typography>
                </TableCell>
            ),
            耐久割金額: (
                <TableCell
                    className={TC.td.center}
                    data-label="耐久割金額"
                >
                    <Typography color="error">-</Typography>
                </TableCell>
            ),
            未償却金額: (
                <TableCell
                    className={TC.td.center}
                    data-label="未償却金額"
                >
                    <Typography color="error">-</Typography>
                </TableCell>
            )
        };
        if(d.調達方法 === "作成" && d.未設定含) return{
            アイテム名: (
                <ItemNameCell
                    className={TC.td.left}
                    itemName={d.アイテム名}
                    handleClick={props.handleItemClick}
                    procurement={d.調達方法}>
                    <Typography>{d.アイテム名}</Typography>
                </ItemNameCell>
            ),
            消費個数: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費個数"
                >
                    <Typography>{numDeform(d.消費個数)}</Typography>
                </TableCell>
            ),
            調達単価: (
                <TableCell
                    className={TC.td.right}
                    data-label="調達単価"
                >
                    <Typography color="error">{numDeform(d.単価)} ± α</Typography>
                </TableCell>
            ),
            合計金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="合計金額"
                >
                    <Typography color="error">{numDeform(d.合計価格)} ± α</Typography>
                </TableCell>
            ),
            最大耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="最大耐久"
                >
                    <Typography>{numDeform(d.最大耐久値)}</Typography>
                </TableCell>
            ),
            消費耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費耐久"
                >
                    <Typography>{numDeform(d.消費耐久値)}</Typography>
                </TableCell>
            ),
            耐久割単価: (
                <TableCell
                    className={TC.td.right}
                    data-label="耐久割単価"
                >
                    <Typography color="error">{numDeform(d.耐久割単価)} ± α</Typography>
                </TableCell>
            ),
            耐久割金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="耐久割金額"
                >
                    <Typography color="error">{numDeform(d.耐久割金額)} ± α</Typography>
                </TableCell>
            ),
            未償却金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="未償却金額"
                >
                    <Typography color="error">{numDeform(d.合計価格 - d.耐久割金額)} ± α</Typography>
                </TableCell>
            )
        };
        return {
            アイテム名: (
                <ItemNameCell
                    className={TC.td.left}
                    itemName={d.アイテム名}
                    handleClick={props.handleItemClick}
                    procurement={d.調達方法}>
                    <Typography>{d.アイテム名}</Typography>
                </ItemNameCell>
            ),
            消費個数: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費個数"
                >
                    <Typography>{numDeform(d.消費個数)}</Typography>
                </TableCell>
            ),
            調達単価: (
                <TableCell
                    className={TC.td.right}
                    data-label="調達単価"
                >
                    <Typography>{numDeform(d.単価)}</Typography>
                </TableCell>
            ),
            合計金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="合計金額"
                >
                    <Typography>{numDeform(d.合計価格)}</Typography>
                </TableCell>
            ),
            最大耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="最大耐久"
                >
                    <Typography>{numDeform(d.最大耐久値)}</Typography>
                </TableCell>
            ),
            消費耐久: (
                <TableCell
                    className={TC.td.right}
                    data-label="消費耐久"
                >
                    <Typography>{numDeform(d.消費耐久値)}</Typography>
                </TableCell>
            ),
            耐久割単価: (
                <TableCell
                    className={TC.td.right}
                    data-label="耐久割単価"
                >
                    <Typography>{numDeform(d.耐久割単価)}</Typography>
                </TableCell>
            ),
            耐久割金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="耐久割金額"
                >
                    <Typography>{numDeform(d.耐久割金額)}</Typography>
                </TableCell>
            ),
            未償却金額: (
                <TableCell
                    className={TC.td.right}
                    data-label="未償却金額"
                >
                    <Typography>{numDeform(d.合計価格 - d.耐久割金額)}</Typography>
                </TableCell>
            )
        }
    });
    
    return (
        <Box className={classes.boxRootSeconds}>
            <Typography variant="h6">耐久割</Typography>
            <Box>
                <TableContainer
                    className={TC.container}
                    component={Paper}
                >
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}><Typography>アイテム名</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>消費<br />個数</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>調達<br />単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>合計<br />金額</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>最大<br />耐久値</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>消費<br />耐久値</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>耐久割<br />単価</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>耐久割<br />金額</Typography></TableCell>
                                <TableCell className={TC.td.center}><Typography>未償却</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={TC.tbody}>
                            {
                                renderObj.map((d,i) => (
                                    <TableRow
                                        className={TC.tr}
                                        key={"Result_DurabilitiesTable_RowNo_" + i}
                                    >
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
                        <TableFooter className={TC.tfoot}>
                            <TableRow className={TC.tr}>
                                <TableCell
                                    colSpan={3}
                                    className={TC.td.center}
                                >
                                    <Typography>合計金額</Typography>
                                </TableCell>
                                {(durabilityTotal.hasUnknown)
                                    ? <TableCell className={TC.td.right}><Typography color="error">{numDeform(durabilityTotal.total)} ± α</Typography></TableCell>
                                    : <TableCell className={TC.td.right}><Typography>{numDeform(durabilityTotal.total)}</Typography></TableCell>
                                }
                                <TableCell
                                    colSpan={3}
                                    className={TC.td.center}
                                />
                                {(durabilityTotal.hasUnknown)
                                    ? (
                                        <>
                                            <TableCell className={TC.td.right}>
                                                <Typography color="error">{numDeform(durabilityTotal.durable)} ± α</Typography>
                                            </TableCell>
                                            <TableCell className={TC.td.right}>
                                                <Typography color="error">{numDeform(durabilityTotal.undepreciated)} ± α</Typography>
                                            </TableCell>
                                        </>
                                    )
                                    : (
                                        <>
                                            <TableCell className={TC.td.right}>
                                                <Typography>{numDeform(durabilityTotal.durable)}</Typography>
                                            </TableCell>
                                            <TableCell className={TC.td.right}>
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
        </Box>
    )
}

export default DurabilityTable;
