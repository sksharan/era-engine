/* Setup WebGL */
document.body.insertAdjacentHTML('beforeend',
        '<canvas id="canvas" height="720" width="1080"></canvas>');
const gl = document.getElementById('canvas').getContext('webgl');

/* Setup gl-utils */
const glUtilsInjector = require('inject-loader!../main/source/gl-utils');
const glUtils = glUtilsInjector({
    './gl': {
        context: gl
    }
});

const assert = require('chai').assert;

describe('gl-utils#createProgram', function() {
    it('should produce a valid program given valid shaders', function() {
        let vertexShader =
            `attribute vec4 position;
            void main() {
                gl_Position = position;
            }`;
        let fragmentShader =
            `precision mediump float;
            void main() {
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }`;
        let program = glUtils.createProgram(vertexShader, fragmentShader);
        assert.isTrue(gl.isProgram(program));
    });
    it('should throw an error given an invalid vertex shader', function() {
        // 'gl_Pos' should be 'gl_Position'
        let vertexShader =
            `attribute vec4 position;
            void main() {
                gl_Pos = position;
            }`;
        let fragmentShader =
            `precision mediump float;
            void main() {
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }`;
        let fn = function() { glUtils.createProgram(vertexShader, fragmentShader); }
        assert.throws(fn, Error, /Error compiling vertex shader/);
    });
    it('should throw an error given an invalid fragment shader', function() {
        let vertexShader =
            `attribute vec4 position;
            void main() {
                gl_Position = position;
            }`;
        // 'gl_Frag' should be 'gl_FragColor'
        let fragmentShader =
            `precision mediump float;
            void main() {
                gl_Frag = vec4(1, 0, 0.5, 1);
            }`;
        let fn = function() { glUtils.createProgram(vertexShader, fragmentShader); }
        assert.throws(fn, Error, /Error compiling fragment shader/);
    });
});
