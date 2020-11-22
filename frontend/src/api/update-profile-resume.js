const axios = require('axios');
const url = "https://techcareerhub.dev/api/profiles/resume"


function updateProfileResume(resume) {
    var formData = new FormData();
    formData.append("file", resume);
    return axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
};

export default updateProfileResume;