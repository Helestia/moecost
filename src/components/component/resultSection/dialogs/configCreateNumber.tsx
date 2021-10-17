import React from 'react';
import { tQtyRoleResult } from '../../../../scripts/buildTrees/commonTypes';
import { numDeform } from '../../../../scripts/common';

import DialogNormal from '../../../commons/dialog/dialogNormal';

import Box                      from '@material-ui/core/Box';
import Button                   from '@material-ui/core/Button';
import TextField                from '@material-ui/core/TextField';
import Slider                   from '@material-ui/core/Slider';
import FormControlLabel         from '@material-ui/core/FormControlLabel';
import FormLabel                from '@material-ui/core/FormLabel';
import Radio                    from '@material-ui/core/Radio';
import RadioGroup               from '@material-ui/core/RadioGroup';

import {
    createStyles,
    makeStyles,
    Theme} from '@material-ui/core/styles';

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

type tRenderConfigQty = {
    isOpen:boolean,
    quantity:number,
    minimumQty:number,
    role:tQtyRoleResult,
    close: () => void,
    changeQty: (number:number, role:tQtyRoleResult) => void
}

const RenderConfigQty:React.FC<tRenderConfigQty> = (props) => {
    const hooks = useResultConfigQtyDialog(
        props.quantity,
        props.minimumQty,
        props.role,
        props.close,
        props.changeQty)

    const classes = useClasses();

    // スライダー描画
    const renderSlider = (() => {
        const marks = (() => {
            const serial = [...Array(5)].map((_,i) => i + 1) // [1,2,3,4,5]
            const valueAndLabels = [0].concat(serial.map(s => Math.ceil(hooks.sliderMax / 5 * s)));
            const deduplication = Array.from(new Set(valueAndLabels));
            return deduplication.map(n => {
                return {value:n, label:n}
            });
        })();

        return <Slider
            value={hooks.quantity}
            className={classes.slider}
            min={0}
            max={hooks.sliderMax}
            step={(hooks.selectedRole === "fully") ? props.minimumQty : 1}
            marks={marks}
            valueLabelDisplay="auto"
            onChange={hooks.handles.handleChangeSlider}
        />
    })();
    // スライダー上限設定ラジオ群
    const renderSliderMaxRadio = (() => {
        const value = hooks.sliderMaxIsInputed ? "-1" : String(hooks.sliderMax);
        return (
            <RadioGroup
                value={value}
                onChange={hooks.handles.handleChangeRadio_sliderMax}
            >
                <Box display="flex" alignItems="center" flexWrap="wrap">
                    {
                        hooks.sliderOptions.map(option => 
                            <FormControlLabel
                                key={`resultConfigCreatrerNumberDialog_SliderOptions_${option}`}
                                label={numDeform(option)}
                                value={String(option)}
                                control={<Radio size="small" />}                                
                            />
                        )
                    }
                    <FormControlLabel
                        label="指定個数"
                        value="-1"
                        control={<Radio size="small" />}
                        onClick={hooks.handles.handleClickRadio_Inputed}
                    />
                </Box>
            </RadioGroup>
        )
    })()


    return (
        <DialogNormal
            isOpen={props.isOpen}
            title="作成個数変更"
            maxWidth="lg"
            actions={(
                <>
                    <Button onClick={props.close} color="default">キャンセル</Button>
                    <Button onClick={hooks.handles.handleSubmit} color="primary">再計算</Button>
                </>
            )}
            handleClose={props.close}
            initialize={hooks.handles.handleInitialize}
        >
            <FormLabel>余剰アイテムの対応</FormLabel>
            <RadioGroup>
                <Box
                    display="flex"
                    flexWrap="wrpa"
                >
                    <FormControlLabel
                        control={
                            <Radio
                                onChange={hooks.handles.handleChangeRadio_role("surplus")} 
                            />
                        }
                        value="surplus"
                        checked={hooks.selectedRole === "surplus"}
                        label="余剰生産有"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                onChange={hooks.handles.handleChangeRadio_role("fully")}
                            />
                        }
                        value="fully"
                        checked={hooks.selectedRole === "fully"}
                        label={"作り切り(" + numDeform(props.minimumQty) + "セットずつ)"}
                    />
                </Box>
            </RadioGroup>
            <Box>
                <FormLabel>作成個数指定</FormLabel>
            </Box>
            <TextField
                type="number"
                onChange={hooks.handles.handleChangeQuantity}
                onBlur={hooks.handles.handleBlurQuantity}
                label="作成個数直接指定"
                size="small"
                margin="dense"
                value={hooks.quantity}
                helperText="0指定時は、条件を満たす最小個数"
            />
            {renderSlider}
            {renderSliderMaxRadio}
        </DialogNormal>
    )
}

