

const Form = ({children, style, onSubmit}) => {

    return (
        <form
            onSubmit={ onSubmit }
            style={{
                maxWidth: '20rem',
                display: 'flex',
                flexDirection: 'column',
                ...style,
            }}
        >
            {children}
        </form>
    )
}

export default Form;