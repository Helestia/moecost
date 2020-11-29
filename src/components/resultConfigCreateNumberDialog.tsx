import React from 'react';
import { tQtyRoleResult } from '../scripts/buildTree';
import { numDeform } from '../scripts/common'

import Box                      from '@material-ui/core/Box';
import Button                   from '@material-ui/core/Button'
import Dialog                   from '@material-ui/core/Dialog';
import DialogTitle              from '@material-ui/core/DialogTitle';
import TextField                from '@material-ui/core/TextField';
import Slider                   from '@material-ui/core/Slider';
import FormControlLabel         from '@material-ui/core/FormControlLabel';
import FormLabel                from '@material-ui/core/FormLabel';
import Radio                    from '@material-ui/core/Radio';
import RadioGroup               from '@material-ui/core/RadioGroup';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles'

const useClasses = makeStyles((theme:Theme)=> 
    createStyles({
        root:{
            padding:"2%"
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
    const [number,setNumber] = React.useState<number>(props.number);
    const [route,setRoute] = React.useState<tQtyRoleResult>(props.route);
    const [sliderMaxState,setSliderMaxState] = React.useState<number>(0)
    const classes = useClasses();

    const sliderOptions:number[] = (()=> {
        if(route === "surplus") return sliderOptionsSurplus;
        const result:number[] = []
        // 5コンバイン
        result.push(props.minimumNumber * 5);
        // 15コンバイン
        result.push(props.minimumNumber * 15);
        // 500未満で最大
        const min500 = Math.floor(500 / props.minimumNumber) * props.minimumNumber;
        if(props.minimumNumber*15 < min500) result.push(min500);
        // 1000未満で最大
        const min1000 = Math.floor(1000 / props.minimumNumber) * props.minimumNumber;
        if(props.minimumNumber*15 < min1000) result.push(min1000);
        // 2000未満で最大
        const min2000 = Math.floor(2000 / props.minimumNumber) * props.minimumNumber;
        if(props.minimumNumber*15 < min2000) result.push(min2000);
        return result;
    })();

    // 初期化処理
    if((! befOpen) && props.isOpen){
        setNumber(props.number);
        setRoute(props.route);

        const sliderMax = sliderOptions.find(n => props.number < n);
        if(sliderMax) setSliderMaxState(sliderMax);
        else setSliderMaxState(0);

        setBefOpen(true);
    }

    // ダイアログクローズ
    const closeDialog = () => {
        setBefOpen(false);
        props.close();
    }

    // 結果送信&ダイアログクローズ
    const sendResult = () => {
        props.changeTrigger(number,route);
        closeDialog();
    }

    const handleNumberInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setNumber(Number(e.target.value));
    }
    const handleNumberInputBlur = (e:React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(route === "fully"){
            const mvr = Number(e.target.value) % props.minimumNumber;
            if(mvr !== 0){
                const result = Number(e.target.value) - mvr;
                e.target.value = String(result);
                setNumber(result);
            }
        }
    }

    const handleNumberSlider = (e:React.ChangeEvent<{}>, value:number| number[]) => {
        if(typeof value === "number"){
            setNumber(value);
        } else {
            setNumber(value[0]);
        }
    }

    const handleChangeSliderRadio = (num:number) => (e:React.ChangeEvent<HTMLInputElement>,checked:boolean) => {
        console.log(checked);
        console.log(num);
        if(! checked) return;

        if(num === 0) setSliderMaxState(number);
        else setSliderMaxState(num);
        if(num < number && num !== 0){
            setNumber(num);
        }
    }

    const handleChangeRoute = (route:tQtyRoleResult) => (e:React.ChangeEvent<HTMLInputElement>,checked:boolean) => {
        if(checked) setRoute(route);
    }

    // スライダーに変数が多いので、専用関数を作成
    const dispSlider = () => {
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
        const max=sliderMaxState;
        const step = (route === "fully") ? props.minimumNumber : 1
        const marks= (max > 5) ? createMarks(max) : true;
        return <Slider
            value={number}
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
            <RadioGroup>
                <Box display="flex" alignItems="center">
                {
                    sliderOptions.map(n => 
                        <FormControlLabel
                            key={"resultConfigCreateNumberDialog_ListNo_" + n}
                            label={numDeform(n)}
                            control={<Radio size="small" onChange={handleChangeSliderRadio(n)} />}
                            checked={n === sliderMaxState} />
                    )
                }
                <FormControlLabel label="指定個数" control={<Radio size="small" onChange={handleChangeSliderRadio(0)} />} checked={sliderMaxState === 0} />
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
            <Box component="div" className={classes.root}>
                <DialogTitle>作成個数変更</DialogTitle>
                <FormLabel>余剰アイテムの対応</FormLabel>
                <RadioGroup name="surplus">
                    <Box display="flex">
                        <FormControlLabel control={<Radio onChange={handleChangeRoute("surplus")} />} value="surplus" checked={route === "surplus"} label="余剰生産有" />
                        <FormControlLabel control={<Radio onChange={handleChangeRoute("fully")} />} value="fully" checked={route === "fully"} label={"作り切り(" + numDeform(props.minimumNumber) + "セットずつ)"} />
                    </Box>
                </RadioGroup>
                <Box>
                    <FormLabel>作成個数指定</FormLabel>
                </Box>
                <TextField type="number" onChange={handleNumberInputChange} onBlur={handleNumberInputBlur} label="作成個数直接指定" size="small" margin="dense" value={number} />
                {dispSlider()}
                {renderSliderRadio()}

                <Button onClick={sendResult}>再計算</Button>
            </Box>
        </Dialog>
    )
}

export default ResultConfigCreateNumberDialog;