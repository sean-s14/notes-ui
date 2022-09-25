
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    FormControl,
    TextField,
    Button,
} from '@mui/material';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import 'static/css/quill.snow.css';

import { PageContainer } from "layout/pageContainer";
// import { useAxios } from 'hooks/exports';
// import { useAuthUpdate } from 'contexts/exports';


const CreateNotePage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    // const updateAuthData = useAuthUpdate();
    // const api = useAxios();

    const [form, setForm] = useState({});

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote', 'code'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link',],
        ],
    }

    useEffect( () => {
        console.log("Form:", form);
    }, [form])

    return (
        <PageContainer style={styles.PageContainer}>
            
            <FormControl sx={styles.Form}>

                <TextField
                    id="standard-basic" 
                    label="Title" 
                    variant="standard"
                    sx={styles.Title}    
                    value={form.title || ''}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                />
            
                <ReactQuill 
                    style={styles.QuillEditor}
                    theme="snow" 
                    value={form.text || ''}
                    onChange={ (e) => setForm({...form, text: e}) }
                    modules={modules}
                />

                <Button 
                    variant="outlined" 
                    sx={styles.SaveBtn}
                >
                    Save
                </Button>

            </FormControl>

        </PageContainer>
    )
}

const stylesheet = (theme) => ({
    PageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    Form: {
        mt: 5,
    },
    Title: {
        color: theme.palette.primary.light,
        width: '390px'
    },
    QuillEditor: {
        marginTop: '20px',
        marginBottom: '20px',
        width: '400px',
    },
    SaveBtn: {
        color: theme.palette.primary.light
    }
})

export default CreateNotePage;