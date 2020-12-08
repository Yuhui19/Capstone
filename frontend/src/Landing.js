import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css'
import Button from '@material-ui/core/Button';


import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Menu} from "@material-ui/icons";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';


import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {CardHeader, FormControl} from "@material-ui/core";
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, HorizontalBarSeries, XAxis, YAxis} from 'react-vis';


import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import Paper from '@material-ui/core/Paper';
import currentUser from './api/current-user';
import  { Redirect } from 'react-router-dom'



function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {/*<Link color="inherit" href="https://material-ui.com/">*/}
            <Link color="inherit" href="https://github.com/Yuhui19/Capstone">
                TechCareer Hub
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(5, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        // width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '20%', // 16:9
        // flex: 1,
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(4),
    },
    button: {
        variant: "contained",
        color: "primary",
        // color: "#20c997",
        justifyContent: 'flex-end'
    },
    statusOption: {
        // padding: theme.spacing(2),
        // height: '100%',
        width: "100%",
        height: 70,
    },
    pageButton: {
        display: 'flex',
    },
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});




const Landing = (props) => {
    const classes = useStyles();

    const [redirect, setRedirect] = React.useState(false);


    // React.useEffect(()=> 
    //     currentUser()
    //     .then(res => {
    //         history.push("/App", [])
    //     }
    // ), [])

    

    React.useEffect(() => {
        (async () => {
            await currentUser();
            setRedirect(true);
        })();
    }, []);

    if (redirect) {
        return <Redirect to='/App'/>;
    }



    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    {/*<Menu className={useStyles().icon}/>*/}
                    <Typography variant="h6" color="inherit" noWrap>
                        {/*TechCareer Hub*/}
                    </Typography>
                    {/* <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button variant="contained" color="primary" href="/UserSignUp">
                                Sign up
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" href="/UserSignIn">
                                Sign in
                            </Button>
                        </Grid>
                    </Grid> */}
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            TechCareer Hub
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            All opportunities for you to start your career.
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" href="/UserSignUp">
                                        Sign Up
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary" href="/UserSignIn">
                                        Sign In
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        <br></br>
                        <br></br>
                        
                      
                        <Timeline align="alternate">
                            <TimelineItem>
                                <TimelineOppositeContent>
                                <Typography variant="body2" color="textSecondary">
                                    8:30 am
                                </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                <TimelineDot>
                                    <FastfoodIcon />
                                </TimelineDot>
                                <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography variant="h6" component="h1">
                                    Get Up and Eat
                                    </Typography>
                                    <Typography>Because you need strength</Typography>
                                </Paper>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent>
                                <Typography variant="body2" color="textSecondary">
                                    10:00 am
                                </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                <TimelineDot color="primary">
                                    <LaptopMacIcon />
                                </TimelineDot>
                                <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography variant="h6" component="h1">
                                    Code
                                    </Typography>
                                    <Typography>Because it&apos;s awesome to be a tech guy!</Typography>
                                </Paper>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                <TimelineDot color="primary" variant="outlined">
                                    <HotelIcon />
                                </TimelineDot>
                                <TimelineConnector className={classes.secondaryTail} />
                                </TimelineSeparator>
                                <TimelineContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography variant="h6" component="h1">
                                    Sleep
                                    </Typography>
                                    <Typography>Because you need rest</Typography>
                                </Paper>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                <TimelineDot color="secondary">
                                    <RepeatIcon />
                                </TimelineDot>
                                </TimelineSeparator>
                                <TimelineContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography variant="h6" component="h1">
                                    Repeat
                                    </Typography>
                                    <Typography>Because this is the life you love!</Typography>
                                </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                   

                    </Container>
                </div>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                {/*<Typography variant="h6" align="center" gutterBottom>*/}
                {/*    Footer*/}
                {/*</Typography>*/}
                {/*<Typography variant="subtitle1" align="center" color="textSecondary" component="p">*/}
                {/*    /!*Something here to give the footer a purpose!*!/*/}
                {/*</Typography>*/}
                <Copyright />
            </footer>
            {/* End footer */}
        </React.Fragment>
    );

}




export default Landing;