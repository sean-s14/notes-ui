import { useState, useContext, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
    useMediaQuery,
    // MuiDrawer,
    // MuiAppBar,
    Toolbar,
    Typography,
    Divider,
    IconButton,

    // List
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

// Icons
import {
    Home,
    // QuestionMark,
    Feed,
    // Article,
    List as ListIcon,
    // Devices, 
    Description,
    NoteAdd,
    Menu,
    ChevronLeft,
    ChevronRight,
    OpenInNew,
    Call,
    Brightness6,
    
    // Auth
    Login,
    Logout,
    PersonAdd,
    Settings,
    
    // Socials
    GitHub,
} from '@mui/icons-material';
import { useAuth, useAuthUpdate, ThemeContext } from 'contexts/exports';
import { useVariables } from 'hooks/exports';


const boxShadow = '2px 0px 8px 6px rgba(126, 87, 194, 0.2)';

const openedMixin = (theme, vars) => ({
    boxShadow: boxShadow,
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(10, 7, 18)' : '#E7DFDD',
    // backgroundColor:  theme.palette.background.paper,
    width: vars.drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme, vars) => ({
    boxShadow: boxShadow,
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(10, 7, 18)' : '#E7DFDD',
    // backgroundColor: theme.palette.primary.dark,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme, vars }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    height: vars.appBarHeight + 'px',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open'})(({ theme, open, vars }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: vars.drawerWidth,
        width: `calc(100% - ${vars.drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open, vars }) => ({
        width: vars.drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
        ...openedMixin(theme, vars),
            '& .MuiDrawer-paper': openedMixin(theme, vars),
        }),
        ...(!open && {
        ...closedMixin(theme, vars),
            '& .MuiDrawer-paper': closedMixin(theme, vars),
        }),
    }),
);

const DrawerListButton = ({open, icon, name, externalPath}) => <ListItemButton>
        <ListItemIcon
            sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
            }}
        >{icon}</ListItemIcon>
        <ListItemText primary={name} sx={{ opacity: open ? 1 : 0 }} />
        { externalPath && open &&
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                }}
            >
                <OpenInNew />
            </ListItemIcon>
        }
    </ListItemButton>

const  DrawerList = ({ routes, open, linkStyle }) => <List>
        {routes.map(({name, path, externalPath, icon, func}, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            { func 
                ?   <button
                        onClick={ func }
                        style={{
                            ...linkStyle,
                            backgroundColor: 'rgba(0,0,0,0)',
                            border: 'none',
                            padding: '0',
                        }}
                    >
                        <DrawerListButton open={open} icon={icon} name={name} />
                    </button>
                : !!externalPath
                    ? 
                        <a 
                            href={path} 
                            target={"_blank"} 
                            rel="noreferrer"
                            style={linkStyle}
                        >
                            <DrawerListButton open={open} icon={icon} name={name} externalPath={externalPath} />
                        </a>
                    :
                        <Link to={path} style={linkStyle}>
                            <DrawerListButton open={open} icon={icon} name={name} />
                        </Link>
            }
            </ListItem>
        ))}
    </List>

export default function NavigationDrawer2(props) {

    const auth = useAuth();
    const authUpdate = useAuthUpdate();
    const navigate = useNavigate();
    const location = useLocation();
    const vars = useVariables()
    const mobile = useMediaQuery(`(min-width: ${vars.mobile})`)

    const theme = useTheme();
    const themeMode = useContext(ThemeContext);
    
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    useEffect( () => { handleDrawerClose() }, [location]);

    const routes1 = [
        {
            name: "Home",
            path: "/",
            icon: <Home />
        },
        {
            name: "Notes",
            path: "notes",
            icon: <Description />
        },
        {
            name: "Add Note",
            path: "notes/create",
            icon: <NoteAdd />
        },
        {
            name: "Tasks",
            path: "tasks",
            icon: <ListIcon />
        },
    ]

    const routes2 = []

    auth?.tokens?.access 
        ? routes2.push({
            name: "Settings",
            path: "settings",
            icon: <Settings />,
            },
            {
            name: "Logout",
            path: "logout",
            icon: <Logout />,
            func: () => { 
                    authUpdate("clear");
                    navigate("/", { replace: true });
                }
            })
        : routes2.push({
            name: "Login",
            path: "login",
            icon: <Login />
            },
            {
            name: "Signup",
            path: "signup",
            icon: <PersonAdd />
            })

    const routes3 = [
        // {
        //     name: "About",
        //     path: "about",
        //     icon: <QuestionMark />
        // },
        {
            name: "Policies",
            path: "policies",
            icon: <Feed />
        },
        {
            name: "Contact",
            path: "contact",
            icon: <Call />
        },
        {
            name: "Github",
            path: "https://github.com/shaun-ps-04/notes-ui",
            externalPath: true,
            icon: <GitHub />
        },
    ]

    const linkStyle = {
        width: "100%", 
        minHeight: 48,
        px: 2.5,
        justifyContent: open ? 'initial' : 'center',
        textDecoration: "none", 
        color: theme.palette.text.primary
    }

    return (
        <>
            <AppBar position="fixed" open={open} vars={vars} >
                <Toolbar sx={{height: vars.appBarHeight}} >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <Menu fontSize={"large"} />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Notes
                    </Typography>
                    <IconButton     
                        aria-label={"theme"}
                        onClick={ themeMode.toggleTheme }
                        sx={{
                            ml: 'auto'
                        }}
                    >
                        <Brightness6 fontSize={"large"} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            
            <Drawer variant={mobile || open ? "permanent" : "temporary"} open={open} vars={vars}>
                <DrawerHeader vars={vars}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl'
                            ? <ChevronRight fontSize={"large"} /> 
                            : <ChevronLeft fontSize={"large"} />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <DrawerList routes={routes1} open={open} linkStyle={linkStyle} />

                <Divider />

                <DrawerList routes={routes2} open={open} linkStyle={linkStyle} />

                <Divider />

                <DrawerList routes={routes3} open={open} linkStyle={linkStyle} />


                { open &&
                    <>
                        <footer 
                            style={{
                                display: 'flex',
                                fontSize: '0.8rem',
                                whiteSpace: 'normal',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                                marginBottom: '20px',
                            }}
                            >
                            Copyright &#169; {new Date().getFullYear()} Notes. All Rights Reserved
                        </footer>
                    </>
                }

            </Drawer>
        </>
    );
}
