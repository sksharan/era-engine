const gl = require('./gl');

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
        throw new Error('Error compiling shader:n\n' + info);
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
    }
}
