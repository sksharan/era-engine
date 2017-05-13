'use strict';

module.exports =
    `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec4 vPositionWorld;
    varying vec3 vNormalWorld;
    varying vec2 vTexcoord;

    void main() {
        vPositionWorld = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * vPositionWorld;
        vNormalWorld = normalMatrix * normal;
        vTexcoord = texcoord;
    }
    `;
