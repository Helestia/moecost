import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

type tListItemButton = {
    helpText:Exclude<React.ReactNode,undefined | null>
    listItemClassName: string,
    handleClick: () => void
}

const ListItemButton:React.FC<tListItemButton> = (props) => (
    <Tooltip
        title={props.helpText}
    >
        <ListItem
            className={props.listItemClassName}
            button
            onClick={props.handleClick}
        >
            <ListItemText>
                {props.children}
            </ListItemText>
        </ListItem>
    </Tooltip>
);

export default ListItemButton;
