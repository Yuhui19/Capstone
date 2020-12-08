import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import App from "./App";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import subscription from './subscription.json';
import Button from '@material-ui/core/Button';
import info from './linkedin_output.json'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';


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
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Menu, ContactSupportOutlined} from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import userEvent from "@testing-library/user-event";
import {useDropzone} from 'react-dropzone';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import getProfile from './api/get-profile';
import getSubscriptions from './api/get-subscriptions';
import updateProfileBasic from './api/update-profile-basic'
import updateProfileJobHuntingType from './api/update-profile-job-hunting-type'
import updateProfileResume from './api/update-profile-resume'
import deleteSubscription from './api/delete-subscription'
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

    const files = acceptedFiles.map(async (file) => {
        // <li key={file.path}>
        //     {file.path} - {file.size} bytes
        // </li>
        await updateProfileResume(file);
    });

    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <Button variant="contained" color="primary" onClick={open}>
                Upload New Resume
            </Button>
        </div>
    );
}

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

const SubDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const SubDialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(DialogContent);

const SubDialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(DialogActions);

function Profile() {

    let jobHuntingTypeMap = new Map();
    jobHuntingTypeMap.set(1, "an internship");
    jobHuntingTypeMap.set(2, "a full-time job");
    jobHuntingTypeMap.set(3, "a part-time job");
    jobHuntingTypeMap.set(4, "a career break");

    //subscript delete button action
    const [remove, setDelete] = React.useState(false);
    const handleDeleteClick = () => {
        setDelete(true);
    };
    const handleDeleteClose = () => {
        setDelete(false);
    };

    //edit button action
    const [open, setOpen] = React.useState(false);
    // const [firstName, setFirstName] = React.useState("");
    // const [lastName, setLastName] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [university, setUniversity] = React.useState("");
    const [majorCode, setMajorCode] = React.useState(0);
    const [major, setMajor] = React.useState("Unknown");
    const [degreeCode, setDegreeCode] = React.useState(0);
    const [degree, setDegree] = React.useState("Unknown");

    // function handleFirstNameChange(event) {
    //     setFirstName(event.target.value)
    // }

    // function handleLastNameChange(event) {
    //     setLastName(event.target.value)
    // }

    function handleFullNameChange(event) {
        setFullName(event.target.value);
    }

    function handleUniversityChange(event) {
        setUniversity(event.target.value)
    }

    // function handleMajorChange(event) {
    //     setMajor(event.target.value)
    // }

    function handleMajorChange(event) {

        var curMajor = "Unknown";
        var curMajorCode = event.target.value;
        if (curMajorCode === 1) {
            curMajor = "Computer Science"
        } 
        else if (curMajorCode === 2) {
            curMajor = "Software Engineering"
        }
        else if (curMajorCode === 3) {
            curMajor = "Electrical and Computer Engineering"
        }
        else if (curMajorCode === 4) {
            curMajor = "Information System"
        }
        else if (curMajorCode === 5) {
            curMajor = "Robotics"
        }
        else if (curMajorCode === 6) {
            curMajor = "Communication Engineering"
        }
        else if (curMajorCode === 7) {
            curMajor = "Data Science"
        }
        else {
            curMajor = "Other"
        }
      
        setMajor(curMajor)
        setMajorCode(curMajorCode)
    }

    // function handleDegreeChange(event) {
    //     setDegree(event.target.value)
    // }

    function handleDegreeChange(event) {

        var curDegree = "Unknown";
        var curDegreeCode = event.target.value;
        if (curDegreeCode === 1) {
            curDegree = "High School Diploma"
        } 
        else if (curDegreeCode === 2) {
            curDegree = "College Diploma"
        }
        else if (curDegreeCode === 3) {
            curDegree = "Bachelor's"
        }
        else if (curDegreeCode === 4) {
            curDegree = "Master's"
        }
        else {
            curDegree = "PhD"
        }
        setDegree(curDegree)
        setDegreeCode(curDegreeCode)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleEditClose = () => {
        setOpen(false);
    };
    async function handleUpdateProfileBasic(event) {
        setOpen(false);
        await updateProfileBasic(fullName, university, major, degree);
        const res = await getProfile();
        const data = res.data
        setProfile(data.profile);
        setFullName(data.profile.name);
        setUniversity(data.profile.university);
        console.log("current user's profile is: ")
        console.log(data);
        // window.location.reload();
    }


    const [profile, setProfile] = React.useState({"profile": {}});
    const [jobHuntingType, setJobHuntingType] = React.useState(2);

    React.useEffect(()=> 
        getProfile()
        .then(res => {
            const profileData = res.data;
            setProfile(profileData.profile);
            setFullName(profileData.profile.name);
            setUniversity(profileData.profile.university);
            var currJobType;
            if (profileData.profile.jobHuntingType === "an internship") {
                currJobType = 1;
            }
            else if (profileData.profile.jobHuntingType === "a full-time job") {
                currJobType = 2;
            }
            else if (profileData.profile.jobHuntingType === "a part-time job") {
                currJobType = 3;
            }
            else {
                currJobType = 4;
            }
            setJobHuntingType(currJobType);
            console.log("setting the current job type as " + currJobType);

            //setMajorCode
            var currMajor = profileData.profile.major;
            var currMajorCode;
            if (currMajor === "Computer Science") {
                currMajorCode = 1;
            } 
            else if (currMajor === "Software Engineering") {
                currMajorCode = 2;
            }
            else if (currMajor === "Electrical and Computer Engineering") {
                currMajorCode = 3;
            }
            else if (currMajor === "Information System") {
                currMajorCode = 4;
            }
            else if (currMajor === "Robotics") {
                currMajorCode = 5;
            }
            else if (currMajor === "Communication Engineering") {
                currMajorCode = 6;
            }
            else if (currMajor === "Data Science") {
                currMajorCode = 7;
            }
            else {
                currMajorCode = 8;
            }
            setMajor(currMajor)
            setMajorCode(currMajorCode)

            //setDegreeCode
            var curDegree = profileData.profile.currentDegree;
            var curDegreeCode;
            if (curDegree === "High School Diploma") {
                curDegreeCode = 1;
            } 
            else if (curDegree === "College Diploma") {
                curDegreeCode = 2;
            }
            else if (curDegree === "Bachelor's") {
                curDegreeCode = 3;
            }
            else if (curDegree === "Master's") {
                curDegreeCode = 4;
            }
            else {
                curDegreeCode = 5
            }
            setDegree(curDegree)
            setDegreeCode(curDegreeCode)
        }
    ), [])






    // subscription area
    const [subscriptions, setSubscriptions] = React.useState({"data": []});

    React.useEffect(()=> 
        getSubscriptions()
        .then(res => {
            const subscriptionsData = res.data;
            setSubscriptions(subscriptionsData);
        }
    ), [])



    async function handleSelectChange(event) {
        const res = await updateProfileJobHuntingType(jobHuntingTypeMap.get(event.target.value))
        const data = res.data;
        var currJobType;
        if (data.updated_item.jobHuntingType === "an internship") {
            currJobType = 1;
        }
        else if (data.updated_item.jobHuntingType === "a full-time job") {
            currJobType = 2;
        }
        else if (data.updated_item.jobHuntingType === "a part-time job") {
            currJobType = 3;
        }
        else {
            currJobType = 4;
        }
        setJobHuntingType(currJobType);
    }

    async function handleResumeClick(event) {
        const res = await getProfile();
        const data = res.data;
        const resumeUrl = data.profile.resume;
        if (!resumeUrl) {
            return;
        }
        else {
            window.open(resumeUrl);
        }
    }

    async function handleDeleteSubClick(event, id) {
        console.log("the subscription id is: " + id)
        await deleteSubscription(id);
        const res = await getSubscriptions();
        const data = res.data;
        setSubscriptions(data)
    }



    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar>
                    {/*<Menu className={useStyles().icon}/>*/}
                    <Typography variant="h5" color="inherit">
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
                            {profile.currentDegree}
                        </Typography>
                        <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            {profile.email}
                        </Typography>
                        {/* <Typography component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Expected Graduate Date
                        </Typography> */}
                        <br></br>
                        <Button variant="contained" color="primary" onClick={handleClickOpen}>
                            Edit
                        </Button>
                        <Dialog open={open} onClose={handleEditClose}>
                            <DialogTitle>
                                Edit Profile
                            </DialogTitle>
                            <DialogContent>
                                {/* <DialogContentText>
                                    To subscribe to this website, please enter your email address here. We will send updates
                                    occasionally.
                                </DialogContentText> */}
                                <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Name"
                                    type="name"
                                    fullWidth
                                    onChange={handleFullNameChange}
                                    defaultValue = {profile.name}
                                />
                                {/* <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="lname"
                                    label="Last Name"
                                    type="lname"
                                    fullWidth
                                    onChange={handleLastNameChange}
                                /> */}
                                <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="univ"
                                    label= "University"
                                    type="univ"
                                    fullWidth
                                    onChange={handleUniversityChange}
                                    defaultValue = {profile.university}
                                />
                                {/* <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="major"
                                    label="Major"
                                    type="major"
                                    fullWidth
                                    onChange={handleMajorChange}
                                /> */}
                                <br></br>
                                <br></br>
                                <Card className={useStyles().card} fullWidth>
                                    <FormControl className={useStyles().statusOption} variant="outlined">
                                        {/*<StyledTableCell align="left">*/}
                                        {/*    {row.status}*/}
                                        {/*</StyledTableCell>*/}
                                        <Select value={majorCode} onChange={handleMajorChange}>
                                            <MenuItem value={0}>Please choose your Major</MenuItem>
                                            <MenuItem value={1}>Computer Science</MenuItem>
                                            <MenuItem value={2}>Software Engineering</MenuItem>
                                            <MenuItem value={3}>Electrical and Computer Engineering</MenuItem>
                                            <MenuItem value={4}>Information System</MenuItem>
                                            <MenuItem value={5}>Robotics</MenuItem>
                                            <MenuItem value={6}>Communication Engineering</MenuItem>
                                            <MenuItem value={7}>Data Science</MenuItem>
                                            <MenuItem value={8}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Card>
                                <br></br>
                                {/* <TextField
                                    // autoFocus
                                    margin="dense"
                                    id="degree"
                                    label="Highest Degree"
                                    type="degree"
                                    fullWidth
                                    onChange={handleDegreeChange}
                                /> */}
                                <Card className={useStyles().card} fullWidth>
                                    <FormControl className={useStyles().statusOption} variant="outlined">
                                        {/*<StyledTableCell align="left">*/}
                                        {/*    {row.status}*/}
                                        {/*</StyledTableCell>*/}
                                        <Select value={degreeCode} onChange={handleDegreeChange}>
                                            <MenuItem value={0}>Please choose your highest degree</MenuItem>
                                            <MenuItem value={1}>High School Diploma</MenuItem>
                                            <MenuItem value={2}>College Diploma</MenuItem>
                                            <MenuItem value={3}>Bachelor's</MenuItem>
                                            <MenuItem value={4}>Master's</MenuItem>
                                            <MenuItem value={5}>PhD</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Card>
                                
                            </DialogContent>
                            <br></br>
                            <DialogActions>
                                <Button onClick={handleEditClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateProfileBasic} variant="contained" color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </div>
                <Container className={useStyles().statusGrid} maxWidth="sm">
                    <Card className={useStyles().card}>
                        <Typography className={useStyles().lookingForTitle} component="h6" variant="h5" color="textPrimary" gutterBottom>
                            I am looking for
                        </Typography>
                        <FormControl className={useStyles().lookingForOptions} variant="outlined">
                            <Select value={jobHuntingType} onChange={handleSelectChange}>
                                <MenuItem value={1}>an internship</MenuItem>
                                <MenuItem value={2}>a full-time job</MenuItem>
                                <MenuItem value={3}>a part-time job</MenuItem>
                                <MenuItem value={4}>a career break</MenuItem>
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
                                <Button variant="outlined" color="primary" onClick={handleResumeClick}>
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
                    <Card className={useStyles().card}>
                        <Typography className={useStyles().lookingForTitle} component="h6" variant="h5" color="textPrimary" gutterBottom>
                            Subscription
                        </Typography>
                        <List>
                            {subscriptions.data.map((subscription)=>(
                                <ListItem key={subscription.id}>
                                    {/*<ListItemAvatar src={"../public/images/" + company + ".png"} />*/}
                                    <ListItemText spacing={2}>
                                        {subscription.company}
                                    </ListItemText>
                                    <DeleteIcon onClick={handleDeleteClick}/>
                                    <Dialog onClose={handleDeleteClose} aria-labelledby="customized-dialog-title" open={remove} fullWidth={true}>
                                        <SubDialogTitle id="customized-dialog-title" onClose={handleDeleteClose}>
                                            Do you want to delete this subscription?
                                        </SubDialogTitle>
                                        <SubDialogContent dividers>
                                            <Button variant="outlined" color="primary" onClick={(e) => handleDeleteSubClick(e, subscription.id)}>Yes</Button>
                                        </SubDialogContent>
                                    </Dialog>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Container>
                <footer className={useStyles().footer}>
                    <Copyright />
                </footer>
            </main>
        </React.Fragment>
    )
}
export default Profile;