import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import App from "./App";

import React, {Component, useCallback} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css'
import Button from '@material-ui/core/Button';
import info from './linkedin_output.json'
// import application from './application.json';

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
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Menu} from "@material-ui/icons";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {FormControl} from "@material-ui/core";
import getProfile from './api/get-profile';
import getApplications from './api/get-applications';
import setApplicationStatus from './api/set-application-status';


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

const StyledTableCell = withStyles((theme) => ({
    head: {
        // backgroundColor: theme.palette.common.black,
        backgroundColor: "navy",
        // backgroundColor: "#1B4F72",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

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
    application: {
        padding: theme.spacing(2),
        marginLeft: theme.spacing(16),
        height: '100%',
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
    },
    table: {
        minWidth: 700,
    },
    statusOption: {
        // padding: theme.spacing(2),
        // height: '100%',
        width: 200,
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

// function statusChange(row, ) {
//
// }

function Applications() {
    const style = useStyles();
    const [age, setAge] = React.useState('');


    const [profile, setProfile] = React.useState({"profile": {}});

    React.useEffect(()=> 
        getProfile()
        .then(res => {
            const profileData = res.data;
            setProfile(profileData.profile);
        }
    ), [])

    const [applications, setApplications] = React.useState({"data": []});

    React.useEffect(()=> 
        getApplications()
        .then(res => {
            const applicationsData = res.data;
            setApplications(applicationsData);
        }
    ), [])

    // const handleChange = (event, row) => {
    //     setAge(event.target.value);
    //     if
    // };


    async function handleStatusChange(applicationId, statusCode) {
        await setApplicationStatus(applicationId, statusCode);
    }



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
                            <Button variant="contained" color="primary" href="/Profile">
                                Profile
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" href="/">
                                Sign Out
                            </Button>
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
                            {profile.name}
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            {profile.university}
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            {profile.major}
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            {profile.email}
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            {profile.graduateDate}
                        </Typography>
                    </Container>
                </div>
                <br/><br/>
                <Container className={useStyles().statusGrid} maxWidth="md">
                    <TableContainer component={Paper}>
                        <Table className={useStyles().table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Company</StyledTableCell>
                                    <StyledTableCell align="left">Type</StyledTableCell>
                                    <StyledTableCell align="left">Link</StyledTableCell>
                                    <StyledTableCell align="left">Date Applied</StyledTableCell>
                                    <StyledTableCell align="left">Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/*{rows.map(() => (*/}
                                {applications.data.map((application)=>(
                                    <StyledTableRow key={application.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {application.company}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{application.title}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Link href={application.link}>Link</Link>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{application.date}</StyledTableCell>
                                        {/*<StyledTableCell align="left">{row.status}</StyledTableCell>*/}
                                        <StyledTableCell align="left">
                                            {/*{row.status}*/}
                                            {/*<FormControl className={style.statusOption}>*/}
                                            {/*    /!*<StyledTableCell align="left">*!/*/}
                                            {/*    /!*    {row.status}*!/*/}
                                            {/*    /!*</StyledTableCell>*!/*/}
                                            {/*    <Select>*/}
                                            {/*        /!*<MenuItem value="">*!/*/}
                                            {/*        /!*    <em>{row.status}</em>*!/*/}
                                            {/*        /!*</MenuItem>*!/*/}
                                            {/*        <option>Interviewing</option>*/}
                                            {/*        <option>Offer</option>*/}
                                            {/*        <option>Rejected</option>*/}
                                            {/*        <option>Applied</option>*/}
                                            {/*    </Select>*/}
                                            {/*</FormControl>*/}

                                            <FormControl className={style.statusOption} variant="outlined">
                                                {/*<StyledTableCell align="left">*/}
                                                {/*    {row.status}*/}
                                                {/*</StyledTableCell>*/}
                                                <Select defaultValue={application.statusCode} onChange={async (e) => handleStatusChange(application.id, e.target.value)}>
                                                    <MenuItem value={1}>Applied</MenuItem>
                                                    <MenuItem value={2}>Online Assessment</MenuItem>
                                                    <MenuItem value={3}>Phone Interview</MenuItem>
                                                    <MenuItem value={4}>Onsite Interview</MenuItem>
                                                    <MenuItem value={5}>Offer</MenuItem>
                                                    <MenuItem value={6}>Rejected</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
                <br/><br/>
                <footer className={useStyles().footer}>
                    <Copyright />
                </footer>
            </main>
        </React.Fragment>
    )
}

export default Applications;