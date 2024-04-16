const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const verifyToken = require('./middleware/auth');
const routesModule = require('./routes/user');
const routesComponent = require('./routes/components');
const routesScenario = require('./routes/scenario');
const routesAction = require('./routes/action');
const routesAbout = require('./about/about');

require('dotenv').config();

const PORT = process.env.PORT;
const TOKEN_KEY = process.env.TOKEN_KEY;
console.log('TEAMS_CHANNEL_ID:', process.env.TEAMS_CHANNEL_ID);
const secretKey = `${TOKEN_KEY}`;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Montez le routeur aboutRouter sous le chemin '/about'
app.use('/', routesAbout);

routesModule(app, db, bcrypt, jwt, secretKey);
routesScenario(app, db);
routesComponent(app, db);
routesAction(app, db);

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'you are in Protected route' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('*', (req, res) => {
  const message = "You are lost, you can find about.json in : <a href='/about.json'>http://localhost:8080/about.json</a>";
  res.send(message);
});
