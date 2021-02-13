import React from 'react';

import {tRetrieveItemData_RecipeResult} from './index';

import {numDeform}          from '../../../../../scripts/common';
import {tJSON_recipe}       from '../../../../../scripts/jsonReader';

import TableContainer           from '@material-ui/core/TableContainer';
import Table                    from '@material-ui/core/Table';
import TableBody                from '@material-ui/core/TableBody';
import TableRow                 from '@material-ui/core/TableRow';
import TableCell                from '@material-ui/core/TableCell';
import Paper                    from '@material-ui/core/Paper';
import Typography               from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    racipeTableContainer: {
        marginBottom: theme.spacing(2)
    }
}));

type tRenderRecipeProps = {
    tabSelected: boolean,
    recipes: tRetrieveItemData_RecipeResult[],
    itemName: string
}
const RenderRecipe:React.FC<tRenderRecipeProps> = (props) => {
    const classes = useStyles();

    if(! props.tabSelected) return null;
    if(! props.recipes) return null;
    
    const renderRouletteRow = (recipe:tJSON_recipe) => {
        if((! recipe.ギャンブル) && (! recipe.ペナルティ)) return null;
        const text = (()=> {
            if(recipe.ギャンブル && recipe.ペナルティ) return "ギャンブル・ペナルティ型";
            if(recipe.ギャンブル) return "ギャンブル型";
            return "ペナルティ";
        })()
        return (
            <TableRow>
                <TableCell><Typography>ルーレット</Typography></TableCell>
                <TableCell><Typography>{text}</Typography></TableCell>
            </TableRow>
        )
    }
    const renderByproduct = (recipe:tJSON_recipe) => {
        if(! recipe.副産物) return null;
        const text = recipe.副産物.map(b => {
            const afix = (b.個数) ? ` × ${b.個数}` : "";
            return b.アイテム + afix;
        }).join(" / ");
        const resultJSX = (text.length > 20)
            ? <Typography>
                {text.split(" / ").map((t,i) => {
                    if(i) return <><br />{t}</>;
                    return <>{t}</>;
                })}
            </Typography>
            : <Typography>{text}</Typography>
        return (
            <TableRow>
                <TableCell><Typography>副産物</Typography></TableCell>
                <TableCell>{resultJSX}</TableCell>
            </TableRow>
        )
    }

    return (
        <>
        {    
            props.recipes.map((r,i) => (
                <TableContainer
                    component={Paper}
                    key={`resultConfigItemDialog_Recipe_TableContainer_${i}`}
                    className={classes.racipeTableContainer}
                >
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell><Typography>レシピ名</Typography></TableCell>
                                <TableCell><Typography>{r.レシピ.レシピ名}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography>作成物</Typography></TableCell>
                                <TableCell>
                                    <Typography>
                                        {r.レシピ.生成物.アイテム}{(r.レシピ.生成物.個数)
                                            ? ` × ${numDeform(r.レシピ.生成物.個数)}`
                                            : ""
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {/*副産物*/}
                            {renderByproduct(r.レシピ)}
                            <TableRow>
                                <TableCell><Typography>材料</Typography></TableCell>
                                <TableCell>
                                    <Typography>
                                    {r.レシピ.材料.map(m => {
                                        const countAfix = (m.個数) ? ` × ${m.個数}` : "";
                                        return <>{m.アイテム + countAfix}<br /></>; 
                                    })}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {/*ルーレット配置*/}
                            {renderRouletteRow(r.レシピ)}
                            {(r.レシピ.要レシピ)
                                ? (<TableRow>
                                    <TableCell><Typography>要レシピ</Typography></TableCell>
                                    <TableCell><Typography>レシピが必要</Typography></TableCell>
                                </TableRow>)
                                : null
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            ))
        }
        </>
    );
}

export default RenderRecipe;
