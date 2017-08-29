import {
    KeyboardHandler,
    MouseHandler,
    RootSceneNode,
    GeometryNode,
    Material,
    Renderer,
    ProgramBuilder,
    Tile
} from './engine/index'

import {mat4, vec3} from 'gl-matrix'

export function begin(MainComponent) {
    // Setup mouse and keyboard handlers
    MouseHandler.init();
    KeyboardHandler.init();

    const programData = new ProgramBuilder().addPosition().addNormal().addTexcoord().build();
    const defaultMaterial = new Material({programData: programData, imageSrc: 'public/textures/debug.png'});

    // Build a scene graph from test tile data
    const hexRadius = 10;

    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
            const shiftFactor = i % 2 == 1 ? (hexRadius * 0.866) : 0;
            const mesh = new Tile(hexRadius, 5, true, true);

            const localMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                i * (hexRadius * 1.5),
                i + j + 1,
                j * (hexRadius * 0.866 * 2) + shiftFactor));

            const tile = new GeometryNode(localMatrix, {mesh, material: defaultMaterial});
            RootSceneNode.addChild(tile);
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
        Renderer.render(RootSceneNode);
        updateFPS();
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}
