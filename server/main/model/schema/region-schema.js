const mongoose = require('mongoose');
const tileSchema = require('./tile-schema');

module.exports = mongoose.Schema({
    name: String,
    tiles: [tileSchema]
});
