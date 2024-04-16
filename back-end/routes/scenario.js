const verifyToken = require('../middleware/auth');
const user = require('./user');

module.exports = function (app, db) {
  app.post('/addScenario', verifyToken, (req, res) => {
    const { scenario_name, scenario_description } = req.body;
    const user_id = req.user.userId;

    console.log(req.body);
    try {
      const addScenario = `INSERT INTO "scenarios" ("user_id", "scenario_name", "scenario_description") VALUES ($1, $2, $3) RETURNING *`;

      db.query(addScenario, [user_id, scenario_name, scenario_description], (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, error: 'add scenario failed' });
        }

        const insertedScenario = result.rows[0];

        console.log('scenario added');
        res.json({ success: true, message: 'scenario added', scenario: insertedScenario });
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get('/getScenarios', verifyToken, (req, res) => {
    const user_id = req.user.userId;

    try {
      const getScenario = `SELECT * FROM "scenarios" WHERE "user_id" = $1`;

      db.query(getScenario, [user_id], (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, error: 'get scenarios failed' });
        }
        console.log('scenario fetched');
        res.json({ success: true, message: 'scenario fetched', result });
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get('/getScenario', verifyToken, (req, res) => {
    const user_id = req.user.userId;
    const scenario_id = req.body.id;

    try {
      const getScenario = `SELECT * FROM "scenarios" WHERE "user_id" = $1 AND "id" = $2`;

      db.query(getScenario, [user_id, scenario_id], (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, error: 'get scenario failed' });
        }
        console.log('scenario fetched');
        res.json({ success: true, message: 'scenario fetched', result });
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
};
