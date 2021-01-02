import React from 'react';
import { tQtyRoleResult } from '../scripts/buildTree';
import { numDeform } from '../scripts/common'

import Box                      from '@material-ui/core/Box';
import Button                   from '@material-ui/core/Button'
import Dialog                   from '@material-ui/core/Dialog';
import DialogTitle              from '@material-ui/core/DialogTitle';
import DialogContent            from '@material-ui/core/DialogContent';
import DialogActions            from '@material-ui/core/DialogActions'
import TextField                from '@material-ui/core/TextField';
import Slider                   from '@material-ui/core/Slider';
import FormControlLabel         from '@material-ui/core/FormControlLabel';
import FormLabel                from '@material-ui/core/FormLabel';
import Radio                    from '@material-ui/core/Radio';
import RadioGroup               from '@material-ui/core/RadioGroup';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles'

const useClasses = makeStyles((theme:Theme)=> 
    createStyles({
        dialogRoot: {
            maxHeight:"80vh",
            display:"flex",
            flexDirection:"column"
        },
        slider: {
            width:"95%",
        },
        box: {
            width:"100%",
            display: "block"
        }
    })
);

// スライダーの上限候補
const sliderOptionsSurplus:number[] = [10,100,500,1000,2000,4000]

type tResultInputCreateNumber = {
    isOpen:boolean,
    number:number,
    minimumNumber:number,
    route:tQtyRoleResult,
    close: () => void,
    changeTrigger: (number:number, route:tQtyRoleResult) => void
}

