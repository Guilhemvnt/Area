const microsoft = require('../appMicrosoft/graph/microsotfAPI');
const settings = require('../appMicrosoft/graph/appSettings');
const verifyToken = require('../middleware/auth');

function isLogged() {
    return microsoft.isLogged();
}
module.exports.isLogged = isLogged;

function authMicrosoft(callback) {
    try {
        microsoft.initializeGraph(settings, (info) => {
            callback(info);
        });
        microsoft.greetUserAsync();
    } catch (error) {
        console.log(error);
    }
}
module.exports.authMicrosoft = authMicrosoft;

function getTokenMicrosoft(callback) {
    try {
        microsoft.displayAccessTokenAsync((accessToken) => {
            console.log('Access Token:', accessToken);
            callback(accessToken);
        });
    } catch (error) {
        console.log(error);
        callback(error);
    }
};
module.exports.getTokenMicrosoft = getTokenMicrosoft;
