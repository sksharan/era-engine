import mongoose from 'mongoose';

export default mongoose.Schema({
    name: String,
    type: String,
    ambient: {
        r: Number,
        g: Number,
        b: Number,
        a: Number
    },
    diffuse: {
        r: Number,
        g: Number,
        b: Number,
        a: Number
    },
    specular: {
        r: Number,
        g: Number,
        b: Number,
        a: Number
    },
    specularTerm: Number,
    quadraticAttenuation: Number,
    linearAttenuation: Number,
    constantAttenuation: Number
});
