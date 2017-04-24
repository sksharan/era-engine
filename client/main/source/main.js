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

// Get test region data
const regionUtils = require('./region-utils');
let tiles = [];
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        tiles.push({ loc: { x: i, y: i+j+1, z: j } });
    }
}
let hexRadius = 5;
let data = regionUtils.getRenderData(tiles, hexRadius);

// Init buffer data
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

function render() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttribLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    keyboardHandler.processKeys();

    gl.uniformMatrix4fv(viewMatrixUniLoc, gl.FALSE, camera.getViewMatrix());

    gl.uniformMatrix4fv(projectionMatrixUniLoc, gl.FALSE,
        mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.0, 100.0));

    gl.drawElements(gl.LINE_STRIP, data.indices.length, gl.UNSIGNED_SHORT, 0);
}

function mainLoop() {
    render();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
