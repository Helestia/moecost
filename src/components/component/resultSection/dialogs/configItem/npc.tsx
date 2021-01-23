import React from 'react';

import {tJSON_npcSaleItem}  from '../../../../../scripts/jsonReader';
import {numDeform}          from '../../../../../scripts/common';


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
    if(! props.tabSelected) return null;
    if(! props.npcs) return null;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>時代</TableCell>
                        <TableCell>地域</TableCell>
                        <TableCell>販売員名</TableCell>
                        <TableCell>販売価格</TableCell>
                        <TableCell>備考</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.npcs.販売情報.map((s,i) => (
                            <TableRow
                                key={`resultConfigItemDialog_Npc_TableRow_${i}`}
                                className={(s.時代 === "War Age") ? classes.warSale : ""}>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.時代}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.エリア}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.販売員}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {(s.時代 === "War Age")
                                        ? <Typography className={classes.warSaleText}>
                                            {numDeform(s.価格)} jade
                                        </Typography>
                                        : <Typography>
                                            {numDeform(s.価格)} gold
                                        </Typography>
                                    }

                                </TableCell>
                                <TableCell>
                                    {(s.備考)
                                        ? <Typography className={(s.時代 === "War Age") ? classes.warSaleText : ""}>{s.備考}</Typography>
                                        : null
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RenderNpc;
