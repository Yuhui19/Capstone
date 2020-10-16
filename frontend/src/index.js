import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserSignIn from './UserSignIn'
import UserSignUp from "./UserSignUp"
import Applications from "./Applications";
import Profile from "./Profile";
import * as serviceWorker from './serviceWorker'
import { Router, Route, browserHistory, IndexRoute, BrowserRouter } from 'react-router-dom'
import {RoundedCorner, VerifiedUserSharp} from "@material-ui/icons";

function render() {
    ReactDOM.render(
        // <React.StrictMode>
        <BrowserRouter>
            <React.Fragment>
                {/*<Route exact path="/" component={App}/>*/}
                <Route exact path="/" component={Profile}/>
                <Route path="/App" component={App}/>
                <Route path="/Applications" component={Applications}/>
                <Route path="/Profile" component={Profile}/>
                <Route path="/UserSignIn" component={UserSignIn}/>
                <Route path="/UserSignUp" component={UserSignUp}/>
            </React.Fragment>
        </BrowserRouter>,
        // </React.StrictMode>,
        document.getElementById('root')
    );
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
