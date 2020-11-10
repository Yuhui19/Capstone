const axios = require('axios');

const url = "https://techcareerhub.dev/api/applications"


function getApplications() {
    return axios.get(url, {
        withCredentials: true
    })
};

export default getApplications;