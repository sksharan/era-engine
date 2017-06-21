import mongoose from 'mongoose';

export default mongoose.Schema({
    name: String,
    type: String,
    // Position does not apply for DIRECTIONAL lights
    position: {
        x: Number,
        y: Number,
        z: Number
    },
    // Direction does not apply for POINT lights
    direction: {
        x: Number,
        y: Number,
        z: Number
    },
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
    intensity: Number
});
