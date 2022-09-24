import '../App.css';

import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useVariables } from 'hooks/exports';
import darkTheme from 'theme/darkTheme';
import lightTheme from 'theme/lightTheme';

const ThemeContext = createContext({ toggleTheme: () => { } });


const ToggleTheme = (props) => {

    const vars = useVariables();

    const [mode, setMode] = useState('dark');
    const colorMode = useMemo(
        () => ({
            toggleTheme: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme(
                Object.assign( 
                    {
                        typography: { fontFamily: "Nunito, Roboto, Arial" },
                        mixins: { toolbar: { minHeight: vars.appBarHeight }}
                    }, 
                    mode === 'dark' ? darkTheme : lightTheme
                    )
            ),
        [mode, vars],
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export { ToggleTheme, ThemeContext };