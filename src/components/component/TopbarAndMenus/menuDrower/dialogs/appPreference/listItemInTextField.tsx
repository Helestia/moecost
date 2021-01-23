import React        from 'react';

import ListItem     from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip      from '@material-ui/core/Tooltip';
import TextField    from '@material-ui/core/TextField';

type tListItemInTextField = {
    helpText:Exclude<React.ReactNode,undefined | null>
    value: Number,
    listItemClassName: string,
    handleChange: (event:React.ChangeEvent<HTMLInputElement>) => void
}

const ListItemInTextField:React.FC<tListItemInTextField> = (props) => {
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
                className={props.listItemClassName}
                button
                onClick={handleClick}
            >
                <ListItemText>{props.children}</ListItemText>
                <TextField
                    type="number"
                    size="small"
                    label="候補表示数"
                    inputRef={textFieldRef}
                    value={props.value}
                    onChange={props.handleChange}
                />
            </ListItem>
        </Tooltip>
    )
}

export default ListItemInTextField;
