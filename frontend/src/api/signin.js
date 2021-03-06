const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signin"


function signin(email, password) {
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

export default signin;