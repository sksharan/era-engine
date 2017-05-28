// glMatrix
import {mat4, vec3} from 'gl-matrix'
// Event handling
import {initMouseHandler} from './input/mouse-handler'
import KeyboardHandler from './input/keyboard-handler'
// Material creation
import Material from './render/material'
import ProgramBuilder from './gl/program-builder'
// Scene graph setup
import TileService from './service/tile-service'
import SceneNode from './render/scene-node'
// Rendering
import Renderer from './render/renderer'

export function begin(MainComponent) {
    // Setup mouse and keyboard handlers
    initMouseHandler();
    KeyboardHandler.init();

    // Setup default material
    const programData = new ProgramBuilder()
            .addPosition()
            .addNormal()
            //.addTexcoord()
            .addPhongLighting()
            .build();
    const debugImageSrc = 'textures/debug.png';
    const defaultMaterial = new Material(programData, debugImageSrc);

    // Build a scene graph from test tile data
    const hexRadius = 10;
    const root = new SceneNode();
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const tile = { loc: { x: i, y: i+j+1, z: j } };
            const renderData = TileService.getRenderData(tile, hexRadius);
            const child = new SceneNode(renderData.localMatrix, renderData.mesh, defaultMaterial);
            root.addChild(child);

            if (i < 2 && j < 2) {
                child.addChild(new SceneNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 10, 0)),
                    renderData.mesh, defaultMaterial));
                child.addChild(new SceneNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, -10, 0)),
                    renderData.mesh, defaultMaterial));
            }
        }
    }

    // FPS counter
    function updateFPS() {
        const currTime = Date.now();
        const millisElapsed = currTime - MainComponent.state.prevTime;
        MainComponent.setState((prevState) => ({
            frames: prevState.frames + 1
        }));
        if (millisElapsed >= 1000) { // Update FPS approximately every second
            MainComponent.setState((prevState) => ({
                prevTime: currTime,
                frames: 0,
                // Note: display as ms/frame instead with console.log(millisElapsed / frames)
                // Do (ms/s)/(ms/frame) to get FPS, and there are 1000ms in a second
                fps: 1000 / (millisElapsed / prevState.frames)
            }));
        }
    }

    // Start main loop
    function mainLoop() {
        KeyboardHandler.processKeys();
        Renderer.render(root);
        updateFPS();
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}
