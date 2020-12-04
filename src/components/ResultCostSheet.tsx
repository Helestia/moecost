import React from 'react';
import ResultItemNameCell from './resultItemNameCell';
import { tMaterial, tByproduct, tDurability, tSurplus, tCreation } from '../scripts/makeListArrayFromTree'
import moecostDb from '../scripts/storage';
import {numDeform, cloneObj_JSON} from '../scripts/common';

import Accordion         from '@material-ui/core/Accordion';
import AccordionSummary  from '@material-ui/core/AccordionSummary';
import AccordionDetails  from '@material-ui/core/AccordionDetails';
import Box               from '@material-ui/core/Box'
import Button            from '@material-ui/core/Button'
import IconButton        from '@material-ui/core/IconButton'
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

import DeleteIcon        from '@material-ui/icons/Delete';
import RestoreIcon       from '@material-ui/icons/Restore';

import {createStyles, Theme, makeStyles, useTheme} from '@material-ui/core/styles';


const useStyles = makeStyles((theme:Theme) => 
    createStyles({
        tableRoot: {
            width: "100%",
            maxWidth: "750px"
        },
        boxRootSeconds: {
            marginTop: theme.spacing(2)
        },
        button: {
            marginTop:theme.spacing(2)
        },
        disableCell: {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.action.disabledBackground,
            textDecorationLine: "line-through"
        }
    })
);

type tResultCostSheet= {
    creations: tCreation[],
    materials: tMaterial[],
    durabilities: tDurability[],
    surpluses: tSurplus[],
    byproducts: tByproduct[],
    changeNotTargetSurpluses : (newItems:string[]) => void,
    changeNotTargetByproducts : (newItems:string[]) => void,
    useChildrenStyles: (props?: any) => Record<"accordionTitleStyle"| "activeStrings", string>,
    handleItemClick: (itemName:string) => void,
    openConfigCreateNumberDialog: () => void
}

type tReduceResult = {
    money:number,
    hasUnknown:boolean
}
const reduceResultDefault: tReduceResult = {
    money:0,
    hasUnknown:false
}

