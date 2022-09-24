import { useState, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom";

import {
    useMediaQuery,
    // MuiDrawer,
    // MuiAppBar,
    Toolbar,
    Typography,
    Divider,
    IconButton,
    Button,

    // Dialog
    Dialog,
    DialogActions,
    DialogContent,
    TextField,

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
    QuestionMark,
    Feed,
    // Article,
    List as ListIcon,
    // Devices, 
    Description,
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
    LinkedIn,
    Telegram,
    Twitter,
} from '@mui/icons-material';
import { useAuth, useAuthUpdate, ThemeContext } from 'contexts/exports';
import { useVariables } from 'hooks/exports';


const openedMixin = (theme, vars) => ({
    backgroundColor:  theme.palette.mode === 'dark' && '#333',
    // backgroundColor:  theme.palette.mode === 'dark' && '#333',
    width: vars.drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme, vars) => ({
    // backgroundColor:  theme.palette.mode === 'dark' && '#311b92',
    backgroundColor:  theme.palette.mode === 'dark' && '#333',
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
    const vars = useVariables()
    const mobile = useMediaQuery(`(min-width: ${vars.mobile})`)

    const theme = useTheme();
    const themeMode = useContext(ThemeContext);

    
    const [open, setOpen] = useState(false);
    const [subForm, setSubForm] = useState(false);
    
    const handleSubscribeOpen = () => setSubForm(true);
    const handleSubscribeClose = () => setSubForm(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const routes1 = [
        {
            name: "Home",
            path: "/",
            icon: <Home />
        },
        {
            name: "Notes",
            path: "projects",
            icon: <Description />
        },
        {
            name: "Tasks",
            path: "articles",
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
            func: () => authUpdate("clear")
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
        {
            name: "About",
            path: "about",
            icon: <QuestionMark />
        },
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
            path: "https://github.com/shaun-ps-04",
            externalPath: true,
            icon: <GitHub />
        },
        {
            name: "LinkedIn",
            path: "https://www.linkedin.com/in/sean-stocker-404149226",
            externalPath: true,
            icon: <LinkedIn />
        },
        {
            name: "Telegram",
            path: "https://t.me/shaunscodehaven",
            externalPath: true,
            icon: <Telegram />
        },
        {
            name: "Twitter",
            path: "policies",
            externalPath: true,
            icon: <Twitter />
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
                        <Button sx={{mb: 2}} onClick={handleSubscribeOpen}>Subscribe</Button>
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
                            Copyright &#169; {new Date().getFullYear()} ReactTemplate. All Rights Reserved
                        </footer>
                    </>
                }

            </Drawer>


            <Dialog open={subForm} onClose={handleSubscribeClose} sx={{width: '100vw'}} >
                <DialogContent sx={{width: mobile ? '350px' : 'auto'}}>
                    <TextField
                        autoFocus
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center'}}>
                    <Button onClick={handleSubscribeClose}>Cancel</Button>
                    <Button onClick={handleSubscribeClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
