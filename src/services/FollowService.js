import {httpClient} from "./HttpService";

/**
 * Get user following data
 * @param userId
 * @returns {Promise<unknown>}
 * @constructor
 */
export function GetUserFollowingData(userId) {
    return new Promise(function (resolve, reject) {
        httpClient.post('/users/follow_data', {
            userId
        })
            .then(function (response) {
                if (response) {
                    resolve(response);
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

/**
 * Follow user API
 * @param userId
 * @param userIdToFollow
 * @returns {Promise<unknown>}
 * @constructor
 */
export function FollowUser(userId, userIdToFollow) {
    return new Promise(function (resolve, reject) {
        httpClient.post('/users/follow_user', {
            userId,
            userIdToFollow
        })
            .then(function (response) {
                if (response) {
                    resolve(response);
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

/**
 * Unfollow user API
 * @param userId
 * @param userIdToUnfollow
 * @returns {Promise<unknown>}
 * @constructor
 */
export function UnfollowUser(userId, userIdToUnfollow) {
    return new Promise(function (resolve, reject) {
        httpClient.post('/users/unfollow_user', {
            userId,
            userIdToUnfollow
        })
            .then(function (response) {
                if (response) {
                    resolve(response);
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
}
