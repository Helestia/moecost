import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
    createStyles,
    makeStyles,
    Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    root: {
        [theme.breakpoints.up("sm")]: {
            paddingLeft: "3rem"
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: "5%"
        }
    }
}))

type tListItemButton = {
    helpText:Exclude<React.ReactNode,undefined | null>
    handleClick: () => void
}

const ListItemButton:React.FC<tListItemButton> = (props) => {
    const classes = useStyles();
    return (
        <Tooltip
            title={props.helpText}
        >
            <ListItem
                className={classes.root}
                button
                onClick={props.handleClick}
            >
                <ListItemText>
                    {props.children}
                </ListItemText>
            </ListItem>
        </Tooltip>
    );
}
export default ListItemButton;
