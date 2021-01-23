import React from 'react';

import {tRetrieveItemData_RecipeResult} from './index';

import {numDeform}          from '../../../../../scripts/common';
import {tJSON_npcSaleItem}  from '../../../../../scripts/jsonReader';

import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableBody        from '@material-ui/core/TableBody';
import TableRow         from '@material-ui/core/TableRow';
import TableCell        from '@material-ui/core/TableCell';
import Paper            from '@material-ui/core/Paper';
import Typography       from '@material-ui/core/Typography';
import List             from '@material-ui/core/List';
import ListItem         from '@material-ui/core/ListItem';
import ListItemText     from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup       from '@material-ui/core/RadioGroup';
import Radio            from '@material-ui/core/Radio';
import TextField        from '@material-ui/core/TextField';

import {
    makeStyles,
    createStyles,
    Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    userCostInput: {
        width: "10rem"
    }
}));

type tRenderSummaryProps = {
    itemName: string,
    tabSelected: boolean,
    recipes: tRetrieveItemData_RecipeResult[],
    npcs: tJSON_npcSaleItem | undefined,
    procurement: string,
    userCost: number,
    handleRadio:    (str:string) => void,
    handleUserCost: (num:number) => void,
    handleSubmit: () => void
}
const RenderSummary:React.FC<tRenderSummaryProps> = (props) => {
    const classes = useStyles();

    if(! props.tabSelected) return null;

    const renderNpcSalesRow = () => {
        const saleCell = (props.npcs === undefined)
            ? <TableCell><Typography>販売情報なし</Typography></TableCell>
            : <TableCell><Typography>最低販売額 {numDeform(props.npcs.最低販売価格)}</Typography></TableCell>
        return (
            <TableRow>
                <TableCell>NPC販売情報</TableCell>
                {saleCell}
            </TableRow>
        )
    }
    const handleChangeRadio = (e:React.ChangeEvent<HTMLInputElement>,value:string) => {
        props.handleRadio(value);
    }

    const handleClickUserTextField = (e:React.MouseEvent<HTMLInputElement>) => {
        props.handleRadio("自力調達");
    }

    const handleUserCost = (e:React.ChangeEvent<HTMLInputElement>) => {
        const valueNumber = Number(e.target.value);
        if(valueNumber < 0) props.handleUserCost(0);
        return props.handleUserCost(valueNumber);
    }

    const renderRecipeRow = () => {
        const recipeCell = (() => {
            if(props.recipes.length === 0) return <TableCell><Typography>生産情報なし</Typography></TableCell>
            if(props.recipes.length === 1){
                const r = props.recipes[0];
                return (
                    <TableCell>
                        <Typography
                            color={(r.リスト.最終作成物[0].未設定含) ? "error" : "textPrimary"}>
                            {(r.リスト.最終作成物[0].未設定含) 
                                ? numDeform(r.リスト.最終作成物[0].単価) + " ± 未設定"
                                : numDeform(r.リスト.最終作成物[0].単価)
                            }
                        </Typography>
                    </TableCell>
                );
            }

            const Lists = props.recipes.map((r,i) => {
                const isError = r.リスト.最終作成物[0].未設定含;
                return (
                    <ListItem
                        key={"resultConfigItemDialog_Summary_CreationList_" + i}>
                        <ListItemText
                            primary={
                                <Typography>{r.レシピ.レシピ名}</Typography>
                            }
                            secondary={
                                <Typography
                                    color={(isError) ? "error" : "textPrimary"}>
                                    {(isError) 
                                        ? numDeform(r.リスト.最終作成物[0].単価) + " ± 未設定"
                                        : numDeform(r.リスト.最終作成物[0].単価)
                                    }
                                </Typography>
                            }
                            />
                    </ListItem>
                )
            });
            return (
                <TableCell>
                    <List>
                        {Lists}
                    </List>
                </TableCell>
            );
        })()
        return (
            <TableRow>
                <TableCell>
                    <Typography>
                        生産情報
                    </Typography>
                </TableCell>
                {recipeCell}
            </TableRow>
        );
    }

    // アイテム入手手段選択肢
    const renderRadioList = () => {
        const npc = (props.npcs !== undefined) 
            ? (
                <ListItem>
                    <ListItemText primary={
                        <FormControlLabel
                            control={<Radio size="small" />}
                            label={<Typography>NPC購入</Typography>}
                            value="NPC"
                            checked={props.procurement === "NPC"}
                        />
                        }
                    />
                </ListItem>
            )
            : null;
        const create = (() => {
            if(props.recipes.length > 1) return (
                <>
                    {props.recipes.map((r,i) => {
                        const valueName: string = `生産_${r.レシピ.レシピ名}`;
                        
                        return (
                            <ListItem key={"resultConfigItemDialog_Summary_RadioListCreationList_" + i}>
                                <ListItemText
                                    primary={
                                    <FormControlLabel
                                        control={<Radio size="small" />}
                                        label={<Typography>生産 - {r.レシピ.レシピ名}</Typography>}
                                        value={valueName}
                                        checked={props.procurement === valueName}

                                    />
                                    }
                                />
                            </ListItem>
                        )
                    })}
                </>
            );
            if(props.recipes.length === 1) {
                const valueName = `生産_${props.recipes[0].レシピ.レシピ名}`;
                return (
                <ListItem>
                    <ListItemText
                        primary={
                            <FormControlLabel
                                control={<Radio size="small" />}
                                label={<Typography>生産作成</Typography>}
                                value={valueName}
                                checked={props.procurement === valueName}
                            />
                        }
                    />
                </ListItem>
                );
            }
            return null;
        })();
        const user = (
            <ListItem>
                <ListItemText
                    primary={
                        <FormControlLabel
                            control={<Radio size="small" />}
                            label={<Typography>自力調達(単価指定)</Typography>}
                            value="自力調達"
                            checked={props.procurement === "自力調達"}
                        />
                    }
                    secondary={
                        <TextField
                            type="number"
                            label="単価"
                            disabled={props.procurement !== "自力調達"}
                            size="small"
                            value={props.userCost}
                            onClick={handleClickUserTextField}
                            onChange={handleUserCost}
                            className={classes.userCostInput}
                    />
                    }
                />
            </ListItem>
        );

        const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
            props.handleSubmit();
            e.preventDefault();
        }
        return (
            <TableRow>
                <TableCell>調達方法</TableCell>
                <TableCell>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <RadioGroup value={props.procurement} onChange={handleChangeRadio}>
                            <List dense>
                                {npc}
                                {create}
                                {user}
                            </List>
                        </RadioGroup>
                    </form>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>アイテム名</TableCell>
                        <TableCell>{props.itemName}</TableCell>
                    </TableRow>
                    {renderNpcSalesRow()}
                    {renderRecipeRow()}
                    {renderRadioList()}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RenderSummary;
