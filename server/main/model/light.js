import mongoose from 'mongoose';
import LightSchema from './schema/light-schema';

export default mongoose.model('Light', LightSchema);
