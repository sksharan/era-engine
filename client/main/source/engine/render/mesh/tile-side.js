import Mesh from './mesh'
import {gl} from '../../gl'

export default class TileSide extends Mesh {
    constructor(radius=5.0, height=5.0, offset=false) {
        const shiftFactor = offset ? (radius * 0.866) : 0;
        super({
            drawMode: gl.TRIANGLE_STRIP,

            vertices: [
                 radius,         0,        shiftFactor,
                 radius,         -height,  shiftFactor,
                 radius / 2,     0,        -(radius * 0.866) + shiftFactor,
                 radius / 2,     -height,  -(radius * 0.866) + shiftFactor,

                 radius / 2,     0,        -(radius * 0.866) + shiftFactor,
                 radius / 2,     -height,  -(radius * 0.866) + shiftFactor,
                 -(radius / 2),  0,        -(radius * 0.866) + shiftFactor,
                 -(radius / 2),  -height,  -(radius * 0.866) + shiftFactor,

                 -(radius / 2),  0,        -(radius * 0.866) + shiftFactor,
                 -(radius / 2),  -height,  -(radius * 0.866) + shiftFactor,
                 -radius,        0,        shiftFactor,
                 -radius,        -height,  shiftFactor,

                 -radius,        0,        shiftFactor,
                 -radius,        -height,  shiftFactor,
                 -(radius / 2),  0,        radius * 0.866 + shiftFactor,
                 -(radius / 2),  -height,  radius * 0.866 + shiftFactor,

                 -(radius / 2),  0,        radius * 0.866 + shiftFactor,
                 -(radius / 2),  -height,  radius * 0.866 + shiftFactor,
                 radius / 2,     0,        radius * 0.866 + shiftFactor,
                 radius / 2,     -height,  radius * 0.866 + shiftFactor,

                 radius / 2,     0,        radius * 0.866 + shiftFactor,
                 radius / 2,     -height,  radius * 0.866 + shiftFactor,
                 radius,         0,        shiftFactor,
                 radius,         -height,  shiftFactor,
            ],
            floatsPerVertex: 3,

            normals: [
                0.866, 0, 0.5,
                0.866, 0, 0.5,
                0.866, 0, 0.5,
                0.866, 0, 0.5,

                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,

                -0.866, 0, 0.5,
                -0.866, 0, 0.5,
                -0.866, 0, 0.5,
                -0.866, 0, 0.5,

                -0.866, 0, -0.5,
                -0.866, 0, -0.5,
                -0.866, 0, -0.5,
                -0.866, 0, -0.5,

                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,

                0.866, 0, -0.5,
                0.866, 0, -0.5,
                0.866, 0, -0.5,
                0.866, 0, -0.5,
            ],
            floatsPerNormal: 3,

            // TODO
            texcoords: [
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,

                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,

                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,

                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,

                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,

                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
                0.0, 0.0,
            ],
            floatsPerTexcoord:2
        });
    }
}
