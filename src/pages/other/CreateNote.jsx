
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {
    FormControl,
    TextField,
    Button,
} from '@mui/material';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import 'static/css/quill.snow.css';

import { PageContainer } from "layout/pageContainer";
import { useAxios, useAuthData } from 'hooks/exports';
import { slugify } from 'utils/exports';


const CreateNotePage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();
    const { isLoggedIn } = useAuthData();
    const navigate = useNavigate();

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

    const save = () => {

        if (!isLoggedIn) {
            let localNotesRaw = localStorage.getItem('notes');
            if (localNotesRaw === null) {
                localStorage.setItem('notes', JSON.stringify([{...form, id: 1, slug: slugify(form.title)}]));
            } else {
                let localNotes = JSON.parse(localNotesRaw);
                localNotes.sort( (a, b) => a.id > b.id ? -1 : 1 );
                localNotes.push({...form, id: localNotes[0].id + 1, slug: slugify(form.title)});
                localNotes.sort( (a, b) => a.id > b.id ? -1 : 1 );
                localStorage.setItem('notes', JSON.stringify(localNotes));
            }
            navigate("/notes", { replace: true });
            return
        }

        api.post('notes/create/', form)
            .then( res => {
                navigate("/notes", { replace: true });
            })
            .catch( err => {

            })
    }

    return (
        <PageContainer style={styles.PageContainer}>
            
            <FormControl sx={styles.Form}>

                <TextField
                    id="standard-basic" 
                    label="Title" 
                    // variant="standard"
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
                    onClick={ save }
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
        minWidth: '300px',
        width: '500px',
        maxWidth: '90%',
    },
    Title: {
        color: theme.palette.primary.light,
        width: '100%',
        maxWidth: '100%',
        '& .MuiInputBase-root' : {
            borderRadius: 2
        }
    },
    QuillEditor: {
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '100%',
    },
    SaveBtn: {
        color: theme.palette.primary.light,
        borderRadius: 2
    }
})

export default CreateNotePage;