import React        from 'react';

import ListItem     from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip      from '@material-ui/core/Tooltip';
import Switch       from '@material-ui/core/Switch';

type tListItemInSwitch = {
    helpText:Exclude<React.ReactNode,undefined | null>
    isChecked: boolean,
    listItemClassName: string,
    disabled?: boolean
    onClick:() => void
}

const ListItemInSwitch:React.FC<tListItemInSwitch> = (props) => (
    <Tooltip
        arrow
        title={props.helpText}
    >
        <ListItem
            className={props.listItemClassName}
            button
            onClick={props.onClick}
        >
            <ListItemText>{props.children}</ListItemText>
            <Switch
                checked={props.isChecked}
                disabled={props.disabled}
                onClick={props.onClick}
            />
        </ListItem>
    </Tooltip>
)

export default ListItemInSwitch;
