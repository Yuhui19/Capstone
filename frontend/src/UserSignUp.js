import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {FormControl} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import signup from './api/signup';
import setProfileBasic from './api/set-profile-basic';
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
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function UserSignUp() {
    const classes = useStyles();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [university, setUniversity] = React.useState("");
    const [majorCode, setMajorCode] = React.useState(0);
    const [major, setMajor] = React.useState("Unknown");
    const [degreeCode, setDegreeCode] = React.useState(0);
    const [degree, setDegree] = React.useState("Unknown");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [redirect, setRedirect] = React.useState(false);
    if (redirect) {
        return <Redirect to='/Profile'/>;
    }

    function handleFirstNameChange(event) {
        setFirstName(event.target.value)
    }

    function handleLastNameChange(event) {
        setLastName(event.target.value)
    }

    function handleUniversityChange(event) {
        setUniversity(event.target.value)
    }

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

    function handleEmailChange(event) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }


    async function handleClick(event) {
        const signupRes = await signup(email, password)
        // console.log("if has cookie : " + signRes.headers.has('Set-Cookie'))
        // console.log("if has content-type : " + signRes.headers.has('Content-Type'))
        console.log(signupRes.headers)

        var name = firstName + " " + lastName;
        const res = await setProfileBasic(name, university, major, degree);
        const data = res.data
        console.log("current user's profile is: ")
        console.log(data)
        setRedirect(true)
    }





    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                {/*<Avatar className={classes.avatar}>*/}
                {/*    <LockOutlinedIcon />*/}
                {/*</Avatar>*/}
                <Typography component="h3" variant="h5">
                    Sign Up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                // name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                // id="firstName"
                                label="First Name"
                                onChange={handleFirstNameChange}
                                // autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                // id="lastName"
                                label="Last Name"
                                onChange={handleLastNameChange}
                                // name="lastName"
                                // autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                // id="univ"
                                label="University"
                                onChange={handleUniversityChange}
                                // name="univ"
                                // autoComplete="univ"
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                // id="major"
                                label="Major"
                                onChange={handleMajorChange}
                                // name="major"
                                // autoComplete="major"
                            />
                        </Grid> */}
                        <Grid>
                            <FormControl className={classes.statusOption} variant="outlined">
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
                        </Grid>
                        <Grid>
                            <FormControl className={classes.statusOption} variant="outlined">
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                // id="email"
                                label="Email Address"
                                onChange={handleEmailChange}
                                // name="email"
                                // autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                // name="password"
                                label="Password"
                                onChange={handlePasswordChange}
                                // type="password"
                                // id="password"
                                // autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive position updates via email when I subscribe a company."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleClick}
                        // href="/Profile"
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="UserSignIn" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}