import React from 'react'
import moecostDb,{iDisplay} from '../scripts/storage';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

type tConfigDisplayDialog = {
    isOpen : boolean,
    close : () => void,
    changeUseDarkMode : () => Promise<void>
}

const ConfigDisplayDialog:React.FC<tConfigDisplayDialog> = (props) => {
    const [isDarkMode,setIsDarkMode] = React.useState(moecostDb.表示設定.ダークモード);
    const [isSimpleMode,setIsSimpleMode] = React.useState(moecostDb.表示設定.簡易表示);
    const [isHiddenS,setIsHiddenS] = React.useState(moecostDb.表示設定.初期非表示設定.概要);
    const [isHiddenCL,setIsHiddenCL] = React.useState(moecostDb.表示設定.初期非表示設定.生成アイテム一覧);
    const [isHiddenML,setIsHiddenML] = React.useState(moecostDb.表示設定.初期非表示設定.素材_余剰生産品_副産物一覧);
    const [isHiddenCT,setIsHiddenCT] = React.useState(moecostDb.表示設定.初期非表示設定.生産ツリー);

    const handleChangeA = () => {
        const result : iDisplay = {
            "ダークモード" : isDarkMode,
            "簡易表示" : isSimpleMode,
            "初期非表示設定" : {
                "概要" : isHiddenS,
                "生成アイテム一覧" : isHiddenCL,
                "素材_余剰生産品_副産物一覧" : isHiddenML,
                "生産ツリー" : isHiddenCT
            }
        }
        const isCallChange = (result.ダークモード !== moecostDb.表示設定.ダークモード) ? true : false;
        if(JSON.stringify(moecostDb.表示設定) !== JSON.stringify(result)){
            moecostDb.registerDisplay(result)
        }
        if(isCallChange){
            props.changeUseDarkMode();
        }
    }
    handleChangeA();

    const handleChange = async (event:React.ChangeEvent<HTMLInputElement>,propFunc:React.Dispatch<React.SetStateAction<boolean>>) => {
        propFunc(event.target.checked);
    }

    return (
        <Dialog 
            open={props.isOpen}
            onClose={props.close}
        >
            <Box marginX={2}>
                <DialogTitle>表示設定変更</DialogTitle>
                <FormGroup>
                    <FormLabel>一般</FormLabel>
                    <FormControlLabel
                        label="ダークモード使用"
                        labelPlacement="start"
                        control={
                            <Switch checked={isDarkMode} onChange={(e)=> handleChange(e,setIsDarkMode)} />
                        }
                    />
                    <FormControlLabel
                        label="生産ツリーの簡易表示"
                        labelPlacement="start"
                        control={
                            <Switch checked={isSimpleMode} onChange={(e)=> handleChange(e,setIsSimpleMode)} />
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel style={{marginTop:25}}>初期状態での非表示設定</FormLabel>
                    <FormControlLabel
                        label="概要"
                        labelPlacement="start"
                        control={
                            <Switch checked={isHiddenS} onChange={(e)=> handleChange(e,setIsHiddenS)} />
                        }
                    />
                    <FormControlLabel
                        label="生産品一覧"
                        labelPlacement="start"
                        control={
                            <Switch checked={isHiddenCL} onChange={(e)=> handleChange(e,setIsHiddenCL)} />
                        }
                    />
                    <FormControlLabel
                        label="素材・余剰生産品・副産物一覧"
                        labelPlacement="start"
                        control={
                            <Switch checked={isHiddenML} onChange={(e)=> handleChange(e,setIsHiddenML)} />
                        }
                    />
                    <FormControlLabel
                        label="生産ツリー"
                        labelPlacement="start"
                        control={
                            <Switch checked={isHiddenCT} onChange={(e)=> handleChange(e,setIsHiddenCT)} />
                        }
                    />
                </FormGroup>
            </Box>
        </Dialog>
    )
}

export default ConfigDisplayDialog;
