
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
} from '@mui/material';

import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'static/css/quill.snow.css';

import { PageContainer } from "layout/pageContainer";
import { useAxios, useAuthData } from 'hooks/exports';
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
    const { isLoggedIn } = useAuthData();

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

    const editNote = () => {
        if ( Object.keys(form).length === 0 ) return;

        let localNotesRaw = localStorage.getItem('notes');
        
        if (!isLoggedIn) {
            if (localNotesRaw !== null) {
                let localNotes = JSON.parse(localNotesRaw);
                localNotes = localNotes.map( note => {
                    if (note.slug === slug) {
                        note.title = form.title;
                        note.text = form.text;
                    } 
                    return note
                });
                localStorage.setItem('notes', JSON.stringify(localNotes));
                // setNotes(localNotes);
            }
            return
        }

        api.patch(`notes/edit/${slug}/`, form)
            .then( res => {})
            .catch( err => {})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => editNote, [form]);

    const getNote = () => {
        let localNotesRaw = localStorage.getItem('notes');
        
        if (!isLoggedIn) {
            if (localNotesRaw !== null) {
                let localNotes = JSON.parse(localNotesRaw);
                let localNote = localNotes.filter( note => note.slug === slug )[0];
                setNote(localNote);
                setForm(localNote);
                // setNotes(localNotes);
            }
            return
        }

        api.get(`notes/${slug}`)
            .then( res => {
                setNote(res?.data);
            })
            .catch( err => {

            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => getNote, []);

    const deleteNote = () => {
        let localNotesRaw = localStorage.getItem('notes');
        
        if (!isLoggedIn) {
            if (localNotesRaw !== null) {
                let localNotes = JSON.parse(localNotesRaw);
                localNotes = localNotes.filter( localNote => localNote.slug !== note.slug );
                
                if (localNotes.length === 0) {
                    localStorage.removeItem('notes');
                    setNote({});
                    setForm({});
                } else {
                    localStorage.setItem('notes', JSON.stringify(localNotes));
                    setNote(localNotes);
                }
            }
            navigate("/notes", { replace: true });
            handleDelClose();
            return
        }

        api.delete(`notes/delete/${note.slug}/`)
            .then( res => {
                navigate("/notes", { replace: true });
            })
            .catch( err => {});
        handleDelClose()
    };

    return (
        <PageContainer style={styles.PageContainer}>
            
            <FormControl sx={styles.Form}>

                <Button 
                    onClick={ handleDelOpen }
                    variant="contained"
                    sx={{ml: 'auto', mb: 4}}
                    endIcon={<Delete sx={{color: theme.palette.primary.contrastText}} />}
                >
                    Delete
                </Button>

                <TextField
                    id="standard-basic" 
                    label="Title" 
                    // variant="standard"
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
        mt: 3,
        minWidth: '300px',
        width: '450px',
        maxWidth: '90%',
    },
    Title: {
        color: theme.palette.primary.light,
        width: '100%',
        maxWidth: '100%',
        boxShadow:  "0px 0px 8px 4px rgba(126, 87, 194, 0.4)",
        borderRadius: 2,
        '& .MuiInputBase-root' : {
            borderRadius: 2,
        }
    },
    QuillEditor: {
        borderRadius: '10px',
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '100%',
        boxShadow:  "0px 0px 8px 4px rgba(126, 87, 194, 0.4)",
    },
    SaveBtn: {
        color: theme.palette.primary.light,
        borderRadius: 2
    },
    Dialog: {
        '& .MuiPaper-root': {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none'
        }
    },
})

export default NoteDetailPage;