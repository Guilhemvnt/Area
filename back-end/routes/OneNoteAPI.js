const microsoft = require('../appMicrosoft/graph/microsotfAPI');
require('dotenv').config();
const GetStat = require('./GetStat');

function getNotebooks(Uid, db) {
    return new Promise((resolve, reject) => {
        try {
            microsoft.getNotebooks((notebooks) => {
                res = notebooks[0];
                console.log('Notebooks:', res);
                result = GetStat.GetStat(db, Uid, res, 'last_notebook');
                resolve(result);
            });
        } catch (error) {
            console.log(error);
            resolve(error);
        }
    });
}
module.exports.getNotebooks = getNotebooks;

async function createNotebook(name) {
    try {
        await microsoft.createNotebook(name, (notebook) => {
            return true;
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports.createNotebook = createNotebook;
