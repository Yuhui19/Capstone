import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css'
import Button from '@material-ui/core/Button';
// import info from './linkedin_output.json'
import getJobs from './api/get-jobs'

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

import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {FormControl} from "@material-ui/core";

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

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

async function CardsLayout(props) {

    // // get job info from api
    // const info = await getJobs()



    const index = props.num;
    const info = props.data;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    let requireImagePath = () => {
        try {
            return require("../public/images/" + info.data[index].company + ".png");
        } catch (e) {
            return false;
        }
    }
    let imagePath;
    if (requireImagePath())
        imagePath = "images/" + info.data[index].company + ".png";
    else
        imagePath = "images/default.png";

    // let imagePath;
    // if (companyIcon.includes(info.data[index].company))
    //     imagePath = "images/" + info.data[index].company + ".png";
    // else
    //     imagePath = "images/default.png";

    return <Grid item xs={12} sm={6} md={4}>
        <Card className={useStyles().card}>
            <CardActions>
                <CardMedia
                    className={useStyles().cardMedia}
                    image={imagePath}
                    // image="images/google.png"
                    // title="Image title"
                />
            </CardActions>
                <CardContent className={useStyles().cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {info.data[index].title}
                    </Typography>
                    <Typography>{info.data[index].company}</Typography>
                    <Typography>{info.data[index].place}</Typography>
                    <Typography>{info.data[index].employmentType}</Typography>

                </CardContent>
            <CardActions>
                {/*<Button variant="contained" color="primary" style={{ marginLeft: "auto" }} onClick={()=>window.location.href=info.data[index].link}>*/}
                <Button variant="contained" color="primary" style={{ marginLeft: "auto"}} onClick={handleClickOpen}>
                    Details
                </Button>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {info.data[index].company}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography>Title: {info.data[index].title}</Typography>
                        <Typography>Location: {info.data[index].place}</Typography>
                        <Typography>Type: {info.data[index].employmentType}</Typography>
                        <Typography>Level: {info.data[index].senorityLevel}</Typography>
                        <Typography>Industry: {info.data[index].function}</Typography>
                        <br/>
                        <FormControl className={useStyles().statusOption} variant="outlined">
                            {/*<StyledTableCell align="left">*/}
                            {/*    {row.status}*/}
                            {/*</StyledTableCell>*/}
                            <Select defaultValue={7}>
                                <MenuItem value={1}>Applied</MenuItem>
                                <MenuItem value={2}>Online Assessment</MenuItem>
                                <MenuItem value={3}>Phone Interview</MenuItem>
                                <MenuItem value={4}>Onsite Interview</MenuItem>
                                <MenuItem value={5}>Offer</MenuItem>
                                <MenuItem value={6}>Rejected</MenuItem>
                                <MenuItem value={7}>Not Applied</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="primary" onClick={()=>window.open(info.data[index].link, '_blank')}>
                            Apply Now!
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardActions>
        </Card>
    </Grid>
}

const App = (props) => {
    // const classes = useStyles();

    // get job info from api
    const info = props.data


    const [open, setOpen] = React.useState(false);
    const rows = parseInt(info.data.length / 3, 10);
    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    {/*<Menu className={useStyles().icon}/>*/}
                    <Typography variant="h6" color="inherit" noWrap>
                        {/*TechCareer Hub*/}
                    </Typography>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button variant="contained" color="primary" href="/UserSignUp">
                                Sign up
                            </Button>
                        </Grid>
                        <Grid item>
                            {/*<Link to="/UserSignIn">*/}
                            <Button variant="contained" color="primary" href="/UserSignIn">
                                    Sign in
                            </Button>
                            {/*</Link>*/}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <div className={useStyles().heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            TechCareer Hub
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            All opportunities for you to start your career.
                        </Typography>
                        <div className={useStyles().heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary">
                                        New Grad
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary">
                                        Internship
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                {/* End hero unit */}
                <Container className={useStyles().cardGrid} maxWidth="md">

                    {/*first line of grid*/}
                    {/*<Grid container spacing={4}>*/}
                    {/*    /!*first grid in first line*!/*/}
                    {/*    <CardsLayout num={0}/>*/}
                    {/*    /!*second grid in first line*!/*/}
                    {/*    <CardsLayout num={1}/>*/}
                    {/*    /!*third grid in first line*!/*/}
                    {/*    <CardsLayout num={2}/>*/}
                    {/*</Grid>*/}

                    {/*/!*second line of grid*!/*/}
                    {/*<Grid container spacing={4}>*/}
                    {/*    /!*{cards.map((card) => (*!/*/}
                    {/*    <CardsLayout num={3}/>*/}
                    {/*    <CardsLayout num={4}/>*/}
                    {/*    <CardsLayout num={5}/>*/}
                    {/*</Grid>*/}

                    {/*<Grid container spacing={4}>*/}
                    {/*    /!*{cards.map((card) => (*!/*/}
                    {/*    <CardsLayout num={6}/>*/}
                    {/*    <CardsLayout num={7}/>*/}
                    {/*    <CardsLayout num={8}/>*/}
                    {/*</Grid>*/}

                    {Array.from(Array(parseInt(info.data.length / 3, 10)).keys()).map((row)=>(
                        <Grid container spacing={4} key={row.company}>
                            {/*first grid in first line*/}
                            <CardsLayout num={row*3} data={info}/>
                            {/*second grid in first line*/}
                            <CardsLayout num={row*3+1} data={info}/>
                            {/*third grid in first line*/}
                            <CardsLayout num={row*3+2} data={info}/>
                        </Grid>
                    ))}

                    <Grid container spacing={4}>
                        {Array.from(Array(parseInt(info.data.length % 3, 10)).keys()).map((row) =>(
                            <CardsLayout num={info.data.length - row - 1} key={row.company} data={info}/>
                        ))}
                    </Grid>

                </Container>
            </main>
            {/* Footer */}
            <footer className={useStyles().footer}>
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


export default App;
