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

const camera = require('./render/camera/camera');
const glUtils = require('./gl-utils');
const glMatrix = require('gl-matrix').glMatrix;
const mat4 = require('gl-matrix').mat4;
const vec3 = require('gl-matrix').vec3;

// Init React component (TODO)
require('./title');

const program = glUtils.createProgram(require('./render/shader/main.vert'), require('./render/shader/main.frag'));
var positionAttribLoc = gl.getAttribLocation(program, 'position');
var normalAttribLoc = gl.getAttribLocation(program, 'normal');
var viewMatrixUniLoc = gl.getUniformLocation(program, 'viewMatrix');
var projectionMatrixUniLoc = gl.getUniformLocation(program, 'projectionMatrix');

// Get test region data
const regionUtils = require('./render/mesh/region');
let tiles = [];
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        tiles.push({ loc: { x: i, y: 1.5*Math.random(), z: j } });
    }
}
let hexRadius = 10;
let data = regionUtils.getMesh(tiles, hexRadius);

// Init buffer data
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

var normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

function render() {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttribLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(normalAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttribLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    keyboardHandler.processKeys();

    gl.uniformMatrix4fv(viewMatrixUniLoc, gl.FALSE, camera.getViewMatrix());

    gl.uniformMatrix4fv(projectionMatrixUniLoc, gl.FALSE,
        mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 500.0));

    gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0);
}

function mainLoop() {
    render();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
