import { deepPurple, grey } from '@mui/material/colors';

const lightTheme = {
    palette: {
        mode: 'light',
        primary: {
            light: deepPurple[200],
            main: deepPurple[400],
            dark: deepPurple[600],
            contrastText: grey[100]
        }
    }
};

export default lightTheme;