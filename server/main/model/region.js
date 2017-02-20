const mongoose = require('mongoose');
const regionSchema = require('./schema/region-schema');

module.exports = mongoose.model('Region', regionSchema);
