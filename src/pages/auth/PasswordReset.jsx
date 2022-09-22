
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { 
    Box,
    Stack,
    Button,
    TextField,
} from '@mui/material';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
// import { useAuthUpdate } from 'contexts/exports';


const PasswordResetPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    // const updateAuthData = useAuthUpdate();
    const api = useAxios();

    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [stage, setStage] = useState(0);

    useEffect( () => {
        console.log("Form:", form);
    }, [form])

    const sendEmail = () => {

        let isError = false;
        
        // Email
        if ( (!form?.email) || (form.email === '') || (form.email && form.email.length === 0) ) {
            setErrors( (e) => ({...e, email: 'Your email address is required'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['email']; return e; });
        }

        if (isError) return;

        api.patch("auth/user/reset-password/1/", JSON.stringify(form))
            .then( res => {
                console.log("Res Data:", res?.data);
                setErrors({});
                setStage(1);
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return;
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };

    const verifyCode = () => {

        let isError = false;
        
        // Code
        if ( (!form?.code) || (form.code === '') || (form.code && form.code.length === 0) ) {
            setErrors( (e) => ({...e, code: 'A code is required'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['code']; return e; });
        }

        if (isError) return;

        api.patch("auth/user/reset-password/2/", JSON.stringify(form))
            .then( res => {
                console.log("Res Data:", res?.data);
                setErrors({});
                setStage(2);
            })
            .catch( err => {
                console.log("Err:", err);
                if (!err?.response?.data) return;
                if (!err?.response?.status) return;
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };

    const updatePass = () => {

        let isError = false;
        
        // New Password
        if ( 
            (!form?.new_password) || 
            (form.new_password === '') || 
            (form.new_password && form.new_password.length === 0)
        ) {
            setErrors( (e) => ({...e, new_password: 'A new password is required'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['new_password']; return e; });
        }
        
        // New Password 2
        if ( 
            (!form?.new_password2) || 
            (form.new_password2 === '') || 
            (form.new_password2 && form.new_password2.length === 0)
        ) {
            setErrors( (e) => ({...e, new_password2: 'Matching password is required'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['new_password2']; return e; });
        }

        if (isError) return;

        api.patch("auth/user/reset-password/3/", JSON.stringify(form))
            .then( res => {
                console.log("Res Data:", res?.data);
                setErrors({});
                navigate("/", { replace: true });
            })
            .catch( err => {
                console.log("Err:", err);
                if (!err?.response?.data) return;
                if (!err?.response?.status) return;
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };


    return (
        <PageContainer
            style={styles.PageContainer}
        >
            <h1>
                { stage === 0 && 'Enter your email' }
                { stage === 1 && 'Enter code' }
                { stage === 2 && 'Reset Password' }
            </h1>

            <Stack 
                spacing={2}
                direction="column"
                sx={styles.StackStyle}
            >
                {   Object.keys(errors).length > 0 && 
                    !Object.keys(errors).includes(['email', 'code', 'new_password', 'new_password2']) &&
                    <Box 
                        sx={{
                            backgroundColor: theme.palette.error.dark,
                            borderRadius: '.3rem',
                            p: 1,
                        }}
                    >
                        { Object.values(errors).map( (txt, index) => 
                            <Box key={index}>{txt}</Box>
                        )}
                    </Box>
                }
                { stage === 0 
                    ?   <>
                            <TextField 
                                error={ !!errors?.email }
                                helperText={ errors?.email }
                                value={ form.email || '' } 
                                onChange={ (e) => setForm({...form, email: e.target.value}) }
                                label={'email'}
                                required={true}
                            />
                            <Button 
                                variant="contained" 
                                onClick={ sendEmail }
                            >
                                Send Email
                            </Button>
                        </>
                    : stage === 1
                    
                    ?   <>
                            <TextField 
                                error={ !!errors?.code }
                                helperText={ errors?.code }
                                value={ form.code || '' } 
                                onChange={ (e) => setForm({...form, code: e.target.value}) }
                                label={'code'}
                                required={true}
                            />
                            <Button 
                                variant="contained" 
                                onClick={ verifyCode }
                            >
                                Verify Code
                            </Button>
                        </>

                    : stage === 2
                    
                    ?   <>
                            <TextField 
                                error={ !!errors?.new_password }
                                helperText={ errors?.new_password }
                                value={ form.new_password || '' } 
                                onChange={ (e) => setForm({...form, new_password: e.target.value}) }
                                label={'new password'}
                                type={"password"}
                                required={true}
                            />
                            <TextField 
                                error={ !!errors?.new_password2 }
                                helperText={ errors?.new_password2 }
                                value={ form.new_password2 || '' } 
                                onChange={ (e) => setForm({...form, new_password2: e.target.value}) }
                                label={'new password again'}
                                type={"password"}
                                required={true}
                            />
                            <Button 
                                variant="contained" 
                                onClick={ updatePass }
                            >
                                Reset Password
                            </Button>
                        </>
                    
                    :   <>
                            <div>Something went wrong. Refresh page to start again.</div>
                        </>
                }
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
        width: '18rem',
        '& > *': {
            color: theme.palette.mode === 'dark' && theme.palette.primary.light,
            fontSize: '1rem',
            '& > input': {
                fontSize: '1.3rem',
                color: 'inherit'
            }
        },
    },
})

export default PasswordResetPage;