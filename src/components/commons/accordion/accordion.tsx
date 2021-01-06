import React from 'react';

import MuiAccordion        from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionActions from '@material-ui/core/AccordionActions';

import ExpandMoreIcon   from '@material-ui/icons/ExpandMore';

type tAccordion = {
    expanded:boolean,
    summary: React.ReactNode,
    actions?: React.ReactNode,
    disabled?: boolean
    onChange:() => void,
    initialize?:() => void
}

const Accordion:React.FC<tAccordion> = (props) => {
    const isInit = useAccordion(props.expanded);

    if(isInit && props.initialize) props.initialize()

    const disabled = props.disabled ? true : false

    return (
        <MuiAccordion
            expanded={props.expanded}
            onChange={props.onChange}
            disabled={disabled}
        >
            <MuiAccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                {props.summary}
            </MuiAccordionSummary>
            <MuiAccordionDetails>
                {props.children}
            </MuiAccordionDetails>
            {(props.actions)
                ? (
                    <MuiAccordionActions>
                        {props.actions}
                    </MuiAccordionActions>
                )
                : null
            }
        </MuiAccordion>
    )
}

const useAccordion = (isExpanded:boolean) => {
    const [befExpanded,setBefExpanded] = React.useState(false);
    if(isExpanded && (! befExpanded)){
        setBefExpanded(true);
        return true;
    }
    if((! isExpanded) && befExpanded) setBefExpanded(false);
    return false; 
}

export default Accordion;
