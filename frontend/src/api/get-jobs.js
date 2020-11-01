const axios = require('axios');

const url = "https://techcareerhub.dev/api/jobs"


function getJobs() {
    return axios.get(url)
};

export default getJobs;