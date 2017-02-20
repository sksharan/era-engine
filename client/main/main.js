const gl = require('./gl');

if (!gl) {
    throw new Error('WebGL is unavailable');
}

const glUtils = require('./gl-utils');
const program = glUtils.createProgram(require('./shader/main.vert'), require('./shader/main.frag'));

//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0.5, 0.7, 0]), gl.STATIC_DRAW);

var positionAttributeLocation = gl.getAttribLocation(program, 'position');

function render() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

render();
