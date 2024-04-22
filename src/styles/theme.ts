import {createTheme} from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#26ace2',
        },
        secondary: {
            main: '#c0c0c0',
        },
        success: {
            main: '#60c761',
        },
    },
    // Add more customizations as needed
});

export default theme;