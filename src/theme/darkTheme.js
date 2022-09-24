import { deepPurple, grey } from '@mui/material/colors';

const darkTheme = {
    palette: {
        mode: 'dark',
        primary: {
            light: deepPurple[400],
            main: deepPurple[600],
            dark: deepPurple[800],
            contrastText: grey[100]
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: deepPurple[900],
                    // backgroundColor: '#000',
                }
            }
        },
    }
};

export default darkTheme;