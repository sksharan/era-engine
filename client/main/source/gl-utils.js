'use strict';

const gl = require('./gl').context;

function createVertexShader(vertexShaderSourceCode) {
    return createShader(gl.VERTEX_SHADER, vertexShaderSourceCode);
}
function createFragmentShader(fragmentShaderSourceCode) {
    return createShader(gl.FRAGMENT_SHADER, fragmentShaderSourceCode);
}
function createShader(type, shaderSourceCode) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        const typeName = (type == gl.VERTEX_SHADER) ? 'vertex' : 'fragment';
        throw new Error('Error compiling ' + typeName + ' shader:n\n' + info);
    }
    return shader;
}

module.exports = {
    /* Creates shaders from the given source code, links the shaders into a program,
     * and returns the created program. */
    createProgram: function(vertexShaderSourceCode, fragmentShaderSourceCode) {
        var program = gl.createProgram();
        gl.attachShader(program, createVertexShader(vertexShaderSourceCode));
        gl.attachShader(program, createFragmentShader(fragmentShaderSourceCode));
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error('Error linking program:\n\n' + info);
        }
        return program;
    },

    /* Creates a texture using the given image source. Returns the handle to the
       texture immediately, but loads the image data asynchronously. */
    loadTextureAsync: function(imageSrc) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Start with a default texture color (blue) until the image is loaded
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        let image = new Image();
        image.src = imageSrc;
        image.addEventListener('load' , function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        return texture;
    }
}
