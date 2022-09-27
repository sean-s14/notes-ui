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
        MuiInputLabel: {
            styleOverrides: {
                root: ({ ownerState }) => {
                    // console.log("Owner State:", ownerState);
                    return {
                        '&.Mui-focused': {
                            color: deepPurple[300],
                        }
                    }
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&::after': {
                        borderColor: deepPurple[300],
                    },
                },
            }
        },

    }
};

export default darkTheme;