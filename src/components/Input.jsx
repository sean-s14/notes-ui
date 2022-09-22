
// import { useState } from 'react';
// import { useTheme } from '@mui/material/styles';


const Input = ({value, placeholder, onChange, style, type}) => {

    // const theme = useTheme();
    // const [text, setText] = useState("");

    return (
        <input
            type={ type || 'text' }
            value={ value || '' }
            placeholder={ placeholder }
            onChange={ onChange }
            style={{
                width: '20rem',
                height: '2.5rem',
                borderRadius: '0.3rem',
                border: 'none',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                fontSize: '1.1rem',
                textAlign: 'center',
                // marginTop: '.5rem',
                // marginBottom: '.5rem',
                ...style,
            }}
        />
    )
}

export default Input;