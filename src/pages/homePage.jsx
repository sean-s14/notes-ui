

// import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import { PageContainer } from "layout/pageContainer";
// import { useAxios } from 'hooks/exports';
// import { useAuthUpdate } from 'contexts/exports';


const HomePage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    // const updateAuthData = useAuthUpdate();
    // const api = useAxios();

    return (
        <PageContainer style={styles.PageContainer}>
            <h1 style={styles.H1}>Home Page</h1>
        </PageContainer>
    )
}

const stylesheet = (theme) => ({
    PageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    H1: {
        margin: 0
    }
})

export default HomePage;