
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Clear } from '@mui/icons-material';
import {
    List,
    ListItemText,
    ListItemButton,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import { Link } from "react-router-dom";

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';
// import { useAuthUpdate } from 'contexts/exports';
import { convertDate } from 'utils/exports';


const NoteListPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    // const updateAuthData = useAuthUpdate();
    const api = useAxios();

    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState([]);
    
    const [delOpen, setDelOpen] = useState(false);
    const handleDelOpen = () => setDelOpen(true);
    const handleDelClose = () => setDelOpen(false);

    const getNotes = () => {
        api.get("notes/")
            .then( res => {
                setNotes(res?.data);
            })
            .catch( err => {

            })
    }

    useEffect( () => {
        getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteNote = (slug) => {
        api.delete(`notes/delete/${slug}/`)
            .then( res => {
                getNotes();
            })
            .catch( err => {

            });
        handleDelClose()
    };

    return (
        <PageContainer style={styles.PageContainer}>
            <h1>All Notes</h1>

            <List dense={false} sx={styles.ListContainer}>
                { notes && notes.map( ({title, slug, date_created}, index) => (
                    <ListItemButton
                        key={index}
                        sx={styles.ListItemBtn}
                    >
                        <Link
                            to={slug}
                            style={styles.NoteLink}
                        >
                            <ListItemText 
                                primary={title} 
                                secondary={convertDate(date_created)}
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
            </List>
            
            
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
    ListContainer: {
        // border: '1px solid red',
        minWidth: '350px',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper
    },
    ListItemBtn: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    NoteLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    IconBtn: {
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