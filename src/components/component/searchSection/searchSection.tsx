import React from 'react'
import {Recipes} from '../../../scripts/jsonReader'
import SuggestionArea from './suggestion'
import SeriesRecipeSelect from './seriesRecipeSelect'

type tSearchSectionProps = {
    handleChangeRecipe:(recipe:string,items:string[]) => void
}

const SearchSection:React.FC<tSearchSectionProps> = (props) => {
    const {
        serieseName,
        handleReturnSearch,
        handleReturnSeriese} = useSearchSection(props.handleChangeRecipe);
    return (
        <>
            <SuggestionArea
                handleReturnSearch={handleReturnSearch}
            />
            <SeriesRecipeSelect
                seriesName={serieseName}
                handleReturnSeriese={handleReturnSeriese} 
            />
        </>
    )
}

type tUseSearchSectionProps = (recipe:string,items:string[]) => void

type tUseSearchSectionReturn = {
    serieseName: string,
    handleReturnSearch: (recipe:string) => void,
    handleReturnSeriese: (items:string[]) => void
}

type tUseSearchSection = (handleChangeRecipe:tUseSearchSectionProps) => tUseSearchSectionReturn
const useSearchSection:tUseSearchSection = (handleChangeRecipe) => {
    const [serieseName,setSerieseName] = React.useState("");

    const handleReturnSearch = (recipe:string) => {
        const findedRecipe = Recipes.find(r => r.レシピ名 === recipe);
        if(findedRecipe){
            setSerieseName("");
            handleChangeRecipe(
                findedRecipe.レシピ名,
                [findedRecipe.生成物.アイテム]
            )
            return;
        } else {
            setSerieseName(recipe);
            handleChangeRecipe(
                "",
                []
            )
        }
    }

    const handleReturnSeriese = (items:string[]) => {
        handleChangeRecipe(
            serieseName,
            items
        )
    }

    return {
        serieseName: serieseName,
        handleReturnSearch: handleReturnSearch,
        handleReturnSeriese: handleReturnSeriese
    }
}

export default SearchSection;
