import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css'
import Button from '@material-ui/core/Button';
// import info from './linkedin_output.json'
import getJobs from './api/get-jobs';
import applyJob from './api/apply-job';
import subscribeCompany from './api/subscribe-company';
import getStat from './api/get-stat';

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
import Pagination from '@material-ui/lab/Pagination';


import UserSignIn from "./UserSignIn";
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SignIn from "./UserSignIn";
import {BrowserRouter} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {CardHeader, FormControl} from "@material-ui/core";
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, HorizontalBarSeries, XAxis, YAxis} from 'react-vis';

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
    }
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



function ApplicationStat(props) {
    const data = props.statData;
    if (data.universityStat == null) {
        return <h>No Applicants for This Job Yet. Be the First One!</h>
    }

    const statusData = [
        {x: data.statusStat.Rejected, y: "Rejected"},
        {x: data.statusStat.Offer, y: "Offer"},
        {x: data.statusStat.Onsite_Interview, y: "Onsite Interview"},
        {x: data.statusStat.Phone_Interview, y: "Phone Interview"},
        {x: data.statusStat.Online_Assessment, y: "Online Assessment"},
        {x: data.statusStat.Applied, y: "Applied"},
    ];

    const universityData = data.universityStat.map(({university, count}) => ({x: count, y: university}))

    const majorData = data.majorStat.map(({major, count}) => ({x: count, y: major}))

    const degreeData = data.degreeStat.map(({degree, count}) => ({x: count, y: degree}))


    return  <div>
        <h>Applicants' Application Status</h>
        <XYPlot height={300} width={500} yType="ordinal" margin={{left: 150}}>
            <XAxis/>
            <YAxis/>
            <HorizontalBarSeries data={statusData} />
        </XYPlot>
        <h>Applicants' Unversities</h>
        <XYPlot height={150} width={500} yType="ordinal" margin={{left: 150}}>
            <XAxis/>
            <YAxis/>
            <HorizontalBarSeries data={universityData} />
        </XYPlot>    
        <h>Applicants' Majors</h>
        <XYPlot height={150} width={500} yType="ordinal" margin={{left: 150}}>
            <XAxis/>
            <YAxis/>
            <HorizontalBarSeries data={majorData} />
        </XYPlot>     
        <h>Applicants' Degrees</h>   
        <XYPlot height={150} width={500} yType="ordinal" margin={{left: 150}}>
            <XAxis/>
            <YAxis/>
            <HorizontalBarSeries data={degreeData} />
        </XYPlot> 
    </div>
    
}