const ResultCostSheet:React.FC<tResultCostSheet> = (props) => {
    const [display,setDisplay] = React.useState( (! moecostDb.表示設定.初期非表示設定.原価表));
    const childrenStyles = props.useChildrenStyles();
    const classes = useStyles(useTheme());

    // アコーディオンのオープン/クローズ
    const handleAccordionChange = () => {
        setDisplay((! display));
    }

    // アイテム名クリック
    const handleItemNameClick = (str:string) => {props.handleItemClick(str)};

    const materialTotal = props.materials.reduce((a,c) => {
        if(c.調達方法 === "未設定") a.hasUnknown = true;
        else a.money += c.合計金額;
        return a;
    },cloneObj_JSON(reduceResultDefault))

    const byproductTotal = props.byproducts.reduce((a,c) => {
        if(c.計算対象外) return a;
        if(c.価格設定有) a.money += c.合計金額;
        else a.hasUnknown = true;
        return a;
    },cloneObj_JSON(reduceResultDefault))

    const surplusTotal = props.surpluses.reduce((a,c) => {
        if(c.計算対象外) return a;
        if(c.未設定含) a.hasUnknown = true;
        a.money += c.余り合計金額;
        return a;
    },cloneObj_JSON(reduceResultDefault));

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
    
    const handleToggleNotTarget_byproduct = (targetItem:string) => () => {
        const nowNonTargets = props.byproducts.filter(b => b.計算対象外).map(b => b.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeNotTargetByproducts(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeNotTargetByproducts(nowNonTargets.concat(targetItem));
    }

    const handleToggleNotTarget_surplus = (targetItem:string) => () => {
        const nowNonTargets = props.surpluses.filter(s => s.計算対象外).map(s => s.アイテム名);
        if(nowNonTargets.includes(targetItem)) props.changeNotTargetSurpluses(nowNonTargets.filter(nt => nt !== targetItem));
        else props.changeNotTargetSurpluses(nowNonTargets.concat(targetItem));
    }

    const renderTableMaterial = () => {
        return (
            <Box>
                <Typography variant="h6">材料費</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>消費個数</Typography></TableCell>
                                <TableCell><Typography>設定単価</Typography></TableCell>
                                <TableCell><Typography>合計金額</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.materials.map((m,i) => (
                                <TableRow key={"Result_MaterialTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={m.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement={m.調達方法}>
                                        <Typography>{m.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        align="right">
                                        <Typography>{numDeform(m.必要個数)}</Typography>
                                    </TableCell>
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
                                            <TableCell align="right">
                                                <Typography>{numDeform(m.設定単価)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography>{numDeform(m.合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="center"><Typography>合計金額</Typography></TableCell>
                                {materialTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(materialTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right">{numDeform(materialTotal.money)}</TableCell>
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableByproduct = () => {
        if(props.byproducts.length === 0) return null;

        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">副産物</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>作成個数</Typography></TableCell>
                                <TableCell><Typography>設定単価</Typography></TableCell>
                                <TableCell><Typography>合計金額</Typography></TableCell>
                                <TableCell><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.byproducts.map((b,i) => (
                                <TableRow key={"Result_ByproductTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={b.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{b.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        className={(b.計算対象外) ? classes.disableCell : ""}>
                                        <Typography>{b.作成個数}</Typography>
                                    </TableCell>
                                    {(b.価格設定有) 
                                        ? (<>
                                            <TableCell
                                                align="right"
                                                className={(b.計算対象外) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(b.設定単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={(b.計算対象外) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(b.合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                align="center"
                                                className={(b.計算対象外) ? classes.disableCell : ""}>
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={(b.計算対象外) ? classes.disableCell : ""}>
                                                <Typography color="error">-</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                    <TableCell>
                                        <IconButton
                                            onClick={handleToggleNotTarget_byproduct(b.アイテム名)}
                                            size="small">
                                            {b.計算対象外
                                                ? <RestoreIcon />
                                                : <DeleteIcon />
                                            }
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align="center"><Typography>合計金額</Typography></TableCell>
                                {byproductTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(byproductTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(byproductTotal.money)}</Typography></TableCell>
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableSurplus = () => {
        if(props.surpluses.length === 0) return null;

        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">余剰生産品</Typography>
                <TableContainer
                    component={Paper}
                    className={classes.tableRoot}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>作成個数</Typography></TableCell>
                                <TableCell><Typography>余り個数</Typography></TableCell>
                                <TableCell><Typography>単価</Typography></TableCell>
                                <TableCell><Typography>余り金額</Typography></TableCell>
                                <TableCell><Typography>除外</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.surpluses.map((s,i) => (
                                <TableRow  key={"Result_SurplusTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={s.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{s.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell
                                        align="right"
                                        className={(s.計算対象外) ? classes.disableCell : ""}>
                                        <Typography>{s.作成個数}</Typography>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        className={(s.計算対象外) ? classes.disableCell : ""}>
                                        <Typography>{s.余り個数}</Typography>
                                    </TableCell>
                                    {(s.未設定含) 
                                        ? (<>
                                            <TableCell
                                                align="right"
                                                className={(s.計算対象外) ? classes.disableCell : ""}>
                                                <Typography
                                                    color={(s.計算対象外) ? "initial" : "error"}>
                                                    {numDeform(s.単価)} ± α
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"                                                
                                                className={(s.計算対象外) ? classes.disableCell : ""}>
                                                <Typography
                                                    color={(s.計算対象外) ? "initial" : "error"}>
                                                    {numDeform(s.余り合計金額)} ± α
                                                </Typography>
                                            </TableCell>
                                        </>)
                                        : (<>
                                            <TableCell
                                                align="right"
                                                className={(s.計算対象外) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(s.単価)}</Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className={(s.計算対象外) ? classes.disableCell : ""}>
                                                <Typography>{numDeform(s.余り合計金額)}</Typography>
                                            </TableCell>
                                        </>)
                                    }
                                    <TableCell>
                                        <IconButton
                                            onClick={handleToggleNotTarget_surplus(s.アイテム名)}
                                            size="small">
                                            {s.計算対象外
                                                ? <RestoreIcon />
                                                : <DeleteIcon />
                                            }
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} align="center"><Typography>合計金額</Typography></TableCell>
                                {surplusTotal.hasUnknown 
                                    ? <TableCell align="right"><Typography color="error">{numDeform(surplusTotal.money) + "+ α"}</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(surplusTotal.money)}</Typography></TableCell>
                                }
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderTableDurability = () => {
        if(props.durabilities.length === 0) return null;

        const renderObj = props.durabilities.map(d => {
            if(d.調達方法 === "未設定") return{
                アイテム名: (
                <ResultItemNameCell
                    itemName={d.アイテム名}
                    handleClick={handleItemNameClick}
                    procurement={d.調達方法}>
                    <Typography>{d.アイテム名}</Typography>
                </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="center">
                        <Typography color="error">-</Typography>
                    </TableCell>
                )
            };
            if(d.調達方法 === "作成" && d.未設定含) return{
                アイテム名: (
                    <ResultItemNameCell
                        itemName={d.アイテム名}
                        handleClick={handleItemNameClick}
                        procurement={d.調達方法}>
                        <Typography>{d.アイテム名}</Typography>
                    </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.単価)} ± α</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.合計価格)} ± α</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.耐久割単価)} ± α</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.耐久割金額)} ± α</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="right">
                        <Typography color="error">{numDeform(d.合計価格 - d.耐久割金額)} ± α</Typography>
                    </TableCell>
                )
            };
            return {
                アイテム名: (
                    <ResultItemNameCell
                        itemName={d.アイテム名}
                        handleClick={handleItemNameClick}
                        procurement={d.調達方法}>
                        <Typography>{d.アイテム名}</Typography>
                    </ResultItemNameCell>
                ),
                消費個数: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費個数)}</Typography>
                    </TableCell>
                ),
                調達単価: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.単価)}</Typography>
                    </TableCell>
                ),
                合計金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.合計価格)}</Typography>
                    </TableCell>
                ),
                最大耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.最大耐久値)}</Typography>
                    </TableCell>
                ),
                消費耐久: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.消費耐久値)}</Typography>
                    </TableCell>
                ),
                耐久割単価: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.耐久割単価)}</Typography>
                    </TableCell>
                ),
                耐久割金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.耐久割金額)}</Typography>
                    </TableCell>
                ),
                未償却金額: (
                    <TableCell align="right">
                        <Typography>{numDeform(d.合計価格 - d.耐久割金額)}</Typography>
                    </TableCell>
                )
            }
        });
        
        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">耐久割</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography>アイテム名</Typography></TableCell>
                                <TableCell><Typography>消費<br />個数</Typography></TableCell>
                                <TableCell><Typography>調達<br />単価</Typography></TableCell>
                                <TableCell><Typography>合計<br />金額</Typography></TableCell>
                                <TableCell><Typography>最大<br />耐久値</Typography></TableCell>
                                <TableCell><Typography>消費<br />耐久値</Typography></TableCell>
                                <TableCell><Typography>耐久割<br />単価</Typography></TableCell>
                                <TableCell><Typography>耐久割<br />金額</Typography></TableCell>
                                <TableCell><Typography>未償却</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                renderObj.map((d,i) => (
                                    <TableRow key={"Result_DurabilitiesTable_RowNo_" + i}>
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
                        <TableFooter>
                            <TableRow>
                                <TableCell align="center" colSpan={3}><Typography>合計金額</Typography></TableCell>
                                {(durabilityTotal.hasUnknown)
                                    ? <TableCell align="right"><Typography color="error">{numDeform(durabilityTotal.total)} ± α</Typography></TableCell>
                                    : <TableCell align="right"><Typography>{numDeform(durabilityTotal.total)}</Typography></TableCell>
                                }
                                <TableCell colSpan={3}></TableCell>
                                {(durabilityTotal.hasUnknown)
                                    ? (
                                        <>
                                            <TableCell align="right">
                                                <Typography color="error">{numDeform(durabilityTotal.durable)} ± α</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography color="error">{numDeform(durabilityTotal.undepreciated)} ± α</Typography>
                                            </TableCell>
                                        </>
                                    )
                                    : (
                                        <>
                                            <TableCell align="right">
                                                <Typography>{numDeform(durabilityTotal.durable)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
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
        )
    }
    const renderTableCreate = () => {
        if(props.creations.length <= 1) return null;
        return (
            <Box className={classes.boxRootSeconds}>
                <Typography variant="h6">最終作成物</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>アイテム名</TableCell>
                                <TableCell>作成個数</TableCell>
                                <TableCell>合計金額</TableCell>
                                <TableCell>単価</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.creations.map((c,i) =>
                                <TableRow  key={"Result_CreationTable_RowNo_" + i}>
                                    <ResultItemNameCell
                                        itemName={c.アイテム名}
                                        handleClick={handleItemNameClick}
                                        procurement="作成">
                                        <Typography>{c.アイテム名}</Typography>
                                    </ResultItemNameCell>
                                    <TableCell align="right"><Typography>{numDeform(c.作成個数)}</Typography></TableCell>
                                    {
                                        (c.未設定含)
                                            ? <>
                                                <TableCell align="right">
                                                    <Typography color="error">{numDeform(c.合計材料費)} ± α</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography color="error">{numDeform(c.単価)} ± α</Typography>
                                                </TableCell>
                                            </>
                                            : <>
                                                <TableCell align="right">
                                                    <Typography>{numDeform(c.合計材料費)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
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
        );
    }

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
                <Box>
                    {renderTableMaterial()}
                    {renderTableByproduct()}
                    {renderTableSurplus()}
                    {renderTableDurability()}
                    {renderTableCreate()}
                    <Button
                        variant="outlined"
                        onClick={props.openConfigCreateNumberDialog}
                        className={classes.button}>作成個数の変更</Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    )

}

export default ResultCostSheet;