const ResultConfigCreateNumberDialog:React.FC<tResultInputCreateNumber> = (props) => {
    const [befOpen, setBefOpen] = React.useState<boolean>(false);
    const [inputedNumber,setInputedNumber] = React.useState<number>(props.number);
    const [route,setRoute] = React.useState<tQtyRoleResult>(props.route);
    const [sliderMax,setSliderMax] = React.useState<number>(0);
    const [sliderMaxIsUserConfig,setSliderMaxIsUserConfig] = React.useState(false);

    const classes = useClasses();

    const initSliderOptions : (r:tQtyRoleResult) => number[] = (r) => {
        if(r === "surplus") return sliderOptionsSurplus;
        const comb05 = props.minimumNumber * 5;
        const comb15 = props.minimumNumber * 15;
        const min500 = Math.floor(500 / props.minimumNumber) * props.minimumNumber;
        const min1000 = Math.floor(1000 / props.minimumNumber) * props.minimumNumber;
        const min2000 = Math.floor(2000 / props.minimumNumber) * props.minimumNumber;
        if(min2000 < comb15) return [comb05,comb15];
        if(min1000 < comb15) return [comb05,comb15,min2000];
        if(min500 < comb15) return [comb05,comb15,min1000,min2000];
        return [comb05,comb15,min500,min1000,min2000];
    }

    const sliderOptions = initSliderOptions(route);

    const registerSliderMax: (order:number,options:number[]) => void = (order,options) => {
        const maxOptions = options.find(op => op > order);
        if(maxOptions === undefined){
            setSliderMax(order);
            setSliderMaxIsUserConfig(true);
        } else {
            setSliderMax(maxOptions);
            setSliderMaxIsUserConfig(false);
        }
    }
    const changeInputedNumber: (nextNumber:number) => void = (nextNumber) => {
        setInputedNumber(nextNumber);
        if(sliderMaxIsUserConfig) setSliderMax(nextNumber);
    }

    // 初期化処理
    if((! befOpen) && props.isOpen){
        setInputedNumber(props.number);
        setRoute(props.route);

        registerSliderMax(props.number, sliderOptions);

        setBefOpen(true);
        return null;
    }

    if(befOpen && (! props.isOpen)){
        setBefOpen(false);
    }

    // ダイアログクローズ
    const closeDialog = () => props.close();

    // 結果送信 & ダイアログクローズ
    const sendResult = () => {
        props.changeTrigger(inputedNumber,route);
        closeDialog();
    }

    const handleNumberInputChange = (e:React.ChangeEvent<HTMLInputElement>) => changeInputedNumber(Number(e.target.value));

    const handleNumberInputBlur = (e:React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(route === "fully"){
            const mvr = Number(e.target.value) % props.minimumNumber;
            if(mvr !== 0) changeInputedNumber(Number(e.target.value) - mvr);
        }
    }

    const handleNumberSlider = (e:React.ChangeEvent<{}>, value:number| number[]) => {
        if(typeof value === "number") setInputedNumber(value);
        else setInputedNumber(value[0]);
    }

    const handleChangeSliderRadio:(e:React.ChangeEvent<HTMLInputElement>, value:string) => void = (e,value) => {
        const numberValue = Number(value);
        if(numberValue === -1){
            setSliderMax(inputedNumber);
            setSliderMaxIsUserConfig(true);
        } else {
            setSliderMax(numberValue);
            setSliderMaxIsUserConfig(false);
        }
    }


    const handleChangeRoute = (route:tQtyRoleResult) => (e:React.ChangeEvent<HTMLInputElement>,checked:boolean) => {
        if(checked){
            setRoute(route);
            const nextSliderOptions = initSliderOptions(route);
            const nextSliderMax = nextSliderOptions.find(so => inputedNumber <= so);
            if(nextSliderMax) setSliderMax(nextSliderMax);
            else setSliderMax(inputedNumber);
            if(route === "fully"){
                const nextNumber = Math.floor(inputedNumber / props.minimumNumber) * props.minimumNumber;
                if(nextNumber === 0) setInputedNumber(props.minimumNumber);
                else setInputedNumber(nextNumber);
            }
        }
    }

    // スライダーに変数が多いので、専用関数を作成
    const renderSlider = () => {
        const createMarks = (n:number) => {
            return [
                {
                    value:0,
                    label:0
                },
                {
                    value: Math.floor(n/5),
                    label: Math.floor(n/5)
                },
                {
                    value: Math.floor(n/5*2),
                    label: Math.floor(n/5*2)
                },
                {
                    value: Math.floor(n/5*3),
                    label: Math.floor(n/5*3)
                },
                {
                    value: Math.floor(n/5*4),
                    label: Math.floor(n/5*4)
                },
                {
                    value:n,
                    label:n
                }
            ]
        }
        const min=0;
        const max=sliderMax;
        const step = (route === "fully") ? props.minimumNumber : 1
        const marks= (max > 5) ? createMarks(max) : true;
        return <Slider
            value={inputedNumber}
            className={classes.slider}
            max={max}
            min={min}
            step={step}
            marks={marks}
            valueLabelDisplay="auto"
            onChange={handleNumberSlider} />
    }
    // スライダー上限設定用ラジオボタン群
    const renderSliderRadio = () => {
        
        return (
            <RadioGroup onChange={handleChangeSliderRadio}>
                <Box display="flex" alignItems="center" flexWrap="wrap">
                {
                    sliderOptions.map(n => 
                        <FormControlLabel
                            key={"resultConfigCreateNumberDialog_ListNo_" + n}
                            label={numDeform(n)}
                            value={String(n)}
                            control={<Radio size="small" />}
                        />
                    )
                }
                <FormControlLabel label="指定個数" control={<Radio size="small" />} value="-1" />
                </Box>
            </RadioGroup>
        )
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth="lg">
            <Box component="div" className={classes.dialogRoot}>
                <DialogTitle>作成個数変更</DialogTitle>
                <DialogContent>
                    <FormLabel>余剰アイテムの対応</FormLabel>
                    <RadioGroup name="surplus">
                        <Box display="flex" flexWrap="wrpa">
                            <FormControlLabel control={<Radio onChange={handleChangeRoute("surplus")} />} value="surplus" checked={route === "surplus"} label="余剰生産有" />
                            <FormControlLabel control={<Radio onChange={handleChangeRoute("fully")} />} value="fully" checked={route === "fully"} label={"作り切り(" + numDeform(props.minimumNumber) + "セットずつ)"} />
                        </Box>
                    </RadioGroup>
                    <Box>
                        <FormLabel>作成個数指定</FormLabel>
                    </Box>
                    <TextField
                        type="number"
                        onChange={handleNumberInputChange}
                        onBlur={handleNumberInputBlur}
                        label="作成個数直接指定"
                        size="small"
                        margin="dense"
                        value={inputedNumber}
                        helperText="0指定時は、条件を満たす最小個数"
                    />
                    {renderSlider()}
                    {renderSliderRadio()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="default">キャンセル</Button>
                    <Button onClick={sendResult} color="primary">再計算</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default ResultConfigCreateNumberDialog;
