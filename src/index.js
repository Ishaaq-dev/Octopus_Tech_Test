const prompt = require("prompt-sync")({ sigint: true });
const service = require('./service');

  
const handler = () => {
    console.log(`Hi, welcome to Ishaaq's tech test solution!`);

    console.log(`This is a backend solution to the problem. It will:\n`
                + `- retrieve all outages via the /outages endpoint \n`
                + `- get the site info for any site you desire (as long as we have permissions to get that info) \n`
                + `- post all the outages after a given date that correspond to any devices in the site \n`);
    console.log(`The program will prompt you for two inputs: \n`
                + `- site_name \n`
                + `- date\n`);

    console.log(`The 'site_name' refers to the site you'd like to find the outages for. \n`
                + `The 'date' refers to the earliest date an outage's begin date can be. \n`);
    console.log(`To speed up the process of using the program, you are able to leave the prompts blank and press enter to use the default values.\n`)
    const site_name = prompt(`site_name (default: norwich-pear-tree): `, 'norwich-pear-tree');
    const earliest_date = prompt(`date dd/mm/yyyy - eg 01/01/2022 (default: the year which you are running this program): `, '2022');
    let response = null;
    try {
        response = service.find_upload_outages_for_site(site_name, earliest_date);
    } catch (error) {
        console.error(error.messagae)
    }
};

handler();