import React from 'react'
import {SeriesCreationItems,tJSON_seriesCreationItem_item} from '../../../scripts/jsonReader'

import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
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

const useStyles = makeStyles((theme:Theme)=>createStyles({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    cord : {
        width: "440px",
        maxWidth: "100%"
    },
    listItem: {
        paddingTop:0,
        paddingBottom:0
    },
    button: {
        margin: theme.spacing(1)
    }
}));

type RenderSeriesItemSelectorProps = {
    seriesName : string,
    handleReturnSeriese : (items:string[]) => void
}
const RenderSeriesItemSelector:React.FC<RenderSeriesItemSelectorProps> = (props) => {
    const {
        ListItemNodes,
        isSubmitDisabled,
        handleSubmit} = useRenderSeriesItemSelector(props.seriesName,props.handleReturnSeriese);
    const classes = useStyles();
    
    if(props.seriesName === "") return null

    return (
        <Box className={classes.root}>
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
        </Box>
    )
}


type tUseRenderSeriesItemSelectorReturn = {
    ListItemNodes: React.ReactNodeArray,
    isSubmitDisabled: boolean,
    handleSubmit: () => void,
}
type tUseRenderSeriesItemSelector = (
    seriesName:string,
    handleReturnSeriese : (items:string[]) => void)
        => tUseRenderSeriesItemSelectorReturn
const useRenderSeriesItemSelector:tUseRenderSeriesItemSelector = (seriesName,handleReturnSeriese) => {
    const [seriesItems,setSeriesItems] = React.useState<tJSON_seriesCreationItem_item[]>([]);
    const [isChecked,setIsChecked] = React.useState<boolean[]>([]);
    const classes = useStyles();
    
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
                key={`RenderSeriesItemSelectorer_${s.接頭}_${s.アイテム}`}
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

export default RenderSeriesItemSelector;
