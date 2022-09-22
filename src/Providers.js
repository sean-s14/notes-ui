import App from './App';
// import './App.css';

// import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, ToggleTheme } from 'contexts/exports';


// const darkTheme = createTheme({
//     palette: { mode: "dark" },
//     typography: { fontFamily: "Nunito, Roboto, Arial" },
// })

export default function Provider({children}) {

    return (
        <AuthProvider>
            <ToggleTheme>
            {/* <ThemeProvider theme={darkTheme}> */}
                <CssBaseline /> {/* To apply the above theme */}
                <App />
            {/* </ThemeProvider> */}
            </ToggleTheme>
        </AuthProvider>
    )
}