const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signup"


function signup(email, password) {
    return axios.post(url, {
        email: email,
        password: password
    })
};

export default signup;