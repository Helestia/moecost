import React        from 'react';

import ListItem     from '@material-ui/core/ListItem';
import Tooltip      from '@material-ui/core/Tooltip';
import Switch       from '@material-ui/core/Switch';
import Box          from '@material-ui/core/Box'
import {
    createStyles,
    makeStyles,
    Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    root: {
        display: "flex",
        [theme.breakpoints.up("sm")]: {
            paddingLeft: "3rem",
            justifyContent: "space-between"
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: "5%",
            flexDirection:"column"
        }
    },
    text: {
        textAlign: "left",
        [theme.breakpoints.down("xs")]: {
            width:"100%"
        }
    },
    switch: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            width:"100%"
        }
    }
}))

type tListItemInSwitch = {
    helpText:Exclude<React.ReactNode,undefined | null>
    isChecked: boolean,
    disabled?: boolean
    onClick:() => void
}

const ListItemInSwitch:React.FC<tListItemInSwitch> = (props) => {
    const classes = useStyles();
    return (
        <Tooltip
            arrow
            title={props.helpText}
        >
            <ListItem
                className={classes.root}
                button
                onClick={props.onClick}
            >
                <Box className={classes.text}>{props.children}</Box>
                <Box className={classes.switch}>
                    <Switch
                        checked={props.isChecked}
                        disabled={props.disabled}
                        onClick={props.onClick}
                    />
                </Box>
            </ListItem>
        </Tooltip>
    )
}

export default ListItemInSwitch;
