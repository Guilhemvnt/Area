const { decode } = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

module.exports = function (app, db, bcrypt, jwt, secretKey) {
  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const addUser = `INSERT INTO "user" ("username", "password") VALUES ($1, $2)`;

      db.query(addUser, [username, hashedPassword], (err, result) => {
        if (err) {
          return res.status(400).json({ error: 'Registration failed' });
        }
        console.log('User registered');
        res.json({ message: 'User registered' });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const findUser = `SELECT * FROM "user" WHERE username = $1`;

      const { rows } = await db.query(findUser, [username]);

      if (rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      const user = rows[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: '1h',
      });
      console.log('User logged in');

      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/google_login', async (req, res) => {
    const { email } = req.body;
    try {
        const findUser = `SELECT * FROM "user" WHERE username = $1`;
  
        const { rows } = await db.query(findUser, [email]);
  
        if (rows.length === 0) {
            const username = email;
            console.log(email);
            const password = (Math.random() + 1).toString(36).substring(7);
            const hashedPassword = await bcrypt.hash(password, 10);
            const addUser = `INSERT INTO "user" ("username", "password") VALUES ($1, $2)`;
      
            db.query(addUser, [username, hashedPassword], (err, result) => {
              if (err) {
                return res.status(400).json({ error: 'Registration failed' });
              }
              console.log('User registered');
              res.json({ message: 'User registered' });
            });
            const user = rows[0];

            const token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: '1h',
            });
            console.log('User logged in');
    
            res.json({ token });
        } else {
            const user = rows[0];
    
            const token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: '1h',
            });
            console.log('User logged in');
    
            res.json({ token });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

  app.get('/getUserId', verifyToken, (req, res) => {
    const userId = req.user.userId;

    res.json({ userId });
  });
};
