import {
    createStyles,
    makeStyles,
    Theme} from '@material-ui/core/styles';

const useStyleHover = makeStyles((theme:Theme) => createStyles({
    hover: {
        '&:hover': {
            backgroundColor : theme.palette.action.hover,
            cursor: "pointer"
        }
    }
}))

export default useStyleHover;
