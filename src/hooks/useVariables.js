import { useTheme } from '@mui/material';


const useVariables = () => {
    const theme = useTheme();

    return {
        drawerWidth: 200,
        drawerWidthClosed: `calc(${theme.spacing(8)} + 1px)`,
        appBarHeight: 80,
        mobile: '600px',
    }
}

export default useVariables;