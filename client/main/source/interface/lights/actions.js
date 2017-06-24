import {vec3, vec4} from 'gl-matrix'
import Light from './light'

let lightId = 1;

export function createLight(name, type,
        position=vec3.fromValues(0, 0, 0),
        direction=vec3.fromValues(0, 0, -1),
        ambient=vec4.fromValues(0.92, 0.92, 0.92, 1),
        diffuse=vec4.fromValues(1, 1, 0.8, 1),
        specular=vec4.fromValues(1, 1, 1, 1),
        intensity=5) {
    return {
        type: 'CREATE_LIGHT',
        payload: new Light({
            id: lightId++,
            name: name == "" ? "Default" : name,
            type,
            position,
            direction,
            ambient,
            diffuse,
            specular,
            intensity})
    }
}
