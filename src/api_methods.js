const axios = require('./axios');

module.exports.get_outages = async () => {
    let outages = [];
    try {
        outages = await this.make_request("/outages");
        outages = outages.data;
    } catch (error) {
        throw error;
    }
    return outages;
}
  
module.exports.get_site_info = async (site_name) => {
    if (typeof site_name != 'string') {
      console.log("You must pass a `site_name` as an argument to this method");
      return false;
    }
    let site_info = {};
    try {
        site_info = await this.make_request("/site-info/" + site_name);
        site_info = site_info.data;
    } catch (error) {
        throw error;
    }

    return site_info;
}

module.exports.post_site_outages = async (site_name, payload) => {
    if (typeof site_name != 'string'  || typeof payload != 'object') {
        console.log("You must pass a `site_name` and `payload` as arguments to this method");
        return false;
    }

    let response = {};
    try {
        response = await this.make_request('/site-outages/' + site_name, payload);
        response = {
            status: response.status,
            data: response.data
        }
    } catch (error) {
        throw error;
    }

    if (response.status === 200) {
        console.log('site outages have successfully been uploaded');
    } else {
        console.log('site outages have not successfully been uploaded')
    }

    return response;
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
    if (response.status === 500) {
        throw new Error('Error occurred communicating with API, reached retry limit');
    }
    if (response.status === 404) {
        throw new Error(endpoint + ' not found')
    }
    return response
}
