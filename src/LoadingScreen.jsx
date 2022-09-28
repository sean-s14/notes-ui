
import logo512 from 'static/images/logo512.png';
import { useTheme } from '@mui/material/styles';

const LoadingScreen = (props) => {

    const theme = useTheme();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(10, 7, 18)' : '#E7DFDD',
            }}
        >
            <img 
                src={logo512} 
                alt="React Logo" 
                style={{
                    maxWidth: '70vw',
                    maxHeight: '70vh',
                }} 
            />
        </div>
    )
}

export default LoadingScreen;