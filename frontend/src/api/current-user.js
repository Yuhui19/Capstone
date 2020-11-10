const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/currentuser"


function currentUser() {
    // return fetch(url, {    
    //     method: 'GET', 
    //     credentials: 'include',
    //     headers: {
    //     //   'Content-Type': 'application/json',
    //       'Cookie': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InhpYW5namllbGkxOTk3QGdtYWlsLmNvbSIsImV4cCI6MTYwNDYwMzI3Mn0.NJhjtBwcRO0yDX82yJUWCM4spLkYYmo1wgjtB60d094"
    //     },
    // })

    return axios.get(url, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
        // headers: {'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InhpYW5namllbGkxOTk3QGdtYWlsLmNvbSIsImV4cCI6MTYwNDYxODY1MX0.pqSB-hA7Ly-uYeJU-2d8a9rjX3D5Cb4vt4EVPwkPUbg'},
    })
};

export default currentUser;