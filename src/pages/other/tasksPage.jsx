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
import { useAxios, useAuthData } from 'hooks/exports';


const TasksPage = (props) => {

    // Theme
    const theme = useTheme();
	const styles = stylesheet(theme);

    // Auth
    const api = useAxios();
    const { isLoggedIn } = useAuthData();

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({});

    const toggleComplete = (val, id) => {
        let completed = val.target.checked;

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');
            if (localTasksRaw !== null) {
                let localTasks = JSON.parse(localTasksRaw);
                localTasks.map( task => {
                    if (task.id === id) {
                        task.completed = completed;
                    }
                    return task
                })
                localStorage.setItem('tasks', JSON.stringify(localTasks));
                getTasks();
            }
            return
        }

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

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');

            if (localTasksRaw !== null) {
                let localTasks = JSON.parse(localTasksRaw);
                localTasks.map( task => {
                    if (task.id === id) {
                        task.editable = !task.editable;
                    }
                    return task;
                })
                localStorage.setItem('tasks', JSON.stringify(localTasks));
                getTasks();
            }

            return
        }

        setTasks( tasks => tasks.map( (task) => {
            if (task.id === id) {
                task.editable = !task.editable;
            }
            return task;
        }) )
    }

    const updateTask = (text, id) => {

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');

            if (localTasksRaw !== null) {
                let localTasks = JSON.parse(localTasksRaw);
                localTasks.map( task => {
                    if (task.id === id) {
                        task.text = text;
                    }
                    return task
                })
                localStorage.setItem('tasks', JSON.stringify(localTasks));
            }

            return
        }

        api.patch(`tasks/edit/${id}/`, {text: text})
            .then( res => {
                setTasks( tasks => tasks.map( task => {
                    if (task.id === id) {
                        task.text = text;
                    }
                    return task
                }))
            })
            .catch( err => {})
    }

    const deleteTask = (id) => {

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');
            if (localTasksRaw !== null) {
                let localTasks = JSON.parse(localTasksRaw);
                localTasks = localTasks.filter( task => task.id !== id );
                localStorage.setItem('tasks', JSON.stringify(localTasks));
                if (localTasks.length === 0) {
                    localStorage.removeItem('tasks');
                    setTasks([]);
                } 
            }
            getTasks();
            return
        }

        api.delete(`tasks/delete/${id}/`)
        .then( res => {
            getTasks();
        })
        .catch( err => {
            
        })
    }

    const getTasks = () => {

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');
            if (localTasksRaw !== null) {
                let localTasks = JSON.parse(localTasksRaw);
                setTasks(localTasks.reverse());
            }
            return
        }
        
        let localTasksRaw = localStorage.getItem('tasks');

        if (localTasksRaw !== null) {
            let localTasks = JSON.parse(localTasksRaw);
            if (localTasks.length > 0) {
                localTasks.sort( (a, b) => a.id > b.id ? -1 : 1 );
                let newlocalTasks = localTasks.map( task => ({text: task.text, completed: task.completed}) );
                newlocalTasks.forEach( task => {
                    api.post('tasks/create/', task)
                        .then( res => {})
                        .catch( err => {})
                });
                localStorage.removeItem('tasks');
            }
        }

        api.get('tasks/')
            .then( res => {
                setTasks(res?.data);
            })
            .catch( err => {

            })
    }

    const addTask = () => {
        setNewTask('');

        if (!isLoggedIn) {
            let localTasksRaw = localStorage.getItem('tasks');
            if (localTasksRaw === null) {
                localStorage.setItem('tasks', JSON.stringify([{...newTask, id: 1, completed: false}]));
            } else {
                let localTasks = JSON.parse(localTasksRaw);
                localTasks.sort( (a, b) => a.id > b.id ? -1 : 1 );
                localTasks.push({...newTask, id: localTasks[0].id + 1, completed: false});
                localTasks.sort( (a, b) => a.id > b.id ? -1 : 1 );
                localStorage.setItem('tasks', JSON.stringify(localTasks));
            }
            getTasks();
            return
        }

        api.post('tasks/create/', newTask)
            .then( res => {
                setNewTask({});
                getTasks();
            })
            .catch( err => {
                getTasks();
            })
    }

    useEffect( () => {
        getTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

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