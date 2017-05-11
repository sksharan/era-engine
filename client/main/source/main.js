'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const FPS = require('./component/fps');

// Component to initialize the canvas and WebGL, meant for one-time use only
const Canvas = React.createClass({
    render: function() {
        return (<canvas id="canvas" height="720" width="1080"></canvas>);
    },
    componentDidMount: function() {
        // With the canvas now rendered, init WebGL or quit if not supported
        const gl = require('./gl').context;
        if (!gl) {
            throw new Error('WebGL is unavailable');
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        // Canvas should never be re-rendered after initialization
        return false;
    }
});

// The root component of the application and home of the main loop
const Main = React.createClass({
    getInitialState: function() {
        return {
            // For FPS calculation
            prevTime: Date.now(),
            frames: 0,
            fps: 0
        }
    },
    render: function() {
        return (
            <div>
                <FPS fps={this.state.fps}/>
                <Canvas/>
            </div>
        );
    },
    componentDidMount: function() {
        const gl = require('./gl').context;
        const mat4 = require('gl-matrix').mat4;
        const vec3 = require('gl-matrix').vec3;

        // Setup mouse and keyboard handlers
        const mouseHandler = require('./input/mouse-handler');
        mouseHandler.init();
        const keyboardHandler = require('./input/keyboard-handler');
        keyboardHandler.init();

        // Setup default material
        const glUtils = require('./gl-utils');
        const Material = require('./render/material');
        const program = glUtils.createProgram(require('./shader/main.vert'), require('./shader/main.frag'));
        const debugImageSrc = 'textures/debug.png';
        const defaultMaterial = new Material(program, debugImageSrc);

        // Build a scene graph from test tile data
        const tileService = require('./service/tile-service');
        const hexRadius = 10;
        const SceneNode = require('./render/scene-node');
        const root = new SceneNode();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const tile = { loc: { x: i, y: (i+j)+1, z: j } };
                const renderData = tileService.getRenderData(tile, hexRadius);

                const child = new SceneNode(renderData.transform, renderData.mesh, defaultMaterial);
                root.addChild(child);

                if (i < 2 && j < 2) {
                    child.addChild(new SceneNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 10, 0)),
                        renderData.mesh, defaultMaterial));
                    child.addChild(new SceneNode(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, -10, 0)),
                        renderData.mesh, defaultMaterial));
                }
            }
        }

        // Rendering
        const renderer = require('./render/renderer');

        // FPS counter
        var self = this;
        function updateFPS() {
            const currTime = Date.now();
            const millisElapsed = currTime - self.state.prevTime;
            self.setState((prevState, props) => ({
                frames: prevState.frames + 1
            }));
            if (millisElapsed > 1000) { // Update FPS every second
                self.setState((prevState, props) => ({
                    prevTime: currTime,
                    frames: 0,
                    // Note: display as ms/frame instead with console.log(millisElapsed / frames)
                    // Do (ms/s)/(ms/frame) to get FPS, and there are 1000ms in a second
                    fps: 1000 / (millisElapsed / prevState.frames)
                }));
            }
        }

        // Main loop
        function mainLoop() {
            keyboardHandler.processKeys();
            renderer.render(root);
            updateFPS();
            requestAnimationFrame(mainLoop);
        }
        requestAnimationFrame(mainLoop);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    }
});

ReactDOM.render(<Main/>, document.getElementById('main'));
