'use strict';

module.exports =
    `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;
    varying vec2 vTexcoord;

    void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
        vNormal = normal;
        vTexcoord = texcoord;
    }
    `;
