import {vec3, vec4} from 'gl-matrix'

let lightId = 1;

export function createLight(name, type,
        worldPosition=vec3.fromValues(0, 0, 0),
        ambient=vec4.fromValues(1, 0.8, 0.8, 1),
        diffuse=vec4.fromValues(0.8, 1, 0.8, 1),
        specular=vec4.fromValues(0.8, 0.8, 1, 1)) {
    return {
        type: 'CREATE_LIGHT',
        payload: {
            lightId: lightId++,
            name,
            type,
            worldPosition,
            ambient,
            diffuse,
            specular
        }
    }
}
