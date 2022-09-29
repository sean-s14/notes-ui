
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Clear, Add } from '@mui/icons-material';
import {
    ListItemText,
    ListItemButton,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
} from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

import { PageContainer } from "layout/pageContainer";
import { useAxios, useAuthData } from 'hooks/exports';
import { convertDate } from 'utils/exports';
import { CList } from 'components/exports';

const NoteListPage = () => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthData();

    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState([]);
    
    const [delOpen, setDelOpen] = useState(false);
    const handleDelOpen = () => setDelOpen(true);
    const handleDelClose = () => setDelOpen(false);

    const deleteNote = () => {
        let localNotesRaw = localStorage.getItem('notes');
        
        if (!isLoggedIn) {
            if (localNotesRaw !== null) {
                let localNotes = JSON.parse(localNotesRaw);
                localNotes = localNotes.filter( localNote => localNote.slug !== note.slug );
                
                if (localNotes.length === 0) {
                    localStorage.removeItem('notes');
                    setNotes([]);
                } else {
                    localStorage.setItem('notes', JSON.stringify(localNotes));
                    setNotes(localNotes);
                }
            }
            handleDelClose()
            return 1
        }

        api.delete(`notes/delete/${note.slug}/`)
            .then( res => {
                getNotes();
            })
            .catch( err => {

            });
        handleDelClose()
    };

    const getNotes = () => {
        let localNotesRaw = localStorage.getItem('notes');
        
        if (!isLoggedIn) {
            if (localNotesRaw !== null) {
                let localNotes = JSON.parse(localNotesRaw);
                localNotes.sort( (a,b) => a.id < b.id ? 1 : -1 )
                setNotes(localNotes);
            }
            return 1
        }

        api.get("notes/")
            .then( res => {
                setNotes(res?.data);
            })
            .catch( err => {

            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => { getNotes() }, [isLoggedIn]);

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>All Notes</h1>

            <CList dense={false}>
                <ListItemButton 
                    sx={{
                        ...styles.ListItemBtn, 
                        justifyContent: 'center', 
                        fontSize: '1.4rem'
                    }}
                    onClick={ () => navigate('/notes/create', { replace: true }) }
                >
                    Add Note
                    <Add fontSize={'large'} sx={{...styles.ClearStyle, ml: 2}}/>
                </ListItemButton>

                <Divider />

                { notes && notes.map( ({title, slug, date_created}, index) => (
                    <ListItemButton
                        key={index}
                        sx={{...styles.ListItemBtn, p: 0}}
                        // onClick={ () => navigate(`/notes/${slug}`, { replace: true }) }
                    >
                        <Link
                            to={slug}
                            style={styles.NoteLink}
                        >
                            <ListItemText 
                                primary={title} 
                                secondary={ date_created && convertDate(date_created)}
                                primaryTypographyProps={{fontSize: '1.2rem'}} 
                                secondaryTypographyProps={{fontSize: '0.8rem'}} 
                            />
                        </Link>
                        <IconButton 
                            sx={styles.IconBtn} 
                            onClick={ () => {
                                handleDelOpen();
                                setNote({title: title, slug: slug});
                            }}
                        >
                            <Clear fontSize={'large'} sx={styles.ClearStyle}/>
                        </IconButton>
                    </ListItemButton>
                )) }
            </CList>
            
            
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
    ListItemBtn: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    NoteLink: {
        textDecoration: 'none',
        color: 'inherit',
        height: 'inherit',
        width: '100%',
        padding: 8,
        marginLeft: '10px',
    },
    IconBtn: {
        borderRadius: 2,
        p: 0.6,
        mr: 1,
        '&:hover': {
            color: theme.palette.primary.light
        },
    },
    ClearStyle: {
        transition: theme.transitions.create(
            ['color'], 
            {
                duration: theme.transitions.duration.standard
            }
        ),
    },
    Dialog: {
        '& .MuiPaper-root': {
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none'
        }
    },
})

export default NoteListPage;