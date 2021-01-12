import React from 'react'

import MuiAppBar        from '@material-ui/core/AppBar';
import MuiTabs          from '@material-ui/core/Tabs';
import MuiTab           from '@material-ui/core/Tab';
import {
    makeStyles,
    createStyles,
    Theme}              from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    disableTab: {
        backgroundColor: theme.palette.action.disabled
    }
}));

export type tTabState = {
    value: string,
    label: React.ReactNode,
    disabled?: boolean
}

type tTabs = {
    value:string
    tabInfo:tTabState[],
    reactKeyPrefix: string,
    handleChange: (event:React.ChangeEvent<{}>, value:string) => void
}

const Tabs:React.FC<tTabs> = (props) => {
    const classes = useStyles();
    return (
        <MuiAppBar
            position="static"
            color="default"
        >
            <MuiTabs
                value={props.value}
                onChange={props.handleChange}
                variant="fullWidth"
                indicatorColor="primary"
            >
                {props.tabInfo.map(info => (
                    <MuiTab
                        key={`${props.reactKeyPrefix}_${info.value}`}
                        value={info.value}
                        label={info.label}
                        disabled={info.disabled}
                        className={info.disabled ? classes.disableTab : ""}
                    />
                ))}
            </MuiTabs>
        </MuiAppBar>
    )
}

export default Tabs;
