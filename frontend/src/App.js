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

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const jobs = [
    {
        query:"software graduate",
        location:"Worldwide",
        title:"Software Engineer - University Graduate",
        company:"PayPal",
        place:"San Francisco, CA",
        date:"2020-08-11",
        link:"https://www.linkedin.com/jobs/view/software-engineer-university-graduate-at-paypal-2147928361?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=1&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
        senorityLevel:"Not Applicable",
        function:"Engineering, Information Technology",
        employmentType:"Full-time",
        industries:"Computer Software, Financial Services, Internet"
    },
    {
        query:"software graduate",
        location:"Worldwide",
        title:"Software Engineer- (Graduate Program)",
        company:"Amdocs",
        place:"Plano, TX",
        date:"2020-07-22",
        link:"https://www.linkedin.com/jobs/view/software-engineer-graduate-program-at-amdocs-1993073833?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=2&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
        senorityLevel:"Entry level",
        function:"Engineering, Information Technology",
        employmentType:"Internship",
        industries:"Information Technology and Services, Computer Software, Telecommunications"
    }
];

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
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
        padding: theme.spacing(6),
    },
    button: {
        variant: "contained",
        color: "primary",
        justifyContent: 'flex-end'
    }
}));

function Turn(props) {
    // return <div className="row turn" style={{backgroundColor : "white"}}>
    //     <div className="col-4 offset-1">
    //         <img src={job.imageUrl} className="companyImage" alt="Company"/>
    //     </div>
    //     <div className="col-6 offset-1">
    //         {job.query}
    //     </div>
    // </div>
    var index = props.index;
    return <CardContent className={useStyles().cardContent}>
        <Typography gutterBottom variant="h5" component="h2" >
            {/*{jobs[0].title}*/}
            {info.data[index].title}
        </Typography>
        <Typography>{info.data[index].company}</Typography>
        <Typography>{info.data[index].place}</Typography>
        {/*<Typography>{info.data[0].date}</Typography>*/}
        <Typography>{info.data[index].employmentType}</Typography>

    </CardContent>
}

function App() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Menu className={classes.icon}/>
                    <Typography variant="h6" color="inherit" noWrap>
                        {/*TechCareer Hub*/}
                    </Typography>
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
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}

                    {/*first line of grid*/}
                    <Grid container spacing={4}>
                        {/*{cards.map((card) => (*/}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardActions>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="images/google.png"
                                            title="Image title"
                                        />
                                            {/*<Button variant="contained" color="primary" style={{ marginLeft: "auto" }}>*/}
                                            {/*    Save*/}
                                            {/*</Button>*/}
                                    </CardActions>
                                    <Turn index={0} />
                                    <CardActions>
                                        <Button variant="contained" color="primary" style={{ marginLeft: "auto" }}>
                                            Apply now!
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                        {/*second grid in first line*/}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardActions>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="images/facebook.png"
                                        title="Image title"
                                    />
                                </CardActions>
                                <Turn index={1} />
                                <CardActions>
                                    <Button variant="contained" color="primary" style={{ marginLeft: "auto" }}>
                                        Apply now!
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/*third grid in first line*/}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardActions>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="images/microsoft.jpg"
                                        title="Image title"
                                    />
                                </CardActions>
                                <Turn index={2} />
                                <CardActions>
                                    <Button variant="contained" color="primary" style={{ marginLeft: "auto" }}>
                                        Apply now!
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                    </Grid>

                    {/*second line of grid*/}
                    <Grid container spacing={4}>
                        {/*{cards.map((card) => (*/}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardActions>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="images/amazon.jpg"
                                        title="Image title"
                                    />
                                </CardActions>
                                <Turn index={3} />
                                <CardActions>
                                    <Button variant="contained" color="primary" style={{ marginLeft: "auto" }}>
                                        Apply now!
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>

                </Container>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    {/*Footer*/}
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    {/*Something here to give the footer a purpose!*/}
                </Typography>
                <Copyright />
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}


export default App;
