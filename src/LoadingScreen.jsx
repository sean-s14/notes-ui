
import logo512 from 'static/images/logo512.png';

const LoadingScreen = (props) => {

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
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