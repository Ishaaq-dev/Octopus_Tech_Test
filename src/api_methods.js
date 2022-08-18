const axios = require('./axios');

module.exports.get_outages = async () => {
    let outages = [];
    try {
        outages = await this.make_request("/outages");
    } catch (error) {
        console.error(error);
    }
    if (outages.data.length === 0)
        console.log('No outages retrieved');

    return outages.data;
}
  
module.exports.get_site_info = async (site_name) => {
    if (typeof site_name != 'string') {
      console.log("You must pass a `site_name` as an argument to this method");
      return false;
    }
    let site_info = {};
    try {
        site_info = await this.make_request("/site-info/" + site_name);
    } catch (error) {
        console.error(error);
    }

    if (Object.keys(site_info.data).length === 0) {
      console.log(`No info on ${site_name} retrieved`);
    }
    return site_info.data;
}

module.exports.post_site_outages = async (site_name, payload) => {
    if (typeof site_name != 'string'  || typeof payload != 'object') {
        console.log("You must pass a `site_name` and `payload` as arguments to this method");
        return false;
    }

    let response = {};
    try {
        response = await this.make_request('/site-outages/' + site_name, payload);
    } catch (error) {
        console.error(error);
    }

    return {
        status: response.status,
        message: response.data
    }
}

module.exports.make_request = async (endpoint, payload=false) => {
    let status_code = 500;
    let retry_counter = 0;
    let response = null;
    while (status_code === 500 && retry_counter < 3) {
        try {
            if (payload && typeof payload === "object")
                response = await axios.post(endpoint, payload);
            else 
                response = await axios.get(endpoint)
        } catch (error) {
            throw error;
        }
        status_code = response.status;
        retry_counter++;
    }
    if (status_code === 500) {
        throw new Error('Error occurred communicating with API, reached retry limit');
    }
    return response
}