const useResultConfigQtyDialog = (
    propQuantity:number,
    minimumNumber:number,
    role:tQtyRoleResult,
    close: () => void,
    changeQty: (number:number, role:tQtyRoleResult) => void
) => {
    const [quantity,setQuantity] = React.useState<number>(propQuantity);
    const [selectedRole,setSelectedRole] = React.useState<tQtyRoleResult>(role);
    const [sliderMax,setSliderMax] = React.useState<number>(0);
    const [sliderMaxIsInputed,setSliderMaxIsInputed] = React.useState(false);

    // スライダーオプションのリスト
    const sliderOptions = {
        surplus : [10,100,500,1000,2000,4000],
        fully: (() => {
            const comb10 = minimumNumber * 10;
            const comb100 = minimumNumber * 100;
            // 指定個数未満で最大個数となる作成個数の取得
            const calcCmobLEXXXX = (limitCreate:number) => Math.floor(limitCreate / minimumNumber) * minimumNumber;
            const combLE500 =  calcCmobLEXXXX(500);
            const combLE1000 = calcCmobLEXXXX(1000);
            const combLE2000 = calcCmobLEXXXX(2000);
            const combLE4000 = calcCmobLEXXXX(4000);
    
            // 最小作成個数 * 100 より小さな指定個数未満は対象外とする。
            if(combLE4000 <= comb100) return [comb10,comb100];
            if(combLE2000 <= comb100) return [comb10,comb100,combLE4000];
            if(combLE1000 <= comb100) return [comb10,comb100,combLE2000,combLE4000];
            if(combLE500 <= comb100)  return [comb10,comb100,combLE1000,combLE2000,combLE4000];
            return [comb10,comb100,combLE500,combLE1000,combLE2000,combLE4000];
        })()
    }

    // 初期化処理
    const handleInitialize = () => {
        setQuantity(propQuantity);
        setSelectedRole(role);
        const {sliderMax,sliderMaxIsInputed} = (() => {
            const options = sliderOptions[role];
            const sliderMax = options.find(option => option > propQuantity);
            return sliderMax
                ? {
                    sliderMax: sliderMax,
                    sliderMaxIsInputed: false
                }
                : {
                    sliderMax: propQuantity,
                    sliderMaxIsInputed: true
                }
        })()
        setSliderMax(sliderMax);
        setSliderMaxIsInputed(sliderMaxIsInputed);
    }

    // ルール変更
    const handleChangeRadio_role = (role:tQtyRoleResult) => (e:React.ChangeEvent<HTMLInputElement>,checked:boolean) => {
        if(e.target.checked){
            setSelectedRole(role);
            const newQuantity = (role === "fully")
                ? Math.floor(quantity / minimumNumber) * minimumNumber
                : quantity 
            setQuantity(newQuantity);
            const newSliderMax = sliderOptions[role].find(option => option > newQuantity);
            if(newSliderMax === undefined){
                setSliderMax(newQuantity);
                setSliderMaxIsInputed(true);
            } else {
                setSliderMax(newSliderMax);
                setSliderMaxIsInputed(false);
            }
        }
    }

    // ルール変更を伴わない個数変更処理
    const updateQuantity = (quantity:number) => {
        setQuantity(quantity);
        if(quantity > sliderMax){
            const newSliderMaxOption = sliderOptions[role].find(option => option > quantity);
            if(newSliderMaxOption === undefined){
                const newSliderMax = (role === "fully")
                    ? Math.ceil(quantity / minimumNumber) * minimumNumber
                    : quantity
                setSliderMax(newSliderMax);
                setSliderMaxIsInputed(true);
            } else {
                setSliderMax(newSliderMaxOption);
                setSliderMaxIsInputed(false);
            }
        }
    }

    const handleChangeQuantity = (event:React.ChangeEvent<HTMLInputElement>) => updateQuantity(Number(event.target.value))
    const handleBlurQuantity = (event:React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(selectedRole === "fully"){
            const mvr = Number(event.target.value) % minimumNumber;
            if(mvr !== 0) updateQuantity(Number(event.target.value) - mvr);
        }
    }

    const handleChangeSlider = (event:React.ChangeEvent<{}>, value:number|number[]) => {
        if(typeof value === "number") setQuantity(value);
        else setQuantity(value[0]);
    }

    const handleChangeRadio_sliderMax = (e:React.ChangeEvent<HTMLInputElement>, value:string) => {
        const newSliderMax = Number(value);
        if(newSliderMax === -1){
            setSliderMax(quantity);
            setSliderMaxIsInputed(true);
        } else {
            setSliderMax(newSliderMax);
            setSliderMaxIsInputed(false);
            if(newSliderMax < quantity) setQuantity(newSliderMax);
        }
    }

    const handleClickRadio_Inputed = (event:React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        if(! sliderMaxIsInputed) return;
        setSliderMax(quantity);
    }

    const handleSubmit = () => {
        changeQty(quantity,selectedRole);
        close();
    }

    return {
        quantity: quantity,
        selectedRole: selectedRole,
        sliderMax: sliderMax,
        sliderMaxIsInputed: sliderMaxIsInputed,
        sliderOptions: sliderOptions[selectedRole],
        handles: {
            handleInitialize: handleInitialize,
            handleChangeRadio_role: handleChangeRadio_role,
            handleChangeQuantity: handleChangeQuantity,
            handleBlurQuantity: handleBlurQuantity,
            handleChangeSlider: handleChangeSlider,
            handleChangeRadio_sliderMax: handleChangeRadio_sliderMax,
            handleClickRadio_Inputed: handleClickRadio_Inputed,
            handleSubmit: handleSubmit
        }
    }
}

export default RenderConfigQty;
