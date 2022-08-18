const api_methods = require('./api_methods');
const helpers = require('./helpers')

const SITE_NAME = 'norwich-pear-tree'

module.exports.find_upload_outages_for_site = async (site_name=SITE_NAME) => {
    
    let uploaded_response = null;
    try {
        console.log('Step 1: Retrieve required data');
        console.log(' - outages \n - site_info');
        console.log();

        const outages = await api_methods.get_outages();
        const site_info = await api_methods.get_site_info(site_name);

        console.log('Step 2: Filter outages');
        console.log(" - Site's devices \n - Date");
        console.log();

        const outages_to_upload = helpers.filter_outages(outages, site_info);

        console.log('Step 3: Upload the outages for the specific site')
        console.log();

        uploaded_response = await api_methods.post_site_outages(site_name, outages_to_upload)

        console.log(uploaded_response)
    } catch (error) {
        console.error(error);
    }

    return uploaded_response;
}

this.find_upload_outages_for_site();
