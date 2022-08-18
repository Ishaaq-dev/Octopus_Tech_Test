const EARLIEST_DATE = new Date(String(new Date().getFullYear()));

module.exports.filter_outages = (outages, site_info, earliest_date=EARLIEST_DATE) => {
    if (!Array.isArray(outages) || !site_info) {
        console.log('You must pass both:\n - an array of `outages` \n - `site_info`');
        return false;
    }
    
    if (typeof site_info != "object" || !site_info.hasOwnProperty('devices')){
        console.log('`site_info` is incorrectly formatted');
        return false
    }

    const site_info_ids = site_info.devices.map(device => device.id );

    const outages_to_upload = outages.filter(outage => {
        const outage_begin_date = new Date(outage.begin);
        if (outage_begin_date >= earliest_date && site_info_ids.includes(outage.id)) {
            outage['name'] = this.get_device_name(site_info.devices, outage.id);
            return outage;
        }
    });

    return outages_to_upload;
}

module.exports.get_device_name = (devices, id) => {
    const device = devices.filter(device => {
        if (device.id === id) {
            return device;
        }
    });
    if (device.length === 1)
        return device[0].name;
    else
        return false;
}