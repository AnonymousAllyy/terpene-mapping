import {styled} from '@mui/material/styles';
import {Switch, SwitchProps} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CustomSwitch = styled((props: SwitchProps) => (
    <Switch
        icon={<CancelIcon style={{color: 'red'}}/>}
        checkedIcon={<CheckCircleIcon style={{color: 'green'}}/>}
        {...props}
    />
))(({theme}) => ({
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