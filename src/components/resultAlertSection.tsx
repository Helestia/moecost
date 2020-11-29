import React from 'react';
import {tMessage} from '../scripts/buildTree';
import {Alert, AlertTitle} from '@material-ui/lab'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles';

interface iResultAlertSection {
    messages:tMessage[]
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
                props.messages.map((message,index) => {
                    return (
                        <Alert
                            key={"resultAlertSection_AlertMessage_" + index}
                            className={classes.alertClass}
                            severity={message.重大度}
                            variant="standard">
                            <AlertTitle>{message.タイトル}</AlertTitle>
                            {message.メッセージ.map((text,index) => {
                                return ( 
                                    <Typography
                                        key={"resultAlertSection_AlertMessageText_" + index}>
                                        {text}
                                    </Typography>
                                )
                            })}
                        </Alert>
                    )
                })
            }
        </Box>
    )
}

export default ResultAlertSection;
