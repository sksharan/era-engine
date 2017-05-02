'use strict';

// Init WebGL or quit if not supported
const gl = require('./gl').context;
if (!gl) {
    throw new Error('WebGL is unavailable');
}

// Setup mouse and keyboard handlers
const mouseHandler = require('./input/mouse-handler');
mouseHandler.init();
const keyboardHandler = require('./input/keyboard-handler');
keyboardHandler.init();

// Setup default material
const glUtils = require('./gl-utils');
const Material = require('./render/material');
const defaultMaterial = new Material(
    glUtils.createProgram(require('./shader/main.vert'), require('./shader/main.frag')));

// Build a scene graph from test tile data
const tileService = require('./service/tile-service');
const hexRadius = 10;
const SceneNode = require('./render/scene-node');
const root = new SceneNode();
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        const tile = { loc: { x: i, y: (i+j), z: j } };
        const renderData = tileService.getRenderData(tile, hexRadius);
        root.addChild(new SceneNode(renderData.transform, renderData.mesh, defaultMaterial));
    }
}

// Rendering
const renderer = require('./render/renderer');

// FPS counter
let prevTime = Date.now();
let frames = 0;
function updateFPS() {
    const currTime = Date.now();
    const millisElapsed = currTime - prevTime;
    frames++;
    if (millisElapsed > 1000) { // Update FPS every second
        // Note: display as ms/frame instead with console.log(millisElapsed / frames)
        // Do (ms/s)/(ms/frame) to get FPS, and there are 1000ms in a second
        console.log(1000 / (millisElapsed / frames));
        frames = 0;
        prevTime = currTime;
    }
}

// Main loop
function mainLoop() {
    renderer.render(root);
    updateFPS();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);
