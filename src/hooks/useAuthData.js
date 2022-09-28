import { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";

// Custom
import { useAuth } from 'contexts/exports';
import { isObject } from 'utils/exports';
import useAxios from './useAxios';


const useAuthData = () => {

    const auth = useAuth();
    const api = useAxios();

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    // useEffect( () => console.log("Access Token :", accessToken), [accessToken])
    // useEffect( () => console.log("Refresh Token :", refreshToken), [refreshToken])

    useEffect( () => {
        // eslint-disable-next-line no-unused-vars
        let isMounted = true;
        // console.log("Use Auth Data has mounted...");
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
        if (isObject(accessToken) && isObject(accessToken)) {
            if ( 
                (Object.keys(accessToken).length > 0) &&
                (Object.keys(refreshToken).length > 0)
            ) {
                setLoggedIn(true);
                setLoading(false);
            } else {
                setLoggedIn(false);
                setLoading(false);
            }
        } else if ( (accessToken !== null) && (refreshToken !== null) ) {
            setLoggedIn(false);
            setLoading(false);
        }
    }, [accessToken, refreshToken]);

    const syncData = () => {
        if (!loggedIn) return;
        
        let tasksRaw = localStorage.getItem('tasks')
        if (tasksRaw !== null) {
            let tasks = JSON.parse(tasksRaw);
            if (tasks.length > 0) {
                tasks.sort( (a, b) => a.id > b.id ? -1 : 1 );
                let newlocalTasks = tasks.map( task => ({text: task.text, completed: task.completed}) );
                newlocalTasks.forEach( task => {
                    api.post('tasks/create/', task)
                        .then( res => {})
                        .catch( err => {})
                });
                localStorage.removeItem('tasks');
            }
        }

        let notesRaw = localStorage.getItem('notes')
        if (notesRaw !== null) {
            let notes = JSON.parse(notesRaw);
            if (notes.length > 0) {
                notes.sort( (a, b) => a.id > b.id ? -1 : 1 );
                let newNotes = notes.map( note => ({title: note.title, slug: note.slug, text: note.text}) );
                newNotes.forEach( note => {
                    api.post('notes/create/', note)
                        .then( res => {})
                        .catch( err => {})
                });
                localStorage.removeItem('notes');
            }
        }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => syncData, [loggedIn]);


    return {
        isLoading: loading,
        isLoggedIn: loggedIn,
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