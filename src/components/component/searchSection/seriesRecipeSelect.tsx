import React from 'react'
import {SeriesCreationItems,tJSON_seriesCreationItem_item} from '../../../scripts/jsonReader'

import Button           from '@material-ui/core/Button'
import Card             from '@material-ui/core/Card';
import CheckBox         from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import List             from '@material-ui/core/List';
import ListSubheader    from '@material-ui/core/ListSubheader'
import ListItem         from '@material-ui/core/ListItem';
import ListItemText     from '@material-ui/core/ListItemText';

import {
    makeStyles,
    createStyles,
    Theme}     from '@material-ui/core/styles'

const definedStyles = makeStyles((theme:Theme)=>createStyles({
    cord : {
        margin: theme.spacing(1),
        width: 440
    },
    listItem: {
        paddingTop:0,
        paddingBottom:0
    },
    button: {
        margin: theme.spacing(1)
    }
}));
type seriesRecipeSelectProps = {
    seriesName : string,
    handleReturnSeriese : (items:string[]) => void
}
const SeriesRecipeSelect:React.FC<seriesRecipeSelectProps> = (props) => {
    const {
        ListItemNodes,
        isSubmitDisabled,
        handleSubmit} = useSeriesRecipeSelect(props.seriesName,props.handleReturnSeriese);
    const classes = definedStyles();
    
    console.log("render SeriesRecipeSelect");
    if(props.seriesName === "") return null

    return (
        <Card className={classes.cord}>
            <List>
                <ListSubheader>シリーズ一括生産・対象アイテム選択</ListSubheader>
                {ListItemNodes.map(node => node)}
            </List>
            <Button
                className={classes.button}
                variant="text"
                color="primary"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            >
                選択完了
            </Button>
        </Card>
    )
}


type tUseSeriesRecipeSelectReturn = {
    ListItemNodes: React.ReactNodeArray,
    isSubmitDisabled: boolean,
    handleSubmit: () => void,
}
type tUseSeriesRecipeSelect = (
    seriesName:string,
    handleReturnSeriese : (items:string[]) => void)
        => tUseSeriesRecipeSelectReturn
const useSeriesRecipeSelect:tUseSeriesRecipeSelect = (seriesName,handleReturnSeriese) => {
    const [seriesItems,setSeriesItems] = React.useState<tJSON_seriesCreationItem_item[]>([]);
    const [isChecked,setIsChecked] = React.useState<boolean[]>([]);
    const classes = definedStyles();
    

    React.useEffect(() => {
        if(seriesName === ""){
            setSeriesItems([]);
            setIsChecked([]);
        } else {
            const tryFindSeriesObj = SeriesCreationItems.find(s => s.シリーズ名 === seriesName);
            if(! tryFindSeriesObj){
                setSeriesItems([]);
                setIsChecked([]);
            } else {
                setSeriesItems(tryFindSeriesObj.アイテム一覧);
                setIsChecked(new Array<boolean>(tryFindSeriesObj.アイテム一覧.length).fill(true));
            }
        }
    },[seriesName])

    const handleChange = (index:number) => {
        const newChecked = isChecked.concat();
        newChecked[index] = (! isChecked[index]);
        setIsChecked(newChecked);
    }

    const ListItemNodes = seriesItems.map((s,i) => {
        return (
            <ListItem
                key={`seriesRecipeSelecter_${s.接頭}_${s.アイテム}`}
                className={classes.listItem}
            >
                <ListItemText
                    className={classes.listItem}
                >
                    <FormControlLabel
                        control={
                            <CheckBox
                                size="small"
                                color="primary"
                                checked={isChecked[i]}
                                onChange={handleChange.bind(null,i)}
                            />
                        }
                        label={`[${s.接頭}]${s.アイテム}`}
                    />
                </ListItemText>
            </ListItem>
        )
    })
    
    const isSubmitDisabled = (() => {
        const checkedCount = isChecked.reduce((acc,cur) => {
            if(cur) return acc+1;
            return acc;
        },0);
        return (checkedCount > 1) ? false : true;
    })();

    const handleSubmit = () => {
        const results = seriesItems.filter((s,i) => isChecked[i] === true).map(s => s.アイテム);
        handleReturnSeriese(results);
    }

    return {
        ListItemNodes: ListItemNodes,
        isSubmitDisabled: isSubmitDisabled,
        handleSubmit: handleSubmit
    }
}

export default SeriesRecipeSelect;
