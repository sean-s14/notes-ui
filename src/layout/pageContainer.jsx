
import { Box, useMediaQuery } from '@mui/material';
import { useVariables } from 'hooks/exports';
// import { useEffect } from 'react';

const PageContainer = ({children, style}) => {

    const vars = useVariables();
    const mobile = useMediaQuery(`(min-width: ${vars.mobile})`)

    // useEffect( () => {
    //     console.log("Variables:", Variables());
    // }, [])

    return (
        <Box
            sx={{
                marginTop: vars.appBarHeight + 'px',
                marginLeft: mobile ? vars.drawerWidthClosed : '0px',
                p: "10px",
                ...style
            }}
        >
            {children}
        </Box>
    )
}

export { PageContainer };