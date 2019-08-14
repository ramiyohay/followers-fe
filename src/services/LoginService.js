import cookie from 'react-cookies';
import {httpClient} from "./HttpService";

/**
 * Remove cookie
 * @private
 */
const _clearCookie = () => {
    cookie.remove('user_id');
    cookie.remove('username');
};

/**
 * Is user logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
    const userId = cookie.load('user_id');
    return userId !== null && userId !== undefined;
}

/**
 * Execute login
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Login(username, password) {
    return new Promise(function (resolve, reject) {
        httpClient.post('/users/login', {
            username,
            password
        })
            .then(function (response) {
                if (response && response.data) {
                    const user = response.data.user;
                    const expires = new Date();

                    expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14);

                    cookie.save('user_id', user.id, {expires});
                    cookie.save('username', user.username, {expires});

                    resolve();
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

/**
 * Execute logout
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Logout() {
    return new Promise(function (resolve, reject) {
        httpClient.post('/users/logout', {})
            .finally(function (response) {
                _clearCookie();
                resolve();
            });
    });
}
