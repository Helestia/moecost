import React from 'react';
import {tResultMessage} from '../scripts/calc';
import {Alert, AlertTitle} from '@material-ui/lab'
import Box from '@material-ui/core/Box'
import {makeStyles} from '@material-ui/styles';

interface iResultAlertSection {
    messages:tResultMessage[]
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: "750px"
    },
    alertClass: {
        marginTop: "1rem",
        marginBottom: "1rem"
    }
})


const ResultAlertSection:React.FC<iResultAlertSection> = (props) => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            {
                props.messages.map(message => {
                    return (
                        <Alert
                            className={classes.alertClass}
                            severity={message.重大度 === "critical" ? "error" : message.重大度}
                            variant="standard">
                            <AlertTitle>{message.タイトル}</AlertTitle>
                            {message.メッセージ.map(text => {
                                return <><p>{text}</p></>
                            })}
                        </Alert>
                    )
                })
            }
        </Box>
    )
}

export default ResultAlertSection;
