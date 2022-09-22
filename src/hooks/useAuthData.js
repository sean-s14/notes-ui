import { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";


// Custom
import { useAuth } from 'contexts/exports';


const useAuthData = () => {

    const auth = useAuth();

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [loading, setLoading] = useState(true);

    // useEffect( () => console.log("Access Token :", accessToken), [accessToken])
    // useEffect( () => console.log("Refresh Token :", refreshToken), [refreshToken])

    useEffect( () => {
        let isMounted = true;
        console.log("Use Auth Data has mounted...");
        let accessToken = auth?.tokens?.access;
        let refreshToken = auth?.tokens?.refresh;

        if (accessToken) {
            const access = jwt_decode(accessToken);
            setAccessToken(access);

            let email = access?.email;
            email ? setEmail(email) : setEmail('');

            let username = access?.username;
            username ? setUsername(username) : setUsername(''); 

            let photo = access?.imageURI;
            photo ? setPhoto(photo) : setPhoto(''); 
        } else {
            setAccessToken(undefined)
        }
        if (refreshToken) {
            setRefreshToken(refreshToken);
        } else {
            setRefreshToken(undefined);
        }

        return () => { isMounted = false };
    }, [auth])

    useEffect( () => {
        accessToken !== null && 
            refreshToken !== null && 
            setLoading(false);
    }, [accessToken, refreshToken]);

    // useEffect( () => {
    //     if (loading) return;
    //     console.log("email :", email);
    //     console.log("username :", username);
    // }, [loading])


    return {
        isLoading: loading,
        tokens: accessToken && refreshToken && {
            access: accessToken,
            refresh: refreshToken,
        }, 
        profile: {
            email: email, 
            username: username, 
            photo: photo,
        },
    };
}

export default useAuthData;