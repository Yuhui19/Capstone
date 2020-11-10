const axios = require('axios');

const url = "https://techcareerhub.dev/api/users/signin"


function signin(email, password) {
    return axios.post(url, {
        email: email,
        password: password
    }, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },
    })
    // return fetch(url, {
    //     method: 'POST', 
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Cookie': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InhpYW5namllbGkxOTk3QGdtYWlsLmNvbSIsImV4cCI6MTYwNDYwMzI3Mn0.NJhjtBwcRO0yDX82yJUWCM4spLkYYmo1wgjtB60d094"

    //     },
    //     body: JSON.stringify({
    //         email: email,
    //         password: password
    //     }),
    // })
};

export default signin;