const axios = require('axios');
const url = "https://techcareerhub.dev/api/profiles/job_hunting_type"


function updateProfileJobHuntingType(jobHuntingType) {
    return axios.put(url, {
        jobHuntingType: jobHuntingType
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default updateProfileJobHuntingType;