
// import { useState, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';


const InputSubmit = ({title, style, onClick }) => {

    // const theme = useTheme();

    return (
        <input
            type={"submit"}
            onClick={ onClick}
            value={ title || "Click Me" }
            style={{
                width: '20rem',
                height: '2.5rem',
                borderRadius: '0.3rem',
                border: 'none',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: '900',
                textAlign: 'center',
                // marginTop: '.5rem',
                // marginBottom: '.5rem',
                cursor: 'pointer',
                ...style,
            }}
        />
    )
}

export default InputSubmit;