'use strict';

module.exports =
    `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec4 vPositionWorld;
    varying vec3 vNormalWorld;
    varying vec2 vTexcoord;

    void main() {
        vPositionWorld = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * vPositionWorld;
        vNormalWorld = normal; // TODO need to compute normal matrix on CPU
        vTexcoord = texcoord;
    }
    `;
