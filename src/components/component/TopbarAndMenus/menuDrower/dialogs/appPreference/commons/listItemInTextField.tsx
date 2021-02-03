import React        from 'react';

import ListItem     from '@material-ui/core/ListItem';
import Tooltip      from '@material-ui/core/Tooltip';
import TextField    from '@material-ui/core/TextField';
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
    inputBox: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            width:"100%"
        }
    },
    input: {
        [theme.breakpoints.down("xs")]: {
            width:"40%"
        }
    }
}));

type tListItemInTextField = {
    helpText:Exclude<React.ReactNode,undefined | null>
    value: Number,
    handleChange: (event:React.ChangeEvent<HTMLInputElement>) => void
}

const ListItemInTextField:React.FC<tListItemInTextField> = (props) => {
    const classes = useStyles();
    const textFieldRef = React.useRef<HTMLInputElement | undefined>(undefined);
    const handleClick = () => {
        if(textFieldRef === undefined) return;
        if(textFieldRef.current === undefined) return;
        textFieldRef.current.focus()
    }

    return (
        <Tooltip
            arrow
            title={props.helpText}
        >
            <ListItem
                className={classes.root}
                button
                onClick={handleClick}
            >
                <Box className={classes.text}>{props.children}</Box>
                <Box className={classes.inputBox}>
                    <TextField
                        type="number"
                        size="small"
                        label="候補表示数"
                        className={classes.input}
                        inputRef={textFieldRef}
                        value={props.value}
                        onChange={props.handleChange}
                    />
                </Box>
            </ListItem>
        </Tooltip>
    )
}

export default ListItemInTextField;
