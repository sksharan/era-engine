import mongoose from 'mongoose';
import regionSchema from './schema/region-schema';

module.exports = mongoose.model('Region', regionSchema);
