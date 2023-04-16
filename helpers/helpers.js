const axios = require('axios');

module.exports = {
    Post: (postData) =>
        new Promise(async (resolve, reject) => {
            const { url = '', headers = {}, body = {} } = postData;
            console.log('Post Data', postData);
            try {
                const response = await axios.post(url, body, { headers });
                console.log('response', response.data);
                resolve(response.data);
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        })
};
