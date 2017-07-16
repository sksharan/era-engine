import Mesh from './mesh'
import {gl} from '../gl'

export default class TileBase extends Mesh {
    constructor(radius=5.0, offset=false) {
        const shiftFactor = offset ? (radius * 0.866) : 0;
        super({
            drawMode: gl.TRIANGLE_FAN,

            vertices: [
                 0,              0,  shiftFactor,
                 radius,         0,  shiftFactor,
                 radius / 2,     0,  -(radius * 0.866) + shiftFactor,
                 -(radius / 2),  0,  -(radius * 0.866) + shiftFactor,
                 -radius,        0,  shiftFactor,
                 -(radius / 2),  0,  radius * 0.866 + shiftFactor,
                 radius / 2,     0,  radius * 0.866 + shiftFactor,
                 radius,         0,  shiftFactor,
            ],
            floatsPerVertex: 3,

            normals: [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
            ],
            floatsPerNormal: 3,

            texcoords: [
                0.5,  0.5,
                1.0,  0.5,
                0.75, 0,
                0.25, 0,
                0,    0.5,
                0.25, 1.0,
                0.75, 1.0,
                1.0,  0.5,
            ],
            floatsPerTexcoord:2
        });
    }
}
