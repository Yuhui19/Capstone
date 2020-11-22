const axios = require('axios');
const url = "https://techcareerhub.dev/api/profiles"


function setProfileBasic(name, university, major, degree) {
    return axios.post(url, {
        name: name,
        university: university,
        major: major,
        currentDegree: degree
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default setProfileBasic;