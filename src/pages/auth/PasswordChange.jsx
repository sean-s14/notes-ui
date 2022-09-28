
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
import { CStack } from 'components/exports';


const PasswordChangePage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();

    const [form, setForm] = useState({});
    const fields = ['old_password', 'new_password', 'new_password2']
    const [errors, setErrors] = useState({});
    const [successMessages, setSuccessMessages] = useState({});

    useEffect( () => {
        console.log("Form:", form);
    }, [form])
    
    const handlePassword = (e, field) => {
        setForm({...form, [field]: e.target.value});
    }

    const saveChanges = (e) => {

        let isError = false;
        
        // New Password
        if ( 
            (!form?.old_password) || 
            (form.old_password === '') || 
            (form.old_password && form.old_password.length === 0)
        ) {
            setErrors( (e) => ({...e, old_password: 'Enter your old password'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['old_password']; return e; });
        }
        
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

        let data = JSON.stringify(form);
        api.patch("auth/user/change-password/", data)
            .then( res => {
                console.log("Res?.data:", res?.data);
                setSuccessMessages(res?.data);
                setForm({});
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return;
                setErrors( e => ({...e, ...err?.response?.data}) );
            });
    };

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>Change Password</h1>

            <CStack 
                spacing={2} 
                direction="column"
            >
                { Object.keys(successMessages).length > 0 && 
                    <Box
                        sx={{
                            backgroundColor: theme.palette.success.dark,
                            borderRadius: '.3rem',
                            p: 1,
                        }}
                    >
                        { Object.values(successMessages).map( (txt, index) => 
                            <Box key={index}>{txt}</Box>
                        )}
                    </Box>
                }
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
                    error={ !!errors?.old_password }
                    helperText={ errors?.old_password }
                    value={ form.old_password || '' } 
                    placeholder={ 'current password' }
                    onChange={ (e) => handlePassword(e, 'old_password') }
                    sx={{textAlign: 'center'}}
                    // label={'password'}
                    type={"password"}
                    required={true}
                />
                <TextField 
                    error={ !!errors?.new_password }
                    helperText={ errors?.new_password }
                    value={ form.new_password || '' } 
                    placeholder={ 'new password' }
                    onChange={ (e) => handlePassword(e, 'new_password') }
                    // label={'email'}
                    type={"password"}
                    required={true}
                />
                <TextField 
                    error={ !!errors?.new_password2 }
                    helperText={ errors?.new_password2 }
                    value={ form.new_password2 || '' } 
                    placeholder={ 'new password again' }
                    onChange={ (e) => handlePassword(e, 'new_password2') }
                    // label={'password'}
                    type={"password"}
                    required={true}
                />
                <Button 
                    variant="contained" 
                    sx={{}}
                    onClick={ saveChanges }
                >
                    Update Password
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

export default PasswordChangePage;