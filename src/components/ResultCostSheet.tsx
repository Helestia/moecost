import React from 'react';
import { tMaterial, tByproduct, tDurability, tSurplus } from '../scripts/makeListArrayFromTree'
import moecostDb from '../scripts/storage';
import {numDeform} from '../scripts/common';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import TableContainer    from '@material-ui/core/TableContainer'
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead'
import TableBody         from '@material-ui/core/TableBody';
import TableFooter       from '@material-ui/core/TableFooter'
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

type tResultCostSheet= {
    materials: tMaterial[],
    durabilities: tDurability[],
    surplulses: tSurplus[],
    byproducts: tByproduct[],
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
}


const ResultCostSheet:React.FC<tResultCostSheet> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.生成アイテム一覧));
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles();

    // アコーディオンのオープン/クローズ
    const handleAccordionChange = () => {
        setDisplay((! display));
    }

    const renderTableMaterial = () => {

        return (
            <TableContainer
                component={Paper}
                className={classes.tableRoot}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>消費個数</TableCell>
                            <TableCell>設定単価</TableCell>
                            <TableCell>合計金額</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.materials.map(m => (
                            <TableRow>
                                <TableCell>{m.アイテム名}</TableCell>
                                <TableCell>{m.必要個数}</TableCell>
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
                                        <TableCell align="right">{numDeform(m.設定単価)}</TableCell>
                                        <TableCell align="right">{numDeform(m.合計金額)}</TableCell>
                                    </>)
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const renderTableByproduct = () => {
        if(props.byproducts.length === 0) return null;
        return (
            <TableContainer
                component={Paper}
                className={classes.tableRoot}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>作成個数</TableCell>
                            <TableCell>設定単価</TableCell>
                            <TableCell>合計金額</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.byproducts.map(b => (
                            <TableRow>
                                <TableCell>{b.アイテム名}</TableCell>
                                <TableCell>{b.作成個数}</TableCell>
                                {(b.価格設定有) 
                                    ? (<>
                                        <TableCell align="right">{numDeform(b.設定単価)}</TableCell>
                                        <TableCell align="right">{numDeform(b.合計金額)}</TableCell>
                                    </>)
                                    : (<>
                                        <TableCell align="center">
                                            <Typography color="error">-</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography color="error">-</Typography>
                                        </TableCell>
                                    </>)
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const renderTableSurplus = () => {
        if(props.surplulses.length === 0) return null;
        return (
            <TableContainer
                component={Paper}
                className={classes.tableRoot}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>作成個数</TableCell>
                            <TableCell>余り個数</TableCell>
                            <TableCell>単価</TableCell>
                            <TableCell>余り金額</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.surplulses.map(s => (
                            <TableRow>
                                <TableCell>{s.アイテム名}</TableCell>
                                <TableCell>{s.作成個数}</TableCell>
                                <TableCell>{s.余り個数}</TableCell>
                                {(s.未設定含) 
                                    ? (<>
                                        <TableCell align="right"><Typography color="error">{numDeform(s.単価)} ± 未設定</Typography></TableCell>
                                        <TableCell align="right"><Typography color="error">{numDeform(s.余り合計金額)} ± 未設定</Typography></TableCell>
                                    </>)
                                    : (<>
                                        <TableCell align="right">{numDeform(s.単価)}</TableCell>
                                        <TableCell align="right">{numDeform(s.余り合計金額)}</TableCell>
                                    </>)
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                素材・余剰生産品・副産物一覧
            </AccordionSummary>
            <AccordionDetails>
                {renderTableMaterial}
                {renderTableByproduct}
                {renderTableSurplus}
            {/*
                {renderTableDurability}
                {renderTableTotal}
            */}
            </AccordionDetails>
        </Accordion>
    )

}

export default ResultCostSheet;