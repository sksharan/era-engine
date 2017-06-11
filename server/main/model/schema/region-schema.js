import mongoose from 'mongoose';
import tileSchema from './tile-schema';

module.exports = mongoose.Schema({
    name: String,
    tiles: [tileSchema]
});
