const microsoft = require('../appMicrosoft/graph/microsotfAPI');
require('dotenv').config();
const GetStat = require('./GetStat');

async function getMsg(Uid, db) {
    return new Promise((resolve, reject) => {
        try {
            microsoft.getTeamsMsg(async (res) => {
                res = res[0];
                console.log('Message get:', res);
                result = GetStat.GetStat(db, Uid, res, 'last_message');
                resolve(result);
            });
        } catch (err) {
            console.log(err);
            resolve(err);
        }
    });
}
module.exports.getMsg = getMsg;

function sendMsg(msg) {
    try {
        console.log('channelID:', process.env.TEAMS_CHANNEL_ID, 'msg:', msg);
        microsoft.sendTeamsMsg(process.env.TEAMS_CHANNEL_ID, msg);
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports.sendMsg = sendMsg;
