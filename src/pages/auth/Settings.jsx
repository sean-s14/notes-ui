import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
    Avatar,
    Badge,
    Divider,
    Box,
    Stack,
    Button,
    TextField,
    IconButton,
    Input,
    InputLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { PageContainer } from "layout/pageContainer";
import { useAxios, useAuthData } from 'hooks/exports';
import { useAuthUpdate } from 'contexts/exports';
import DefaultUser from 'static/images/default-user.jpg';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';


const SettingsPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const updateAuthData = useAuthUpdate();
    const api = useAxios();
    const { profile, isLoading } = useAuthData();

    const [userInfo, setUserInfo] = useState({});
    const fields = ['username', 'email']
    const [errors, setErrors] = useState({});

    useEffect( () => {
        console.log('Profile:', profile);
    }, [profile])

    useEffect( () => {
        console.log('User Info:', userInfo);
        
        let email = userInfo?.email
        // email.length === 0 ? console.log('Yes') : console.log('No');
        email === '' ? console.log('Yes') : console.log('No');
        console.log("Email:", userInfo?.email)
    }, [userInfo])

    const handleUsername = (e) => {
        setUserInfo({...userInfo, username: e.target.value});
    };

    const handleEmail = (e) => {
        setUserInfo({...userInfo, email: e.target.value});
    };

    const saveChanges = () => {

        api.patch("auth/user/", JSON.stringify(userInfo))
            .then( res => {
                console.log("Res?.data:", res?.data);
                res?.data && updateAuthData({tokens: res.data});
                setUserInfo({});
                setErrors({});
            })
            .catch( err => {
                if (!err?.response?.data) return;
                if (!err?.response?.status) return 
                setErrors( (e) => ({...e, ...err?.response?.data}) );
            });
    };

    const handlePhoto = (e) => {
        console.log('Handling Photo...');
        let file = e.target.files[0];
        console.log("File:", file)
        function getBase64(file, cb) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                cb(reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }

        let res = '';
        getBase64(file, (result) => {
            // res = result;
            setUserInfo( (u) => ({...u, imageURI: result}) )
            // console.log("Result:", result);
        })
        console.log(res);
    };

    if (isLoading) return null;

    return (
        <PageContainer style={styles.PageContainer}>
            
            <Stack 
                spacing={3} 
                direction="column"
                sx={styles.StackStyle}
            >

                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{width: 'auto'}}
                    badgeContent={
                        <IconButton>
                            <InputLabel 
                                htmlFor={"photo-upload"} 
                                sx={{
                                    maxWidth: '3rem', 
                                    maxHeight: '3rem',
                                }}
                            >
                                <ChangeCircleIcon sx={{ fontSize: "3rem" }} />
                            </InputLabel>
                            <Input 
                                id={"photo-upload"}
                                type={"file"} 
                                hidden={true}
                                onChange={ e => handlePhoto(e) }
                                sx={{display: 'none'}}
                            >
                            </Input>
                        </IconButton>
                    }
                >    
                    <Avatar 
                        alt="Default User"
                        src={ userInfo?.imageURI || profile.photo || DefaultUser }
                        sx={{ 
                            width: 200,
                            maxWidth: 200,
                            height: 200,
                            maxHeight: 200,
                        }}
                        variant={"circular"}
                    />
                </Badge>

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
                    value={ 
                        userInfo?.username 
                        // eslint-disable-next-line no-new-wrappers
                        || (userInfo?.username === '' && new String(""))
                        || profile.username 
                        || '' 
                    } 
                    placeholder={ 'username' }
                    onChange={ handleUsername }
                    sx={{textAlign: 'center'}}
                    label={'username'}
                />
                <TextField 
                    error={ !!errors?.email }
                    helperText={errors?.email}
                    value={ 
                        userInfo?.email
                        // eslint-disable-next-line no-new-wrappers
                        || (userInfo?.email === '' && new String(""))
                        || profile.email 
                        || '' 
                    } 
                    placeholder={ 'email' }
                    onChange={ handleEmail } 
                    label={'email'}
                />
                <Button 
                    variant="contained"
                    onClick={ saveChanges }
                >
                    Save Changes
                </Button>

                <Divider sx={{width: '100%'}} />

                <Button variant="contained">
                    <Link to="/password-change">Change Password</Link>
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
        alignItems: 'center',
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
    },
})

export default SettingsPage;