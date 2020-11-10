const axios = require('axios');

const url = "https://techcareerhub.dev/api/profiles"


function getProfile() {
    return axios.get(url, {
        withCredentials: true
    })
};

export default getProfile;