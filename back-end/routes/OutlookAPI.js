const microsoft = require('../appMicrosoft/graph/microsotfAPI');
require('dotenv').config();
const GetStat = require('./GetStat');

function getMail(Uid, db) {
    return new Promise((resolve, reject) => {
        try {
            microsoft.getInboxAsync( async (res) => {
                // if (message.includes(process.env.EMAIL_NAME_TO_FIND)) {
                //     console.log('Find :', message);
                //     return message;
                // };
                //return undefined;
                res = res[0];
                console.log('Mail:', res);
                result = GetStat.GetStat(db, Uid, res, 'last_email');
                resolve(result);
            });
        } catch (error) {
            console.log(error);
            resolve(error);
        }
    });
}
module.exports.getMail = getMail;

function sendMail(body) {
    try {
        let email = 'guilhem.vinet@epitech.eu';
        console.log('email:', email);
        microsoft.sendMailAsync('tester scenario', body, email);
        console.log('Send mail');
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports.sendMail = sendMail;