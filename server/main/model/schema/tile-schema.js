const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    name: String,
    /* The axial coordinates of this tile, as described at
       http://www.redblobgames.com/grids/hexagons/ */
    loc: {
        x: Number,
        y: Number
    }
});
