const verifyToken = require('../middleware/auth');
const user = require('./user');

module.exports = function (app, db) {
  app.post('/getComponents', verifyToken, (req, res) => {
    const user_id = req.user.userId;
    const scenario_id = req.body.id;

    try {
      const checkOwnership = 'SELECT * FROM "scenarios" WHERE "id" = $1 AND "user_id" = $2';
      db.query(checkOwnership, [scenario_id, user_id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0 || results.rows[0].user_id !== user_id) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      });

      try {
        const getComponents = `SELECT * FROM "components" WHERE "scenario_id" = $1`;
        db.query(getComponents, [scenario_id], (err, result) => {
          if (err) {
            return res.status(400).json({ success: false, error: 'get components failed' });
          }
          res.json({ success: true, message: 'components fetched', result });
          console.log('components fetched');
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post('/addComponent', verifyToken, (req, res) => {
    const userId = req.user ? req.user.userId : null; // Check if req.user is defined

    if (!userId) {
      console.log('User is undefined');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const scenario_id = req.body.scenario_id;
    const component_name = req.body.component_name;
    const component_type = req.body.component_type;
    const link_to = req.body.link_to;

    console.log(scenario_id, component_name, component_type, link_to);
    try {
      const checkOwnership = 'SELECT * FROM "scenarios" WHERE "id" = $1 AND "user_id" = $2';
      db.query(checkOwnership, [scenario_id, userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0 || results.rows[0].user_id !== userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
          const addComponent = 'INSERT INTO "components" ("scenario_id", "component_name", "component_type", "link_to") VALUES ($1, $2, $3, $4)';
          db.query(addComponent, [scenario_id, component_name, component_type, link_to], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            return res.json({ message: 'Component added successfully' });
          });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete('/delComponent', verifyToken, (req, res) => {
    const userId = req.user.userId;
    const scenario_id = req.body.scenario_id
    const component_id = req.body.component_id;

    console.log(scenario_id, component_id);
    console.log(userId);

    try {
      const checkOwnership = 'SELECT * FROM "scenarios" WHERE "id" = $1 AND "user_id" = $2';
      db.query(checkOwnership, [scenario_id, userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0 || results.rows[0].user_id !== userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
          const deleteComponent = 'DELETE FROM "components" WHERE "id" = $1';
          db.query(deleteComponent, [component_id], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            return res.json({ message: 'Component deleted successfully' });
          });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
}
