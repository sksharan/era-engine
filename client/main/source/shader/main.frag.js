'use strict';

module.exports =
    `
    precision mediump float;

    uniform sampler2D texture;

    varying vec3 vNormal;
    varying vec2 vTexcoord;

    void main() {
        gl_FragColor = texture2D(texture, vTexcoord);
    }
    `;
