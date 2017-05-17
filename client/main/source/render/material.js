'use strict';

/* Material that can associated with a mesh that determines
   the renderable properties of that mesh. */

const gl = require('../gl').context;
const glUtils = require('../gl-utils');

function Material(programData, imageSrc) {
    this.programData = programData;
    this.texture = glUtils.loadTextureAsync(imageSrc);
}

Material.prototype.getProgramData = function() {
    return this.programData;
}
Material.prototype.getTexture = function() {
    return this.texture;
}

module.exports = Material;
