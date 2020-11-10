const axios = require('axios');

const url = "https://techcareerhub.dev/api/applications"


function applyJob(jobId, statusCode) {
    return axios.post(url, {
        jobId: jobId,
        statusCode: statusCode,
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default applyJob;