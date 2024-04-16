const { file } = require('googleapis/build/src/apis/file');
const microsoft = require('../appMicrosoft/graph/microsotfAPI');
require('dotenv').config();
const GetStat = require('./GetStat');

function getFiles(Uid, db) {
    return new Promise((resolve, reject) => {
        try {
            microsoft.getFiles((files) => {
                res = files[0];
                console.log('Files:', res);
                result = GetStat.GetStat(db, Uid, res, 'last_file');
                resolve(result);
                //return undefined;
            });
        } catch (error) {
            console.log(error);
            resolve(error);
        }
    });

}
module.exports.getFiles = getFiles;

async function createFolder(folderName) {
    try {
        await microsoft.createFolder(folderName, (file) => {
            console.log('File:', file);
            return true;
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports.createFolder = createFolder;
