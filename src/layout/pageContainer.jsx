
// import { useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useVariables } from 'hooks/exports';
// import LoadingScreen from 'LoadingScreen';


const PageContainer = ({children, style}) => {

    const theme = useTheme();
    const vars = useVariables();
    const mobile = useMediaQuery(`(min-width: ${vars.mobile})`)
    // const { isLoading } = useAuthData();

    // useEffect( () => console.log("Variables:", Variables()), []);

    // if (isLoading) return <LoadingScreen />;

    return (
        <Box
            sx={{
                marginTop: vars.appBarHeight + 'px',
                marginLeft: mobile ? vars.drawerWidthClosed : '0px',
                p: "10px",
                // bgcolor: theme.palette.mode === 'dark' ? '#0E0B16' : '#E7DFDD',
                bgcolor: theme.palette.mode === 'dark' ? 'rgb(10, 7, 18)' : '#E7DFDD',
                minHeight: `calc(100vh - ${vars.appBarHeight}px)`,
                maxWidth: mobile ? `calc(100vw - ${vars.drawerWidthClosed})` : 'auto',
                ...style
            }}
        >
            {children}
        </Box>
    )
}

export { PageContainer };