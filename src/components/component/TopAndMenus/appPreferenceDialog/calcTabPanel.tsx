import React from 'react';

import ListItemInSwitch     from './listItemInSwitch';

import Box          from '@material-ui/core/Box';
import Paper        from '@material-ui/core/Paper';
import List         from '@material-ui/core/List';
import Typography   from '@material-ui/core/Typography';
import {
    makeStyles,
    createStyles,
    Theme}  from '@material-ui/core/styles';
const useStyle = makeStyles((theme:Theme) => createStyles({
    rootBox: {
        flexDirection:"column",
        width:"100%"
    },
    paper: {
        width: "100%"
    },
    list:{
        marginBottom:theme.spacing(2),
        minWidth:"380px"
    }
}))

type tAppTabPanel = {
    isDisplay:boolean,
    listItemClassName: string,
    status:{
        isUseWarNpc: boolean
    }
    handler:{
        switch: (terminus?:boolean) => void,
    }
}
const AppTabPanel:React.FC<tAppTabPanel> = (props) => {
    const classes = useStyle();

    if(! props.isDisplay) return null;
    
    return (
        <Box className={classes.rootBox}>
            <Paper className={classes.paper}>
                <List
                    className={classes.list}
                    dense
                    subheader={<Typography variant="subtitle1">販売情報</Typography>}
                >
                    <ListItemInSwitch
                        helpText={<Typography variant="body2">War Ageの販売情報を計算結果に含めます。</Typography>}
                        isChecked={props.status.isUseWarNpc}
                        onClick={props.handler.switch.bind(null,undefined)}
                        listItemClassName={props.listItemClassName}
                    >
                        War販売物の利用
                    </ListItemInSwitch>
                </List>
            </Paper>
        </Box>
    )
}

export default AppTabPanel;
