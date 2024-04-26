import {styled} from '@mui/material/styles';
import {Switch} from '@mui/material';

const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-track': {

        '&.Mui-checked': {
            background: theme.palette.secondary.main,
            borderRight: '1px solid black',
            borderTop: '1px solid black',
        },
        '&:not(.Mui-checked)': {
            background: theme.palette.secondary.main,
            borderLeft: '1px solid black',
            borderTop: '1px solid black',
        },
    },
}));

export default CustomSwitch;