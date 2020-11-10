const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signout"


function signout() {
    return axios.post(url)
};

export default signout;