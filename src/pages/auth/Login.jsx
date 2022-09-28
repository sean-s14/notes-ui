
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from "react-router-dom";
import { 
    Box,
    Divider,
    Button,
    TextField,
} from '@mui/material';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
import { useAuthUpdate } from 'contexts/exports';
import { CStack } from 'components/exports';


const LoginPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const updateAuthData = useAuthUpdate();
    const api = useAxios();

    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const fields = ['username', 'password']
    const [errors, setErrors] = useState({});

    const logIn = () => {

        let isError = false;
        
        // Username
        if ( (!form?.username) || (form?.username === '') || (form?.username && form.username.length === 0) ) {
            setErrors( (e) => ({...e, username: 'You must enter a username or email'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['username']; return e; });
        }

        // Password
        if ( (!form?.password) || (form?.password === '') || (form?.password && form.password.length < 8) ) {
            setErrors( (e) => ({...e, password: 'Password must be at least 8 characters long'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['password']; return e; });
        }

        if (isError) return;

        let data = structuredClone(form);

        if (form.username.includes('@')) {
            data = {password: data.password, email: data.username};
        };

        api.post("api/token/", JSON.stringify(data))
            .then( res => {
                console.log("Res?.data:", res?.data);
                res?.data && updateAuthData({tokens: res.data});
                setForm({});
                navigate("/", { replace: true });
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return 
                setErrors( e => ({...e, ...err?.response?.data}) );

                if (err?.response?.status === 423) {
                    navigate(
                        "/verify", 
                        { 
                            replace: true, 
                            state: { 
                                email: form.email,
                                username: form.username,
                                password: data.password,
                            } 
                        });
                }
            });
    };

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>Login</h1>
            
            <CStack 
                spacing={2} 
                direction="column"
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
                    label={'username / email'}
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
                <Button variant="contained" onClick={ logIn }>
                    Login
                </Button>

                <Divider />
                
                <Button variant="contained">
                    <Link to="/signup">Don't have an account?</Link>
                </Button>
                <Button variant="contained">
                    <Link to="/password-reset">Forgot Your Password?</Link>
                </Button>
            </CStack>
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

export default LoginPage;