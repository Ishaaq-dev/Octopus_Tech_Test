require('dotenv').config();
const axios = require("axios");

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['x-api-key'] = process.env.API_KEY;

module.exports = axios;