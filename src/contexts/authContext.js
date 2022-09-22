import { 
    useState,
    useEffect,
    createContext,
    useContext,
} from 'react';

const AuthContext = createContext();
const AuthUpdateContext = createContext();

const useAuth = () => {
    return useContext(AuthContext);
}

const useAuthUpdate = () => {
    return useContext(AuthUpdateContext);
}

function AuthProvider({children}) {

    const [userData, setUserData] = useState({});

    const storeUserData = async (newUserData) => {
        console.log("New User Data :", newUserData)
        if (newUserData === 'clear') {
            // Clear Auth Data
            localStorage.setItem('userData', JSON.stringify({}));
            setUserData({});
        } else {
            try {
                let oldUserData = JSON.parse(localStorage.getItem('userData'));
                console.log('Old User Data :', typeof oldUserData, ':', oldUserData);
                newUserData = {
                    ...oldUserData, 
                    ...newUserData
                };
                // await AsyncStorage.setItem('userData', newUserData);
                localStorage.setItem('userData', JSON.stringify(newUserData));
                setUserData(newUserData);
            } catch (e) { console.log(e); }
        }
    };

    const getUserData = async () => {
        try {
            const newUserData = JSON.parse(localStorage.getItem('userData'));
            console.log("New User Data :", newUserData);
            if (newUserData !== null && newUserData !== '' && Object.keys(newUserData).length !== 0) { 
                setUserData(newUserData);
            } else {
                setUserData({'empty': true})
            }
        } catch(e) {
            console.log(e);
        }
    }

    const updateUserData = (newUserData) => {
        storeUserData(newUserData);
        getUserData(newUserData);
    };

    useEffect( () => {
        getUserData();
    }, []);
    
    if (Object.keys(userData).length <= 0) return null;

    return (
        <AuthContext.Provider value={userData}>
            <AuthUpdateContext.Provider value={updateUserData}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}

export { useAuth, useAuthUpdate, AuthProvider };