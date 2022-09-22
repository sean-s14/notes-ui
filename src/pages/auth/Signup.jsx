
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from "react-router-dom";
import { 
    Box,
    Divider,
    Stack,
    Button,
    TextField,
} from '@mui/material';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';


const SignupPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();

    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const fields = ['username', 'email', 'password', 'password2']
    const [errors, setErrors] = useState({});

    useEffect( () => console.log("Errors:", errors), [errors])
    useEffect( () => console.log("Form:", form), [form])

    const signUp = () => {

        let isError = false;

        // Username
        if ( form?.username === "" ) {
            setForm((f) => { delete f['username']; return f; });
        }
        
        // Email
        if ( (!form?.email) || (form.email === '') || (form.email && form.email.length === 0) ) {
            setErrors( (e) => ({...e, email: 'Your email address is required'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['email']; return e; });
        }

        // Password 1
        if ( (!form?.password) || (form?.password === '') || (form?.password && form.password.length < 8) ) {
            setErrors( (e) => ({...e, password: 'Password 1: must be at least 8 characters long'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['password']; return e; });
        }
        
        // Password 2
        if ( (!form?.password2) || (form.password2 === '') || (form.password2 && form.password2.length < 8) ) {
            console.log('Password 2 is empty');
            setErrors( (e) => ({...e, password2: 'Password 2: must be at least 8 characters long'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['password2']; return e; });
        }

        if (isError) return;

        api.post("auth/user/create/", JSON.stringify(form))
            .then( res => {
                console.log("Res?.data:", res?.data);
                navigate(
                    "/verify", 
                    { 
                        replace: true, 
                        state: { 
                            email: form.email,
                            password: form.password,
                        } 
                    });
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return 
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };

    return (
        <PageContainer
            style={styles.PageContainer}
        >
            <h1>Signup</h1>
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
                    error={ !!errors?.username }
                    helperText={ errors?.username }
                    value={ form.username || '' } 
                    onChange={ (e) => setForm({...form, username: e.target.value}) }
                    sx={{textAlign: 'center'}}
                    label={'username'}
                />
                <TextField 
                    error={ !!errors?.email }
                    helperText={ errors?.email }
                    value={ form.email || '' } 
                    onChange={ (e) => setForm({...form, email: e.target.value}) } 
                    label={'email'}
                    type={"email"}
                    required={true}
                />
                <TextField 
                    error={ !!errors?.password }
                    helperText={ errors?.password }
                    value={ form.password || '' } 
                    onChange={ (e) => setForm({...form, password: e.target.value}) } 
                    label={'password'}
                    type={"password"}
                    required={true}
                />
                <TextField 
                    error={ !!errors?.password2 }
                    helperText={ errors?.password2 }
                    value={ form.password2 || '' } 
                    onChange={ (e) => setForm({...form, password2: e.target.value}) } 
                    label={'password again'}
                    type={"password"}
                    required={true}
                />
                <Button 
                    variant="contained"
                    onClick={ signUp }
                >
                    Signup
                </Button>

                <Divider />
                
                <Button variant="contained">
                    <Link to="/login">Already have an account?</Link>
                </Button>
                <Button variant="contained">
                    <Link to="/password-reset">Forgot Your Password?</Link>
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
        width: '18rem',
        '& > button, & > div': {
            width: '100%',
            color: theme.palette.mode === 'dark' && theme.palette.primary.light,
            fontSize: '1rem',
            '& > input': {
                fontSize: '1.3rem',
            },
            '& > a': {
                fontSize: '1rem',
                textDecoration: 'none',
                color: 'inherit'
            }
        },
    },
})

export default SignupPage;