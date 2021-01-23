import React     from 'react';
import {History} from '../../../../../scripts/jsonReader';

import DialogNormal from '../../../../commons/dialog/dialogNormal';

import Box          from '@material-ui/core/Box'
import Typography   from '@material-ui/core/Typography';

type tChangeLog = {
    isOpen : boolean,
    close:() => void
}

const DispChangeLogDialog:React.FC<tChangeLog> = (props) => (
    <DialogNormal
        isOpen={props.isOpen}
        handleClose={props.close}
        title={
            <>
                <Typography variant="h4">開発状況・ログ</Typography>
                <Typography variant="h6">version.{History.version}</Typography>
            </>
        }
        maxWidth="md"
    >
        {History.history.map((h,index) => {
            return (
                <Box key={"history-" + index}>
                    <Typography key={index} variant="subtitle1">[ver.{h.version}] {h.更新日}</Typography>
                    <ul>
                        {h.更新内容.map((updateText,index2)=>{
                            return (
                                <li key={"history-" +index + "-" + index2}>{updateText}</li>
                            )
                        })}
                    </ul>
                </Box>
            )
        })}
    </DialogNormal>
)

export default DispChangeLogDialog