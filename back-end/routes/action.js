const {GMAIL_SECRET, GMAIL_CLIENTID} = require('dotenv').config();
const start_gmail = require('./get_token_gmail');
const message_discord = require('./message_discord');
const verifyToken = require('../middleware/auth');
const crypto = require('./cryptoAPI');
const teams = require('./TeamsAPI');
const microsoft = require('./MicrosoftAuth');
const outlook = require('./OutlookAPI');
const onenote = require('./OneNoteAPI');
const onedrive = require('./OneDriveAPI');
const GetStat = require('./GetStat');

const mapAction = {
    'Empty': () => {},
    'GetCrypto€': crypto.getEuro,
    'GetCrypto$': crypto.getDollar,
    'SendMsgDiscord': message_discord,
    'GetMsgTeams': teams.getMsg, // get messages from teams
    'GetMailOutlook': outlook.getMail, // get mail content from outlook
    'GetNotebooks': onenote.getNotebooks, // get notebooks from onenote names
    'GetFiles': onedrive.getFiles, // get files name from onedrive files names

    'GetEmailGmail': start_gmail,
    'SendMsgTeams': teams.sendMsg,
    'SendMailOutlook': outlook.sendMail,
    'CreateNotebook': onenote.createNotebook, //pas sur
    'CreateFolder': onedrive.createFolder,
}

module.exports = async function (app, db) {
    app.post('/doScenario', verifyToken, (req, res) => {
        const user_id = req.user.userId;
        const scenario_id = req.body.id;

        try {
            const getComponents = `SELECT * FROM "components" WHERE "scenario_id" = $1`;
            db.query(getComponents, [scenario_id], async (err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, error: 'get components failed' });
                }
                try {
                    const action = await mapAction[result.rows[0].component_type](user_id, db);

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('action:', action);
                    if (action != undefined) {
                        console.log('action done', action, 'trigger', result.rows[1].component_type);
                        const reactionPromise = mapAction[result.rows[1].component_type](action);
                        const reaction = await Promise.all([reactionPromise]);
                        res.status(200).json({ success: true, message: 'Action done successfully' });
                        console.log('action done', result.rows[0].component_type, result.rows[1].component_type);
                    } else {
                        res.status(200).json({ success: false, message: 'Action run but not trigger' });
                    }
                } catch (error) {
                    // Gérer les erreurs, si nécessaire
                    console.error('Une erreur s\'est produite :', error);
                }
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

    app.get('/authMicrosoft', verifyToken, (req, res) => {
        microsoft.authMicrosoft((info) => {
            res.status(200).json({ success: true, message: 'auth done', info });
        });
    });

/////////////////////////////////////////////////////////////////////
    app.get('/getNotebooks', verifyToken, (req, res) => {
        try {
            const user_id = req.user.userId;
            onenote.getNotebooks(user_id, db, (info) => {
                res.status(200).json({ success: true, message: 'notebooks done', info });
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

    app.get('/getEmail', verifyToken, (req, res) => {
        try {
            const user_id = req.user.userId;
            outlook.getMail(user_id, db, () => {
                res.status(200).json({ success: true, message: 'mail done' });
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

    app.get('/getFiles', verifyToken, (req, res) => {
        try {
            const user_id = req.user.userId;
            onedrive.getFiles(user_id, db, () => {
                res.status(200).json({ success: true, message: 'files done'});
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

    app.get('/getTeamsMsg', verifyToken, (req, res) => {
        try {
            const user_id = req.user.userId;
            teams.getMsg(user_id, db, () => {
                res.status(200).json({ success: true, message: 'teams done' });
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

    app.get('/testGetStat', async (req, res) => {
        try {
            let msg = 'bonjour';
            let user_id = 1;
            let stat = 'last_message';
            GetStat.GetStat(db, user_id, msg, stat, (res) => {
                res.status(200).json({ success: true, message: 'teams done'});
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

/////////////////////////////////////////////////////////////////////////////
    app.get('/getTokenMicrosoft', verifyToken, (req, res) => {
        microsoft.getTokenMicrosoft((accessToken) => {
            res.status(200).json({ success: true, message: 'token done', accessToken });
        });
    });

    app.post('/doCrypto', verifyToken, (req, res) => {
        const user_id = req.user.userId;
        const scenario_id = req.body.id;

        try {
            const getComponents = `SELECT * FROM "components" WHERE "scenario_id" = $1`;

            db.query(getComponents, [scenario_id], async (err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, error: 'get components failed' });
                }
                const crypto = 'BTC';
                const currency = 'usd';

                getCrypto(crypto, currency)
                .then((returnValue) => {
                    console.log('Formatted Amount:', returnValue);
                })
                .catch((error) => {
                    console.error('Error getting crypto information:', error);
                });

                res.status(200).json({ success: true, message: 'components fetched', result });
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
};
