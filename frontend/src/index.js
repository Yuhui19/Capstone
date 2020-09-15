import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const jobs = [
    {
        query:"software graduate",
        location:"Worldwide",
        title:"Software Engineer - University Graduate",
        company:"PayPal","place":"San Francisco, CA",
        date:"2020-08-11",
        link:"https://www.linkedin.com/jobs/view/software-engineer-university-graduate-at-paypal-2147928361?refId=83056685-7469-40b3-97ea-ce0896d856a9&position=1&pageNum=0&trk=public_jobs_job-result-card_result-card_full-click",
        senorityLevel:"Not Applicable",
        function:"Engineering, Information Technology",
        employmentType:"Full-time",
        industries:"Computer Software, Financial Services, Internet",
        imageUrl:"images/google.png"
    }
];

const state = {
    turnData : {
        job : jobs[0],
        location : jobs[0].location,
        title : jobs[0].title
    }
};

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App {...state}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
