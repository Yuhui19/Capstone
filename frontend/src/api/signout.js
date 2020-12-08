const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signout"


function signout() {
    return axios.post(url, {}, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default signout;