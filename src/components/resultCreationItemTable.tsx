import React from 'react';
import moecostDb from '../scripts/storage';
import { numDeform } from '../scripts/common';
import { tCreation } from '../scripts/makeListArrayFromTree';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import TableContainer    from '@material-ui/core/TableContainer'
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead'
import TableBody         from '@material-ui/core/TableBody';
import TableCell         from '@material-ui/core/TableCell';
import TableRow          from '@material-ui/core/TableRow';
import Typography        from '@material-ui/core/Typography'
import Paper             from '@material-ui/core/Paper';
import ExpandMoreIcon    from '@material-ui/icons/ExpandMore';
import makeStyles        from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
    tableRoot: {
        width: "100%",
        maxWidth: "750px"
    }
});

type tResultCreationItemnTable= {
    creations: tCreation[],
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
}

const ResultCreationItemTable:React.FC<tResultCreationItemnTable> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.生成アイテム一覧));
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles();

    // 作成アイテムが1つ以下の場合は処理終了
    if(props.creations.length <= 1) return null;

    // アコーディオンのオープン/クローズ
    const handleAccordionChange = () => {
        setDisplay((! display));
    }

    const renderTotalCostCell = (r:tCreation) => {
        if(r.未設定含) return (
            <TableCell align="left">
                <Typography color="error">
                    {numDeform(r.合計材料費) + " + 未設定分"}
                </Typography>
            </TableCell>
        );
        return (
            <TableCell align="left">
                <Typography color="textPrimary">
                    {numDeform(r.合計材料費)}
                </Typography>
            </TableCell>
        )
    }
    const renderUnitCostCell = (r:tCreation) => {
        if(r.未設定含) return (
            <TableCell align="center">
                <Typography color="error">-</Typography>
            </TableCell>
        );
        return (
            <TableCell align="left">
                <Typography color="textPrimary">
                    {numDeform(r.単価)}
                </Typography>
            </TableCell>
        )
    }

    // テーブル作成
    return (
        <Accordion
            expanded={display}
            onChange={handleAccordionChange}>
            <AccordionSummary
                className={childrenStyles.accordionTitleStyle}
                expandIcon={<ExpandMoreIcon />}>
                生産アイテム一覧
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer component={Paper} className={classes.tableRoot}>
                    <Table className={classes.tableRoot}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">生産アイテム</TableCell>
                                <TableCell align="center">作成個数</TableCell>
                                <TableCell align="center">合計金額</TableCell>
                                <TableCell align="center">単価</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.creations.map(r => (
                                <TableRow key={"resultCreationItemTable_" + r.アイテム名}>
                                    <TableCell component="th">{r.アイテム名}</TableCell>
                                    <TableCell align="right">{numDeform(r.作成個数)}</TableCell>
                                    {renderTotalCostCell(r)}
                                    {renderUnitCostCell(r)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );
}

export default ResultCreationItemTable;
