const axios = require('axios');

const url = "https://techcareerhub.dev/api/subscriptions"


function getSubscriptions() {
    return axios.get(url, {
        withCredentials: true
    })
};

export default getSubscriptions;