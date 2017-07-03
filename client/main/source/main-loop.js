// glMatrix
import {mat4, vec3} from 'gl-matrix'
// Event handling
import * as MouseHandler from './engine/input/mouse-handler'
import * as KeyboardHandler from './engine/input/keyboard-handler'
// Material creation
import Material from './engine/render/material'
import ProgramBuilder from './engine/shader/program-builder'
// Lighting
import Light from './engine/render/light'
// Scene graph setup
import TileService from './service/tile-service'
import SceneNode from './engine/render/node/scene-node'
import GeometryNode from './engine/render/node/geometry-node'
import LightNode from './engine/render/node/light-node'
// Rendering
import Renderer from './engine/render/renderer'

export function begin(MainComponent) {
    // Setup mouse and keyboard handlers
    MouseHandler.init();
    KeyboardHandler.init();

    // Setup default material
    const programData = new ProgramBuilder().build();
    const debugImageSrc = 'textures/debug.png';
    const defaultMaterial = new Material(programData, debugImageSrc);

    // Build a scene graph from test tile data
    const hexRadius = 10;
    const rootNode = new SceneNode();
    const lightNode1 = new LightNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(60, 20, 60)),
            new Light({id: 'light1', type: "POINT",
                direction: {x: 0, y: -1, z: 0},
                ambient: {r: 0.1, g: 0.1, b: 0.1, a: 1},
                diffuse: {r: 0.8, g: 0.8, b: 0.8, a: 1},
                specular: {r: 0.8, g: 0.6, b: 0.6, a: 1},
                specularTerm: 100,
                quadraticAttenuation: 0.0007,
                linearAttenuation: 0.014,
                constantAttenuation: 1
            })
        );
    const lightNode2 = new LightNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(240, 40, 240)),
            new Light({id: 'light2', type: "POINT",
                direction: {x: 0, y: -1, z: 0},
                ambient: {r: 0.1, g: 0.1, b: 0.1, a: 1},
                diffuse: {r: 0.8, g: 0.8, b: 0.8, a: 1},
                specular: {r: 0.8, g: 0.6, b: 0.6, a: 1},
                specularTerm: 100,
                quadraticAttenuation: 0.0007,
                linearAttenuation: 0.014,
                constantAttenuation: 1
            })
        );
    rootNode.addChild(lightNode1);
    rootNode.addChild(lightNode2);
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
            const tile = { loc: { x: i, y: i+j+1, z: j } };
            const renderData = TileService.getRenderData(tile, hexRadius);
            const child = new GeometryNode(renderData.localMatrix, {mesh: renderData.mesh, material: defaultMaterial});
            rootNode.addChild(child);

            if (i < 2 && j < 2) {
                child.addChild(new GeometryNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 10, 0)),
                    {mesh: renderData.mesh, material: defaultMaterial}));
                child.addChild(new GeometryNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, -10, 0)),
                    {mesh: renderData.mesh, material: defaultMaterial}));
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
        Renderer.render(rootNode);
        updateFPS();
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}
