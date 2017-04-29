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
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const tile = { loc: { x: i, y: 10*(Math.random()), z: j } };
        const renderData = tileService.getRenderData(tile, hexRadius);
        root.addChild(new SceneNode(renderData.transform, renderData.mesh, defaultMaterial));
    }
}

const renderer = require('./render/renderer');

function mainLoop() {
    renderer.render(root);
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
