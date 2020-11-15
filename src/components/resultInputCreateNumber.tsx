import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { tNoStackCalcRouteResult, tTreeNode } from '../scripts/calc';

type tResultInputCreateNumber = {
    isOpen:boolean,
    recipeName:string,
    mainTrees:tTreeNode,
    minimumNumber:number,
    surplusCalcRoute:tNoStackCalcRouteResult,
    returnFunc: (number:number, surplusCalcRoute:tNoStackCalcRouteResult) => void
}
const ResultInputCreateNumber:React.FC<tResultInputCreateNumber> = (props) => {
    const [isDialogOpen,setIsDialogOpen] = React.useState<boolean>(props.isOpen);
    const [surplus,useSurplus] = React.useState<tNoStackCalcRouteResult>(props.surplusCalcRoute);
    const [createNumber,useCreateNumber] = React.useState<number>(0);
    if(props.mainTrees.調達方法 === "作成"){
        if(props.mainTrees.個数.作成個数 !== createNumber){
            useCreateNumber(props.mainTrees.個数.作成個数);
        }
    }

    return (
        <></>
    )
}

export default ResultInputCreateNumber;