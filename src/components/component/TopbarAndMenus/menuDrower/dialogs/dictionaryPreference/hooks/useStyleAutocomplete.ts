import {
    makeStyles,
    createStyles,
    Theme}  from '@material-ui/core/styles';

const useStyleAutocomplete = makeStyles((theme:Theme) => createStyles({
    root:{
        width:"40em",
        maxWidth:"100%"
    }
}));

export default useStyleAutocomplete;
