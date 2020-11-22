const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signup"


function signup(email, password) {
    return axios.post(url, {
        email: email,
        password: password
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default signup;