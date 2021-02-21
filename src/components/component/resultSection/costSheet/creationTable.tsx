import React from 'react';
import ItemNameCell from '../common/itemNameCell';

import {tCreation} from '../../../../scripts/makeListArrayFromTree';
import {numDeform}  from '../../../../scripts/common';
import moecostDb    from '../../../../scripts/storage';

import useTableStyles   from '../../../commons/styles/useTableStyles';

import Box              from '@material-ui/core/Box';
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead';
import TableBody        from '@material-ui/core/TableBody';
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

type tCreationTable = {
    creations: tCreation[],
    handleItemClick: (itemName:string) => void
}

const CreationTable:React.FC<tCreationTable> = (props) => {
    const classes = useStyles();
    const TC = useTableStyles(4);

    if( (! moecostDb.アプリ設定.表示設定.常時最終作成物表示) &&
        (props.creations.length <= 1)) return null;
    return (
        <Box className={classes.boxRootSeconds}>
            <Typography variant="h6">最終作成物</Typography>
            <Box>
                <TableContainer
                    className={TC.container}
                    component={Paper}
                >
                    <Table className={TC.table}>
                        <TableHead className={TC.thead}>
                            <TableRow className={TC.tr}>
                                <TableCell className={TC.td.center}>アイテム名</TableCell>
                                <TableCell className={TC.td.center}>作成個数</TableCell>
                                <TableCell className={TC.td.center}>合計金額</TableCell>
                                <TableCell className={TC.td.center}>単価</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={TC.tbody}>
                            {props.creations.map((c,i) =>
                                <TableRow
                                    className={TC.tr}
                                    key={"Result_CreationTable_RowNo_" + i}
                                >
                                    <ItemNameCell
                                        className={TC.td.left}
                                        itemName={c.アイテム名}
                                        handleClick={props.handleItemClick}
                                        procurement="作成"
                                    >
                                        <Typography>{c.アイテム名}</Typography>
                                    </ItemNameCell>
                                    <TableCell
                                        className={TC.td.right}
                                        data-label="作成個数"
                                    >
                                        <Typography>{numDeform(c.作成個数)}</Typography>
                                    </TableCell>
                                    {
                                        (c.未設定含)
                                            ? <>
                                                <TableCell
                                                    className={TC.td.right}
                                                    data-label="合計金額"
                                                >
                                                    <Typography color="error">{numDeform(c.合計材料費)} ± α</Typography>
                                                </TableCell>
                                                <TableCell
                                                    className={TC.td.right}
                                                    data-label="単価"
                                                >
                                                    <Typography color="error">{numDeform(c.単価)} ± α</Typography>
                                                </TableCell>
                                            </>
                                            : <>
                                                <TableCell
                                                    className={TC.td.right}
                                                    data-label="合計金額"
                                                >
                                                    <Typography>{numDeform(c.合計材料費)}</Typography>
                                                </TableCell>
                                                <TableCell
                                                    className={TC.td.right}
                                                    data-label="単価"
                                                >
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
        </Box>
    );
}

export default CreationTable;
