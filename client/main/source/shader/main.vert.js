'use strict';

module.exports =
    `
    attribute vec4 position;
    attribute vec3 normal;

    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        gl_Position = projectionMatrix * viewMatrix * position;
        vNormal = normal;
    }
    `;
