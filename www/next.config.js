const withStylus = require('@zeit/next-stylus');

module.exports = withStylus({
  target: 'serverless',
  env: {
    API_LANG: process.env.API_LANG || 'node'
  }
  // Other options
});
