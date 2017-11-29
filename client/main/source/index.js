import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {Store} from './interface/index'
import css from './scss/main.scss'

// Component for initializing the canvas and WebGL
class Canvas extends React.Component {
    render() {
        return <canvas id="canvas" height="480" width="720" className={css.canvas}></canvas>;
    }
    componentDidMount() {
        // With the canvas now rendered, init WebGL by requiring it
        const gl = require('./engine/gl').gl;
        if (!gl) {
            throw new Error('WebGL is unavailable');
        }
    }
    shouldComponentUpdate() {
        // Canvas should never be re-rendered after initialization
        return false;
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // True if WebGL has been already initialized
            glInitialized: false,
            // True if the main loop has already been initialized
            mainLoopInitialized: false,

            // The last time FPS was changed
            prevTime: Date.now(),
            // The number of frames rendered since 'prevTime'
            frames: 0,
            // The calculated FPS
            fps: 0
        }
    }
    render() {
        // Render the canvas in order to init WebGL before rendering any other components
        return (
            <div>
                <Canvas />
                <nav className='navbar navbar-expand-sm navbar-dark bg-dark'>
                    <a className='navbar-brand' href="#">
                        <FontAwesome name='gamepad' />
                    </a>
                </nav>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-9 pl-0 pr-0' id='tools'>
                            {this.state.glInitialized ? this.getToolsView() : ""}
                        </div>
                        <div className='col-md-3 pl-0 pr-0'>
                            {this.state.glInitialized ? this.getNodesView() : ""}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    getNodesView() {
        const Node = require('./interface/index-deferred').NodePanel;
        return <Node />
    }
    getToolsView() {
        const Tool = require('./interface/index-deferred').ToolPanel;
        return <Tool />
    }
    componentDidMount() {
        // At this point, canvas has been rendered so WebGL is initialized
        this.setState({glInitialized: true});
    }
    componentDidUpdate() {
        // Only do main loop setup logic once
        if (this.state.mainLoopInitialized) {
            return;
        }
        this.setState({mainLoopInitialized: true});

        // Start the main loop, which will also handle FPS calculation
        const mainLoop = require('./main-loop');
        mainLoop.begin(this);
    }
}

ReactDOM.render(
    <Provider store={Store}>
        <Main/>
    </Provider>,
    document.getElementById('main'));
