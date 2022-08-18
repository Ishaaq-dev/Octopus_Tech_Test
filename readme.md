# Introduction
Hi, 

I have produced a small program that:
- returns all outages
- retreives information on any given site
- filters outages based on site and supplied data
- posts the site's outages to `site_outages/{site_id}` successfully
- it is also resilient to 500 status code on any given api call

# Resiliency

The program will retry the api call if it receives a 500.

However it will only retry the call 3 times.

If after three times the api is still responding with a 500 status error, then I throw an error and interupt the program.

# How to run

- clone the project
- open terminal
- `cd` into the cloned project (top-level: `~/path/to/Octopus-Tech-Test`)
- create a copy of `.env copy` file
- rename the copy you have just made to `.env`
- input the following details into `.env`:
  - API_URL
  - API_KEY 
- install dependencies - `npm install`
- run program - `npm start`
- run unit tests - `npm test`