function CardsLayout(props) {
    const index = props.num;
    const info = props.data;
    const [open, setOpen] = React.useState(false);
    const [statData, setStatData] = React.useState({});
    const handleClickOpen = async () => {

        console.log("find stat for job id: " + info.id)
        const res = await getStat(info.id);

        // set stat data
        const data = res.data
        setStatData(data)
        setOpen(true);

    };
    const handleClose = () => {
        setOpen(false);
    };
    let requireImagePath = () => {
        try {
            return require("../public/images/" + info.company + ".png");
        } catch (e) {
            return false;
        }
    }
    let imagePath;
    if (requireImagePath())
        imagePath = "images/" + info.company + ".png";
    else
        imagePath = "images/default.png";

    const [iconStatus, setIconStatus] = React.useState(false)

    async function iconStatusData(event, props) {
        setIconStatus(!iconStatus)
        await subscribeCompany(info.company)
    }

    const [status, setStatus] = React.useState(7);

    async function handleSelectChange(event) {
        await applyJob(info.id, event.target.value);
        setStatus(event.target.value)
    }


    return <Grid item xs={12} sm={6} md={4}>
        <Card className={useStyles().card}>
            <CardActions>
                <CardMedia
                    className={useStyles().cardMedia}
                    image={imagePath}
                    // image="images/google.png"
                    // title="Image title"
                    action={iconStatus? <FavoriteIcon/> : <FavoriteBorderIcon/> }
                />
                {/*<FavoriteBorderIcon></FavoriteBorderIcon>*/}
                <CardHeader style={{ marginLeft: "auto"}} color="primary" action={iconStatus? <FavoriteIcon/> : <FavoriteBorderIcon/>} onClick={(e) => iconStatusData(e,props)} />
            </CardActions>
                <CardContent className={useStyles().cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {info.title}
                    </Typography>
                    <Typography>{info.company}</Typography>
                    <Typography>{info.place}</Typography>
                    <Typography>{info.employmentType}</Typography>

                </CardContent>
            <CardActions>
                {/*<Button variant="contained" color="primary" style={{ marginLeft: "auto" }} onClick={()=>window.location.href=info.data[index].link}>*/}
                <Button variant="contained" color="primary" style={{ marginLeft: "auto"}} onClick={handleClickOpen}>
                    Details
                </Button>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {info.company}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography>Title: {info.title}</Typography>
                        <Typography>Location: {info.place}</Typography>
                        <Typography>Type: {info.employmentType}</Typography>
                        <Typography>Level: {info.senorityLevel}</Typography>
                        <Typography>Industry: {info.function}</Typography>
                        <br/>
                        <FormControl className={useStyles().statusOption} variant="outlined">
                            {/*<StyledTableCell align="left">*/}
                            {/*    {row.status}*/}
                            {/*</StyledTableCell>*/}
                            <Select value={status} onChange={handleSelectChange}>
                                <MenuItem value={1}>Applied</MenuItem>
                                <MenuItem value={2}>Online Assessment</MenuItem>
                                <MenuItem value={3}>Phone Interview</MenuItem>
                                <MenuItem value={4}>Onsite Interview</MenuItem>
                                <MenuItem value={5}>Offer</MenuItem>
                                <MenuItem value={6}>Rejected</MenuItem>
                                <MenuItem value={7}>Not Applied</MenuItem>
                            </Select>
                        </FormControl>
                        <ApplicationStat statData={statData} >
                        </ApplicationStat>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="primary" onClick={()=>window.open(info.link, '_blank')}>
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

    const [data, setData] = React.useState({"data": []});

    React.useEffect(()=> 
        getJobs()
        .then(res => {
            const jobs = res.data;
            setData(jobs);
            console.log(jobs)
        }
    ), [])

    const [open, setOpen] = React.useState(false);
    const rows = parseInt(data.data.length / 3, 10);


    const maxItemOnePage = 9;
    const [page, setPage] = React.useState(1);
    function handlePageChange(page) {
        console.log("current page is: " + page);
        setPage(page);
    }


    return (
        <React.Fragment>
            <CssBaseline />
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

                    {Array.from(Array(parseInt((Math.min(data.data.length, maxItemOnePage * page) - (page - 1) * maxItemOnePage) / 3, 10)).keys()).map((row)=>(
                        <Grid container spacing={4} key={row.company}>
                            {/*first grid in first line*/}
                            <CardsLayout num={(page - 1) * maxItemOnePage + row * 3} data={data.data[(page - 1) * maxItemOnePage + row * 3]}/>
                            {/*second grid in first line*/}
                            <CardsLayout num={(page - 1) * maxItemOnePage + row * 3 + 1} data={data.data[(page - 1) * maxItemOnePage + row * 3 + 1]}/>
                            {/*third grid in first line*/}
                            <CardsLayout num={(page - 1) * maxItemOnePage + row * 3 + 2} data={data.data[(page - 1) * maxItemOnePage + row * 3 + 2]}/>
                        </Grid>
                    ))}

                    <Grid container spacing={4}>
                        {Array.from(Array(parseInt((Math.min(data.data.length, maxItemOnePage * page) - (page - 1) * maxItemOnePage) % 3, 10)).keys()).map((row) =>(
                            <CardsLayout num={data.data.length - row - 1} key={row.company} data={data.data[data.data.length - row - 1]}/>
                        ))}
                    </Grid>

                </Container>
                <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                    <Pagination count={Math.ceil(data.data.length / maxItemOnePage)} variant="outlined" color="primary" page={page} onChange={(event, page) => handlePageChange(page) } className={useStyles().pageButton}/>
                </Grid> 
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

App.defaultProps = async () => {
    const { data } = await getJobs();

    return { data : data };
}


export default App;
