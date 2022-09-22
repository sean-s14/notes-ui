
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
import { useAuthUpdate } from 'contexts/exports';


const NewPageTemplate = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const updateAuthData = useAuthUpdate();
    const api = useAxios();

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>New Page Template</h1>
        </PageContainer>
    )
}

const stylesheet = (theme) => ({
    PageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
})

export default NewPageTemplate;