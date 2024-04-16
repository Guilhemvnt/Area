const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... other Webpack configuration ...

  plugins: [
    new Dotenv() // Use dotenv-webpack as a plugin
  ]
};
