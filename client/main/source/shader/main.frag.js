'use strict';

module.exports =
    `
    precision mediump float;

    varying vec3 vNormal;

    void main() {
        gl_FragColor = vec4(vNormal, 1);
    }
    `;
