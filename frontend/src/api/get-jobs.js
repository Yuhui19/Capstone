const axios = require('axios');

// const url = "https://cors-anywhere.herokuapp.com/http://localhost:8080/api/jobs"


function getJobs() {
    return axios.get("http://" + window.location.host + "/api/jobs")
};

export default getJobs;