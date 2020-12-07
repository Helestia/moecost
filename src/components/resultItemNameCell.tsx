import React from 'react';

import {tProcurement} from '../scripts/buildTree'
import TableCell from '@material-ui/core/TableCell'

import {
    makeStyles,
    createStyles,
    Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
        create:{
            backgroundColor: (theme.palette.type === "light") ? "#fcc" : "#300",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: (theme.palette.type === "light") ? "#f99" : "#600"
            }
        },
        user:{
            backgroundColor: (theme.palette.type === "light") ? "#cff" : "#033",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: (theme.palette.type === "light") ? "#9ff" : "#066"
            }
        },
        npc:{
            backgroundColor: (theme.palette.type === "light") ? "#cfc" : "#030",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: (theme.palette.type === "light") ? "#9f9" : "#060"
            }
        },
        common: {
            backgroundColor: (theme.palette.type === "light") ? "#ffc" : "#330",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: (theme.palette.type === "light") ? "#ff9" : "#660",
            }
        },
        unknown:{
            fontWeight: "bold",
            cursor: "pointer",
            color: (theme.palette.type === "light") ? theme.palette.error.light : theme.palette.error.dark,
            "&:hover": {
                backgroundColor: theme.palette.action.hover
            }
        },
        isTree: {
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: theme.palette.divider
        }
    })
);

type tResultItemNameCell = {
    itemName: string,
    colspan?: number,
    rowspan?: number,
    keyName?: string,
    isTree?: boolean
    procurement: tProcurement,
    handleClick: (str:string) => void
}
const ResultItemNameCell:React.FC<tResultItemNameCell> = (props) => {
    const classes = useStyles();
    const cellClass = (() => {
        if(props.procurement === "NPC")      return classes.npc;
        if(props.procurement === "作成")     return classes.create;
        if(props.procurement === "共通素材") return classes.common;
        if(props.procurement === "自力調達") return classes.user;
        return classes.unknown;
    })();
    

    const colSpan = props.colspan ? props.colspan : 1;
    const rowSpan = props.rowspan ? props.rowspan : 1;
    
    const handleClick = (str:string) => () => {props.handleClick(str)};
    return (
        <TableCell
            colSpan={colSpan}
            rowSpan={rowSpan}
            onClick={handleClick(props.itemName)}
            className={(props.isTree) ? cellClass + " " +  classes.isTree : cellClass}
            key={props.keyName}
        >
            {props.children}
        </TableCell>
    );
}

export default ResultItemNameCell;