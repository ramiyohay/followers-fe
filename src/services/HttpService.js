import axios from "axios";

/**
 * Create an API client
 * @type {AxiosInstance}
 */
export const httpClient = axios.create({
    timeout: 60000,
    baseURL: 'http://localhost:3001',
    withCredentials: true, //important for getting the user session in the server side
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    validateStatus: function (status) {
        return status >= 200 && status < 300; // default
    },
});
