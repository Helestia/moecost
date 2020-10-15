import {moecost} from '../types/app'
import React from 'react'
import jsonRecipes from '../reference/recipes.json'
import jsonSeriesCreationItems from '../reference/seriesCreationItems.json'
import {SuggestionArea,tSuggestion} from './suggestion'
import {SeriesRecipeSelect,} from './seriesRecipeSelect'

export type tSerchSectionRtnFuncProps = {
        レシピ名 : string,
        生成アイテム : string[]
    } | undefined;


export type tSerchSectionProps = {
    rtnFunc : (rtnFuncProp:tSerchSectionRtnFuncProps) => void
}

export const SerchSection:React.FC<tSerchSectionProps> = (props) => {
    const [seriesObj,setSeriesObj] = React.useState<moecost.JSON.seriesCreationItems | undefined>(undefined);

    const suggestionAreaRtnFunc = (suggestion? : tSuggestion) => {
        if(suggestion === undefined){
            setSeriesObj(undefined);
        } else if(! suggestion.シリーズレシピ){
            const recipeIndex = jsonRecipes.findIndex(recipe => {
                return recipe.レシピ名 === suggestion.レシピ名;
            })
            if(recipeIndex === -1){
                // 初期化
                props.rtnFunc({
                    レシピ名 : "",
                    生成アイテム : []
                });
            } else {
                props.rtnFunc({
                    レシピ名 : jsonRecipes[recipeIndex].レシピ名,
                    生成アイテム : [jsonRecipes[recipeIndex].生成物.アイテム]
                });
            }
        } else {
            const seriesObj = jsonSeriesCreationItems.find(series => {
                return suggestion.レシピ名 === series.シリーズ名
            });
            if(seriesObj){
                setSeriesObj(seriesObj);
            }
        }
    }

    // シリーズ選択結果
    type tSeriesRecipeSelectRtnFuincProps = {
        レシピ名 : string,
        生成アイテム : string[]
    };
    const seriesRecipeSelectRtnFuinc = (seriesRecipeSelectRtnFuincProps : tSeriesRecipeSelectRtnFuincProps) => {
        if(seriesRecipeSelectRtnFuincProps.レシピ名 && seriesRecipeSelectRtnFuincProps.生成アイテム.length>1){
            props.rtnFunc({
                レシピ名 : seriesRecipeSelectRtnFuincProps.レシピ名,
                生成アイテム : seriesRecipeSelectRtnFuincProps.生成アイテム
            });
        } else {
            // 初期化
            props.rtnFunc({
                レシピ名 : "",
                生成アイテム : []
            });
        }
    }

    // サジェストリストの生成
    const suggestList : tSuggestion[] = [];
    jsonSeriesCreationItems.forEach(series => {
        suggestList.push({
            レシピ名 : series.シリーズ名,
            シリーズレシピ : true
        })
    });
    jsonRecipes.forEach(recipe => {
        suggestList.push({
            レシピ名: recipe.レシピ名,
            シリーズレシピ : false
        })
    })

    if(seriesObj){
        return (
            <>
                <SuggestionArea 
                    allSuggestions={suggestList}
                    rtnFunc={suggestionAreaRtnFunc}
                    />
                <SeriesRecipeSelect
                    seriesObj={seriesObj}
                    rtnFunc={seriesRecipeSelectRtnFuinc} 
                    />
            </>
        )
    } else {
        return (
            <SuggestionArea 
                allSuggestions={suggestList}
                rtnFunc={suggestionAreaRtnFunc}
                />
        )
    }
    
}