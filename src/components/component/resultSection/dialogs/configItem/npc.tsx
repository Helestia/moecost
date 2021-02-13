import React from 'react';

import {tJSON_npcSaleItem}  from '../../../../../scripts/jsonReader';
import {numDeform}          from '../../../../../scripts/common';

import useStyleTableDefault from '../../../../commons/styles/useTableStyles';

import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead';
import TableBody        from '@material-ui/core/TableBody';
import TableRow         from '@material-ui/core/TableRow';
import TableCell        from '@material-ui/core/TableCell';
import Paper            from '@material-ui/core/Paper';
import Typography       from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme} from '@material-ui/core/styles'

const useStyles = makeStyles((theme:Theme) => createStyles({
    warSale: {
        backgroundColor: (theme.palette.type === "light") ? "#ffc" : "#330",
    },
    warSaleText: {
        fontWeight: "bold"
    }
}));

type tRenderNpcProps = {
    tabSelected: boolean,
    npcs: tJSON_npcSaleItem | undefined,
    itemName: string
}
const RenderNpc:React.FC<tRenderNpcProps> = (props) => {
    const classes = useStyles();
    const tableStyles = useStyleTableDefault(4,false);

    if(! props.tabSelected) return null;
    if(! props.npcs) return null;

    return (
        <TableContainer
            component={Paper}
            className={tableStyles.container}
        >
            <Table className={tableStyles.table}>
                <TableHead className={tableStyles.thead}>
                    <TableRow className={tableStyles.tr}>
                        <TableCell className={tableStyles.td.center}>時代</TableCell>
                        <TableCell className={tableStyles.td.center}>地域</TableCell>
                        <TableCell className={tableStyles.td.center}>販売員名</TableCell>
                        <TableCell className={tableStyles.td.center}>販売価格</TableCell>
                        <TableCell className={tableStyles.td.center}>備考</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={tableStyles.tbody}>
                    {
                        props.npcs.販売情報.map((s,i) => {
                                const trClass = (s.時代 === "War Age") ? `${tableStyles.tr} ${classes.warSale}` : tableStyles.tr;
                                const typoClassName = (s.時代 === "War Age") ? classes.warSaleText : "";
                                return (
                                <TableRow
                                    key={`resultConfigItemDialog_Npc_TableRow_${i}`}
                                    className={trClass}
                                >
                                    <TableCell
                                        className={tableStyles.td.left}
                                        data-label="時代"
                                    >
                                        <Typography className={typoClassName}>{s.時代}</Typography>
                                    </TableCell>
                                    <TableCell
                                        className={tableStyles.td.left}
                                        data-label="エリア"
                                    >
                                        <Typography className={typoClassName}>{s.エリア}</Typography>
                                    </TableCell>
                                    <TableCell
                                        className={tableStyles.td.left}
                                        data-label="販売員名"
                                    >
                                        <Typography className={typoClassName}>{s.販売員}</Typography>
                                    </TableCell>
                                    <TableCell
                                        className={tableStyles.td.right}
                                        data-label="販売価格"
                                    >
                                        {(s.時代 === "War Age")
                                            ? <Typography className={classes.warSaleText}>
                                                {numDeform(s.価格)} jade
                                            </Typography>
                                            : <Typography>
                                                {numDeform(s.価格)} gold
                                            </Typography>
                                        }
                                    </TableCell>
                                    <TableCell
                                        className={tableStyles.td.left}
                                        data-label="備考"
                                    >
                                        {(s.備考)
                                            ? <Typography className={typoClassName}>{s.備考}</Typography>
                                            : null
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RenderNpc;
