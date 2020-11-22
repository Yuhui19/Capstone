const axios = require('axios');
const url = "https://techcareerhub.dev/api/subscriptions/"


function deleteSubscription(id) {
    return axios.delete(url + id, {
        withCredentials: true,
        maxRedirects: 0,
        // validateStatus: function (status) {
        //     return status <= 302; // Reject only if the status code is greater than 302
        // },
    })
};

export default deleteSubscription;