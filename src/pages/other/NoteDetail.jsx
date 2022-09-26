
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import {
    FormControl,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';

import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'static/css/quill.snow.css';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
// import { useAuthUpdate } from 'contexts/exports';


const NoteDetailPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    // const updateAuthData = useAuthUpdate();
    const api = useAxios();
    let { slug } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({});
    const [note, setNote] = useState({});

    const [delOpen, setDelOpen] = useState(false);
    const handleDelOpen = () => setDelOpen(true);
    const handleDelClose = () => setDelOpen(false);

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
        if ( Object.keys(form).length === 0 ) return;
        api.patch(`notes/edit/${slug}/`, form)
            .then( res => {

            })
            .catch( err => {

            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form])

    useEffect( () => {
        api.get(`notes/${slug}`)
            .then( res => {
                setNote(res?.data);
            })
            .catch( err => {

            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteNote = () => {
        api.delete(`notes/delete/${note.slug}/`)
            .then( res => {
                navigate("/notes", { replace: true });
            })
            .catch( err => {

            });
        handleDelClose()
    };

    return (
        <PageContainer style={styles.PageContainer}>
            
            <FormControl sx={styles.Form}>

                <IconButton 
                    onClick={ handleDelOpen }
                    sx={{ml: 'auto'}}
                >
                    <Delete sx={{color: theme.palette.error.main}} />
                </IconButton>

                <TextField
                    id="standard-basic" 
                    label="Title" 
                    variant="standard"
                    sx={styles.Title}    
                    value={form.title || note.title || ''}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                />
            
                <ReactQuill 
                    style={styles.QuillEditor}
                    theme="snow" 
                    value={form.text || note.text || ''}
                    onChange={ (e) => setForm({...form, text: e}) }
                    modules={modules}
                />

            </FormControl>
            
            
            <Dialog
                open={delOpen}
                onClose={handleDelClose}
                aria-labelledby="note-delete-dialog-title"
                aria-describedby="note-delete-dialog-description"
                sx={styles.Dialog}
            >
                <DialogTitle id="note-delete-dialog-title">
                    {`Delete note titled "${note.title}"?`}
                </DialogTitle>
                <DialogActions sx={{justifyContent: 'space-around'}}>
                    <Button 
                        onClick={deleteNote} 
                        sx={styles.DelBtn}
                    >
                        Delete
                    </Button>
                    <Button 
                        onClick={handleDelClose} 
                        sx={styles.DelBtn} 
                        autoFocus
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

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
        mt: 6,
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
    },
    Dialog: {
        '& .MuiPaper-root': {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none'
        }
    },
})

export default NoteDetailPage;