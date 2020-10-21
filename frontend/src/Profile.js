import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import App from "./App";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css'
import Button from '@material-ui/core/Button';
import info from './linkedin_output.json'

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
import Table from "@material-ui/core/Table";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import userEvent from "@testing-library/user-event";
import {useDropzone} from 'react-dropzone';

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
    statusGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
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
        padding: theme.spacing(6),
    },
    button: {
        variant: "contained",
        color: "primary",
        // color: "#20c997",
        justifyContent: 'flex-end'
    },
    lookingForTitle: {
        padding: 30,
    },
    lookingForOptions: {
        padding: 50,
        paddingTop: theme.spacing(0),
    }
}));

function Dropzone(props) {
    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true
    });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <Button variant="contained" color="primary" onClick={open}>
                Upload New Resume
            </Button>
        </div>
    );
}

function Profile() {
    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar>
                    {/*<Menu className={useStyles().icon}/>*/}
                    <Typography variant="h5" color="inherit">
                        {/*TechCareerHub*/}
                        <Link color="inherit" href="/App">
                            TechCareerHub
                        </Link>
                    </Typography>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button variant="contained" color="primary" href="/Applications">
                                Application
                            </Button>
                        </Grid>
                        <Grid item>
                            {/*<Link to="/UserSignIn">*/}
                            <Button variant="contained" color="primary" href="/Profile">
                                Profile
                            </Button>
                            {/*</Link>*/}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <main>
                <br></br>
                <br></br>
                <div>
                    <Container maxWidth="sm">
                        <Typography component="h6" variant="h4" color="textPrimary" gutterBottom>
                            Name
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            University
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Major
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Email
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Expected Graduate Date
                        </Typography>
                        <Button variant="contained" color="primary">
                            Edit
                        </Button>
                    </Container>
                </div>
                <Container className={useStyles().statusGrid} maxWidth="sm">
                    <Card className={useStyles().card}>
                        <Typography className={useStyles().lookingForTitle} component="h6" variant="h5" color="textPrimary" gutterBottom>
                            I am looking for
                        </Typography>
                        <FormControl className={useStyles().lookingForOptions} variant="outlined">
                            <Select defaultValue={20}>
                                <MenuItem value={10}>an internship</MenuItem>
                                <MenuItem value={20}>a full-time job</MenuItem>
                                <MenuItem value={30}>a part-time job</MenuItem>
                                <MenuItem value={40}>a career break</MenuItem>
                            </Select>
                        </FormControl>
                    </Card>
                    <br></br>
                    <Card className={useStyles().card}>
                        <Typography className={useStyles().lookingForTitle} component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Resume
                        </Typography>
                        <Grid container spacing={5} justify="center">
                            <Grid item >
                                {/*<Button variant="contained" color="primary">*/}
                                {/*    Upload New Resume*/}
                                {/*</Button>*/}
                                <Dropzone />
                                {/*<div id="upload"></div>*/}
                            </Grid>
                            <Grid item >
                                <Button variant="outlined" color="primary">
                                    View Current Resume
                                </Button>
                                {/*<Button className={useStyles().button}>*/}
                                {/*    View Current Resume*/}
                                {/*</Button>*/}
                            </Grid>
                        </Grid>
                        <br></br>
                    </Card>
                    <br></br>
                    {/*<Card className={useStyles().card}>*/}
                    {/*    <Typography className={useStyles().lookingForTitle} component="h6" variant="h5" color="textPrimary" gutterBottom>*/}
                    {/*        Experience*/}
                    {/*    </Typography>*/}
                    {/*</Card>*/}
                </Container>
            </main>
        </React.Fragment>
    )
}
export default Profile;