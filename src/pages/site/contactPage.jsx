
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import {
    Box,
    Stack,
    Button,
    TextField,
} from '@mui/material'

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';


const ContactPage = (props) => {

    const theme = useTheme();
    // eslint-disable-next-line no-unused-vars
    const api = useAxios();

    const [form, setForm] = useState({});
    const fields = ['name', 'email', 'message']
    const [errors, setErrors] = useState({});

    useEffect( () => console.log("Form:", form), [form]);
    useEffect( () => console.log("Errors:", errors), [errors]);

    const sendMsg = () => {

        let isError = false;
        
        // Name
        if ( (!form?.name) || (form?.name === '') || (form?.name && form.name.length === 0) ) {
            setErrors( (e) => ({...e, name: 'Enter your name'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['name']; return e; });
        }

        // Email
        if ( (!form?.email) || (form?.email === '') || (form?.email && form.email.length < 3) ) {
            setErrors( (e) => ({...e, email: 'Enter your email'}) );
            isError = true;
        } else {
            setErrors((e) => { delete e['email']; return e; });
        }

        // Message
        if ( (!form?.message) || (form?.message === '') || (form?.message && form.message.length === 0) ) {
            setErrors( (e) => ({...e, message: 'Enter a message'}) );
            isError = true;
        } else {
            console.log('deleting...')
            setErrors((e) => { console.log('Working'); delete e['message']; console.log(e); return e; });
        }

        if (isError) return;

        // api.post("contact/", JSON.stringify(data))
        //     .then( res => {
        //         console.log("Res?.data:", res?.data);
        //         setForm({});
        //     })
        //     .catch( err => {
        //         if (!err?.response?.data) return;
        //         if (!err?.response?.status) return 
        //         setErrors( e => ({...e, ...err?.response?.data}) );
        //     });
    };

    return (
        <PageContainer
            style={{
                maxWidth: '100vw',
                height: '100%',
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h1>Contact Me</h1>
            
            <Stack 
                spacing={2} 
                direction="column"
                sx={{
                    width: '18rem',
                    '& > *': {
                        width: '100%',
                        color: theme.palette.mode === 'dark' && theme.palette.primary.light,
                        fontSize: '1rem',
                        '& > input': {
                            fontSize: '1.3rem',
                        },
                        '& > a': {
                            color: 'inherit',
                            fontSize: 'inherit',
                            textDecoration: 'none',
                        }
                    },
                }}
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
                    error={ !!errors?.name }
                    helperText={ errors?.name }
                    value={ form.name || '' } 
                    onChange={ (e) => setForm({...form, name: e.target.value}) }
                    sx={{textAlign: 'center'}}
                    label={'name'}
                />
                <TextField 
                    error={ !!errors?.email }
                    helperText={ errors?.email }
                    value={ form.email || '' } 
                    onChange={ (e) => setForm({...form, email: e.target.value}) }
                    sx={{textAlign: 'center'}}
                    label={'email'}
                    type={'email'}
                />
                <TextField 
                    error={ !!errors?.message }
                    helperText={ errors?.message }
                    value={ form.message || '' } 
                    onChange={ (e) => setForm({...form, message: e.target.value}) } 
                    label={'message'}
                    multiline={true}
                    minRows={3}
                    maxRows={5}
                />
                <Button 
                    variant="contained" 
                    sx={{}}
                    onClick={ sendMsg }
                >
                    Send
                </Button>
            </Stack>
        </PageContainer>
    )
}

export default ContactPage;