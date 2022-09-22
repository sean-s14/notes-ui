import axios from 'axios';
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAuth, useAuthUpdate } from 'contexts/exports';


const baseURL = process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DJANGO_ADDRESS
    : process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_DJANGO_ADDRESS
        : null


const useAxios = () => {
    const auth = useAuth();
    const authUpdate = useAuthUpdate();
    const [newTokens, setNewTokens] = useState(null);

    // useEffect( () => {
    //     console.log('Auth :', auth);
    // }, [auth])

    const axiosInstance = axios.create({
        baseURL,
        headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.tokens?.access}`
        }
    });


    axiosInstance.interceptors.request.use(async req => {
        console.log('Interceptor Request :', req);

        // Gets new Refresh & Access tokens using current Refresh token
        const refreshTokens = () => {
            return axios.post(
                `${baseURL}api/token/refresh/`,
                {"refresh": auth?.tokens?.refresh},
                { headers: {'Content-Type': 'application/json'}}
            )
        }
        
        // Check if user has tokens
        if (auth?.tokens?.access) {
            // Check if users access token has expired
            const user = jwt_decode(auth.tokens.access)
            // console.log('User (decoded token) :', user);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
            // If not expired return req
            if(!isExpired) return req;
        } else {
            return req;
        }
    

        try {
            const response = await refreshTokens();
            // Set tokens here then update auth context in response interceptor, so as to not disrupt request
            setNewTokens(response.data);
            req.headers.Authorization = `Bearer ${response?.data?.access}`
            return req;
        } catch (err) {
            console.log(err);
            if (err?.response?.status === 401) {
                console.log('Error Status :', err?.response?.status);
                if (Object.keys(auth).length > 0) authUpdate('clear');
            }
            return req;
        }
        
    })

    axiosInstance.interceptors.response.use( async res => {
        console.log('Interceptor Response :', res);
        console.log('Interceptor Response Data :', res?.data);
        if (newTokens) {
            console.log('Updating Auth...');
            res = {...res, updatingAuth: true}
            authUpdate({tokens: newTokens});
            return res;
        } else {
            return res;
        }
    }, err => {
        console.log('Interceptor Error :', err);
        console.log('Interceptor Error Response :', err?.response);
        console.log('Interceptor Error Response Data :', err?.response?.data);
        throw err;
    });
    
    return axiosInstance
}

export default useAxios;