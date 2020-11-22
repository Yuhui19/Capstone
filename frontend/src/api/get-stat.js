const axios = require('axios');

const url = "https://techcareerhub.dev/api/stat/"


function getStat(jobId) {
    return axios.get(url + jobId)
};

export default getStat;