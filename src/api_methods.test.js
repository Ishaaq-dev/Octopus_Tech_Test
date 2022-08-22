var axios = require("axios");
jest.mock('axios');
jest.spyOn(console, 'log');

const api_methods = require('./api_methods');
const test_data = require('./test_data/test_data');

afterEach(() => {
    jest.clearAllMocks();
  });

describe('make_request() function', () => {
    describe('throws error', () => {
        it('when axios call to api fails', async () => {
            axios.get.mockRejectedValueOnce('an error has occurred')
            let response = null;
            let error = null;
            try {
                response = await api_methods.make_request('/test');
            } catch (err) {
                error = err;
            }
            expect(error).toEqual('an error has occurred')
            expect(response).toEqual(null);
        });
    })

    describe('makes the correct request', () => {
        it('when given a payload it makes a POST request', async () => {
            const data = {
                status: 200,
                data:'POST request has been made'
            };
            axios.get.mockRejectedValue('GET request should not have been made');
            axios.post.mockResolvedValue(data);

            const response = await api_methods.make_request('/test', {payload: 'hello world'});
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(response).toEqual(data);
        });
        it('when no payload is given it makes a GET request', async () => {
            const data = {
                status: 200,
                data:'GET request has been made'
            };
            axios.post.mockRejectedValue('POST request should not have been made');
            axios.get.mockResolvedValue(data);

            const response = await api_methods.make_request('/test');
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(response).toEqual(data);
        });
    });

    describe('retries the request when response has status 500', () => {
        it('retries api request 3 times with GET then fails', async () => {
            axios.post.mockRejectedValue('POST request should not have been made');
            axios.get.mockResolvedValue({
                status: 500,
                data:'GET request has been made - RETRY'
            });
            let response = null, error = null;
            try {
                response = await api_methods.make_request('/test');
            } catch (err) {
                error = err;
            }
            
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(axios.get).toHaveBeenCalledTimes(3);
            expect(error).toEqual(new Error('Error occurred communicating with API, reached retry limit'));
        });

        it('retries api request 3 times with POST then fails', async () => {
            axios.get.mockRejectedValue('GET request should not have been made');
            axios.post.mockResolvedValue({
                status: 500,
                data:'POST request has been made - RETRY'
            });
            
            let response = null, error = null
            try {
                response = await api_methods.make_request('/test', {payload: 'hello world'});
            } catch (err) {
                error = err;
            }
            
            expect(axios.post).toHaveBeenCalledTimes(3);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(error).toEqual(new Error('Error occurred communicating with API, reached retry limit'));
            expect(response).toEqual(null);
        });
    })
});

describe('get_outages() function', () => {
    describe('returns empty array', () => {
        it('when api errors', async () => {
            axios.get.mockRejectedValue('simulated error');
            let response = null, error = null;
            try {
                response = await api_methods.get_outages();
            } catch (err) {
                error = err;
            }
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(error).toEqual('simulated error');
            expect(response).toEqual(null);
        });

        it('when api responds with 200 status but empty array', async () => {
            const data = {
                status: 200,
                data: []
            };
            axios.get.mockResolvedValue(data);
            const response = await api_methods.get_outages();
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(data.data)
        });
    });

    it('returns outages correctly given api responds with 200 status', async () => {
        axios.get.mockResolvedValue({
            status: 200,
            data: test_data.mock_outages
        });
        const response = await api_methods.get_outages();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledTimes(0);
        expect(console.log).toHaveBeenCalledTimes(0);
        expect(response).toEqual(test_data.mock_outages);
    });
});

describe('get_site_info() function', () => {
    describe('returns false when supplied with incorrect parameter', () => {
        it('when "site_name" is null', async () => {
            const response = await api_methods.get_site_info(null);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(false);
        });

        it('when "site_name" is not a string', async () => {
            const response = await api_methods.get_site_info(200);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(false);
        });
    });

    describe('returns empty object', () => {
        it('when api call fails', async () => {
            axios.get.mockRejectedValue('simulated error');
            let response = null, error = null;
            try {
                response = await api_methods.get_site_info('test');
            } catch (err) {
                error = err;
            }
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(console.log).toHaveBeenCalledTimes(0);
            expect(error).toEqual('simulated error')
            expect(response).toEqual(null);
        });
        it('when api returns 200 status but empty object', async () => {
            axios.get.mockResolvedValue({
                status: 200,
                data: {}
            });
            const response = await api_methods.get_site_info('test');
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(console.log).toHaveBeenCalledTimes(0);
            expect(response).toEqual({});
        });

    });
    it('returns site_info correctly given api responds with 200', async () => {
        axios.get.mockResolvedValue({
            status: 200,
            data: test_data.mock_site_info
        });
        const response = await api_methods.get_site_info('test');
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledTimes(0);
        expect(console.log).toHaveBeenCalledTimes(0);
        expect(response).toEqual(test_data.mock_site_info)
    })
});

describe('post_site_outages() function', () => {
    describe('returns false when supplied with incorrect parameters', () => {
        it('both parameters are null', async () => {
            const response = await api_methods.post_site_outages(null, null);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(false);
        });
        it('site_name is correct and payload is incorrect', async () => {
            const response = await api_methods.post_site_outages('test', 'this is incorrect');
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(false);
        });
        it('site_name is incorrect and payload is correct', async () => {
            const response = await api_methods.post_site_outages(200, {payload: 'is correct'});
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(0);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(response).toEqual(false);
        })
    });
    it('returns empty object when api call fails', async () => {
        axios.post.mockRejectedValue('simulated error');
        let response = null, error = null;
        try {
            response = await api_methods.post_site_outages('test', {payload: 'payload'});
        } catch (err) {
            error = err;
        }
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(0);
        expect(error).toEqual('simulated error');
        expect(response).toEqual(null);
    });
    it('successfully returns data when api returns 200 status', async () => {
        const data = {
            status: 200,
            data: 'successfully uploaded site outages'
        };
        axios.post.mockResolvedValue(data);
        const response = await api_methods.post_site_outages('test', {payload: 'payload'});
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(0);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('site outages have successfully been uploaded');
        expect(response).toEqual(data);
    });
    it('successfully returns data when api returns anything but 200 or 500 status code', async () => {
        const data = {
            status: 400,
            data: 'site outages upload unsuccessful'
        };
        axios.post.mockResolvedValue(data);
        const response = await api_methods.post_site_outages('test', {payload: 'payload'});
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(0);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('site outages have not successfully been uploaded');
        expect(response).toEqual(data);
    })

})