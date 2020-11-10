const axios = require('axios');

const url = "https://techcareerhub.dev/api/applications/"


function setApplicationStatus(applicationId, statusCode) {
    return axios.put(url + applicationId, {
        statusCode: statusCode,
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default setApplicationStatus;