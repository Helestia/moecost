import React from 'react';

import {tMessage}           from '../../../scripts/buildTrees/commonTypes';

import {Alert, AlertTitle}  from '@material-ui/lab'
import Box                  from '@material-ui/core/Box'
import Typography           from '@material-ui/core/Typography'
import {makeStyles}         from '@material-ui/styles';

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

type tRenderAlerts = {
    messages:tMessage[]
}
const RenderAlerts:React.FC<tRenderAlerts> = (props) => {
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

export default RenderAlerts;
