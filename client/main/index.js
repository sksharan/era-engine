import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import FontAwesome from 'react-fontawesome'

import {
    Store,
    ContentPanel,
    PropertiesPanel,
    NodePanel,
    ToolPanel
} from './interface/index'

import {
    KeyboardHandler,
    MouseHandler,
    RootSceneNode,
    Renderer,
} from './engine/index'

import css from './scss/main.scss'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // The last time FPS was changed
            prevTime: Date.now(),
            // The number of frames rendered since 'prevTime'
            frames: 0,
            // The calculated FPS
            fps: 0
        }
    }
    render() {
        return (
            <div>
                <nav className='navbar navbar-expand-sm navbar-dark bg-dark'>
                    <a className='navbar-brand' href="#">
                        <FontAwesome name='gamepad' />
                    </a>
                </nav>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-3 pl-0 pr-0'>
                            <ContentPanel />
                        </div>
                        <div className={`col-md-6 pl-0 pr-0 ${css.tools}`}>
                            <ToolPanel />
                        </div>
                        <div className='col-md-3 pl-0 pr-0'>
                            <NodePanel />
                            <PropertiesPanel />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        // Setup mouse and keyboard handlers
        MouseHandler.init();
        KeyboardHandler.init();
        // FPS counter
        function updateFPS() {
            const currTime = Date.now();
            const millisElapsed = currTime - this.state.prevTime;
            this.setState((prevState) => ({
                frames: prevState.frames + 1
            }));
            if (millisElapsed >= 1000) { // Update FPS approximately every second
                this.setState((prevState) => ({
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
            updateFPS.call(this);
            requestAnimationFrame(mainLoop.bind(this));
        }
        requestAnimationFrame(mainLoop.bind(this));
    }
}

ReactDOM.render(
    <Provider store={Store}>
        <Main/>
    </Provider>,
    document.getElementById('main'));
