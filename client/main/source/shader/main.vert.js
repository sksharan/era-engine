'use strict';

module.exports =
   `attribute vec4 position;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        gl_Position = projectionMatrix * viewMatrix * position;
    }`;
