'use strict';

/* Material that can associated with a mesh that determines
   the renderable properties of that mesh. */

const gl = require('../gl').context;

function Material(program) {
    /* The WebGL program to use when rendering the mesh. */
    this.program = program;

    this.programAttributes = {
        position: gl.getAttribLocation(this.program, 'position'),
        normal: gl.getAttribLocation(this.program, 'normal')
    };

    this.programUniforms = {
        modelMatrix: gl.getUniformLocation(this.program, 'modelMatrix'),
        viewMatrix: gl.getUniformLocation(this.program, 'viewMatrix'),
        projectionMatrix: gl.getUniformLocation(this.program, 'projectionMatrix')
    }
}

module.exports = Material;
