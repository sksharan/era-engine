'use strict';

const gl = require('./gl').context;
if (!gl) {
    throw new Error('WebGL is unavailable');
}

// Setup mouse and keyboard handlers
const mouseHandler = require('./input/mouse-handler');
mouseHandler.init();
const keyboardHandler = require('./input/keyboard-handler');
keyboardHandler.init();

const camera = require('./scene/camera');
const glUtils = require('./gl-utils');
const glMatrix = require('gl-matrix').glMatrix;
const mat4 = require('gl-matrix').mat4;
const vec3 = require('gl-matrix').vec3;

// Init React component (TODO)
require('./title');

const program = glUtils.createProgram(require('./shader/main.vert'), require('./shader/main.frag'));
var positionAttribLoc = gl.getAttribLocation(program, 'position');
var viewMatrixUniLoc = gl.getUniformLocation(program, 'viewMatrix');
var projectionMatrixUniLoc = gl.getUniformLocation(program, 'projectionMatrix');

// Init buffer data
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, -3, 0, 5, -3, 7, 0, -3]), gl.STATIC_DRAW);

function render() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.7, 0.7, 0.7, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttribLoc, 3, gl.FLOAT, false, 0, 0);

    keyboardHandler.processKeys();

    gl.uniformMatrix4fv(viewMatrixUniLoc, gl.FALSE, camera.getViewMatrix());

    gl.uniformMatrix4fv(projectionMatrixUniLoc, gl.FALSE,
        mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.0, 100.0));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function mainLoop() {
    render();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
