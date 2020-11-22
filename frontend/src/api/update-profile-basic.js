const axios = require('axios');
const url = "https://techcareerhub.dev/api/profiles/basic"


function updateProfileBasic(name, university, major, degree) {
    return axios.put(url, {
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

export default updateProfileBasic;