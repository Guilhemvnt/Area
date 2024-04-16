async function getUserStats(db, user_id, stat) {
    try {
        const query = 'SELECT ' + stat + ' FROM "userStats" WHERE user_id = $1';
        const result = await db.query(query, [user_id]);
        if (result.rows.length === 0) {
            console.log('user doesn\'t exist');
            return null;
        }
        console.log('result:', result.rows);
        return result.rows;
    } catch (error) {
        console.log('error:', error);
        return null;
    }
}

async function updateUserStats(db, user_id, lastMessage, stat) {
    try {
        console.log('update stat', stat);
        const query = 'UPDATE "userStats" SET ' + stat + ' = $1 WHERE user_id = $2';
        const result = await db.query(query, [lastMessage, user_id]);
        console.log('update last message', lastMessage);
        return lastMessage;
    } catch (error) {
        console.log('error:', error);
        return null;
    }
}

async function insertUserStats(db, user_id, lastMessage, stat) {
    try {
        console.log('user doesn\'t exist insert into');
        const query = 'INSERT INTO "userStats" (user_id,' + stat + ') VALUES ($1, $2)';
        const result = await db.query(query, [user_id, lastMessage]);
        console.log('first message posted', lastMessage);
        return lastMessage;
    } catch (error) {
        console.log('error:', error);
        return null;
    }
}

async function processStat(db, Uid, message, stat) {
    try {
        const userStats = await getUserStats(db, Uid, stat);
        console.log('userStats:', userStats);
        const res = message[0];
        if (userStats != null) {
            const lastMessage = userStats[0][stat];
            console.log('lastMessage:', lastMessage);

            if (lastMessage === res) {
                console.log('same message', lastMessage);
                return undefined;
            } else {
                return updateUserStats(db, Uid, res, stat);
            }
        } else {
            return insertUserStats(db, Uid, res, stat);
        }
    } catch (error) {
        console.log('error:', error);
        return undefined;
    }
}

async function GetStat(db, Uid, msg, stat) {
    try {
        const teamsMessage = [msg];
        console.log('Stat to get:', stat);
        const result = await processStat(db, Uid, teamsMessage, stat);
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.log('Erreur dans la fonction de test:', error);
    }
}
module.exports.GetStat = GetStat;
