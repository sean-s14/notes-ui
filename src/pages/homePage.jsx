

// import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Clear, Edit, Add } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton,
    TextField,
    Checkbox,
    Divider,
    Typography,
    useMediaQuery,
} from '@mui/material';
import parse from 'html-react-parser';

import { PageContainer } from "layout/pageContainer";
import { CList } from 'components/exports';
import { convertDate } from 'utils/exports';


const HomePage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);
    const md = useMediaQuery('(min-width:750px)');

    const tasks = [
        {
            id: 1,
            text: 'visit relative',
            completed: true,
            editable: false,
        },
        {
            id: 2,
            text: 'shop for groceries',
            completed: false,
            editable: false,
        },
    ]

    const notes = [
        {
            title: 'The Rules of Chess',
            date_created: "2022-09-27T21:44:13.041525Z",
        },
        {
            title: 'Exam tips',
            date_created: "2022-09-25T17:51:05.763482Z",
        },
    ]

    const noteGridItems = [
        <Grid item xs={12} sm={6} sx={styles.GridItem}>
            <CList dense={false} sx={styles.CList}>
                <ListItemButton 
                    sx={{
                        ...styles.ListItemBtn, 
                        justifyContent: 'center', 
                        fontSize: '1.4rem'
                    }}
                >
                    Add Note
                    <Add fontSize={'large'} sx={{...styles.ClearStyle, ml: 2}}/>
                </ListItemButton>

                <Divider />

                { notes && notes.map( ({title, slug, date_created}, index) => (
                    <ListItemButton key={index} sx={{...styles.ListItemBtn, p: 1, pl: 2}}>
                        <ListItemText 
                            primary={title} 
                            secondary={ date_created && convertDate(date_created)}
                            primaryTypographyProps={{fontSize: '1.2rem'}} 
                            secondaryTypographyProps={{fontSize: '0.8rem'}} 
                        />
                        <IconButton sx={styles.IconBtn}>
                            <Clear fontSize={'large'} sx={styles.ClearStyle}/>
                        </IconButton>
                    </ListItemButton>
                )) }
            </CList>
        </Grid>,
        <Grid item xs={12} sm={6} sx={styles.GridItem}>
            <Typography 
                paragraph 
                variant="h5"
                sx={styles.GridItemText}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quasi beatae aspernatur culpa magni ab.
            </Typography>
        </Grid>
    ]

    return (
        <PageContainer style={styles.PageContainer}>
            <h1 style={{...styles.H1, marginBottom: md ? '4rem' : '2rem'}}>Welome to Notes!</h1>
            
            <Grid 
                container 
                // spacing={3}
                columnSpacing={{xs: 0, sm: 3}}
                rowSpacing={{xs: 4, sm: 6}}
                sx={{
                    justifyContent: 'center',
                    maxWidth: '90%'
                }}
                wrap='wrap'
                // columns={12}
                disableEqualOverflow
            >
                
                <Grid item xs={12} sm={6} sx={styles.GridItem}>
                    <Typography
                        paragraph 
                        variant="h5"
                        sx={styles.GridItemText}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quasi beatae aspernatur culpa magni ab.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} sx={styles.GridItem}>
                    {/* <Item>xs=8</Item> */}
                    <CList dense={false} sx={styles.CList}>
                        <ListItem>
                            <TextField
                                placeholder='"get milk"'
                                value={''}
                                sx={{ width: '90%', p: 1, '& input': { p: 1.5 } }}
                            />
                            <IconButton sx={styles.IconBtn}>
                                <Add fontSize={"large"} />
                            </IconButton>
                        </ListItem>

                        <Divider sx={{width: '95%', ml: 'auto', mr: 'auto'}}/>

                        { tasks && tasks.map( ({text, completed, id, editable}, index) => (
                            <ListItemButton key={index} sx={styles.ListItemBtn}>
                                <Checkbox checked={completed} sx={styles.Checkbox}/>

                                <ListItemText 
                                    primary={ completed ? parse(text.strike()) : text }
                                    primaryTypographyProps={{fontSize: '1.2rem'}} 
                                    secondaryTypographyProps={{fontSize: '0.8rem'}} 
                                />
                                
                                <IconButton sx={styles.IconBtn}>
                                    <Edit fontSize={'normal'} sx={styles.ClearStyle}/>
                                </IconButton>

                                <IconButton sx={styles.IconBtn}>
                                    <Clear fontSize={'normal'} sx={styles.ClearStyle}/>
                                </IconButton>
                            </ListItemButton>
                        )) }
                    </CList>
                </Grid>

                { md
                    ? <>{noteGridItems[0]}{noteGridItems[1]}</>
                    : <>{noteGridItems[1]}{noteGridItems[0]}</>
                }
                
                
                
                
                
            </Grid>
        </PageContainer>
    )
}

const stylesheet = (theme) => ({
    PageContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '5rem'
    },
    H1: {
        margin: 0,
        marginTop: '1rem',
        marginBottom: '4rem',
    },
    GridItem: {
        minWidth: '18rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    GridItemText: {
        minWidth: '18rem',
        maxWidth: '26rem',
        textAlign: 'center',
        // padding: '24px',
    },

    // Notes & Tasks
    CList: {
        // width: '22rem',
        maxWidth: '24rem',
        // width: '100%',
    },
    ListItemBtn: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    Checkbox: {
        ml: 0, 
        mr: 2, 
        borderRadius: 2, 
        '&:hover': {
            bgcolor: "rgba(94, 53, 177, 0.2)",
        },
        '&.Mui-checked': {
            color: theme.palette.primary.light,
        }
    },
    IconBtn: {
        borderRadius: 2,
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
})

export default HomePage;