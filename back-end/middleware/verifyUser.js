const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

require('dotenv').config();

const TOKEN_KEY = process.env.TOKEN_KEY;

const secretKey = `${TOKEN_KEY}`;

function verifyUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userIdFromToken = decoded.userId;
    const userIdFromQuery = req.body.user_id;

    console.log("useridfromTOKEN", userIdFromToken);
    console.log("query", userIdFromQuery);

    if (userIdFromToken !== userIdFromQuery) {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.user = decoded;
    next();
  });
}


module.exports = verifyUser;