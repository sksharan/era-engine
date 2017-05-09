'use strict';

/* Material that can associated with a mesh that determines
   the renderable properties of that mesh. */

const gl = require('../gl').context;
const glUtils = require('../gl-utils');

function Material(program, imageSrc) {
    /* The WebGL program to use when rendering the mesh. */
    this.program = program;

    this.programAttributes = {
        position: gl.getAttribLocation(this.program, 'position'),
        normal: gl.getAttribLocation(this.program, 'normal'),
        texcoord: gl.getAttribLocation(this.program, 'texcoord')
    };

    this.programUniforms = {
        modelMatrix: gl.getUniformLocation(this.program, 'modelMatrix'),
        viewMatrix: gl.getUniformLocation(this.program, 'viewMatrix'),
        projectionMatrix: gl.getUniformLocation(this.program, 'projectionMatrix')
    }

    this.texture = glUtils.loadTextureAsync(imageSrc);
}

module.exports = Material;
