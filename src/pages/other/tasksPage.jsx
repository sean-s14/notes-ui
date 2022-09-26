
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Clear, Edit, Add } from '@mui/icons-material';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton,
    TextField,
    Checkbox,
    Divider,
} from '@mui/material';
import parse from 'html-react-parser';

import { PageContainer } from "layout/pageContainer";
import { useAxios } from 'hooks/exports';


const TasksPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({});

    const toggleComplete = (val, id) => {
        let completed = val.target.checked;
        api.patch(`tasks/edit/${id}/`, {completed: completed})
            .then( res => {
            })
            .catch( err => {
                getTasks();
            })
        
        setTasks( tasks => tasks.map( task => {
            if (task.id === id) {
                task.completed = completed;
            }
            return task
        }));
    }

    const editTask = (id) => {
        setTasks( tasks => tasks.map( (task, index) => {
            if (task.id === id) {
                task.editable = !task.editable;
            }
            return task;
        }) )
    }

    const updateTask = (text, id) => {
        api.patch(`tasks/edit/${id}/`, {text: text})
            .then( res => {
                setTasks( tasks => tasks.map( task => {
                    if (task.id === id) {
                        task.text = text;
                    }
                    return task
                }))
            })
            .catch( err => {

            })
    }

    const deleteTask = (id) => {
        api.delete(`tasks/delete/${id}/`)
            .then( res => {
                getTasks();
            })
            .catch( err => {

            })
    }

    const getTasks = () => {
        api.get('tasks/')
            .then( res => {
                setTasks(res?.data);
            })
            .catch( err => {

            })
    }

    const addTask = () => {
        api.post('tasks/create/', newTask)
            .then( res => {
                setNewTask({});
                getTasks();
            })
            .catch( err => {
                getTasks();
            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => getTasks, [])


    return (
        <PageContainer style={styles.PageContainer}>
            <h1>Tasks</h1>

            <List dense={false} sx={styles.ListContainer}>

                <ListItem>
                    <TextField 
                        value={ newTask.text || '' }
                        onChange={ e => setNewTask( val => ({...val, text: e.target.value}) ) }
                        sx={{
                            width: '90%',
                            p: 1,
                            '& input': {
                                p: 1.5,
                            }
                        }}
                    />
                    <IconButton
                        sx={styles.IconBtn}
                        onClick={ addTask }
                    >
                        <Add fontSize={"large"} />
                    </IconButton>
                </ListItem>

                <Divider sx={{width: '95%', ml: 'auto', mr: 'auto'}}/>

                { tasks && tasks.map( ({text, completed, id, editable}, index) => (
                    <ListItemButton
                        key={index}
                        sx={styles.ListItemBtn}
                    >

                        <Checkbox 
                            checked={completed}
                            sx={styles.Checkbox}
                            onChange={ (val) => toggleComplete(val, id) }
                        />

                        { editable 
                            ?   <TextField
                                    defaultValue={text}
                                    onChange={ (text) => updateTask(text.target.value, id) }
                                    sx={{minWidth: '200px', width: '350px', maxWidth: '400px'}}
                                />
                            :   <ListItemText 
                                    primary={ completed ? parse(text.strike()) : text }
                                    primaryTypographyProps={{fontSize: '1.2rem'}} 
                                    secondaryTypographyProps={{fontSize: '0.8rem'}} 
                                />
                        }
                        
                        <IconButton 
                            sx={styles.IconBtn} 
                            onClick={ () => editTask(id) }
                        >
                            <Edit fontSize={'normal'} sx={styles.ClearStyle}/>
                        </IconButton>

                        <IconButton 
                            sx={styles.IconBtn} 
                            onClick={ () => deleteTask(id) }
                        >
                            <Clear fontSize={'normal'} sx={styles.ClearStyle}/>
                        </IconButton>
                    </ListItemButton>
                )) }
            </List>
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
        mt: 3,
        minWidth: '300px',
        width: '500px',
        maxWidth: '500px',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper
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

export default TasksPage;