
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Box,
    Stack,
    Button,
    TextField,
} from '@mui/material';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
import { useAuthUpdate } from 'contexts/exports';


const VerificationPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const updateAuthData = useAuthUpdate();
    const api = useAxios();

    const navigate = useNavigate();
    let location = useLocation();
    const [form, setForm] = useState({});
    const fields = ['code'];
    const [errors, setErrors] = useState({});

    useEffect( () => console.log("Errors:", errors), [errors])
    useEffect( () => {
        console.log("Errors:", errors)
        let e = Object.entries(errors)
        console.log(e);
    }, [errors])

    useEffect( () => console.log("Form:", form), [form])

    useEffect( () => {
        console.log('Location State:', location.state);
        setForm( f => ({...f, ...location.state}) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const verify = () => {

        let isError = false;
        
        // Code
        // if ( (!!form?.code) || (form.code === '') || (form.code && form.code.length !== 6) ) {
        //     setErrors( (e) => ({...e, code: 'The code you entered is invalid'}) );
        //     isError = true;
        // } else {
        //     setErrors((e) => { delete e['code']; return e; });
        // }

        if (isError) return;

        let data = JSON.stringify(form);
        api.post("api/token/", data)
            .then( res => {
                console.log("Res?.data:", res?.data);
                res?.data && updateAuthData({tokens: res.data});
                navigate("/", { replace: true });
                setErrors({});
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return 
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>Verify Your Account</h1>

            <Stack 
                spacing={2} 
                direction="column"
                sx={styles.StackStyle}
            >
                {   
                    Object.keys(errors).filter( (key) => 
                        !fields.includes(key) 
                    ).length > 0 &&
                    <Box 
                        sx={{
                            backgroundColor: theme.palette.error.dark,
                            borderRadius: '.3rem',
                            p: 1,
                        }}
                    >
                        { Object.entries(errors).map( ([key, val], index) => 
                            !fields.includes(key) && <Box key={index}>{val}</Box>
                        )}
                    </Box>
                }
                <TextField 
                    error={ !!errors?.code }
                    helperText={ errors?.code }
                    value={ form.code || '' } 
                    onChange={ (e) => setForm({...form, code: e.target.value}) } 
                    label={'code'}
                    // type={"password"}
                    required={true}
                />
                <Button 
                    variant="contained" 
                    sx={{}}
                    onClick={ verify }
                >
                    Verify
                </Button>

            </Stack>

        </PageContainer>
    )
}

const stylesheet = (theme) => ({
    PageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    StackStyle: {
        width: '14rem',
        '& > *': {
            width: '100%',
            color: theme.palette.mode === 'dark' && theme.palette.primary.light,
            fontSize: '1rem',
            '& *': {
                fontSize: '1.3rem',
            },
            '& input': {
                textAlign: 'center',
            },
        },
    },
})

export default VerificationPage;