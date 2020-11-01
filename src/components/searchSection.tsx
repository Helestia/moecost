import React from 'react'
import {Recipes,SeriesCreationItems,tJSON_seriesCreationItem} from '../scripts/jsonReader'
import SuggestionArea, {tSuggestion} from './suggestion'
import SeriesRecipeSelect, {tSeriesSelectItems} from './seriesRecipeSelect'

export type tSearchSectionRtnFuncProps = {
    レシピ名 : string,
    生成アイテム : string[]
} | undefined;

export type tSearchSectionProps = {
    rtnFunc : (rtnFuncProp:tSearchSectionRtnFuncProps) => void
}

export const SearchSection:React.FC<tSearchSectionProps> = (props) => {
    const [seriesObj,setSeriesObj] = React.useState<tJSON_seriesCreationItem | undefined>(undefined);
    
    const suggestionAreaRtnFunc = (suggestion? : tSuggestion) => {
        if(suggestion === undefined){
            setSeriesObj(undefined);
        } else if(! suggestion.シリーズレシピ){
            setSeriesObj(undefined);
            const recipeIndex = Recipes.findIndex(recipe => {
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
                    レシピ名 : Recipes[recipeIndex].レシピ名,
                    生成アイテム : [Recipes[recipeIndex].生成物.アイテム]
                });
            }
        } else {
            const seriesObj = SeriesCreationItems.find(series => {
                return suggestion.レシピ名 === series.シリーズ名
            });
            if(seriesObj){
                setSeriesObj(seriesObj);
            }
        }
    }

    // シリーズ選択結果
    const seriesRecipeSelectRtnFuinc = (seriesRecipeSelectRtnFuincProps : tSeriesSelectItems) => {
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
    SeriesCreationItems.forEach(series => {
        suggestList.push({
            レシピ名 : series.シリーズ名,
            シリーズレシピ : true
        })
    });
    Recipes.forEach(recipe => {
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

export default SearchSection;