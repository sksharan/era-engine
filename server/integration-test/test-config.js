/* Reuse the main config, but with a few test-specific overrides. */
var config = require('../main/config');
config.database.url = 'mongodb://localhost/test';
config.port = 8081;
module.exports = config;
